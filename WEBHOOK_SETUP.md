# Webhook Setup Guide

This guide explains how to set up webhooks to automatically sync new repositories to your portfolio.

## Overview

The portfolio repository can automatically create project entries when new repositories are created in your GitHub account. This works through GitHub Actions workflows that can be triggered via webhooks or on a schedule.

## Setup Methods

### Method 1: Scheduled Sync (Automatic)

The easiest method - no additional setup required!

- **Frequency**: Every 6 hours
- **Workflow**: `.github/workflows/sync-projects.yml`
- **Action**: Scans all repositories and adds any new ones

#### Manual Trigger

You can also manually trigger the sync:

1. Go to your portfolio repository on GitHub
2. Click "Actions" tab
3. Select "Sync Projects from Repositories" workflow
4. Click "Run workflow" button
5. Choose branch and click "Run workflow"

### Method 2: Repository Dispatch (Instant)

For instant updates when you create a new repository, use GitHub's repository dispatch API.

#### Using GitHub CLI (gh)

```bash
# Sync all repositories
gh api repos/pappater/portfolio/dispatches \
  -X POST \
  -f event_type="sync_new_repository"

# Sync a specific repository
gh api repos/pappater/portfolio/dispatches \
  -X POST \
  -f event_type="sync_new_repository" \
  -f client_payload[repository_name]="your-repo-name"
```

#### Using curl

```bash
# Replace YOUR_GITHUB_TOKEN with a personal access token
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer YOUR_GITHUB_TOKEN" \
  https://api.github.com/repos/pappater/portfolio/dispatches \
  -d '{"event_type":"sync_new_repository","client_payload":{"repository_name":"your-repo-name"}}'
```

#### Creating a Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. Give it a name like "Portfolio Sync"
4. Select scopes:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
5. Click "Generate token"
6. Copy and save the token securely

### Method 3: GitHub Actions Webhook (Advanced)

You can set up another GitHub Action in your repositories to trigger the portfolio sync.

Create `.github/workflows/notify-portfolio.yml` in your project repositories:

```yaml
name: Notify Portfolio

on:
  push:
    branches: [main]
  release:
    types: [published]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger portfolio sync
        run: |
          curl -X POST \
            -H "Accept: application/vnd.github+json" \
            -H "Authorization: Bearer ${{ secrets.PORTFOLIO_SYNC_TOKEN }}" \
            https://api.github.com/repos/pappater/portfolio/dispatches \
            -d '{"event_type":"sync_new_repository","client_payload":{"repository_name":"${{ github.event.repository.name }}"}}'
```

Then add `PORTFOLIO_SYNC_TOKEN` as a secret in each repository.

## Repository Requirements

For a repository to be synced to your portfolio, it must meet these criteria:

1. **Public**: Repository must be public
2. **Not Archived**: Repository should not be archived
3. **Has URL or Description**: Repository should have either:
   - A homepage URL in the "About" section
   - A description

### Setting Repository Homepage

1. Go to your repository on GitHub
2. Click the gear icon (⚙️) next to "About" section
3. Enter website URL in "Website" field
4. Click "Save changes"

## Configuration

### Required Secrets

- `GITHUB_TOKEN`: Automatically provided by GitHub Actions (no setup needed)

### Optional Secrets

- `OPENAI_API_KEY`: For AI-enhanced project descriptions
  1. Go to portfolio repository Settings → Secrets and variables → Actions
  2. Click "New repository secret"
  3. Name: `OPENAI_API_KEY`
  4. Value: Your OpenAI API key
  5. Click "Add secret"

## How It Works

### Workflow Process

1. **Trigger**: Workflow starts (scheduled, manual, or webhook)
2. **Fetch Repositories**: Gets list of all public repositories
3. **Filter**: Checks each repository against criteria
4. **Check Existing**: Skips repositories already in `_projects/`
5. **Fetch Content**:
   - Try to get README.md
   - If no README, analyze repository structure
   - Optionally generate AI description
6. **Create Project File**: Generate markdown file in `_projects/`
7. **Commit & Push**: Automatically commits and pushes changes
8. **Deploy**: GitHub Pages rebuilds site with new project

### Content Generation

#### With README
- Extracts first meaningful paragraphs
- Removes code blocks and complex formatting
- Adds source and live links

#### Without README
- Analyzes file structure
- Detects technology stack
- Generates description based on files and metadata
- Optionally uses AI for better description

### Technology Detection

The system detects technologies from:

- **Languages**: Primary repository language
- **Package Managers**: 
  - `package.json` → Node.js
  - `requirements.txt` → Python
  - `Gemfile` → Ruby
  - `pom.xml` → Java
  - `Cargo.toml` → Rust
  - `go.mod` → Go
- **Frameworks**:
  - React, Angular, Vue.js, Next.js
  - TypeScript, Tailwind CSS
  - Docker, Kubernetes
- **Topics**: Repository topics are included

## Testing

### Test the Sync Workflow

1. Create a new test repository
2. Add a homepage URL in About section
3. Trigger the workflow manually
4. Check Actions logs for progress
5. Verify new file appears in `_projects/`

### Verify Output

```bash
# Check if project file was created
ls -la _projects/your-repo-name.md

# View the content
cat _projects/your-repo-name.md

# Check git status
git status
```

## Troubleshooting

### Issue: Projects not syncing

**Solutions:**
1. Check workflow logs in Actions tab
2. Verify repository is public and not archived
3. Ensure repository has homepage or description
4. Check `GITHUB_TOKEN` permissions

### Issue: Build failures

**Solutions:**
1. Verify YAML frontmatter syntax
2. Check for special characters in titles
3. Review generated markdown files
4. Test Jekyll build locally

### Issue: Missing content

**Solutions:**
1. Check if README.md exists in repository
2. Verify README.md is not empty
3. Try manual trigger to regenerate
4. Review script logs for errors

### Issue: Rate limiting

**Solutions:**
1. Reduce sync frequency in workflow
2. Add delays between API calls
3. Use authenticated requests (automatic with GITHUB_TOKEN)

## Maintenance

### Updating Existing Projects

To regenerate a project entry:

1. Delete the existing `.md` file from `_projects/`
2. Trigger the sync workflow
3. The project will be recreated with latest content

### Customizing Templates

Edit `.github/scripts/sync-projects.js`:

- Line ~200: Modify `generateMarkdown()` function
- Line ~100: Adjust `detectTechStack()` function
- Line ~250: Change filtering logic

### Monitoring

- Check GitHub Actions tab regularly
- Review commit history for auto-syncs
- Monitor workflow run times and failures

## Advanced Features

### Custom Content Enhancement

You can enhance the automation by:

1. **Custom AI Prompts**: Modify `generateAIDescription()` function
2. **Additional Metadata**: Add more frontmatter fields
3. **Image Extraction**: Fetch and include repository images
4. **Tag Generation**: Auto-generate project tags
5. **Search Integration**: Add metadata for search optimization

### Integration with Other Services

- **Slack Notifications**: Add webhook to notify on new projects
- **Twitter Posts**: Auto-tweet new portfolio additions
- **Analytics**: Track project views and engagement
- **RSS Feed**: Auto-generate feed from projects

## Security Considerations

1. **Tokens**: Never commit tokens to repository
2. **Secrets**: Use GitHub Secrets for sensitive data
3. **Permissions**: Use minimal required token permissions
4. **Rate Limits**: Be mindful of GitHub API rate limits
5. **Dependencies**: Keep npm packages updated

## Support

For issues or questions:
- Check GitHub Actions logs first
- Review this documentation
- Open an issue in the portfolio repository
- Check GitHub API status page

## Future Enhancements

Potential improvements:
- [ ] Support for private repositories (with authentication)
- [ ] Image/screenshot fetching
- [ ] Automatic tag generation
- [ ] Project categorization
- [ ] Star/fork count display
- [ ] Contributor information
- [ ] Build status badges
- [ ] Deployment status
