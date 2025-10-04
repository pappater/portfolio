#!/usr/bin/env node

const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const OWNER = 'pappater';
const PROJECTS_DIR = path.join(process.cwd(), '_projects');
const REPO_NAME = process.argv[2] || process.env.REPO_NAME;

if (!REPO_NAME) {
  console.error('Error: Repository name is required');
  process.exit(1);
}

/**
 * Check if project already exists
 */
function projectExists(repoName) {
  const filename = `${repoName}.md`;
  return fs.existsSync(path.join(PROJECTS_DIR, filename));
}

/**
 * Get repository details
 */
async function getRepository() {
  try {
    const { data: repo } = await octokit.repos.get({
      owner: OWNER,
      repo: REPO_NAME
    });
    return repo;
  } catch (error) {
    console.error('Error fetching repository:', error.message);
    throw error;
  }
}

/**
 * Get README content
 */
async function getReadme() {
  try {
    const { data } = await octokit.repos.getReadme({
      owner: OWNER,
      repo: REPO_NAME,
    });
    return Buffer.from(data.content, 'base64').toString('utf-8');
  } catch (error) {
    console.log('No README found');
    return null;
  }
}

/**
 * Analyze repository
 */
async function analyzeRepository(repo) {
  try {
    const { data: contents } = await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO_NAME,
      path: ''
    });
    
    const files = contents.filter(item => item.type === 'file').map(item => item.name);
    const languages = repo.language ? [repo.language] : [];
    const topics = repo.topics || [];
    
    const techStack = detectTechStack(files, languages, topics);
    
    let description = repo.description || `A project by ${OWNER}`;
    
    if (!repo.description && files.length > 0) {
      description = `This is a ${languages[0] || 'software'} project`;
      if (techStack.length > 0) {
        description += ` built with ${techStack.slice(0, 3).join(', ')}`;
      }
    }
    
    return {
      description,
      techStack: techStack.join(', ') || languages.join(', ') || 'Various technologies'
    };
  } catch (error) {
    console.error('Error analyzing repository:', error.message);
    return {
      description: repo.description || 'A project',
      techStack: repo.language || 'Various technologies'
    };
  }
}

/**
 * Detect technology stack
 */
function detectTechStack(files, languages, topics) {
  const tech = new Set();
  
  languages.forEach(lang => tech.add(lang));
  topics.forEach(topic => tech.add(topic));
  
  if (files.includes('package.json')) tech.add('Node.js');
  if (files.includes('requirements.txt') || files.includes('setup.py')) tech.add('Python');
  if (files.includes('Gemfile')) tech.add('Ruby');
  if (files.includes('pom.xml') || files.includes('build.gradle')) tech.add('Java');
  if (files.includes('Cargo.toml')) tech.add('Rust');
  if (files.includes('go.mod')) tech.add('Go');
  if (files.includes('Dockerfile')) tech.add('Docker');
  if (files.some(f => f.endsWith('.tsx') || f.endsWith('.jsx'))) tech.add('React');
  if (files.includes('angular.json')) tech.add('Angular');
  if (files.includes('vue.config.js')) tech.add('Vue.js');
  if (files.includes('next.config.js')) tech.add('Next.js');
  if (files.includes('tsconfig.json')) tech.add('TypeScript');
  if (files.includes('tailwind.config.js')) tech.add('Tailwind CSS');
  
  return Array.from(tech);
}

/**
 * Generate markdown content
 */
function generateMarkdown(repo, readme, analysis) {
  const date = new Date(repo.created_at).toISOString().split('T')[0];
  const title = repo.name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  let content = `---
title: "${title}"
date: ${date}
layout: project
tech: "${analysis.techStack}"
---

`;

  if (readme) {
    const cleanReadme = readme
      .replace(/^#.*$/gm, '')
      .replace(/```[\s\S]*?```/g, '')
      .trim()
      .split('\n')
      .filter(line => line.trim().length > 0)
      .slice(0, 5)
      .join('\n\n');
    
    content += cleanReadme + '\n\n';
  } else {
    content += analysis.description + '\n\n';
  }
  
  content += `Source: [github.com/${OWNER}/${repo.name}](https://github.com/${OWNER}/${repo.name})\n`;
  
  if (repo.homepage) {
    content += `\nLive: [${repo.homepage}](${repo.homepage})\n`;
  } else if (repo.has_pages) {
    content += `\nLive: [${OWNER}.github.io/${repo.name}](https://${OWNER}.github.io/${repo.name}/)\n`;
  }
  
  return content;
}

/**
 * Main process function
 */
async function processRepository() {
  console.log(`Processing repository: ${REPO_NAME}`);
  
  if (projectExists(REPO_NAME)) {
    console.log('Project already exists, skipping...');
    return;
  }
  
  if (!fs.existsSync(PROJECTS_DIR)) {
    fs.mkdirSync(PROJECTS_DIR, { recursive: true });
  }
  
  try {
    const repo = await getRepository();
    
    if (repo.archived || repo.private) {
      console.log('Repository is archived or private, skipping...');
      return;
    }
    
    if (!repo.homepage && !repo.description) {
      console.log('Repository has no homepage or description, skipping...');
      return;
    }
    
    const readme = await getReadme();
    const analysis = await analyzeRepository(repo);
    const content = generateMarkdown(repo, readme, analysis);
    
    const filepath = path.join(PROJECTS_DIR, `${REPO_NAME}.md`);
    fs.writeFileSync(filepath, content, 'utf-8');
    
    console.log(`✓ Created ${REPO_NAME}.md`);
  } catch (error) {
    console.error('Error processing repository:', error.message);
    process.exit(1);
  }
}

processRepository();
