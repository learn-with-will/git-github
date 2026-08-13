---
id: lesson-06
slug: branching-basics
title: "Branching Basics"
level: beginner
order: 6
duration: 18
tags:
  - branching
  - head
  - git-switch
  - git-branch
summary: "A branch is just a movable pointer to a commit, and HEAD marks where you are. Create, switch, and delete branches — and understand what a detached HEAD means."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain what a **branch** really is: a lightweight, movable pointer to a commit.
- Describe the role of **`HEAD`**.
- Create and switch branches with `git branch` and `git switch`.
- Understand why branching in Git is cheap and instant.
- Recognize and safely handle a **detached `HEAD`**.

# Why It Matters

Branching is the feature that made Git famous. It lets you start a new feature, try a
risky idea, or fix a bug in **isolation**, without disturbing your main line of work —
and it's so cheap that you'll do it many times a day. But branches confuse people until
they see what a branch *actually is*. Spoiler: it's not a copy of your project.

# Concept Explanation

### A branch is a pointer

In Git, a **branch is a lightweight, movable pointer to a commit** — literally a small
file containing a commit hash. Creating a branch doesn't copy any files; it just adds
another pointer. That's why making a branch is instant, even in a huge project.

Commits themselves link backward to their parents, forming a chain. A branch name simply
points at the tip of one such chain:

```text
      A---B---C   main
```

Here `main` points at commit `C`. Create a new branch and you get a second pointer to the
same commit:

```text
      A---B---C   main
               \
                (feature also points here at first)
```

### `HEAD`: "you are here"

**`HEAD`** is a special pointer that tells Git which branch you're currently on. When you
switch branches, you're moving `HEAD`. When you make a commit, the branch that `HEAD`
points to advances to the new commit.

### Creating and switching

```bash
git branch                 # list branches; * marks the current one
git branch feature         # create "feature" (does NOT switch to it)
git switch feature         # switch to it (HEAD now points to feature)
git switch -c feature      # shortcut: create AND switch in one step
```

`git switch` and `git switch -c` were added in **Git 2.23 (2019)**. Older material uses
`git checkout feature` and `git checkout -b feature`, which still work — `switch` is just
clearer.

Now commit on `feature`, and only `feature` moves:

```text
      A---B---C   main
               \
                D   feature   <-- HEAD
```

`main` still points at `C`; your new commit `D` is on `feature`. The two lines of work
have diverged — exactly what you wanted.

### Deleting branches

```bash
git branch -d feature      # delete (refuses if it has unmerged work)
git branch -D feature      # force-delete, even if unmerged (can lose commits)
```

### Detached `HEAD`

If you switch to a **specific commit** instead of a branch (e.g.
`git switch --detach <hash>` or `git checkout <hash>`), `HEAD` points straight at that
commit — a **detached `HEAD`**. You can look around and even commit, but those commits
aren't on any branch, so they can be lost when you switch away. If you want to keep work
made there, create a branch: `git switch -c new-branch`.

# Key Terminology

- **Branch:** a movable pointer to a commit; a line of development.
- **`HEAD`:** the pointer to the branch (or commit) you currently have checked out.
- **`git branch`:** list, create, or delete branches.
- **`git switch`:** change which branch you're on (`-c` to create and switch).
- **Detached `HEAD`:** `HEAD` pointing directly at a commit rather than a branch.
- **Diverge:** when two branches each gain commits the other doesn't have.

# Options and Trade-offs

| Command | What it does | Note |
| ------- | ------------ | ---- |
| `git branch <name>` | Create a branch | Does **not** switch to it |
| `git switch <name>` | Switch to an existing branch | Modern, single-purpose |
| `git switch -c <name>` | Create **and** switch | The common way to start work |
| `git checkout <name>` / `-b` | Older equivalent of switch | Still valid; more overloaded |
| `git branch -d` / `-D` | Delete / force-delete | `-d` protects unmerged work |

# Worked Example

Start a feature in isolation, make a commit, and see the branches diverge.

```bash
git switch -c add-search      # new branch off main, and switch to it
echo "search()" > search.js
git add search.js
git commit -m "Add search"
git log --oneline --graph --all
```

```text
* 4d5e6f7 (HEAD -> add-search) Add search
* 1a2b3c4 (main) Initial project
```

`add-search` has advanced to the new commit while `main` stayed put. Switch back and
`main` is exactly as you left it:

```bash
git switch main
```

Your search work waits safely on its own branch until you're ready to merge it (next
lesson).

# Real World Analogy

A branch is a **bookmark** in the book of your project's history — a sticky note on a
particular page. Adding a bookmark doesn't copy the book; it just marks a spot. `HEAD` is
the "you are reading here" ribbon. When you write a new page (commit), the bookmark you're
holding moves forward to it, while the other bookmarks stay on their pages. A detached
`HEAD` is holding the ribbon on a page with no bookmark — write there and you might not
find your way back.

# Examples

## Example 1 — Basic: a quick experiment

You want to try a risky refactor. `git switch -c experiment`, hack away, commit. If it
works, you'll merge it; if not, you switch back to `main` and delete the branch — `main`
never saw the mess.

**Why this works:** Isolation is free. A throwaway branch costs nothing and protects your
main line.

## Example 2 — Real-world: a branch per task

A team keeps `main` always deployable and does every feature or bugfix on its own
short-lived branch (`fix/login-crash`, `feature/dark-mode`). Many people work in parallel
without stepping on each other.

**Why this works:** Cheap branches make parallel development the default, and a stable
`main` stays shippable.

## Example 3 — Trade-off / pitfall: committing on a detached HEAD

Curious about an old version, you run `git checkout a1b2c3d`, then make a couple of
commits. Git warned you were in "detached HEAD" state. When you `git switch main`, those
commits seem to vanish — they're on no branch. You recover them by their hash (or via the
reflog) and create a branch to keep them.

**Why this bites:** Commits need a branch to belong to. In detached `HEAD`, nothing points
to your new commits, so switching away leaves them unreferenced.

# Common Mistakes

- **Thinking a branch copies your files.** It's a pointer; branching is instant and
  weightless.
- **Committing in a detached `HEAD`** and losing track of the commits — create a branch
  there instead.
- **`git branch <name>` and expecting to be on it.** That only creates it; use
  `git switch` (or `switch -c`).
- **Force-deleting (`-D`) an unmerged branch** and discarding its commits by mistake.

# Best Practices

- Use **short-lived topic branches**, one per feature or fix.
- Name branches descriptively: `feature/…`, `fix/…`.
- Start work with `git switch -c <name>` so you never edit the wrong branch.
- Keep `main` in a working, deployable state.
- Prefer `git branch -d` (safe) over `-D`, so Git can warn you about unmerged work.

# Summary

- A **branch** is a lightweight, movable pointer to a commit — not a copy of your project.
- **`HEAD`** points to the branch you're on; committing advances that branch.
- `git branch` lists/creates; `git switch` moves; `git switch -c` creates and switches
  (older `checkout`/`checkout -b` still work).
- Branches are cheap, which is why isolating each piece of work on its own branch is the
  normal way to use Git.
- A **detached `HEAD`** points at a commit, not a branch; commit there only after making a
  branch to hold the work.

# Flash Cards

Q: What is a branch in Git?
A: A lightweight, movable pointer to a commit — just a small file holding a commit hash, not a copy of your files.

Q: What does HEAD point to?
A: The branch (or, when detached, the commit) you currently have checked out — essentially "you are here."

Q: What does `git switch -c feature` do?
A: Creates a new branch called feature and switches to it in one step.

Q: Does `git branch feature` switch you to the new branch?
A: No. It only creates the branch; you still need git switch feature to move onto it.

Q: What is a detached HEAD?
A: A state where HEAD points directly at a commit instead of a branch; commits made there belong to no branch and can be lost.

Q: Why is branching so cheap in Git?
A: Because a branch is just a pointer to an existing commit — creating one copies nothing.

# Exercises

### Easy

Create a branch called `experiment` and switch to it two different ways (with
`git branch` + `git switch`, and with `git switch -c`). Confirm with `git branch` which
one you're on.

### Medium

On a new branch, make a commit. Switch back to `main` and run
`git log --oneline --graph --all`. Explain what the graph shows about where each branch
points.

### Challenging

Deliberately enter a detached `HEAD` (`git switch --detach <some-commit>`), make a commit,
then switch back to `main`. Use `git reflog` or the commit hash to recover your commit
onto a new branch, and explain why it was "lost" in the first place.

# Further Reading

- Pro Git, Chapter 3 — [Branches in a Nutshell](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell)
- [`git branch`](https://git-scm.com/docs/git-branch) and [`git switch`](https://git-scm.com/docs/git-switch) references
