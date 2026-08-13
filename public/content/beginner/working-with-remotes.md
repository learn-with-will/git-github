---
id: lesson-08
slug: working-with-remotes
title: "Working with Remotes"
level: beginner
order: 8
duration: 18
tags:
  - remotes
  - clone
  - fetch-pull-push
  - origin
summary: "Sync your repo with a hosted copy: clone, add remotes, and understand the difference between fetch (download only), pull (fetch + integrate), and push (upload)."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain what a **remote** is and what **`origin`** means.
- Clone a repository and list its remotes.
- Distinguish **`git fetch`** (download only) from **`git pull`** (download + integrate).
- Push your commits with `git push`, and set an **upstream** branch.
- Understand and fix a rejected (**non-fast-forward**) push.

# Why It Matters

So far everything has been on your machine. A **remote** is a copy of your repository
hosted somewhere else — usually on GitHub — and it's how you back up your work and
collaborate. The three commands that move commits between your machine and the remote —
`fetch`, `pull`, and `push` — are among the most-used in all of Git, and mixing them up is
the source of a lot of early confusion. Let's make them clear.

# Concept Explanation

### What is a remote?

A **remote** is a named reference to a repository hosted elsewhere. When you `git clone` a
project, Git automatically names that source remote **`origin`**. `origin` isn't magic —
it's just the conventional default name; you could rename it or add others.

```bash
git clone https://github.com/octocat/Hello-World.git
cd Hello-World
git remote -v            # list remotes and their URLs
```

```text
origin  https://github.com/octocat/Hello-World.git (fetch)
origin  https://github.com/octocat/Hello-World.git (push)
```

You can add more remotes (you'll do this when forking, later):

```bash
git remote add upstream https://github.com/original/project.git
```

### Remote-tracking branches

After talking to a remote, Git keeps read-only pointers like **`origin/main`** that record
"where `main` was on the remote the last time I checked." Your local `main` and
`origin/main` are separate; commands move them at different times.

### `fetch` vs `pull` — the key distinction

- **`git fetch`** downloads new commits and branches from the remote and updates your
  remote-tracking branches (like `origin/main`). It does **not** change your working files
  or your current branch. It's the safe "just show me what's new" command.
- **`git pull`** does a `git fetch` **and then integrates** the changes into your current
  branch — by default with a **merge** (you can make it rebase with `--rebase` or the
  `pull.rebase` setting).

```bash
git fetch origin         # see what's new; nothing in your working tree changes
git pull                 # fetch AND merge origin's changes into your branch
```

### Pushing your work

**`git push`** uploads your local commits to the remote:

```bash
git push origin main
```

The first time you push a branch, set its **upstream** with `-u` so future `push`/`pull`
need no arguments:

```bash
git push -u origin main   # push and remember origin/main as the upstream
git push                  # from now on, this is enough
```

### When a push is rejected

If the remote has commits you don't have locally, Git rejects your push to avoid
overwriting them:

```text
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs
hint: Updates were rejected because the remote contains work that you do not have locally.
```

The fix is **not** to force it — it's to **integrate first**: `git pull` (merge or rebase
the remote work into yours), resolve any conflicts, then `git push`.

# Key Terminology

- **Remote:** a named reference to a repository hosted elsewhere.
- **`origin`:** the default name for the remote you cloned from.
- **`git clone`:** copy a remote repository (with full history) to your machine.
- **Remote-tracking branch:** a local read-only pointer like `origin/main`.
- **`git fetch`:** download remote changes without touching your working branch.
- **`git pull`:** fetch and then integrate into your current branch.
- **`git push`:** upload your commits to a remote.
- **Upstream:** the remote branch your local branch is linked to.

# Options and Trade-offs

| Command | Direction | Changes your working branch? |
| ------- | --------- | ---------------------------- |
| `git fetch` | Remote → local (metadata) | No — only updates `origin/*` |
| `git pull` | Remote → local | **Yes** — merges/rebases into your branch |
| `git push` | Local → remote | No (updates the remote) |
| `git clone` | Remote → new local copy | Creates the repo and checks out a branch |

# Worked Example

You and a teammate share a repo. They pushed a commit while you made one locally.

```bash
git fetch origin
git log --oneline --graph --all
```

```text
* 5c6d7e8 (origin/main) Teammate: add license
| * 9a8b7c6 (HEAD -> main) Me: add tests
|/
* 1a2b3c4 Initial commit
```

`fetch` showed that `origin/main` and your `main` have **diverged** — each has a commit
the other lacks. Trying to `git push` now would be rejected. Integrate first, then push:

```bash
git pull            # merges origin/main into your main (may create a merge commit)
git push            # now succeeds
```

If both of you had changed the same lines, `pull` would surface a conflict to resolve —
exactly like the merge lesson.

# Real World Analogy

The remote is a **shared bulletin board** for the team. **`push`** pins your notes to the
board so others can see them. **`fetch`** copies down whatever's new on the board to read
at your desk, without changing your own work. **`pull`** does both: grabs the new notes
*and* works them into your current draft. If someone pinned a note while you were writing,
the board won't let you overwrite theirs — you have to read their note in first (`pull`),
then post.

# Examples

## Example 1 — Basic: clone and push

You clone a repo, fix a typo, commit, and `git push`. Your change is now on the remote for
everyone. Because you cloned, `origin` and the upstream were set up automatically.

**Why this works:** `clone` wires up the remote and tracking, so the everyday
commit-then-push loop just works.

## Example 2 — Real-world: fetch to review before integrating

Before starting the day, a developer runs `git fetch` and inspects `origin/main` with
`git log origin/main` to see what changed overnight — then decides when to `pull` it into
their branch.

**Why this works:** `fetch` separates *seeing* new work from *integrating* it, so you stay
in control of when your branch changes.

## Example 3 — Trade-off / pitfall: the rejected push

Someone finishes a feature and `git push` is rejected with "fetch first." They almost
reach for `--force`, which would erase the teammate's commit. Instead they `git pull`,
merge cleanly, and push.

**Why this bites:** A non-fast-forward rejection is Git protecting shared work. Force-
pushing over it destroys commits; pulling integrates them. Force belongs only to your own
un-shared branches (a later lesson).

# Common Mistakes

- **Confusing `fetch` and `pull`.** `fetch` is look-only; `pull` also changes your branch.
- **Force-pushing to "fix" a rejected push.** That overwrites others' commits — `pull`
  instead.
- **Thinking `origin` is special.** It's just the default remote name; you can rename it or
  have several remotes.
- **Forgetting `-u` on a new branch's first push**, then wondering why bare `git push`
  doesn't know where to go.

# Best Practices

- **Pull (or fetch) before you push** to integrate others' work and avoid rejections.
- Use **`git fetch`** when you want to inspect remote changes without altering your branch.
- Set the upstream once with **`git push -u origin <branch>`**.
- Treat **force-push as off-limits on shared branches**; resolve rejections by
  integrating.
- Push regularly — it's your off-machine backup as well as how you share.

# Summary

- A **remote** is a hosted copy of your repo; **`origin`** is the default name for the one
  you cloned from.
- **`git fetch`** downloads changes and updates `origin/*` **without** touching your
  branch; **`git pull`** fetches **and** integrates into your current branch.
- **`git push`** uploads your commits; use **`-u`** on a branch's first push to set its
  upstream.
- A **non-fast-forward rejection** means the remote has commits you don't; fix it by
  `git pull`-ing (integrating), not force-pushing.

# Flash Cards

Q: What does the remote name `origin` refer to?
A: The default name Git assigns to the remote you cloned from — a convention, not a special keyword.

Q: What's the difference between `git fetch` and `git pull`?
A: fetch downloads remote changes without altering your current branch; pull fetches and then integrates them (merge by default).

Q: What does `git push` do?
A: Uploads your local commits to a remote so others can see them.

Q: What does the `-u` flag do in `git push -u origin main`?
A: It sets the upstream (tracking) branch, so later `git push` and `git pull` work with no extra arguments.

Q: Your push is rejected as non-fast-forward. What should you do?
A: git pull to integrate the remote's commits (resolving any conflicts), then push again — do not force-push over shared work.

Q: What is a remote-tracking branch like `origin/main`?
A: A local read-only pointer recording where a branch was on the remote at your last fetch.

# Exercises

### Easy

Clone any public repository, then run `git remote -v`. Identify the remote's name and URL,
and explain where the name came from.

### Medium

In a repo with a remote, run `git fetch` and then `git log --oneline --all`. Explain what
`origin/main` represents and how it differs from your local `main`.

### Challenging

Create a situation where `git push` is rejected: make a local commit, and (via the GitHub
web UI or a second clone) add a different commit to the remote. Push, observe the
rejection, then integrate correctly and push. Explain why force-pushing would have been the
wrong fix.

# Further Reading

- Pro Git, Chapter 2 — [Working with Remotes](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes)
- Pro Git, Chapter 3 — [Remote Branches](https://git-scm.com/book/en/v2/Git-Branching-Remote-Branches)
- [`git fetch`](https://git-scm.com/docs/git-fetch), [`git pull`](https://git-scm.com/docs/git-pull), and [`git push`](https://git-scm.com/docs/git-push) references
