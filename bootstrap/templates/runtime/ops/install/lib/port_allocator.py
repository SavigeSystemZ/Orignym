#!/usr/bin/env python3
from __future__ import annotations

import argparse
import re
import socket
from pathlib import Path


def env_value(text: str, key: str) -> str | None:
    match = re.search(rf"^{re.escape(key)}=(.+)$", text, re.MULTILINE)
    if match:
        return match.group(1).strip()
    return None


def can_bind(host: str, port: int, family: socket.AddressFamily, sock_type: socket.SocketKind) -> bool:
    try:
        sock = socket.socket(family, sock_type)
        if family == socket.AF_INET6:
            sock.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 1)
        sock.bind((host, port))
        sock.close()
        return True
    except OSError:
        return False


def port_available(port: int, bind_address: str) -> bool:
    checks = []
    if ":" in bind_address:
        checks.extend(
            [
                (socket.AF_INET6, socket.SOCK_STREAM, bind_address),
                (socket.AF_INET6, socket.SOCK_DGRAM, bind_address),
            ]
        )
    else:
        checks.extend(
            [
                (socket.AF_INET, socket.SOCK_STREAM, bind_address),
                (socket.AF_INET, socket.SOCK_DGRAM, bind_address),
            ]
        )

    for family, sock_type, host in checks:
        if not can_bind(host, port, family, sock_type):
            return False
    return True


def choose_port(start: int, end: int, bind_address: str) -> int:
    for port in range(start, end + 1):
        if port_available(port, bind_address):
            return port
    raise SystemExit(f"no available port found in range {start}-{end}")


def write_key(path: Path, key: str, value: str) -> None:
    text = path.read_text() if path.exists() else ""
    if re.search(rf"^{re.escape(key)}=", text, re.MULTILINE):
        text = re.sub(rf"^{re.escape(key)}=.*$", f"{key}={value}", text, flags=re.MULTILINE)
    else:
        if text and not text.endswith("\n"):
            text += "\n"
        text += f"{key}={value}\n"
    path.write_text(text)
    path.chmod(0o600)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("env_file")
    parser.add_argument("--key", default="APP_PORT")
    parser.add_argument("--bind-address", default="127.0.0.1")
    parser.add_argument("--start", type=int, default=8000)
    parser.add_argument("--end", type=int, default=9000)
    parser.add_argument("--port", type=int)
    args = parser.parse_args()

    path = Path(args.env_file)
    path.parent.mkdir(parents=True, exist_ok=True)
    text = path.read_text() if path.exists() else ""
    current = env_value(text, args.key)

    if args.port is not None:
        port = args.port
    elif current and current.isdigit() and port_available(int(current), args.bind_address):
        port = int(current)
    else:
        port = choose_port(args.start, args.end, args.bind_address)

    write_key(path, args.key, str(port))
    print(port)


if __name__ == "__main__":
    main()
