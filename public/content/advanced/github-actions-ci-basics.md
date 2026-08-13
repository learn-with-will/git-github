---
id: lesson-22
slug: github-actions-ci-basics
title: "GitHub Actions: CI Basics"
level: advanced
order: 22
duration: 19
tags:
  - github-actions
  - ci-cd
  - workflows
  - automation
summary: "GitHub's built-in CI/CD: how workflows, events, jobs, steps, runners, and actions fit together — and how to write a minimal 'test on every push' pipeline in YAML."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain the GitHub Actions vocabulary: **workflow, event, job, step, runner, action**.
- Write a minimal CI workflow that runs your tests on every push and pull request.
- Read a workflow YAML file and know where it lives.
- Avoid the classic beginner mistakes (missing checkout, wrong file location).

# Why It Matters

**Continuous Integration (CI)** — automatically building and testing every change — catches bugs
before they reach `main` and is a backbone of the GitHub flow. **GitHub Actions** is GitHub's
built-in way to do it (and much more automation) with a YAML file in your repo. Once you can read
and write a basic workflow, you can make quality checks run themselves.

# Concept Explanation

### The vocabulary

- **Workflow:** an automated process defined in a **YAML file under `.github/workflows/`**.
- **Event:** what triggers a workflow — a `push`, a `pull_request`, a schedule, a manual run.
  Declared under `on:`.
- **Job:** a group of steps that runs on one machine. Jobs run **in parallel by default**; use
  `needs:` to make one wait for another.
- **Runner:** the machine that executes a job — **GitHub-hosted** (e.g. `ubuntu-latest`) or
  self-hosted.
- **Step:** one task in a job. It either runs a shell command (`run:`) or uses an **action**
  (`uses:`).
- **Action:** a reusable, shareable unit of work (e.g. `actions/checkout`, `actions/setup-node`).

### A minimal CI workflow

Save this as `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4        # get your code onto the runner
      - uses: actions/setup-node@v4      # install Node
        with:
          node-version: 20
      - run: npm ci                      # install dependencies
      - run: npm test                    # run the tests
```

Read it top to bottom: **on** a push to `main` or any pull request, run a **job** called `test`
**on** an Ubuntu **runner**, whose **steps** check out the code, set up Node, install, and test.
If any step fails, the job fails and the PR shows a red check.

### Two things beginners miss

- **`actions/checkout` first.** A fresh runner has *no* code until you check it out. Skip it and
  your build can't find any files.
- **Jobs don't share a filesystem.** Each job runs on its own runner; to pass files between jobs,
  upload/download **artifacts**.

### Secrets

Never hardcode credentials. Store them in repo/organization **Secrets** and reference them:

```yaml
      - run: ./deploy.sh
        env:
          TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

# Key Terminology

- **Workflow:** the automated process (a YAML file in `.github/workflows/`).
- **Event (`on:`):** what triggers the workflow.
- **Job:** a set of steps on one runner; parallel unless `needs:` orders them.
- **Runner:** the machine executing a job.
- **Step:** a single task — `run:` a command or `uses:` an action.
- **Action:** a reusable unit referenced with `uses:`.
- **Artifact:** files passed between jobs or saved from a run.

# Options and Trade-offs

| Concept | In the YAML | Notes |
| ------- | ----------- | ----- |
| Trigger | `on:` | `push`, `pull_request`, `schedule`, `workflow_dispatch`, … |
| Machine | `runs-on:` | `ubuntu-latest`, `windows-latest`, `macos-latest`, self-hosted |
| Run a command | `run:` | Any shell command |
| Use an action | `uses:` | e.g. `actions/checkout@v4`; pin the version |
| Order jobs | `needs:` | Otherwise jobs run in parallel |

# Worked Example

You want tests to run automatically on every push and PR for a Node project.

1. Create `.github/workflows/ci.yml` with the minimal workflow above.
2. Commit and push it.
3. Open the repo's **Actions** tab — the workflow runs, and you see each step's log.
4. Open a pull request: the CI check appears on the PR. If `npm test` fails, the check goes red
   and reviewers see it before merging.

```text
✓ Set up job
✓ actions/checkout@v4
✓ actions/setup-node@v4
✓ npm ci
✗ npm test        ← failing test blocks the merge
```

The pipeline now guards `main` automatically — no one has to remember to run the tests.

# Real World Analogy

A workflow is a **recipe a robot kitchen runs by itself** whenever a trigger happens (an order
comes in = a push). **Jobs** are cooks who can work **in parallel**; **steps** are the recipe's
numbered instructions; and **actions** are **pre-made ingredients and tools** you pull off the
shelf with `uses:` instead of making from scratch. Forgetting `checkout` is like the robot trying
to cook before anyone delivered the groceries.

# Examples

## Example 1 — Basic: test on every push

A small project adds the minimal `ci.yml`. Now every push runs the tests on a clean Ubuntu
runner, and broken changes are caught immediately.

**Why this works:** The `on: push` trigger plus a checkout-and-test job gives automatic feedback
with almost no configuration.

## Example 2 — Real-world: a build matrix

A library tests across several Node versions at once using a matrix, so a change is verified on
everything it supports in parallel jobs.

**Why this works:** Jobs run in parallel by default, so a matrix broadens coverage without
slowing the pipeline much.

## Example 3 — Trade-off / pitfall: the missing checkout

A newcomer's workflow runs `npm test` but omits `actions/checkout`. The job fails with "no such
file" because the runner never received the repository's code.

**Why this bites:** A runner starts empty. Without a checkout step, there's nothing to build or
test — one of the most common first-workflow errors.

# Common Mistakes

- **Omitting `actions/checkout`,** so the runner has no code.
- **Putting the file in the wrong place** — it must be under `.github/workflows/`.
- **Assuming jobs share a filesystem;** they don't — use artifacts to pass files.
- **Hardcoding secrets** instead of using `${{ secrets.NAME }}`.

# Best Practices

- Keep workflows in **`.github/workflows/`**, one clear file per purpose.
- **Pin action versions** (e.g. `@v4`) for reproducibility.
- Trigger CI on **`push` and `pull_request`** so PRs get checked before merge.
- Use **Secrets** for credentials; never commit them.
- Keep pipelines **fast** (cache dependencies) so feedback stays quick.

# Summary

- **GitHub Actions** is GitHub's built-in CI/CD, configured by **YAML workflows in
  `.github/workflows/`**.
- A **workflow** is triggered by an **event** (`on:`), contains **jobs** (parallel by default),
  each running on a **runner** with **steps** that `run:` commands or `uses:` **actions**.
- A minimal CI job **checks out** the code, sets up the toolchain, installs, and tests — turning
  a red/green check on every push and PR.
- Classic pitfalls: forgetting `actions/checkout`, wrong file location, expecting jobs to share a
  filesystem, and hardcoding secrets.

# Flash Cards

Q: Where do GitHub Actions workflow files live?
A: In the .github/workflows/ directory of the repository, as YAML files.

Q: What triggers a workflow to run?
A: An event declared under `on:` — such as push, pull_request, schedule, or a manual workflow_dispatch.

Q: What's the relationship between jobs, steps, runners, and actions?
A: A workflow has jobs; each job runs on a runner and contains steps; a step runs a command (run) or uses an action (uses).

Q: Do jobs in a workflow run in parallel or in sequence by default?
A: In parallel by default; add `needs:` to make one job wait for another.

Q: Your CI runs tests but they fail with "no such file." What's likely missing?
A: The actions/checkout step — the runner starts empty and has none of your code until you check it out.

Q: How should you provide a credential to a workflow?
A: Store it as a Secret and reference it with ${{ secrets.NAME }}; never hardcode it in the YAML.

# Exercises

### Easy

Write a minimal `.github/workflows/ci.yml` that checks out the code and runs your project's test
command on every push. Identify the event, job, runner, and steps.

### Medium

Add a second job (e.g. lint) that must finish before `test` runs, using `needs:`. Explain how the
default parallel behavior changes.

### Challenging

Explain, step by step, what happens from `git push` to a red/green check on a pull request: which
event fires, what the runner does, why `actions/checkout` is required, and how a failing step
blocks the merge.

# Further Reading

- GitHub Docs — [Understanding GitHub Actions](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions) and [Workflow syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- GitHub Docs — [Building and testing your code (quickstart)](https://docs.github.com/en/actions/automating-builds-and-tests)
