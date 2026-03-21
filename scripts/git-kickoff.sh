#!/bin/bash

# Initialize Git for Orignym
git init

# Configure user (using provided info)
git config user.name "Michael Spaulding"
git config user.email "mtspaulding87@gmail.com"

# Add all files except those in .gitignore
git add .

# Initial Commit
git commit -m "feat: initial Orignym release v1.0.0

- Canonical Single Source of Truth (SSoT) documentation
- Next.js 14 App Router Foundation with Auth & Prisma
- Staged Evidence-First Verification Engine
- AI Suggestion Engine for coined-word alternatives
- Public Registry with search and provenance records
- Moderation & Disputes system with Admin Command Center
- Advanced Installer with dynamic port detection and desktop integration"

echo "Git repository initialized and initial commit created."
