# Quick Start Guide - Automated Portfolio Sync

This guide will help you get started with the automated portfolio synchronization system in under 5 minutes.

## What You'll Get

✅ Automatic portfolio updates when you create new repositories  
✅ Smart content extraction from README files  
✅ Intelligent code analysis for repos without README  
✅ Technology stack detection  
✅ Live demo links (if GitHub Pages enabled)

## Step 1: Verify Setup (1 minute)

The automation is already set up! Run this command to verify:

```bash
bash .github/scripts/test-setup.sh
```

You should see all checkmarks (✓).

## Step 2: Test the Sync (2 minutes)

### Option A: Manual Trigger (Recommended for first test)

1. Go to your portfolio repository on GitHub
2. Click the **"Actions"** tab
3. Click **"Sync Projects from Repositories"** in the left sidebar
4. Click **"Run workflow"** button (top right)
5. Click the green **"Run workflow"** button
6. Wait 1-2 minutes and check the results

### Option B: Command Line Trigger

```bash
# Using GitHub CLI
gh workflow run sync-projects.yml

# Check status
gh run list --workflow=sync-projects.yml
```

## Step 3: Create a Test Repository (2 minutes)

1. Create a new repository on GitHub (e.g., "test-project")
2. Add a description or homepage URL in the **About** section
3. Add a README.md with some content (optional but recommended)
4. Wait for the next scheduled sync (runs every 6 hours) OR trigger manually

Example README.md:
```markdown
# Test Project

This is a test project to verify the portfolio automation.

## Features
- Feature 1
- Feature 2

Built with JavaScript and React.
```

## What Happens Next?

### Automatic Process

1. **Discovery**: The workflow finds your new repository
2. **Check**: Verifies it has a homepage/description and is public
3. **Fetch**: Gets README.md content or analyzes code
4. **Generate**: Creates a markdown file in `_projects/`
5. **Deploy**: Commits and pushes to trigger GitHub Pages rebuild
6. **Live**: Your portfolio updates with the new project!

### Timeline

- **Scheduled**: Every 6 hours automatically
- **Manual**: Instant when you trigger the workflow
- **Webhook**: Instant if configured (see Advanced Setup)

## Viewing Your Projects

Once synced, projects appear at:
- **Portfolio**: https://pappater.github.io/portfolio/
- **Project File**: `_projects/your-repo-name.md`

## Expected Output

Your new project file will look like this:

```markdown
---
title: "Test Project"
date: 2025-01-15
layout: project
tech: "JavaScript, React"
---

This is a test project to verify the portfolio automation.

Features:
- Feature 1
- Feature 2

Built with JavaScript and React.

Source: [github.com/pappater/test-project](https://github.com/pappater/test-project)

Live: [https://pappater.github.io/test-project/](https://pappater.github.io/test-project/)
```

## Customizing Projects

After a project is synced, you can manually edit it:

1. Find the file in `_projects/your-repo-name.md`
2. Edit the frontmatter or content
3. Commit and push
4. Your custom changes will be preserved

To regenerate from source:
1. Delete the `.md` file
2. Trigger the sync workflow
3. The project will be recreated fresh

## Troubleshooting

### Project didn't sync?

**Checklist:**
- [ ] Repository is public (not private)
- [ ] Repository has a description or homepage URL
- [ ] Repository is not archived
- [ ] You've triggered the workflow or waited for schedule

### How to check?

```bash
# Check if project file exists
ls -la _projects/your-repo-name.md

# View workflow logs
# Go to Actions tab → Click on workflow run → View logs
```

### Still not working?

1. Check the Actions tab for error logs
2. Verify `GITHUB_TOKEN` has correct permissions
3. See [WEBHOOK_SETUP.md](WEBHOOK_SETUP.md) for detailed troubleshooting

## Advanced Features

### Enable AI Descriptions (Optional)

1. Get an OpenAI API key from https://platform.openai.com/
2. Go to repository Settings → Secrets and variables → Actions
3. Add secret: `OPENAI_API_KEY` with your key
4. Next sync will use AI to enhance descriptions

### Instant Updates via Webhook

See [WEBHOOK_SETUP.md](WEBHOOK_SETUP.md) for setting up instant notifications.

### Add to Other Repos

Want other repos to notify your portfolio instantly?

Copy `.github/workflows/EXAMPLE_REPO_WORKFLOW.yml` to your project repositories.

## Repository Requirements

### Required
✅ Public repository  
✅ Homepage URL OR description in About section  
✅ Not archived  

### Recommended
⭐ README.md file with clear description  
⭐ GitHub Pages enabled for live demo  
⭐ Repository topics/tags set  
⭐ Clear project description  

### Best Practices

**For Best Results:**
1. Write clear, concise README files
2. Add a homepage URL in repository settings
3. Enable GitHub Pages for demo sites
4. Use descriptive repository names
5. Add relevant topics/tags
6. Include technology stack in README

**README Tips:**
- Start with a clear description (first paragraph matters!)
- Use bullet points for features
- Include technology stack
- Add usage examples
- Keep it concise (first 300 words are used)

## Next Steps

1. ✅ Run test sync to verify setup
2. ✅ Create test repository to see automation
3. ✅ Review generated project file
4. ⭐ Add OpenAI API key for AI enhancement (optional)
5. ⭐ Set up webhooks for instant updates (optional)
6. ⭐ Customize project templates in scripts (optional)

## Need Help?

- 📖 Full documentation: [README.md](README.md)
- 🔧 Webhook setup: [WEBHOOK_SETUP.md](WEBHOOK_SETUP.md)
- 🐛 Issues: Check GitHub Actions logs in the Actions tab
- 💡 Questions: Open an issue in this repository

---

**That's it!** Your portfolio is now automated. Create new repositories and watch them appear in your portfolio automatically. 🎉
