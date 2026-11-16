---
slug: remote-tracking-branches
title: "Remote Repositories & Tracking Branches"
topic: remotes-collaboration
kind: concept
summary: "Understand remote references, the origin naming convention, and how remote-tracking branches link local work to remote repositories."
tags: [remotes, tracking-branches, architecture]
related: [git-clone-and-remotes, fetch-vs-pull, git-push-and-rejections]
---
> **In one line:** Remote-tracking branches are immutable bookmarks representing the state of branches on remote repositories at your last sync.

## The idea

A remote repository is simply a copy of your Git project hosted on the internet, on a local network server, or even on another directory of your filesystem.

When you interact with a remote, Git creates **remote-tracking branches**. These references act as bookmarks showing where branches on the remote repository were pointing the last time you communicated with that server.

Remote-tracking branches take the form `<remote>/<branch>`, such as `origin/main` or `upstream/feature`.
- They live in `.git/refs/remotes/<remote>/`.
- **They are read-only bookmarks:** You cannot switch to them or commit to them directly.
- Git updates them automatically whenever you run network commands like `git fetch`, `git pull`, or `git push`.

The name **`origin`** is simply the default name Git gives to the remote server you cloned from. It is a convention, not a magic keyword; you can rename it or add multiple other remotes (such as `staging` or `upstream`) anytime.

| Branch Type | Example Name | Can You Commit to It? | When Does It Move? |
|---|---|---|---|
| **Local Branch** | `main`, `feat-auth` | Yes | Every time you run `git commit` locally |
| **Remote-Tracking Branch** | `origin/main` | No (read-only bookmark) | Only when you run `git fetch`, `pull`, or `push` |
| **Remote Branch** | `main` on GitHub server | Only via `git push` | When anyone pushes to the remote server |

## See it

Inspect your configured remotes and remote-tracking references:

```bash
# List all configured remote names with their fetch/push URLs
git remote -v

# List both local and remote-tracking branches
git branch -a

# Inspect the commit that origin/main is currently pointing to
git rev-parse origin/main
```

## Go deeper

When you check out a branch that exists on `origin` (e.g. `git switch feature-login`), Git automatically sets up a **tracking relationship** between your new local branch `feature-login` and `origin/feature-login`. This upstream tracking relationship is what allows `git status` to report: 'Your branch is up to date with origin/feature-login', or 'Your branch is ahead of origin/main by 2 commits.'

> **Tip:** Pass `-vv` to `git branch` (`git branch -vv`) to see the upstream tracking branch and ahead/behind counts for every local branch.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

## Watch out

- Attempting to run `git switch origin/main` to work on it; Git will put you in a detached HEAD because remote branches are read-only.
- Assuming `origin/main` reflects the live GitHub server status in real time; it only updates when you explicitly run `git fetch`.

## Remember

- `origin` is simply the default name for the primary remote repository.
- Remote-tracking branches like `origin/main` are read-only local bookmarks updated by network calls.
- Run `git branch -vv` to view tracking relationships and ahead/behind counts.
