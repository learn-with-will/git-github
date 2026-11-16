---
slug: git-push-and-rejections
title: "Pushing Changes and Handling Rejections"
topic: remotes-collaboration
kind: technique
summary: "Push commits to remote branches with upstream tracking (-u), and understand why non-fast-forward pushes are rejected."
tags: [git-push, remotes, troubleshooting]
related: [fetch-vs-pull, remote-tracking-branches, force-with-lease]
---
> **In one line:** git push uploads local commits to a remote branch, and is rejected if your branch has diverged from upstream.

## The idea

Once you have created local commits and want to share them with your team or publish them to GitHub, you use `git push`.

The `git push` command takes the local commits on your current branch and uploads the missing object data to the specified remote repository, advancing the remote branch pointer.

When you push a new branch for the very first time, use the `-u` (or `--set-upstream`) flag: `git push -u origin <branch>`. This establishes a persistent tracking link between your local branch and the remote branch, so that in future turns you can simply type `git push` or `git pull` without specifying the remote and branch names.

A **non-fast-forward push rejection** occurs when someone else has pushed new commits to the remote branch while you were working locally. Because advancing the remote pointer would overwrite those commits, Git protects the remote and rejects your push.

| Push Status | Cause | Resolution |
|---|---|---|
| **Accepted** | Remote branch is a direct ancestor of local branch | Clean fast-forward on remote |
| **Rejected (`non-fast-forward`)** | Remote branch contains commits you don't have locally | Fetch and integrate (merge or rebase) before pushing |

## See it

Push a new branch and handle a push rejection:

```bash
# Push new feature branch and configure upstream tracking
git push -u origin feature-auth

# If push is rejected due to remote divergence:
# 1. Fetch remote changes
git fetch origin

# 2. Rebase your local commits on top of remote main
git rebase origin/main

# 3. Push cleanly
git push origin feature-auth
```

## Go deeper

Never use `git push --force` to overcome a non-fast-forward push rejection on a shared team branch! Forcing overwrites whatever commits your teammates pushed, permanently deleting their work from the remote branch. Always integrate remote commits locally first.

> **Tip:** Setting `git config --global push.autoSetupRemote true` automatically configures upstream tracking whenever you push a new branch, removing the need to type `-u`.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

## Watch out

- Using `git push --force` on `main` when your push is rejected, destroying colleagues' work.
- Forgetting to pass `-u origin <branch>` on the first push, leading to ambiguous future pull/push commands.

## Remember

- `git push` uploads local commits and advances the remote branch pointer.
- Pass `-u origin <branch>` on first push to configure upstream tracking.
- A rejected push means the remote has new commits; fetch and integrate them before pushing again.
