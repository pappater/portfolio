---
title: "Deps Vuln"
date: 2025-09-21
layout: project
tech: "TypeScript"
---

Demo repo to show automated dependency scanning + parent mapping.

Workflow:

1. GitHub Actions runs `npm audit --json` and uploads `npm-audit.json`.

2. A mapping job runs `npm ls --json`, reads `npm-audit.json`, finds vulnerable packages, and outputs `vulnerable-report.csv`.

Source: [github.com/pappater/deps-vuln](https://github.com/pappater/deps-vuln)

Live: [https://pappater.github.io/deps-vuln/](https://pappater.github.io/deps-vuln/)
