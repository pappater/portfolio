#!/bin/bash
# Test script to verify the automation setup

echo "🔍 Checking automation setup..."
echo ""

# Check workflow files
echo "✓ Checking workflow files..."
if [ -f ".github/workflows/sync-projects.yml" ]; then
    echo "  ✓ sync-projects.yml exists"
else
    echo "  ✗ sync-projects.yml missing"
fi

if [ -f ".github/workflows/webhook-receiver.yml" ]; then
    echo "  ✓ webhook-receiver.yml exists"
else
    echo "  ✗ webhook-receiver.yml missing"
fi

# Check script files
echo ""
echo "✓ Checking script files..."
if [ -f ".github/scripts/sync-projects.js" ]; then
    echo "  ✓ sync-projects.js exists"
else
    echo "  ✗ sync-projects.js missing"
fi

if [ -f ".github/scripts/process-single-repo.js" ]; then
    echo "  ✓ process-single-repo.js exists"
else
    echo "  ✗ process-single-repo.js missing"
fi

if [ -f ".github/scripts/package.json" ]; then
    echo "  ✓ package.json exists"
else
    echo "  ✗ package.json missing"
fi

# Check documentation
echo ""
echo "✓ Checking documentation..."
if [ -f "README.md" ]; then
    if grep -q "Automated Project Sync" README.md; then
        echo "  ✓ README.md updated with automation docs"
    else
        echo "  ✗ README.md missing automation section"
    fi
else
    echo "  ✗ README.md missing"
fi

if [ -f "WEBHOOK_SETUP.md" ]; then
    echo "  ✓ WEBHOOK_SETUP.md exists"
else
    echo "  ✗ WEBHOOK_SETUP.md missing"
fi

# Check _projects directory
echo ""
echo "✓ Checking _projects directory..."
if [ -d "_projects" ]; then
    PROJECT_COUNT=$(ls -1 _projects/*.md 2>/dev/null | wc -l)
    echo "  ✓ _projects directory exists with $PROJECT_COUNT projects"
else
    echo "  ✗ _projects directory missing"
fi

# Check Node.js availability
echo ""
echo "✓ Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "  ✓ Node.js $NODE_VERSION installed"
else
    echo "  ✗ Node.js not installed"
fi

# Summary
echo ""
echo "================================================"
echo "Setup verification complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Commit and push these changes"
echo "2. Go to GitHub Actions tab"
echo "3. Manually trigger 'Sync Projects from Repositories'"
echo "4. Check the logs for any errors"
echo ""
echo "For webhook setup, see WEBHOOK_SETUP.md"
