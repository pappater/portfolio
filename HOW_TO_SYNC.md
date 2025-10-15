# How to Run Auto-Sync Actions

## 📋 Overview

Your portfolio has **2 GitHub Actions workflows** that sync repositories to the UI:

1. **`sync-projects.yml`** - Main sync workflow (scheduled + manual)
2. **`webhook-receiver.yml`** - Instant webhook sync

---

## 🔄 Method 1: Automatic Sync (Every 6 Hours)

**Workflow**: `sync-projects.yml`  
**Job Name**: `sync-projects`

### How It Works
- Runs automatically every 6 hours
- Checks all your GitHub repositories
- Finds repos with URLs or descriptions
- Creates/updates project files in `_projects/`
- Commits and pushes changes
- GitHub Pages rebuilds the site automatically

### Schedule
```yaml
schedule:
  - cron: '0 */6 * * *'  # Runs at: 00:00, 06:00, 12:00, 18:00 UTC
```

**You don't need to do anything!** Just wait and it syncs automatically.

---

## 🚀 Method 2: Manual Sync (On Demand)

**Workflow**: `sync-projects.yml`  
**Job Name**: `sync-projects`

### Steps to Run Manually:

1. Go to your GitHub repository:
   ```
   https://github.com/pappater/portfolio
   ```

2. Click on the **"Actions"** tab

3. In the left sidebar, click on:
   ```
   "Sync Projects from Repositories"
   ```

4. On the right side, click the **"Run workflow"** dropdown button

5. Keep the branch as `main` and click **"Run workflow"**

6. Wait 1-2 minutes for the workflow to complete

7. Your portfolio will update automatically!

### What This Does:
- ✅ Scans all your public repositories
- ✅ Fetches README.md from each repo
- ✅ Creates project files with full README content
- ✅ Detects technology stack automatically
- ✅ Commits changes to the repository
- ✅ Triggers GitHub Pages rebuild

---

## ⚡ Method 3: Instant Webhook Sync (For Specific Repo)

**Workflow**: `webhook-receiver.yml`  
**Job Name**: `process-webhook`

### Use Case:
When you create a **new repository** and want it to appear **immediately** on your portfolio (without waiting 6 hours).

### Option A: Using GitHub CLI (`gh`)

```bash
gh api repos/pappater/portfolio/dispatches \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -f event_type='sync_new_repository' \
  -f client_payload[repository_name]='YOUR_REPO_NAME'
```

**Example:**
```bash
gh api repos/pappater/portfolio/dispatches \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -f event_type='sync_new_repository' \
  -f client_payload[repository_name]='my-new-project'
```

### Option B: Using `curl` with Personal Access Token

```bash
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer YOUR_GITHUB_TOKEN" \
  https://api.github.com/repos/pappater/portfolio/dispatches \
  -d '{"event_type":"sync_new_repository","client_payload":{"repository_name":"YOUR_REPO_NAME"}}'
```

**Example:**
```bash
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer ghp_xxxxxxxxxxxx" \
  https://api.github.com/repos/pappater/portfolio/dispatches \
  -d '{"event_type":"sync_new_repository","client_payload":{"repository_name":"my-new-project"}}'
```

### Option C: Sync All Repos Instantly

If you don't specify a repository name, it syncs all repos:

```bash
gh api repos/pappater/portfolio/dispatches \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -f event_type='sync_new_repository'
```

---

## 🔍 Which Job Does What?

### `sync-projects` Job (in `sync-projects.yml`)

**Script**: `.github/scripts/sync-projects.js`

**What it does:**
1. Fetches all public repositories from `pappater` account
2. Filters repos with homepage URL OR description
3. Skips archived/private repos
4. For each repo:
   - Gets README.md content
   - Detects technology stack
   - Generates full markdown file in `_projects/`
   - Uses **entire README** (not truncated!)
5. Commits all changes
6. GitHub Pages rebuilds site automatically

**Output:**
- Creates files like: `_projects/my-repo.md`
- Each file contains full README content
- Frontmatter includes: title, date, tech stack

---

### `process-webhook` Job (in `webhook-receiver.yml`)

**Script**: `.github/scripts/process-single-repo.js` OR `sync-projects.js`

**What it does:**
1. If specific repo provided → processes only that repo (fast!)
2. If no repo provided → runs full sync (all repos)
3. Same process as above but faster for single repos

**Use when:**
- You just created a new repo
- You updated a README and want instant refresh
- You don't want to wait 6 hours

---

## 📊 How to Check if Sync Worked

### 1. Check GitHub Actions Status

Go to: `https://github.com/pappater/portfolio/actions`

You'll see:
- ✅ Green checkmark = Success
- ❌ Red X = Failed
- 🟡 Yellow dot = Running

### 2. Check for New Files

Look in the `_projects/` folder:
```bash
ls -la _projects/
```

You should see `.md` files for each project.

### 3. Check Your Live Site

Visit: `https://pappater.github.io/portfolio/`

New projects should appear within 1-2 minutes after the action completes.

---

## 🛠️ Troubleshooting

### Sync didn't create my project?

**Check if your repo meets the criteria:**
- ✅ Is it public?
- ✅ Does it have a homepage URL in the About section?
- ✅ Or does it have a description?
- ✅ Is it not archived?

### How do I force a re-sync?

1. Delete the project file from `_projects/`:
   ```bash
   rm _projects/my-repo.md
   git commit -am "Remove project to re-sync"
   git push
   ```

2. Run manual sync (Method 2 above)

### How do I update a project's README?

Just update the README in the original repository, then:
- Wait for next automatic sync (6 hours), OR
- Run manual sync (Method 2), OR
- Use webhook to sync that specific repo (Method 3)

---

## 🎯 Quick Reference

| Method | When to Use | Speed | How to Trigger |
|--------|-------------|-------|----------------|
| **Automatic** | Set and forget | Every 6 hours | Does it automatically |
| **Manual** | On demand, all repos | ~2-3 minutes | GitHub Actions UI |
| **Webhook** | New repo, instant | ~30 seconds | API call or `gh` CLI |

---

## 💡 Pro Tips

1. **After creating a new repo:** Use the webhook method for instant appearance
2. **For bulk updates:** Use manual sync via GitHub UI
3. **For routine updates:** Just let automatic sync handle it
4. **Always add a URL:** Repos with URLs in the About section are prioritized

---

## 📝 Example Workflow

### You just created a new repo called `awesome-app`:

```bash
# 1. Create repo with README.md on GitHub
# 2. Add homepage URL in repo settings > About

# 3. Trigger instant sync
gh api repos/pappater/portfolio/dispatches \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -f event_type='sync_new_repository' \
  -f client_payload[repository_name]='awesome-app'

# 4. Wait 30 seconds
# 5. Visit https://pappater.github.io/portfolio/
# 6. Your project appears! 🎉
```

---

## 🔗 Links

- **Portfolio Site**: https://pappater.github.io/portfolio/
- **GitHub Actions**: https://github.com/pappater/portfolio/actions
- **Repository**: https://github.com/pappater/portfolio

---

**Last Updated**: October 15, 2025  
**Status**: ✅ Fully Automated & Working
