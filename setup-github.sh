#!/bin/bash

# Setup script for GitHub repository
# This script helps set up the project for the GitHub repository

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up ISP Management System for GitHub...${NC}"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Initializing Git repository...${NC}"
    git init
fi

# Add all files
echo -e "${YELLOW}Adding files to Git...${NC}"
git add .

# Create initial commit
echo -e "${YELLOW}Creating initial commit...${NC}"
git commit -m "Initial commit: ISP Management System with daloRADIUS integration

Features:
- Complete ISP management system
- daloRADIUS integration for FreeRADIUS
- User management and authentication
- NAS device management
- Real-time monitoring
- Docker support
- One-click installation for Ubuntu 22.04"

# Add remote origin (if not already added)
if ! git remote get-url origin >/dev/null 2>&1; then
    echo -e "${YELLOW}Adding GitHub remote...${NC}"
    git remote add origin https://github.com/nimroozy/dalradius.git
fi

# Set main branch
echo -e "${YELLOW}Setting up main branch...${NC}"
git branch -M main

# Push to GitHub
echo -e "${YELLOW}Pushing to GitHub...${NC}"
git push -u origin main

echo -e "${GREEN}Setup complete!${NC}"
echo -e "${BLUE}Your project is now available at: https://github.com/nimroozy/dalradius${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Visit https://github.com/nimroozy/dalradius"
echo "2. Update repository description and topics"
echo "3. Enable GitHub Pages if needed"
echo "4. Set up GitHub Actions for CI/CD"
echo "5. Create releases for version management"
