---
slug: syncing-upstream-forks
title: "Syncing Upstream Repositories"
topic: pull-requests
kind: technique
summary: "Configure an upstream remote to keep your personal fork synchronized with fast-moving open-source parent repositories."
tags: [fork, upstream, sync]
related: [fork-and-pull-model, git-clone-and-remotes, fetch-vs-pull]
---
> **In one line:** Configure an upstream remote pointing to the parent repository to pull latest updates into your fork.

## The idea

When contributing to an active open-source project, the parent repository moves forward continuously as other contributors merge pull requests. Over days or weeks, your personal fork becomes out of date.

To prevent merge conflicts and ensure your new features are built on the latest codebase, you must synchronize your fork regularly.

In Git conventions, the two remotes in a fork setup are named:
- **`origin`:** Your personal fork on GitHub (where you push your work).
- **`upstream`:** The original, canonical parent repository (where you fetch updates from).

To sync, you fetch the latest commits from `upstream/main` and fast-forward your local `main` branch to match. Once your local `main` is current, you push it to `origin/main` to update your GitHub fork.

| Remote Name | Points To | Permissions | Primary Action |
|---|---|---|---|
| `origin` | `https://github.com/your-username/repo` | Read & Write | Pushing your topic branches |
| `upstream` | `https://github.com/parent-org/repo` | Read Only | Fetching latest community updates |

## See it

Configure the upstream remote and sync your fork:

```bash
# Add upstream remote pointing to parent project
git remote add upstream https://github.com/parent-org/project.git

# Fetch all latest upstream branches and commits
git fetch upstream

# Switch to local main and fast-forward to match upstream/main
git switch main
git merge --ff-only upstream/main

# Push updated main to your personal GitHub fork
git push origin main
```

## Go deeper

GitHub also provides a convenient 'Sync fork' button on your fork's web interface. While handy for quick updates, synchronizing locally through the terminal via `git fetch upstream` gives you complete control to review incoming changes before updating your local working tree.

> **Tip:** If your active feature branch is falling behind, sync your local `main` first, then run `git rebase main` on your feature branch to replay your commits on top of current code.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

Investing the time to configure disciplined defaults and learn primary flags pays compound dividends across every software project and team you collaborate with throughout your career.

## Watch out

- Attempting to run `git push upstream main`; you do not have write permissions on the parent repository.
- Rebasing your feature branch directly onto `upstream/main` without fetching first; you will rebase onto stale refs.

## Remember

- Name the parent project `upstream` to distinguish it from your personal `origin` fork.
- Run `git fetch upstream` to download latest community commits safely.
- Fast-forward local `main` to `upstream/main` and push to `origin` to keep your fork updated.
