---
id: lesson-07
slug: merging-and-conflicts
title: "Merging & Conflicts"
level: beginner
order: 7
duration: 20
tags:
  - merge
  - fast-forward
  - conflicts
  - three-way-merge
summary: "Combine branches with git merge: when Git can fast-forward vs. when it makes a three-way merge commit, plus how to read and resolve a merge conflict."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Combine one branch into another with `git merge`.
- Tell a **fast-forward** merge from a **three-way** merge, and know when each happens.
- Explain that a merge commit has **two parents**.
- Read Git's **conflict markers** and resolve a conflict.
- Abort a merge you don't want to finish.

# Why It Matters

Branching is only half the story — eventually you need to bring work back together.
Merging is how a finished feature rejoins `main`. Most merges are effortless, but when two
branches change the same lines, you get a **conflict**, and Git needs *you* to decide.
Conflicts feel scary the first time; once you understand the markers, they're routine.

# Concept Explanation

### Merging combines branches

You merge **into** the branch you're on. To bring `feature` into `main`:

```bash
git switch main
git merge feature
```

What happens next depends on whether history has diverged.

### Fast-forward merge

If `main` hasn't moved since `feature` branched off, `main` is simply "behind" `feature`.
Git can **fast-forward**: it just slides the `main` pointer forward to `feature`'s tip. No
merge commit is created.

```text
Before:   A---B   main
               \
                C---D   feature

After:    A---B---C---D   main, feature   (main fast-forwarded)
```

### Three-way merge

If **both** branches have new commits since they diverged, Git can't just slide a pointer.
It performs a **three-way merge**, combining three commits: the two branch tips and their
**common ancestor** (the *merge base*). The result is a new **merge commit** with **two
parents**.

```text
      A---B---C       main
           \   \
            D---M      M = merge commit (parents: C and E)
           /
      ...E            feature
```

Use `git merge --no-ff` to force a merge commit even when a fast-forward is possible —
handy when you want history to record that a feature branch existed.

### When a merge conflicts

A **conflict** happens when the two branches changed the **same lines** differently (or
one edited a file the other deleted). Git pauses the merge, marks the trouble spots inside
the file, and asks you to resolve them:

```diff
<<<<<<< HEAD
color = "blue"
=======
color = "green"
>>>>>>> feature
```

Everything between `<<<<<<< HEAD` and `=======` is your current branch's version;
everything from `=======` to `>>>>>>> feature` is the incoming branch's version. To
resolve: edit the file so it says what you want, **delete all three marker lines**, then:

```bash
git add color.css        # mark this file resolved
git commit               # complete the merge (message is pre-filled)
```

`git status` lists conflicted files under "Unmerged paths" the whole time. If you'd rather
back out entirely:

```bash
git merge --abort        # return to exactly how things were before the merge
```

# Key Terminology

- **Merge:** combine the histories of two branches.
- **Fast-forward:** move a branch pointer forward when there's no divergence — no merge
  commit.
- **Three-way merge:** combine two tips using their common ancestor, producing a merge
  commit.
- **Merge base:** the common ancestor commit of the two branches.
- **Merge commit:** a commit with two (or more) parents.
- **Conflict markers:** `<<<<<<<`, `=======`, `>>>>>>>` that bracket the clashing versions.

# Options and Trade-offs

| Situation | What Git does | You get |
| --------- | ------------- | ------- |
| Target branch hasn't diverged | **Fast-forward** | Pointer moves; linear history; no merge commit |
| Both branches have new commits | **Three-way merge** | A merge commit with two parents |
| You force it with `--no-ff` | Merge commit even if FF was possible | An explicit record that a branch existed |
| Same lines changed on both sides | **Conflict** | You resolve manually, then commit |

# Worked Example

`main` and `feature` have both changed the same line of `greeting.txt`.

```bash
git switch main
git merge feature
```

```text
Auto-merging greeting.txt
CONFLICT (content): Merge conflict in greeting.txt
Automatic merge failed; fix conflicts and then commit the result.
```

Open the file:

```diff
<<<<<<< HEAD
Hello, world!
=======
Hi there, world!
>>>>>>> feature
```

You decide on the incoming wording, edit the file to a single clean line, and remove the
markers:

```text
Hi there, world!
```

Finish up:

```bash
git add greeting.txt
git commit          # completes the merge commit
git log --oneline --graph
```

```text
*   7c8d9e0 Merge branch 'feature'
|\
| * 3a2b1c0 Reword greeting (feature)
* | 9f8e7d6 Reword greeting (main)
|/
* 1a2b3c4 Add greeting
```

The merge commit ties both lines of work together — with two parents.

# Real World Analogy

Merging is combining two edited copies of the same document. If only one person made
changes, you just take their copy (**fast-forward**). If both edited different paragraphs,
you can automatically stitch the changes together (**three-way merge**). But if you *both*
rewrote the *same* sentence in different ways, no tool can guess which you meant — that's a
**conflict**, and a human has to choose the final wording.

# Examples

## Example 1 — Basic: a clean fast-forward

You branched `fix-typo`, made one commit, and `main` didn't change meanwhile.
`git merge fix-typo` fast-forwards `main` — no merge commit, perfectly linear history.

**Why this works:** With no divergence, there's nothing to reconcile; Git just advances
the pointer.

## Example 2 — Real-world: merging a feature with a merge commit

`main` got bug fixes while you built a feature on a branch. Merging creates a three-way
merge commit that records both streams of work coming together — a faithful history of
what happened.

**Why this works:** A three-way merge preserves both sets of commits and records the
integration point explicitly.

## Example 3 — Trade-off / pitfall: a half-resolved conflict

In a hurry, someone deletes only the `<<<<<<<` and `>>>>>>>` lines but leaves `=======`
and both versions of the text. They commit the "resolved" file and ship a broken line.

**Why this bites:** Resolving means producing the final correct content and removing
**all** markers — then testing. Leftover markers or duplicated code slip through if you
don't re-read the file.

# Common Mistakes

- **Leaving conflict markers in the file.** Remove every `<<<<<<<`, `=======`, and
  `>>>>>>>`, and make sure the remaining text is what you actually want.
- **Not testing after resolving.** A merge can compile and still be logically wrong.
- **Panicking mid-conflict.** `git merge --abort` cleanly resets you to before the merge.
- **Assuming Git picks a side for you.** For overlapping changes, only you can decide.

# Best Practices

- **Merge (or update) often** and keep branches short — small, frequent integrations mean
  small, rare conflicts.
- **Pull `main` into your branch before merging back**, so you resolve conflicts on your
  branch, not on `main`.
- When a conflict appears, **read both sides** carefully before editing.
- **Test** after resolving, then commit.
- If you're unsure, `git merge --abort` and try again with a clearer head.

# Summary

- `git merge <branch>` combines that branch into the one you're on.
- A **fast-forward** happens when the target hasn't diverged: the pointer just moves, with
  no merge commit.
- A **three-way merge** combines two tips using their common ancestor, creating a **merge
  commit with two parents**.
- A **conflict** occurs when both branches changed the same lines; Git marks them with
  `<<<<<<<` / `=======` / `>>>>>>>` for you to resolve, then `git add` + `git commit`.
- `git merge --abort` backs out of a conflicted merge entirely.

# Flash Cards

Q: When can Git fast-forward a merge?
A: When the current branch hasn't diverged from the target — Git just slides the pointer forward, creating no merge commit.

Q: How many parents does a merge commit have?
A: Two (or more) — one for each branch being combined.

Q: Which three commits does a three-way merge use?
A: The two branch tips and their common ancestor (the merge base).

Q: What do the markers <<<<<<<, =======, and >>>>>>> indicate?
A: A conflict: the text between them is the two branches' competing versions, which you must resolve by hand.

Q: After editing a conflicted file to resolve it, what two steps finish the merge?
A: git add the resolved file(s), then git commit to complete the merge commit.

Q: How do you cancel an in-progress conflicted merge?
A: git merge --abort, which returns the repository to its exact pre-merge state.

# Exercises

### Easy

Create a branch, make one commit, and merge it back into `main` while `main` is unchanged.
Confirm from `git log --graph` that it was a fast-forward (no merge commit).

### Medium

Make divergent commits on `main` and a branch (changing *different* files), then merge.
Explain why this produced a merge commit and identify its two parents in the log.

### Challenging

Force a conflict: change the *same line* of a file on two branches, then merge. Resolve it
by hand, remove all markers, and complete the merge. Then repeat, but this time
`git merge --abort` instead — and describe the difference in the repository's state.

# Further Reading

- Pro Git, Chapter 3 — [Basic Branching and Merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)
- [`git merge`](https://git-scm.com/docs/git-merge) reference
