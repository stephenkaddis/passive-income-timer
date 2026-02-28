#!/bin/bash
# Simple script to push this project to GitHub and prepare for GitHub Pages.
# You still need to create the repo on GitHub and set Source to "GitHub Actions" (see PUT-ON-GITHUB-PAGES.md).

set -e

echo ""
echo "  Passive Income Timer — deploy to GitHub"
echo "  ---------------------------------------"
echo ""

read -p "  Your GitHub username: " USERNAME
read -p "  Repository name (e.g. passive-income-timer): " REPO

USERNAME=$(echo "$USERNAME" | tr -d ' ')
REPO=$(echo "$REPO" | tr -d ' ')

if [ -z "$USERNAME" ] || [ -z "$REPO" ]; then
  echo "  Username and repo name are required. Bye."
  exit 1
fi

REMOTE="https://github.com/${USERNAME}/${REPO}.git"
echo ""
echo "  Using: $REMOTE"
echo ""

if [ ! -d .git ]; then
  echo "  Initializing git..."
  git init
fi

git add .
git status

echo ""
read -p "  Commit and push to GitHub now? (y/n): " CONFIRM
if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
  echo "  Skipped. Run this script again when you're ready."
  exit 0
fi

git commit -m "Initial commit: Passive Income Timer" || true
git branch -M main

if git remote get-url origin 2>/dev/null; then
  git remote set-url origin "$REMOTE"
else
  git remote add origin "$REMOTE"
fi

echo ""
echo "  Pushing to GitHub..."
git push -u origin main

echo ""
echo "  Done!"
echo ""
echo "  Next:"
echo "  1. On GitHub, open your repo → Settings → Pages"
echo "  2. Set Source to 'GitHub Actions' (if you haven’t already)"
echo "  3. Go to the Actions tab and wait for the workflow to finish (green check)"
echo "  4. Your app will be at:  https://${USERNAME}.github.io/${REPO}/"
echo ""
