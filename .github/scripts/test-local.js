#!/usr/bin/env node

/**
 * Local testing script - allows testing the sync without running GitHub Actions
 * Usage: GITHUB_TOKEN=your_token node .github/scripts/test-local.js [repo-name]
 */

const fs = require('fs');
const path = require('path');

// Check for GitHub token
if (!process.env.GITHUB_TOKEN) {
  console.error('❌ Error: GITHUB_TOKEN environment variable is required');
  console.error('');
  console.error('Usage:');
  console.error('  GITHUB_TOKEN=ghp_xxx node .github/scripts/test-local.js');
  console.error('  GITHUB_TOKEN=ghp_xxx node .github/scripts/test-local.js repo-name');
  console.error('');
  console.error('Get a token at: https://github.com/settings/tokens');
  process.exit(1);
}

console.log('🧪 Local Testing Mode');
console.log('━'.repeat(50));
console.log('');

// Check if specific repo is provided
const specificRepo = process.argv[2];

if (specificRepo) {
  console.log(`📦 Testing single repository: ${specificRepo}`);
  console.log('');
  
  // Set environment variable for the script
  process.env.REPO_NAME = specificRepo;
  
  // Run process-single-repo.js
  require('./process-single-repo.js');
} else {
  console.log('📦 Testing full repository sync');
  console.log('');
  console.log('⚠️  This will scan all repositories and create files for new ones');
  console.log('⚠️  Files will be created in _projects/ but NOT committed');
  console.log('');
  console.log('Press Ctrl+C to cancel, or wait 3 seconds to continue...');
  
  setTimeout(() => {
    // Run sync-projects.js
    require('./sync-projects.js');
  }, 3000);
}
