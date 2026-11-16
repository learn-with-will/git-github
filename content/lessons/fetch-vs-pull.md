---
slug: fetch-vs-pull
title: "`git fetch` vs `git pull`"
topic: remotes-collaboration
kind: concept
summary: "Understand the critical distinction between fetching remote commits safely and pulling them into your working tree."
tags: [fetch, pull, synchronization]
related: [remote-tracking-branches, git-push-and-rejections, essential-git-settings]
---
> **In one line:** git fetch downloads remote changes without touching your working tree; git pull fetches and immediately merges.

## The idea

One of the most essential distinctions in distributed version control is the difference between `git fetch` and `git pull`.

**`git fetch` is safe and non-destructive:**
When you run `git fetch`, Git contacts the remote server and downloads all new commits, tags, and refs that others have pushed since your last sync. It updates your local remote-tracking branches (like `origin/main`). **`git fetch` never touches your working tree, your index, or your active local branches.** You can fetch anytime, inspect what changed with `git log` or `git diff`, and decide how to integrate the changes on your own schedule.

**`git pull` combines two actions in one:**
By default, `git pull` runs `git fetch` followed immediately by `git merge FETCH_HEAD`. It downloads the new commits and instantly attempts to integrate them into your currently checked-out branch. If your local branch has diverged, this can trigger unexpected merge commits or merge conflicts in the middle of your work.

| Operation | Downloads Remote Commits? | Updates Remote-Tracking Branches? | Modifies Working Tree? | Can Cause Conflicts? |
|---|---|---|---|---|
| `git fetch` | Yes | Yes (`origin/main`) | No | Never |
| `git pull` | Yes | Yes | Yes (merges into HEAD) | Yes |

## See it

Fetch to inspect remote progress safely before integrating:

```bash
# Safely download all new commits from origin without touching your files
git fetch origin

# Inspect what commits teammates pushed to origin/main that you don't have yet
git log --oneline HEAD..origin/main

# Review exact code changes before integrating
git diff HEAD..origin/main

# When ready, integrate cleanly
git merge origin/main
```

## Go deeper

If you prefer linear history over merge commits when syncing, you can run `git pull --rebase` (or configure `git config --global pull.rebase true`). This instructs Git to fetch remote commits and then rebase your local unpushed commits on top of the newly fetched commits.

> **Tip:** Professional developers often make a habit of running `git fetch` first to inspect incoming changes with `git log HEAD..origin/main` before merging.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

## Watch out

- Running `git pull` when you have unstaged local edits, which can complicate merge conflict resolution.
- Assuming `git fetch` updates your local `main` branch; it only updates the remote-tracking `origin/main` pointer.

## Remember

- `git fetch` downloads remote objects and updates `origin/<branch>` without altering your working tree.
- `git pull` equals `git fetch` plus `git merge` (or `git rebase`).
- Use `git fetch` and diff against `origin/main` to review incoming changes before integrating.
