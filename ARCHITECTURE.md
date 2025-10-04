# Architecture - Automated Portfolio Sync

This document explains the technical architecture of the automated portfolio synchronization system.

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     GitHub Ecosystem                             │
│                                                                   │
│  ┌──────────────┐         ┌──────────────┐                      │
│  │  New Repo    │         │   Webhook    │                      │
│  │   Created    │────────▶│   (Optional) │                      │
│  └──────────────┘         └──────┬───────┘                      │
│                                   │                               │
│                                   ▼                               │
│  ┌──────────────────────────────────────────┐                   │
│  │     GitHub Actions - Portfolio Repo      │                   │
│  │                                            │                   │
│  │  ┌────────────────────────────────────┐  │                   │
│  │  │  Trigger:                          │  │                   │
│  │  │  • Schedule (every 6 hours)        │  │                   │
│  │  │  • Manual (workflow_dispatch)      │  │                   │
│  │  │  • Webhook (repository_dispatch)   │  │                   │
│  │  └────────────┬───────────────────────┘  │                   │
│  │               ▼                            │                   │
│  │  ┌────────────────────────────────────┐  │                   │
│  │  │  Sync Script (sync-projects.js)    │  │                   │
│  │  │                                      │  │                   │
│  │  │  1. Fetch all public repos         │  │                   │
│  │  │  2. Filter by criteria             │  │                   │
│  │  │  3. Check for existing projects    │  │                   │
│  │  │  4. Process new repositories       │  │                   │
│  │  └────────────┬───────────────────────┘  │                   │
│  │               ▼                            │                   │
│  │  ┌────────────────────────────────────┐  │                   │
│  │  │  Content Generation                │  │                   │
│  │  │                                      │  │                   │
│  │  │  • Fetch README.md                 │  │                   │
│  │  │  • Analyze repository structure    │  │                   │
│  │  │  • Detect technology stack         │  │                   │
│  │  │  • Generate description (AI opt.)  │  │                   │
│  │  └────────────┬───────────────────────┘  │                   │
│  │               ▼                            │                   │
│  │  ┌────────────────────────────────────┐  │                   │
│  │  │  Create Markdown File              │  │                   │
│  │  │  _projects/repo-name.md            │  │                   │
│  │  └────────────┬───────────────────────┘  │                   │
│  │               ▼                            │                   │
│  │  ┌────────────────────────────────────┐  │                   │
│  │  │  Commit & Push Changes             │  │                   │
│  │  └────────────┬───────────────────────┘  │                   │
│  └───────────────┼────────────────────────┘  │                   │
│                  ▼                             │                   │
│  ┌─────────────────────────────────────────┐ │                   │
│  │     GitHub Pages Build & Deploy         │ │                   │
│  └─────────────────┬───────────────────────┘ │                   │
└────────────────────┼─────────────────────────┘                   │
                     ▼                                               
           ┌──────────────────┐                                    
           │  Live Portfolio  │                                    
           │  Website Updated │                                    
           └──────────────────┘                                    
```

## Components

### 1. Workflows (`.github/workflows/`)

#### sync-projects.yml
- **Purpose**: Main synchronization workflow
- **Triggers**: 
  - Schedule (cron: every 6 hours)
  - Manual (workflow_dispatch)
  - Webhook (repository_dispatch)
- **Actions**:
  1. Checkout portfolio repository
  2. Setup Node.js environment
  3. Install npm dependencies
  4. Run sync-projects.js
  5. Commit and push changes

#### webhook-receiver.yml
- **Purpose**: Handle webhook events
- **Triggers**: 
  - repository_dispatch events
- **Actions**:
  1. Process specific repository (if provided)
  2. Or run full sync
  3. Commit and push changes

### 2. Scripts (`.github/scripts/`)

#### sync-projects.js
Main synchronization script with the following flow:

```
Start
  ├─▶ Load existing projects
  ├─▶ Fetch all repositories from GitHub API
  ├─▶ For each repository:
  │    ├─▶ Check if already exists → Skip
  │    ├─▶ Check if meets criteria → Skip if not
  │    ├─▶ Fetch README.md
  │    ├─▶ If no README → Analyze repository
  │    ├─▶ Generate markdown content
  │    ├─▶ Create project file
  │    └─▶ Add delay (rate limiting)
  └─▶ Report summary
```

**Key Functions:**
- `loadExistingProjects()`: Scans _projects/ directory
- `getRepositories()`: Fetches repos via GitHub API
- `getReadme()`: Fetches and decodes README
- `analyzeRepository()`: Code structure analysis
- `detectTechStack()`: Technology detection
- `generateMarkdown()`: Creates project markdown
- `generateAIDescription()`: Optional AI enhancement

#### process-single-repo.js
Processes a single repository (webhook variant).

```
Start
  ├─▶ Get repository name (from args or env)
  ├─▶ Check if already exists → Exit
  ├─▶ Fetch repository details
  ├─▶ Validate criteria
  ├─▶ Fetch README or analyze
  ├─▶ Generate markdown
  ├─▶ Create project file
  └─▶ Exit
```

#### test-local.js
Local testing utility:
- Allows testing without GitHub Actions
- Requires GITHUB_TOKEN environment variable
- Can test single repo or full sync

#### test-setup.sh
Setup verification script:
- Checks all required files exist
- Verifies directory structure
- Confirms Node.js availability
- Reports setup status

### 3. Data Flow

```
GitHub API → Octokit Client → Script Logic → File System → Git → GitHub
```

**Step-by-step:**

1. **Fetch**: Octokit fetches repository data
2. **Filter**: Script applies business logic
3. **Transform**: Data converted to markdown
4. **Write**: File written to _projects/
5. **Commit**: Git stages and commits
6. **Push**: Changes pushed to GitHub
7. **Build**: GitHub Pages rebuilds site
8. **Deploy**: Site updated with new project

## Technology Stack Detection

The system detects technologies using multiple signals:

### 1. Repository Metadata
- **Language**: Primary language from GitHub
- **Topics**: User-defined repository topics

### 2. File Analysis
```javascript
Files Checked:
├─ package.json        → Node.js
├─ requirements.txt    → Python
├─ Gemfile            → Ruby
├─ pom.xml            → Java
├─ Cargo.toml         → Rust
├─ go.mod             → Go
├─ Dockerfile         → Docker
├─ *.tsx, *.jsx       → React
├─ angular.json       → Angular
├─ vue.config.js      → Vue.js
├─ next.config.js     → Next.js
├─ tsconfig.json      → TypeScript
└─ tailwind.config.js → Tailwind CSS
```

### 3. Content Analysis (Optional)
- AI analysis of README content
- Code structure patterns
- Framework-specific files

## Filtering Logic

Repositories must pass all criteria:

```javascript
✓ Public (not private)
✓ Not archived
✓ Has homepage URL OR description
✗ Skip if already in _projects/
```

## Content Generation Strategy

### Priority 1: README.md
If README exists:
1. Fetch and decode content
2. Remove headers and code blocks
3. Extract first 5 meaningful paragraphs
4. Clean formatting
5. Add source and live links

### Priority 2: Repository Analysis
If no README:
1. Fetch repository contents
2. Analyze file structure
3. Detect technology stack
4. Generate description from metadata
5. Add source and live links

### Priority 3: AI Enhancement (Optional)
If OpenAI API key provided:
1. Send repo metadata + README to OpenAI
2. Generate engaging description
3. Use AI output in markdown
4. Fallback to standard method if fails

## Markdown Template

```markdown
---
title: "[Generated from repo name]"
date: [Repository creation date]
layout: project
tech: "[Detected technology stack]"
---

[Generated content from README or analysis]

Source: [GitHub repository URL]

Live: [Homepage URL if available]
```

## Error Handling

```
API Rate Limit → Add delays between requests
README Not Found → Use analysis fallback
Analysis Fails → Use repo description
AI Fails → Use standard description
Commit Fails → Log error, continue
Network Error → Retry with backoff
```

## Performance Considerations

### Rate Limiting
- GitHub API: 5,000 requests/hour (authenticated)
- 1 second delay between repository processing
- Exponential backoff on errors

### Caching
- Existing projects cached in memory
- Prevents duplicate API calls
- Reduces processing time

### Optimization
- Process only new repositories
- Skip archived and private repos
- Parallel-safe: Can run multiple times

## Security

### Token Security
- `GITHUB_TOKEN`: Automatically provided, scoped to repo
- `OPENAI_API_KEY`: Optional, stored as secret
- Tokens never exposed in logs

### Permissions Required
- `contents: write` - To commit and push
- `repo` scope - To read public repositories

### Best Practices
- Use GitHub Secrets for sensitive data
- Minimal token permissions
- No hardcoded credentials
- Secure error messages

## Extensibility

### Adding New Technology Detection

Edit `detectTechStack()` in sync-projects.js:

```javascript
if (files.includes('your-file.config')) tech.add('YourTech');
```

### Customizing Markdown Output

Edit `generateMarkdown()` in sync-projects.js:

```javascript
content += `Custom Field: ${repo.customField}\n`;
```

### Adding New Filters

Edit repository filtering in main loop:

```javascript
if (repo.yourCondition) {
  console.log('Skipping due to custom rule');
  continue;
}
```

## Monitoring & Debugging

### Logs Location
- GitHub Actions → Actions tab → Workflow run → Job logs

### Log Levels
```
✓ Success messages (green)
⊘ Skipped items (gray)
⚠ Warnings (yellow)
✗ Errors (red)
📦 Processing items (blue)
```

### Common Debug Points
1. Repository list fetching
2. Filtering logic
3. Content generation
4. File writing
5. Git operations

## Future Enhancements

### Potential Improvements
- [ ] Support for organization repositories
- [ ] Custom templates per repository
- [ ] Image/screenshot extraction
- [ ] Automatic category assignment
- [ ] Build status badges
- [ ] Contributor information
- [ ] Star/fork count display
- [ ] Last updated timestamp
- [ ] Multi-language support
- [ ] Custom metadata extraction

### Integration Possibilities
- [ ] Slack notifications
- [ ] Twitter auto-posting
- [ ] Discord webhooks
- [ ] RSS feed generation
- [ ] Analytics integration
- [ ] Search functionality
- [ ] Tag cloud generation

## Dependencies

### Runtime Dependencies
```json
{
  "@octokit/rest": "GitHub API client",
  "openai": "Optional AI enhancement"
}
```

### Build Dependencies
- Node.js 20+
- npm or yarn
- Git

### GitHub Actions
- `actions/checkout@v4`
- `actions/setup-node@v4`

## Performance Metrics

### Typical Execution
- Time per repository: ~2-3 seconds
- Full sync (10 repos): ~30 seconds
- Webhook trigger: ~5 seconds
- Deploy time: ~1-2 minutes (GitHub Pages)

### Resource Usage
- Memory: <100MB
- API calls: ~3-5 per repository
- Disk space: <1KB per project file

## Maintenance

### Regular Tasks
- [ ] Review workflow logs weekly
- [ ] Update dependencies monthly
- [ ] Check rate limit usage
- [ ] Verify all projects synced
- [ ] Test webhook endpoints

### Update Process
1. Edit scripts in `.github/scripts/`
2. Test locally with test-local.js
3. Commit and push changes
4. Monitor next scheduled run
5. Verify output in Actions logs

---

For more information:
- [README.md](README.md) - Main documentation
- [QUICK_START.md](QUICK_START.md) - Getting started guide
- [WEBHOOK_SETUP.md](WEBHOOK_SETUP.md) - Webhook configuration
