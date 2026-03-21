#!/bin/bash

# Orignym Advanced Installer & Setup
# This script handles environment detection, dependency checks, port selection, and desktop integration.

set -e

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
find_free_port() {
    local port=$1
    while lsof -i :$port > /dev/null; do
        port=$((port + 1))
    done
    echo $port
}

APP_PORT=$(find_free_port 3000)
DB_PORT=$(find_free_port 5432)

echo "Selected App Port: $APP_PORT"
echo "Selected DB Port: $DB_PORT"

# 4. Environment Setup
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env <<EOF
DATABASE_URL="postgresql://orignym:orignym_password@localhost:$DB_PORT/orignym?schema=public"
NEXTAUTH_URL="http://localhost:$APP_PORT"
NEXTAUTH_SECRET="$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
EOF
fi

# Update docker-compose.yml if ports changed
# Note: This is a simple sed replacement for the demo/installer
sed -i "s/[0-9]\{4\}:5432/$DB_PORT:5432/" docker-compose.yml

# 5. Initialization
echo "Starting database..."
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
