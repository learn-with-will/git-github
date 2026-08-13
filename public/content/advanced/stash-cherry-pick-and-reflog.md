---
id: lesson-17
slug: stash-cherry-pick-and-reflog
title: "Stash, Cherry-pick & Reflog"
level: advanced
order: 17
duration: 18
tags:
  - stash
  - cherry-pick
  - reflog
  - recovery
summary: "Shelve work-in-progress with git stash, copy a single commit with git cherry-pick, and recover 'lost' commits with git reflog — Git's local safety net."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Shelve and restore uncommitted work with `git stash`.
- Copy a single commit onto your current branch with `git cherry-pick`.
- Use `git reflog` to recover commits after a mistaken `reset` or rebase.

# Why It Matters

Real work is messy: you're mid-change when an urgent fix lands elsewhere, you need one commit
from another branch but not the whole thing, or you run a `reset --hard` and your heart stops.
These three tools handle exactly those situations — and the **reflog** is the safety net that
makes Git far more forgiving than people realize.

# Concept Explanation

### `git stash`: shelve work-in-progress

`git stash` takes your uncommitted changes (tracked, and with `-u` also untracked), saves them
on a stack, and gives you a **clean working tree** — perfect for switching context without
making a half-baked commit.

```bash
git stash              # shelve changes; working tree becomes clean
git stash list         # see what's stashed
git stash pop          # reapply the latest stash AND remove it from the stack
git stash apply        # reapply but KEEP it on the stack
git stash -u           # include untracked files
```

### `git cherry-pick`: copy one commit

`git cherry-pick <commit>` applies **the changes from that one commit** onto your current
branch as a **new commit** (new hash). Use it to grab a single fix from another branch without
merging everything.

```bash
git switch release-1.x
git cherry-pick a1b2c3d      # apply that commit here as a new commit
# on conflict: resolve, then git cherry-pick --continue (or --abort)
```

### `git reflog`: the recovery net

Git keeps a local **reflog** — a log of everywhere `HEAD` (and each branch) has pointed. Every
commit, switch, reset, rebase, and merge adds an entry. So even when a commit is no longer
reachable from any branch (say, after `reset --hard`), its hash is still in the reflog and you
can get it back.

```bash
git reflog                       # list recent HEAD positions
git reset --hard HEAD@{2}        # jump HEAD back to a previous position
git switch -c rescue <hash>      # or rescue a specific commit onto a new branch
```

The reflog is **local only** (never pushed) and entries **expire** eventually (Git's garbage
collection defaults to ~90 days for reachable, ~30 for unreachable). It's your net for recent
mistakes, not permanent history.

# Key Terminology

- **`git stash`:** shelve uncommitted changes on a stack; restore later.
- **`stash pop` vs `apply`:** pop removes the stash after reapplying; apply keeps it.
- **`git cherry-pick`:** apply one commit's changes as a new commit on your branch.
- **`git reflog`:** a local log of where `HEAD`/branches have been — enables recovery.
- **`HEAD@{n}`:** the position `HEAD` had `n` moves ago.

# Options and Trade-offs

| Tool | Use when | Note |
| ---- | -------- | ---- |
| `git stash` | Quick context switch without committing | Local, easy to forget — don't hoard stashes |
| `git cherry-pick` | You need one commit, not a whole branch | Creates a new hash; can duplicate work if later merged |
| `git reflog` | Recover after a bad reset/rebase | Local only; entries eventually expire |

# Worked Example

You're mid-change when a production bug needs a quick fix on another branch.

```bash
git stash                    # shelve your current work
git switch hotfix
# …fix the bug, commit…
git switch feature
git stash pop                # get your work-in-progress back
```

Later you want that same hotfix commit on the release branch:

```bash
git switch release-2.x
git cherry-pick 9f8e7d6      # copy just that fix here
```

And suppose you botched a rebase and a commit vanished:

```bash
git reflog
```

```text
7c8d9e0 HEAD@{0}: rebase (finish): returning to refs/heads/feature
a1b2c3d HEAD@{1}: commit: Add the feature I thought I lost
```

```bash
git switch -c rescue a1b2c3d   # the "lost" commit is back on a new branch
```

# Real World Analogy

`git stash` is sweeping your half-finished work into a **drawer** so your desk is clear for an
urgent task, then pulling it back out. `git cherry-pick` is **photocopying one recipe** from
another cookbook into yours, rather than adopting the whole book. `git reflog` is your **undo
journal** — a running log of everywhere you've been, so even after a wrong turn you can retrace
your steps and recover.

# Examples

## Example 1 — Basic: stash to switch fast

A developer is mid-edit when a colleague asks them to review a branch. They `git stash`, switch
and review, switch back, and `git stash pop` — their work-in-progress untouched.

**Why this works:** Stash cleanly parks uncommitted changes so you can move without committing
something unfinished.

## Example 2 — Real-world: back-port a fix

A critical bug is fixed on `main`, but the `1.x` release line needs it too without all of
`main`'s other changes. A maintainer cherry-picks just that commit onto `release-1.x`.

**Why this works:** cherry-pick transplants a single commit's change, ideal for back-porting a
targeted fix.

## Example 3 — Trade-off / pitfall: recovering from `reset --hard`

Someone runs `git reset --hard HEAD~3`, then realizes they needed those commits. Because the
commits were made (not just uncommitted edits), they're still in the reflog, and
`git reset --hard HEAD@{1}` restores them.

**Why this works (and its limit):** The reflog recovers **committed** work. Had the lost work
been uncommitted (wiped by the same `--hard`), it would be gone — commit early.

# Common Mistakes

- **Hoarding stashes.** They're local and unlabeled; a pile of them is easy to lose track of.
  Prefer a WIP commit for anything you'll keep a while.
- **Cherry-picking then merging the same branch,** duplicating the change (two commits, same
  content, different hashes).
- **Assuming the reflog is on the remote.** It's local only.
- **Waiting too long to recover** — reflog entries eventually expire.

# Best Practices

- Use `git stash` for **short** context switches; commit WIP for anything longer.
- Prefer `git stash pop` when you're done with a stash; use `apply` if you might need it again.
- **Cherry-pick sparingly** — reach for merge/rebase when you want a whole branch.
- Learn `git reflog` **before** you need it; it turns scary mistakes into quick recoveries.

# Summary

- `git stash` shelves uncommitted changes and restores a clean working tree; `pop` reapplies
  and removes, `apply` reapplies and keeps.
- `git cherry-pick <commit>` copies one commit's changes onto your branch as a new commit.
- `git reflog` records where `HEAD`/branches have been and lets you **recover** commits after a
  bad `reset`/rebase — but it's local and entries expire.

# Flash Cards

Q: What does `git stash` do?
A: It saves your uncommitted changes onto a stack and restores a clean working tree, so you can reapply them later.

Q: What's the difference between `git stash pop` and `git stash apply`?
A: pop reapplies the stash and removes it from the stack; apply reapplies it but keeps it on the stack.

Q: What does `git cherry-pick <commit>` do?
A: It applies the changes from that single commit onto your current branch as a new commit (with a new hash).

Q: What is the reflog, and why is it useful?
A: A local log of everywhere HEAD and branches have pointed; it lets you recover commits that are no longer reachable, e.g. after a mistaken reset --hard.

Q: You ran `git reset --hard` and lost a commit. How do you recover it?
A: Find its hash in git reflog and restore it, e.g. git reset --hard HEAD@{1} or git switch -c rescue <hash>.

Q: Is the reflog stored on the remote?
A: No — the reflog is local to your machine and its entries eventually expire.

# Exercises

### Easy

Make some uncommitted changes, run `git stash`, confirm the working tree is clean, then
`git stash pop` to restore them.

### Medium

On two branches, make a commit on one, then `git cherry-pick` it onto the other. Compare the
two commits' hashes and explain why they differ despite identical changes.

### Challenging

Deliberately "lose" a commit with `git reset --hard HEAD~1`, then recover it using `git reflog`.
Explain why this works for committed changes but would not save uncommitted edits wiped by the
same command.

# Further Reading

- Pro Git, Chapter 7 — [Stashing and Cleaning](https://git-scm.com/book/en/v2/Git-Tools-Stashing-and-Cleaning)
- Pro Git, Chapter 10 — [Maintenance and Data Recovery](https://git-scm.com/book/en/v2/Git-Internals-Maintenance-and-Data-Recovery) (reflog)
- [`git cherry-pick`](https://git-scm.com/docs/git-cherry-pick) and [`git reflog`](https://git-scm.com/docs/git-reflog) references
