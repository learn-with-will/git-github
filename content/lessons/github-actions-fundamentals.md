---
slug: github-actions-fundamentals
title: "GitHub Actions: Workflows, Jobs & Steps"
topic: ci-workflows
kind: concept
summary: "Understand GitHub Actions CI/CD vocabulary: workflows, triggers, matrix jobs, steps, runners, and reusable actions."
tags: [github-actions, ci-cd, automation]
related: [actions-ci-pipeline, workflow-secrets-and-caching, branch-protection-rules]
---
> **In one line:** GitHub Actions automates CI/CD using YAML workflows triggered by repository events and executed on virtual runners.

## The idea

**GitHub Actions** is GitHub's built-in automation and Continuous Integration / Continuous Delivery (CI/CD) platform. It allows you to automatically build, test, lint, and deploy your code whenever events happen in your repository (like opening a pull request or pushing to `main`).

GitHub Actions uses a hierarchy of four primary concepts:
1. **Workflows:** Automated procedures configured in YAML files inside `.github/workflows/`.
2. **Events (Triggers):** Specific repository activities that trigger the workflow, defined by the `on:` key (e.g. `push`, `pull_request`, `schedule`).
3. **Jobs:** A set of steps that execute on the same virtual machine runner. By default, jobs run in parallel, but you can configure dependencies with `needs:`.
4. **Steps:** Individual tasks within a job. A step can run shell commands (`run:`) or execute reusable community actions (`uses:`).
5. **Runners:** Virtual machines hosted by GitHub (Ubuntu, Windows, macOS) that execute your jobs.

| Component | Hierarchy Level | Defined in YAML by |
|---|---|---|
| **Workflow** | Top-level file in `.github/workflows/` | `name: CI` |
| **Trigger** | What events launch the workflow | `on: [push, pull_request]` |
| **Job** | Unit of work executed on a runner | `jobs: test:` |
| **Runner** | Operating system virtual environment | `runs-on: ubuntu-latest` |
| **Step** | Sequential commands or actions | `steps: - uses: ... - run: ...` |

## See it

A minimal GitHub Actions CI workflow in `.github/workflows/ci.yml`:

```yaml
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Run automated test suite
        run: npm test
```

## Go deeper

The `actions/checkout@v4` action is the most critical first step in virtually every workflow. By default, virtual runners launch with an empty disk. `actions/checkout` downloads your repository's Git history and checks out your commit onto the runner so subsequent build steps can access project files.

> **Tip:** You can define a `concurrency` group in your workflow to automatically cancel in-flight test runs when a developer pushes new commits to the same PR.

## Watch out

- Forgetting `actions/checkout` in your first step; subsequent scripts will fail with 'file not found' errors.
- Committing workflow YAML files to any folder other than `.github/workflows/`; GitHub ignores other paths.

## Remember

- Workflows live in `.github/workflows/*.yml` and trigger on repository events.
- Jobs run in parallel on virtual runners; steps run sequentially within a job.
- Use `actions/checkout` to download project files onto the runner before running tests.
