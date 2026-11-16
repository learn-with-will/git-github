---
slug: actions-ci-pipeline
title: "Building a CI Pipeline"
topic: ci-workflows
kind: technique
summary: "Build a robust CI pipeline with GitHub Actions: matrix testing across versions, linting, unit tests, and build artifacts."
tags: [github-actions, ci-cd, testing]
related: [github-actions-fundamentals, workflow-secrets-and-caching, branch-protection-rules]
---
> **In one line:** Build a comprehensive CI pipeline that runs linters, test suites, and multi-version matrix builds on every pull request.

## The idea

A production-grade CI pipeline does not just run a single test script; it validates formatting, checks static types, executes unit and integration tests, and verifies that the code builds across supported runtime versions and operating systems.

To test across multiple environments without duplicating YAML code, GitHub Actions provides **Matrix Builds**.

By defining a `strategy.matrix`, GitHub automatically fans out and launches parallel jobs for every combination of parameters (e.g. testing across Node 18, 20, and 22 on both Ubuntu and Windows).

A robust pipeline structure follows sequential gates:
1. **Lint & Type Check:** Fast feedback on syntax and types (fails in seconds).
2. **Unit Test Matrix:** Parallel execution of test suites across supported runtimes.
3. **Build & Package:** Generates production bundle artifacts only if tests pass.

| CI Stage | Typical Commands | Speed |
|---|---|---|
| **Lint / Format** | `npm run lint`, `prettier --check` | 10–30 seconds |
| **Type Check** | `tsc --noEmit` | 15–45 seconds |
| **Unit Test Matrix** | `npm test` across Node 18, 20, 22 | 1–3 minutes |
| **Production Build** | `npm run build` | 1–2 minutes |

## See it

Configure a matrix build pipeline in `.github/workflows/test.yml`:

```yaml
name: Test Suite

on:
  pull_request:
    branches: [main]

jobs:
  matrix-test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x, 22.x]
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm test
```

## Go deeper

Using `npm ci` instead of `npm install` in CI environments is critical. `npm ci` strictly honors `package-lock.json` and deletes any pre-existing `node_modules`, guaranteeing deterministic, reproducible builds and failing fast if the lockfile was not committed properly.

> **Tip:** You can upload build outputs as downloadable artifacts using `actions/upload-artifact@v4`, allowing teammates to test compiled bundles without building locally.

## Watch out

- Running `npm install` in CI instead of `npm ci`, allowing unpinned dependencies to cause silent build drift.
- Creating massive build matrices that exhaust your organization's free GitHub Actions runner minutes.

## Remember

- Use `strategy.matrix` to test code across multiple runtime versions and operating systems in parallel.
- Always run `npm ci` in CI pipelines for deterministic, lockfile-enforced dependency installation.
- Structure pipelines to fail fast: run linters and type-checkers before long-running integration tests.
