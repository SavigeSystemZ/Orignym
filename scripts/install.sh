#!/bin/bash

# Orignym Advanced Installer & Setup
# This script handles environment detection, dependency checks, port selection, and desktop integration.

set -e

if [[ "$1" == "--help" || "$1" == "-h" ]]; then
    echo "Usage: ./scripts/install.sh [OPTIONS]"
    echo "Options:"
    echo "  --help, -h    Show this help message and exit"
    echo "Description:"
    echo "  Installs dependencies, sets up ports, initializes the database, and creates a desktop launcher."
    exit 0
fi

echo "--- Orignym Setup ---"

# 1. OS Detection
OS=$(uname -s)
DISTRO=""
if [ -f /etc/os-release ]; then
    . /etc/os-release
    DISTRO=$ID
fi

echo "Detected OS: $OS ($DISTRO)"

# 2. Dependency Check
check_dep() {
    if ! command -v $1 &> /dev/null; then
        echo "Error: $1 is not installed."
        return 1
    fi
    return 0
}

DEPS=("node" "npm" "docker" "docker-compose")
MISSING_DEPS=()

for dep in "${DEPS[@]}"; do
    if ! check_dep $dep; then
        MISSING_DEPS+=($dep)
    fi
done

if [ ${#MISSING_DEPS[@]} -ne 0 ]; then
    echo "Missing dependencies: ${MISSING_DEPS[*]}"
    if [[ "$DISTRO" == "ubuntu" || "$DISTRO" == "debian" ]]; then
        echo "Suggesting install via apt-get..."
        echo "sudo apt-get update && sudo apt-get install -y ${MISSING_DEPS[*]}"
    fi
    exit 1
fi

# 3. Port Selection
find_random_free_port() {
    local port
    while true; do
        # Select random port in high range (10000-60000)
        port=$(( ( RANDOM % 50000 )  + 10000 ))
        if ! ss -tuln | grep -q ":$port " > /dev/null; then
            echo $port
            return 0
        fi
    done
}

# Only pick new ports if .env doesn't exist
if [ ! -f .env ]; then
    APP_PORT=$(find_random_free_port)
    DB_PORT=$(find_random_free_port)
else
    # Extract existing ports from .env if we are rerunning
    APP_PORT=$(grep NEXTAUTH_URL .env | sed -e 's/.*:\([0-9]*\).*/\1/')
    # Check if existing app port is still free
    if ss -tuln | grep -q ":$APP_PORT " > /dev/null; then
        echo "Existing App Port $APP_PORT is now busy. Selecting new port..."
        APP_PORT=$(find_random_free_port)
    fi
    
    DB_PORT=$(grep DATABASE_URL .env | sed -e 's/.*:\([0-9]*\)\/.*/\1/')
    if ss -tuln | grep -q ":$DB_PORT " > /dev/null; then
        echo "Existing DB Port $DB_PORT is now busy. Selecting new port..."
        DB_PORT=$(find_random_free_port)
    fi
fi

echo "Selected App Port: $APP_PORT"
echo "Selected DB Port: $DB_PORT"

# 4. Environment Setup
PORT_CHANGED=false
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env <<EOF
DATABASE_URL="postgresql://orignym:orignym_password@localhost:$DB_PORT/orignym?schema=public"
NEXTAUTH_URL="http://localhost:$APP_PORT"
NEXTAUTH_SECRET="$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
EOF
else
    # Update existing .env if ports changed
    sed -i "s|localhost:[0-9]*|localhost:$DB_PORT|" .env
    sed -i "s|localhost:[0-9]*|localhost:$APP_PORT|" .env
    # Note: The above sed is a bit broad, let's be more specific
    sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"postgresql://orignym:orignym_password@localhost:$DB_PORT/orignym?schema=public\"|" .env
    sed -i "s|NEXTAUTH_URL=.*|NEXTAUTH_URL=\"http://localhost:$APP_PORT\"|" .env
    PORT_CHANGED=true
fi

# Update docker-compose.yml
sed -i "s/\"[0-9]*:5432\"/\"$DB_PORT:5432\"/" docker-compose.yml

# 5. Initialization
echo "Starting database..."
if [ "$PORT_CHANGED" = true ]; then
    echo "Ports changed or rerunning, resetting containers..."
    docker-compose down -v || true
fi
docker-compose up -d

echo "Installing npm dependencies..."
npm install

echo "Running database migrations..."
# Use a short sleep to ensure DB is ready
sleep 5
npx prisma migrate dev --name init_via_installer

echo "Building the application..."
npm run build

# 6. Desktop Integration
echo "Creating desktop launcher..."
mkdir -p ~/.local/share/applications

CAT_BIN=$(which cat)
DESKTOP_FILE=~/.local/share/applications/Orignym.desktop
PROJECT_DIR=$(pwd)

cat > $DESKTOP_FILE <<EOF
[Desktop Entry]
Name=Orignym
Comment=Coined-word provenance and registry
Exec=$PROJECT_DIR/scripts/start-app.sh
Icon=utilities-terminal
Terminal=true
Type=Application
Categories=Development;
EOF

chmod +x $DESKTOP_FILE

# Create start script
cat > scripts/start-app.sh <<EOF
#!/bin/bash
cd $PROJECT_DIR
docker-compose up -d
npm start &
sleep 5
xdg-open http://localhost:$APP_PORT
wait
EOF
chmod +x scripts/start-app.sh

echo "--- Installation Complete ---"
echo "You can now launch Orignym from your applications menu or via scripts/start-app.sh"
echo "Local URL: http://localhost:$APP_PORT"
