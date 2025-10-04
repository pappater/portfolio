# Portfolio Jekyll Site

This is a Jekyll-based portfolio site with automated project synchronization from GitHub repositories. The site automatically discovers and creates portfolio entries for repositories with URLs in their About section.

## Table of Contents
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Configuration](#configuration)
- [Automated Project Sync](#automated-project-sync)
- [Deployment](#deployment)

## Project Structure

- `_config.yml`: Main configuration file (site title, baseurl, etc.)
- `Gemfile`: Specifies Jekyll and plugins.
- `index.html`: Main page, uses Liquid templating.
- `_layouts/`, `_projects/`, `assets/`: Folders for layouts, project posts, CSS, images.
- `.github/workflows/`: GitHub Actions workflows for automation
- `.github/scripts/`: Scripts for automated project synchronization

## Installation

Run these commands in your project directory:

```bash
# Install Bundler if not installed
gem install bundler

# Install project dependencies
bundle install
```

## Running Locally

```bash
bundle exec jekyll serve
```
This will build and serve your site locally at `http://localhost:4000`.

## Configuration

- Edit `_config.yml` to change site settings (title, description, baseurl, etc.).
- Add/edit pages in `_projects/` for portfolio items.
- Customize layout in `_layouts/project.html` and CSS in `assets/css/style.css`.

## Automated Project Sync

This portfolio has an automated system that synchronizes projects from GitHub repositories. Here's how it works:

### How It Works

1. **Automatic Discovery**: GitHub Actions workflows periodically scan the pappater GitHub account for new repositories
2. **Filtering**: Only processes repositories that have:
   - A URL in the About section (homepage field) OR a description
   - Public visibility (not archived or private)
3. **Content Generation**:
   - Fetches the repository's README.md if available
   - If no README exists, analyzes the repository structure to generate content
   - Detects technology stack from files and metadata
   - Optionally uses OpenAI to generate enhanced descriptions
4. **Project Creation**: Automatically creates a new `.md` file in the `_projects/` folder
5. **Deployment**: Commits and pushes changes, triggering GitHub Pages rebuild

### Workflows

#### 1. Scheduled Sync (`sync-projects.yml`)
- **Trigger**: Runs every 6 hours automatically
- **Purpose**: Discovers and syncs new repositories
- **Manual Trigger**: Can be manually triggered from GitHub Actions tab

#### 2. Webhook Receiver (`webhook-receiver.yml`)
- **Trigger**: Via `repository_dispatch` event
- **Purpose**: Processes specific repositories instantly when triggered
- **Usage**: Can be triggered by external webhooks or API calls

### Triggering Instant Sync

To trigger an instant sync for a new repository, use GitHub's API:

```bash
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer YOUR_GITHUB_TOKEN" \
  https://api.github.com/repos/pappater/portfolio/dispatches \
  -d '{"event_type":"sync_new_repository","client_payload":{"repository_name":"YOUR_REPO_NAME"}}'
```

### Project File Format

Each project file in `_projects/` follows this format:

```markdown
---
title: "Project Title"
date: YYYY-MM-DD
layout: project
tech: "Technology Stack"
---

Project description and content here.

Source: [github.com/pappater/repo-name](https://github.com/pappater/repo-name)

Live: [project-url](https://project-url)
```

### Technology Detection

The system automatically detects technologies from:
- Repository language metadata
- Package manager files (package.json, requirements.txt, Gemfile, etc.)
- Configuration files (tsconfig.json, tailwind.config.js, etc.)
- Framework-specific files (angular.json, vue.config.js, etc.)

### AI Enhancement (Optional)

If `OPENAI_API_KEY` is configured as a repository secret, the system will:
- Generate more engaging project descriptions
- Improve readability and consistency
- Create better portfolio-style content

To enable AI features:
1. Go to repository Settings → Secrets and variables → Actions
2. Add `OPENAI_API_KEY` with your OpenAI API key

### Scripts

- **sync-projects.js**: Main script that scans all repositories and syncs new ones
- **process-single-repo.js**: Processes a specific repository (used by webhook)

### Customization

To customize the sync behavior, edit the scripts in `.github/scripts/`:
- Modify repository filtering logic
- Adjust content generation templates
- Change technology detection rules
- Update markdown formatting

### Manual Project Addition

You can still manually add projects by creating `.md` files in `_projects/`:

```bash
# Create a new project file
touch _projects/my-project.md

# Edit with your preferred editor
nano _projects/my-project.md
```

### Troubleshooting

**Projects not syncing:**
- Check GitHub Actions logs in the "Actions" tab
- Verify repository has homepage URL or description
- Ensure repository is public and not archived

**Build failures:**
- Verify Jekyll syntax in generated markdown files
- Check for invalid frontmatter YAML
- Review commit history for changes

**Missing projects:**
- Run manual sync from GitHub Actions tab
- Check if repository meets filtering criteria
- Verify `GITHUB_TOKEN` permissions

### Requirements Summary

1. ✅ New repositories with URLs in About section are automatically discovered
2. ✅ README.md is fetched and used as content source
3. ✅ Instant sync possible via repository_dispatch webhook
4. ✅ Changes automatically deployed to pappater.github.io/portfolio
5. ✅ Code analysis for repositories without README
6. ✅ Technology stack detection and smart content generation
7. ✅ Comprehensive documentation of the automation system

## Deployment

For GitHub Pages, push your code to a GitHub repository and set the repository settings to use GitHub Pages. The automated workflows will handle project synchronization and keep your portfolio up to date.
