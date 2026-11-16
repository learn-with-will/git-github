---
slug: force-with-lease
title: "Safe Force-Pushing: `--force-with-lease`"
topic: rebasing-history
kind: technique
summary: "Push rewritten branch histories safely using --force-with-lease, preventing accidental overwriting of colleagues' commits."
tags: [force-push, force-with-lease, safety]
related: [golden-rule-of-rebasing, git-push-and-rejections, interactive-rebase]
---
> **In one line:** Always use git push --force-with-lease instead of --force to protect against blindly overwriting teammates' work.

## The idea

When you rewrite history on a local branch that has already been pushed to GitHub (for example, after using `git commit --amend` or `git rebase -i` to address PR review feedback), Git will reject a normal `git push`. Your local branch and the remote branch have diverged.

To update the remote branch with your newly rewritten commits, you must perform a forced push.

Historically, developers used `git push --force` (or `-f`). **`--force` is a blunt weapon.** It instructs the remote repository to blindly overwrite the remote branch pointer with your local pointer, regardless of what has happened on the remote in the meantime. If a colleague pushed a commit to your PR branch five minutes ago, `git push --force` will silently destroy their commit on the server.

The safe, modern alternative is **`git push --force-with-lease`**.

`--force-with-lease` is a conditional force-push. Before overwriting the remote branch, Git checks whether the remote branch still points to the exact commit that your local remote-tracking branch (`origin/feature`) last recorded. If someone else pushed new commits that you have not seen, the lease check fails and Git safely refuses to push!

| Command | Safety Check | What Happens if Teammate Pushed? |
|---|---|---|
| `git push --force` | None (blind overwrite) | **Destroys teammate's commit silently** |
| `git push --force-with-lease` | Compares remote ref to your `origin/feature` | **Rejects push with error; protects their work** |

## See it

Force-push safely after an interactive rebase:

```bash
# Curate your local branch commits
git rebase -i main

# Push the rewritten branch safely with lease protection
git push --force-with-lease origin feature-nav

# If rejected because a teammate added a commit:
# 1. Fetch their changes
git fetch origin
# 2. Inspect what they added
git log --oneline HEAD..origin/feature-nav
# 3. Integrate and push again
```

## Go deeper

You can set up a global Git alias or default to protect yourself from accidentally typing `--force`:
`git config --global alias.pushf "push --force-with-lease"`

Many engineering organizations completely disable unprivileged force-pushing on default branches (`main`) using GitHub Branch Protection Rules, ensuring force-pushes are physically impossible on production branches.

> **Tip:** If `--force-with-lease` is rejected, run `git fetch` to see what changed on the remote branch before deciding whether to rebase again.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

## Watch out

- Typing `git push -f` out of muscle memory; train yourself to use `--force-with-lease`.
- Force-pushing to a shared team branch like `main` or `develop`.

## Remember

- `git push --force` unconditionally overwrites the remote branch, risking data loss.
- `git push --force-with-lease` ensures no one else has pushed to the remote branch before updating.
- Use `--force-with-lease` whenever updating remote topic branches after rebasing.
