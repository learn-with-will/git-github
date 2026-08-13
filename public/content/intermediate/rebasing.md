---
id: lesson-13
slug: rebasing
title: "Rebasing"
level: intermediate
order: 13
duration: 20
tags:
  - rebase
  - interactive-rebase
  - linear-history
  - golden-rule
summary: "Replay commits onto a new base for a linear history, curate history with interactive rebase (squash, reword, reorder), and respect the Golden Rule of Rebasing."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain what `git rebase` does and how it differs from `git merge`.
- Use **interactive rebase** to squash, reword, reorder, and drop commits.
- State and apply the **Golden Rule of Rebasing**.
- Safely update a rebased branch you've already pushed.

# Why It Matters

Rebasing is Git's tool for a **clean, linear history**. It lets you replay your work as if
you'd started from the latest `main`, and — interactively — lets you tidy messy commits
before anyone sees them. It's powerful and a little dangerous: because rebasing **rewrites
commits**, using it on shared history causes real problems. Learn the rule and it's one of
the most satisfying tools in Git.

# Concept Explanation

### What rebase does

`git rebase <base>` takes the commits on your current branch and **reapplies them, one by
one, on top of `<base>`** — creating **new commits with new hashes**. The effect is a
straight line, as though your branch had started from the latest `<base>`.

```text
Before:            A---B---C   main
                    \
                     D---E   feature

git switch feature
git rebase main

After:   A---B---C   main
                  \
                   D'---E'   feature   (D,E reapplied as D',E')
```

Compare with merge, which would instead add a merge commit joining the two lines. Rebase
gives linear history; merge preserves the exact shape of what happened. Neither is "correct"
— it's a trade-off (you saw the PR-level version in the last lesson).

### Interactive rebase: curating history

`git rebase -i <base>` (often `git rebase -i HEAD~3` for the last three commits) opens an
editor listing those commits, each with an action you can change:

```text
pick   a1b2c3d Add search box
squash 4d5e6f7 Fix search typo
reword 7a8b9c0 Add search tests
```

| Action | Effect |
| ------ | ------ |
| `pick` | Keep the commit as-is |
| `reword` | Keep it, but edit the message |
| `edit` | Pause to amend the commit's content |
| `squash` | Merge into the previous commit, combining messages |
| `fixup` | Like squash, but discard this commit's message |
| `drop` | Remove the commit entirely |
| (reorder) | Move lines to reorder commits |

This is how you turn `wip`, `fix`, `oops`, `works` into one clean commit before opening a PR.

### The Golden Rule of Rebasing

> **Never rebase commits that exist outside your own repository** — i.e. commits you've
> pushed and others may have based work on.

Because rebase replaces commits with new ones, anyone who had the old commits is now out of
sync, and merging the two versions creates a duplicated, tangled mess. Rebase freely on
**local, private** branches; leave **shared** history alone (undo those with `revert`).

### Updating a pushed branch after rebasing

If you rebase a branch you already pushed (say, your own PR branch), the remote still has the
old commits, so a normal push is rejected. Update it with a **lease-checked** force push,
which refuses if someone else pushed in the meantime:

```bash
git push --force-with-lease
```

Use this only on **your own** branch — never on a shared branch like `main`.

# Key Terminology

- **Rebase:** reapply commits onto a new base, creating new commits.
- **Interactive rebase (`-i`):** edit a series of commits (squash, reword, reorder, drop).
- **Golden Rule of Rebasing:** don't rebase commits others may have.
- **`--force-with-lease`:** a safer force push that checks the remote hasn't changed.
- **Linear history:** history without merge commits.

# Options and Trade-offs

| Goal | Tool | Trade-off |
| ---- | ---- | --------- |
| Integrate `main` with linear history | `git rebase main` | Rewrites your commits (new hashes) |
| Integrate `main` preserving exact history | `git merge main` | Adds a merge commit; non-linear |
| Clean up your commits before a PR | `git rebase -i` | Only safe before sharing |
| Update a rebased pushed branch | `git push --force-with-lease` | Safe only on your own branch |

# Worked Example

Your `feature` branch is behind `main`, and its history is a bit messy. Rebase to update and
tidy it before opening a PR.

```bash
git switch feature
git rebase main            # replay feature's commits on top of the latest main
```

If a conflict appears, resolve it, then:

```bash
git add <resolved-file>
git rebase --continue      # (or: git rebase --abort to bail out)
```

Now squash the small fix commits into their feature commit:

```bash
git rebase -i HEAD~3
# change the 2nd/3rd lines from "pick" to "fixup", save, exit
```

```text
* c0ffee1 (HEAD -> feature) Add search box
* 1a2b3c4 (main) Latest main
```

One clean commit, sitting on the latest `main` — ideal for review. Because you already
pushed `feature`, finish with `git push --force-with-lease`.

# Real World Analogy

Rebasing is **re-transcribing** your draft chapters so they follow the book's newest
chapter, as if you'd written them last. Interactive rebase is the **editing pass** before
publishing: you merge two rough paragraphs into one (squash), fix a heading (reword), cut a
dead-end paragraph (drop), and reorder for flow. The Golden Rule is simple: only re-transcribe
pages **that haven't been printed and handed out yet**. Rewriting pages other people already
hold just creates confusion.

# Examples

## Example 1 — Basic: linear update before merging

Before opening a PR, a developer runs `git rebase main` on their branch so it sits cleanly on
top of the latest `main`. The eventual merge is a trivial fast-forward with no merge commit.

**Why this works:** Rebasing onto the latest base resolves integration early and keeps
history a clean line.

## Example 2 — Real-world: curate with interactive rebase

A branch accumulated `fix lint`, `fix lint again`, `typo`. The author runs `git rebase -i`,
`fixup`s the noise into the real commit, and rewords it clearly — so reviewers see one
coherent change.

**Why this works:** Interactive rebase lets you present intent, not the messy path you took
to get there — and it's safe because nothing was shared yet.

## Example 3 — Trade-off / pitfall: rebasing shared history

Someone rebases `main` (or a branch teammates have pulled) and force-pushes. Everyone else's
history now conflicts with the rewritten commits, causing duplicate commits and painful
recovery.

**Why this bites:** Rebase rewrites commits; doing it to shared history breaks everyone who
had the originals. That's exactly what the Golden Rule forbids.

# Common Mistakes

- **Rebasing shared/pushed commits** others may have — violates the Golden Rule; use
  `revert` on shared history instead.
- **Force-pushing with plain `--force`.** Prefer `--force-with-lease`, which won't clobber a
  teammate's newer push.
- **Forgetting `git rebase --continue`** after resolving a conflict (the rebase stays
  paused).
- **Confusing rebase with merge.** Rebase rewrites and linearizes; merge preserves and adds
  a merge commit.

# Best Practices

- Rebase **local, private** branches freely to stay current and tidy.
- Use **interactive rebase** to curate commits **before** opening a PR.
- Never rebase **shared** history; `git revert` is the tool there.
- When updating a rebased pushed branch, use **`--force-with-lease`**.
- If a rebase gets messy, **`git rebase --abort`** and rethink.

# Summary

- `git rebase <base>` reapplies your commits onto `<base>`, creating **new commits** and a
  **linear** history (merge, by contrast, adds a merge commit).
- **Interactive rebase** (`-i`) lets you squash, reword, reorder, and drop commits — great
  for cleaning up before a PR.
- The **Golden Rule**: never rebase commits that exist outside your repository (shared/pushed
  history).
- After rebasing a pushed branch of **your own**, update the remote with
  `git push --force-with-lease`.

# Flash Cards

Q: What does `git rebase <base>` do?
A: It reapplies your branch's commits on top of <base> as new commits, producing a linear history.

Q: What is the Golden Rule of Rebasing?
A: Never rebase commits that exist outside your own repository — i.e. commits you've pushed that others may have based work on.

Q: Name three things interactive rebase lets you do to commits.
A: Squash them together, reword their messages, reorder them, drop them, or edit their contents (any three).

Q: Does rebasing change commit hashes?
A: Yes — it creates brand-new commits, so the hashes differ from the originals.

Q: You rebased your own pushed branch and the push is rejected. What's the safe way to update it?
A: git push --force-with-lease, which refuses if the remote received other commits you haven't seen. Only on your own branch.

Q: Which command starts an interactive rebase of the last three commits?
A: git rebase -i HEAD~3

# Exercises

### Easy

On a feature branch that's behind `main`, run `git rebase main`. Compare
`git log --oneline --graph` before and after, and describe how the shape changed.

### Medium

Make three small commits, then use `git rebase -i HEAD~3` to squash two of them into the
first and reword the result. Confirm the final history with `git log --oneline`.

### Challenging

Explain why rebasing a branch that teammates have already pulled is dangerous. Walk through
what happens to their history after you force-push the rebased version, and state what you
should have used instead for shared commits.

# Further Reading

- Pro Git, Chapter 3 — [Rebasing](https://git-scm.com/book/en/v2/Git-Branching-Rebasing)
- Pro Git, Chapter 7 — [Rewriting History](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History)
- [`git rebase`](https://git-scm.com/docs/git-rebase) reference
