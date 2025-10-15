#!/usr/bin/env node

const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const OWNER = 'pappater';
const PROJECTS_DIR = path.join(process.cwd(), '_projects');

// Track processed repositories to avoid duplicates
const existingProjects = new Set();

/**
 * Load existing projects to avoid duplicates
 */
function loadExistingProjects() {
  if (!fs.existsSync(PROJECTS_DIR)) {
    fs.mkdirSync(PROJECTS_DIR, { recursive: true });
  }
  
  const files = fs.readdirSync(PROJECTS_DIR);
  files.forEach(file => {
    if (file.endsWith('.md')) {
      const content = fs.readFileSync(path.join(PROJECTS_DIR, file), 'utf-8');
      // Extract repo name from source link
      const match = content.match(/github\.com\/pappater\/([^)\s]+)/);
      if (match) {
        existingProjects.add(match[1]);
      }
    }
  });
  
  console.log(`Found ${existingProjects.size} existing projects`);
}

/**
 * Get all public repositories for the user
 */
async function getRepositories() {
  try {
    const { data: repos } = await octokit.repos.listForUser({
      username: OWNER,
      type: 'public',
      per_page: 100,
      sort: 'created',
      direction: 'desc'
    });
    
    console.log(`Found ${repos.length} repositories`);
    return repos;
  } catch (error) {
    console.error('Error fetching repositories:', error.message);
    return [];
  }
}

/**
 * Get README content from a repository
 */
async function getReadme(repoName) {
  try {
    const { data } = await octokit.repos.getReadme({
      owner: OWNER,
      repo: repoName,
    });
    
    // Decode base64 content
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return content;
  } catch (error) {
    console.log(`No README found for ${repoName}`);
    return null;
  }
}

/**
 * Analyze repository code to generate description
 */
async function analyzeRepository(repo) {
  try {
    const { data: contents } = await octokit.repos.getContent({
      owner: OWNER,
      repo: repo.name,
      path: ''
    });
    
    // Analyze repository structure
    const files = contents.filter(item => item.type === 'file').map(item => item.name);
    const languages = repo.language ? [repo.language] : [];
    const topics = repo.topics || [];
    
    // Detect technology stack
    const techStack = detectTechStack(files, languages, topics);
    
    // Generate description
    let description = repo.description || `A project by pappater`;
    
    if (!repo.description && files.length > 0) {
      description = `This is a ${languages[0] || 'software'} project`;
      if (techStack.length > 0) {
        description += ` built with ${techStack.slice(0, 3).join(', ')}`;
      }
      description += `. ${generateFeaturesList(files)}`;
    }
    
    return {
      description,
      techStack: techStack.join(', ') || languages.join(', ') || 'Various technologies'
    };
  } catch (error) {
    console.error(`Error analyzing ${repo.name}:`, error.message);
    return {
      description: repo.description || 'A project by pappater',
      techStack: repo.language || 'Various technologies'
    };
  }
}

/**
 * Detect technology stack from files and metadata
 */
function detectTechStack(files, languages, topics) {
  const tech = new Set();
  
  // Add languages
  languages.forEach(lang => tech.add(lang));
  
  // Add topics
  topics.forEach(topic => tech.add(topic));
  
  // Detect from files
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
 * Generate features list from file analysis
 */
function generateFeaturesList(files) {
  const features = [];
  
  if (files.includes('README.md')) features.push('Well documented');
  if (files.some(f => f.includes('test'))) features.push('Includes tests');
  if (files.includes('.github')) features.push('CI/CD enabled');
  if (files.includes('LICENSE')) features.push('Open source');
  
  return features.length > 0 ? features.join('. ') + '.' : '';
}

/**
 * Use AI to generate better project description (optional)
 */
async function generateAIDescription(repo, readme) {
  if (!process.env.OPENAI_API_KEY) {
    console.log('OpenAI API key not found, skipping AI generation');
    return null;
  }
  
  try {
    const OpenAI = require('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    const prompt = `Generate a concise project description (2-3 sentences, max 200 words) for a GitHub repository:

Repository: ${repo.name}
Description: ${repo.description || 'No description'}
Language: ${repo.language || 'Unknown'}
README excerpt: ${readme ? readme.substring(0, 500) : 'No README'}

Format the response as a brief, engaging portfolio description.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.7
    });
    
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.log('AI generation failed:', error.message);
    return null;
  }
}

/**
 * Generate markdown frontmatter and content
 */
function generateMarkdown(repo, readme, analysis, aiDescription) {
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

  // Use full README content if available
  if (readme) {
    // Use the entire README content without truncation
    content += readme + '\n\n';
  } else if (aiDescription) {
    content += aiDescription + '\n\n';
  } else {
    content += analysis.description + '\n\n';
  }
  
  // Add source and live links
  content += `Source: [github.com/${OWNER}/${repo.name}](https://github.com/${OWNER}/${repo.name})\n`;
  
  if (repo.homepage) {
    content += `\nLive: [${repo.homepage}](${repo.homepage})\n`;
  } else if (repo.has_pages) {
    content += `\nLive: [${OWNER}.github.io/${repo.name}](https://${OWNER}.github.io/${repo.name}/)\n`;
  }
  
  return content;
}

/**
 * Create project markdown file
 */
function createProjectFile(repo, content) {
  const filename = `${repo.name}.md`;
  const filepath = path.join(PROJECTS_DIR, filename);
  
  fs.writeFileSync(filepath, content, 'utf-8');
  console.log(`✓ Created ${filename}`);
}

/**
 * Main sync function
 */
async function syncProjects() {
  console.log('Starting project sync...');
  
  loadExistingProjects();
  const repos = await getRepositories();
  
  let newProjectsCount = 0;
  
  for (const repo of repos) {
    // Skip if already exists
    if (existingProjects.has(repo.name)) {
      console.log(`⊘ Skipping ${repo.name} (already exists)`);
      continue;
    }
    
    // Skip if no homepage/description (no URL in about)
    if (!repo.homepage && !repo.description) {
      console.log(`⊘ Skipping ${repo.name} (no homepage or description)`);
      continue;
    }
    
    // Skip if archived or private
    if (repo.archived || repo.private) {
      console.log(`⊘ Skipping ${repo.name} (archived or private)`);
      continue;
    }
    
    console.log(`\n📦 Processing ${repo.name}...`);
    
    try {
      // Get README
      const readme = await getReadme(repo.name);
      
      // Analyze repository if no README
      let analysis = null;
      let aiDescription = null;
      
      if (!readme) {
        console.log('  ⚠ No README found, analyzing repository...');
        analysis = await analyzeRepository(repo);
        
        // Try AI generation
        aiDescription = await generateAIDescription(repo, null);
      } else {
        analysis = {
          description: repo.description || '',
          techStack: repo.language || 'Various technologies'
        };
        
        // Try AI generation with README
        aiDescription = await generateAIDescription(repo, readme);
      }
      
      // Generate markdown
      const content = generateMarkdown(repo, readme, analysis, aiDescription);
      
      // Create project file
      createProjectFile(repo, content);
      newProjectsCount++;
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`✗ Error processing ${repo.name}:`, error.message);
    }
  }
  
  console.log(`\n✓ Sync complete! ${newProjectsCount} new project(s) added.`);
}

// Run the sync
syncProjects().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
