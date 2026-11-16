---
slug: fork-and-pull-model
title: "The Fork-and-Pull Model"
topic: pull-requests
kind: pattern
summary: "Understand open-source collaboration using server-side forks, topic branches, and cross-repository pull requests."
tags: [fork, open-source, collaboration]
related: [syncing-upstream-forks, open-source-contribution-etiquette, opening-and-reviewing-prs]
---
> **In one line:** A fork is a server-side clone of a repository under your own account, enabling you to contribute to projects without push access.

## The idea

In a company or small team, developers usually collaborate on a single shared repository: everyone has write permissions to push branches directly to `origin`.

In the open-source world, allowing thousands of strangers to push branches to a project's repository is a severe security and organization risk. Instead, open-source projects rely on the **Fork-and-Pull Model**.

A **fork** is not a core Git command; it is a feature of hosting platforms like GitHub. Clicking 'Fork' on GitHub creates a complete server-side copy of the target repository under your own personal GitHub account. You have full write permissions on your fork.

The workflow operates in four stages:
1. **Fork:** Create your personal server-side copy on GitHub.
2. **Clone:** Clone your personal fork to your local machine (`origin`).
3. **Commit & Push:** Create a local topic branch, write your changes, and push to your fork.
4. **Pull Request:** Open a cross-repository pull request proposing changes from your fork's branch into the upstream project's `main` branch.

| Concept | Shared Repository Model | Fork-and-Pull Model |
|---|---|---|
| **Common Use** | Private company teams | Open-source public projects |
| **Push Permissions** | Team members push directly to `origin` | Contributors push only to their personal fork |
| **Pull Requests** | Between branches on the same repo | Cross-repository from fork to upstream |

## See it

Fork and clone a project using the GitHub CLI:

```bash
# Fork an upstream project and clone it to your machine in one command
gh repo fork torvalds/linux --clone

# Create a topic branch for your patch
git switch -c fix/docs-typo

# Make changes, commit, and push to your fork
git commit -am "docs: fix spelling in kernel-parameters"
git push -u origin fix/docs-typo

# Open cross-repository PR to the original parent project
gh pr create
```

## Go deeper

When you open a PR from a fork, GitHub automatically creates a special pull request ref in the parent repository (e.g. `refs/pull/123/head`). Maintainers of the parent repository can check out your PR locally using `gh pr checkout 123` to test your changes without adding your fork as a remote.

> **Tip:** Always create a new topic branch on your fork for every pull request; never work directly on your fork's `main` branch.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

## Watch out

- Committing your changes directly onto your fork's `main` branch, making it difficult to maintain multiple clean PRs.
- Deleting your fork on GitHub while your pull request is still open; this closes the PR immediately.

## Remember

- A fork is a server-side clone under your account where you have full write access.
- Open-source contributions use cross-repository PRs from your fork to the upstream project.
- Always create a dedicated topic branch on your fork for each pull request.
