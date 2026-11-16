---
slug: the-github-flow
title: "The GitHub Flow"
topic: pull-requests
kind: pattern
summary: "Master the GitHub Flow: branch off main, commit small changes, open a pull request, review, merge, and deploy."
tags: [github-flow, workflow, collaboration]
related: [opening-and-reviewing-prs, code-review-guidelines, branching-strategies-compared]
---
> **In one line:** The GitHub Flow is a lightweight, branch-based workflow that delivers continuous, high-quality deployments from main.

## The idea

The **GitHub Flow** is a lightweight, branch-based development methodology created by GitHub. It is the dominant workflow for modern web applications and agile development teams practicing continuous delivery.

The GitHub Flow consists of six core principles:
1. **`main` is always deployable:** The `main` branch contains tested, production-ready code at all times.
2. **Branch off `main` for everything:** Every new feature, bug fix, or refactor begins on a descriptively named topic branch created directly from latest `main`.
3. **Commit and push early:** Push commits to your remote branch regularly to back up work and share progress.
4. **Open a Pull Request:** Open a PR early to initiate team discussion and trigger automated CI test runs.
5. **Review and iterate:** Teammates review code, leave feedback, and request changes. You push follow-up commits to the same branch.
6. **Merge and deploy:** Once approved and CI status checks pass, merge into `main` and deploy immediately to production.

| Step | Action | Primary Tool |
|---|---|---|
| **1. Create Branch** | `git switch -c feat/search-filter` | Local Git CLI |
| **2. Work & Push** | `git commit` & `git push -u origin feat/...` | Local Git CLI |
| **3. Open PR** | Propose merging feature into `main` | GitHub Web UI |
| **4. Review & CI** | Automated tests run; peers review | GitHub Actions & PR Review |
| **5. Merge** | Integrated into `main` and branch deleted | GitHub PR Interface |

## See it

Execute the developer steps of the GitHub Flow:

```bash
# 1. Ensure local main is up to date
git switch main
git pull

# 2. Branch off main for a specific task
git switch -c feat/dark-mode-toggle

# 3. Write code, stage, and commit
git add src/theme.ts
git commit -m "feat(theme): implement dark mode state provider"

# 4. Push to GitHub and open PR
git push -u origin feat/dark-mode-toggle
```

## Go deeper

Unlike older, heavyweight workflows like Git Flow (which mandate `develop`, `release`, and `hotfix` branches), the GitHub Flow has only one long-lived branch: `main`. This simplicity dramatically reduces merge conflicts and minimizes time-to-market for software features.

> **Tip:** You can open a **Draft Pull Request** on GitHub to signal that your code is still in progress, allowing teammates to view early architecture without requesting formal review.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

## Watch out

- Committing directly to `main` without a topic branch and pull request, bypassing CI and peer review.
- Keeping a feature branch unmerged for weeks, allowing it to diverge significantly from `main`.

## Remember

- In GitHub Flow, anything on `main` is deployable to production at all times.
- Create descriptive topic branches directly off `main` for every task.
- Use Pull Requests for peer review, discussion, and automated CI test gates.
