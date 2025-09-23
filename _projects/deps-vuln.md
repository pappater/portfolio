
title: "Deps Vuln"
date: 2025-09-23
layout: project
tech: "Node.js, JavaScript, React, TypeScript, GitHub Actions, Security"
---

Deps Vuln is a comprehensive toolset and UI for automated dependency vulnerability analysis in Node.js projects.

**Key Features:**
- **Automated Scanning:** Uses GitHub Actions to run `npm audit --json` and `npm ls --json`, collecting dependency and vulnerability data automatically in CI/CD pipelines.
- **Parent Mapping:** Analyzes the full dependency tree to map vulnerable packages to their parent chains, helping you identify which parent libraries to upgrade for remediation.
- **CSV Reporting:** Generates actionable CSV reports (`vulnerable-report.csv`) listing vulnerable packages, versions, parent chains, severity, and advisory URLs.
- **Modern Web UI:** Includes a React-based UI for uploading audit and dependency files, visualizing vulnerabilities in a table, and exporting results. The UI provides minimal upgrade advice and supports black/white themes.
- **AI-Powered Insights:** (Optional) Integrates with OpenAI to generate concise upgrade recommendations for developers.

**How it works:**
1. GitHub Actions run `npm audit --json` and upload the results.
2. A Node.js script (`find-vulnerable-parents.js`) parses the audit and dependency tree, finds all vulnerable packages, and traces their parent chains.
3. The UI allows you to drag-and-drop audit and dependency files, view vulnerabilities, and get actionable upgrade advice.

Source: [github.com/pappater/deps-vuln](https://github.com/pappater/deps-vuln)

Live: [pappater.github.io/deps-vuln](https://pappater.github.io/deps-vuln/)

