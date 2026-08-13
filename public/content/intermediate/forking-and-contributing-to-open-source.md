---
id: lesson-11
slug: forking-and-contributing-to-open-source
title: "Forking & Contributing to Open Source"
level: intermediate
order: 11
duration: 18
tags:
  - fork
  - upstream
  - open-source
  - contributing
summary: "The fork-and-pull model: fork a repo you can't push to, add an 'upstream' remote, contribute changes via a pull request, and keep your fork in sync."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain what a **fork** is and why it's needed to contribute to projects you don't own.
- Set up the **fork-and-pull** workflow with `origin` and `upstream` remotes.
- Contribute a change via a branch and a pull request to the original project.
- Keep your fork **in sync** with the upstream repository.

# Why It Matters

You usually can't push directly to someone else's repository — you don't have write access.
**Forking** is how open source works around that: you make your own copy, do your work
there, and propose it back with a pull request. Understanding forks and the `upstream`
remote is the key to contributing to the millions of projects on GitHub.

# Concept Explanation

### What is a fork?

A **fork** is a server-side **copy** of a repository under **your** GitHub account. You have
full push access to your fork, even though you have none on the original. Forking is a
GitHub feature (Git itself just clones).

### The fork-and-pull workflow

```text
   original repo (upstream)  ──fork──▶  your fork (origin)
        ▲                                     │
        │ pull request                        │ clone
        │                                     ▼
        └──────────────  your laptop  ◀────────
```

1. **Fork** the project on GitHub → creates `you/project`.
2. **Clone your fork** locally. `origin` now points to *your* fork.
3. Add the **original** as a remote named **`upstream`**:
   ```bash
   git remote add upstream https://github.com/original-owner/project.git
   git remote -v
   ```
4. **Branch, commit, push** to your fork:
   ```bash
   git switch -c fix-typo
   # …edit, commit…
   git push -u origin fix-typo
   ```
5. On GitHub, **open a pull request** from `you/project:fix-typo` into the original repo.
6. Maintainers review; you push follow-up commits to the same branch until it's merged.

### Keeping your fork in sync

The original keeps moving. Pull its new commits into your fork so you don't drift:

```bash
git fetch upstream
git switch main
git merge upstream/main      # or: git rebase upstream/main
git push origin main         # update your fork's main
```

### Etiquette

Read the project's **`CONTRIBUTING.md`** and follow its conventions. For anything beyond a
small fix, **open an issue first** to discuss. Keep pull requests focused, describe the
*why*, match the code style, and be patient and respectful — maintainers are usually
volunteers.

# Key Terminology

- **Fork:** your own GitHub copy of someone else's repository.
- **`origin`:** in this workflow, your fork.
- **`upstream`:** the original repository you forked from.
- **Fork-and-pull model:** contribute by pushing to your fork and opening a PR upstream.
- **`CONTRIBUTING.md`:** a project's guide for how to contribute.

# Options and Trade-offs

| Model | Who uses it | How you contribute |
| ----- | ----------- | ------------------ |
| **Fork & pull** | Outside contributors (no write access) | Push to your fork, open a PR upstream |
| **Shared repository** | Team members with write access | Push a branch directly, open a PR in the same repo |

# Worked Example

You spot a typo in a popular project's docs and want to fix it.

```bash
# After clicking "Fork" on GitHub and cloning your fork:
git remote add upstream https://github.com/acme/widgets.git
git switch -c fix-readme-typo
# edit README.md…
git add README.md
git commit -m "Fix typo in installation steps"
git push -u origin fix-readme-typo
```

Open a pull request from `you/widgets:fix-readme-typo` into `acme/widgets:main`. A
maintainer reviews and merges. Later, to catch up with everything merged since:

```bash
git fetch upstream
git switch main
git merge upstream/main
git push origin main
```

Your fork's `main` now matches the original again, ready for your next contribution.

# Real World Analogy

A fork is like **photocopying a public, open-license cookbook** to make your own annotated
edition. You can scribble in your copy all you like (your fork). If you improve a recipe and
think the original authors would want it, you mail them your suggested page — a **pull
request** to **upstream**. Meanwhile the authors keep publishing new editions, so now and
then you copy their latest changes into your edition to stay current.

# Examples

## Example 1 — Basic: a one-line docs fix

A first-time contributor forks a project, fixes a broken link on a branch, pushes to their
fork, and opens a PR. It's merged within a day. They never needed write access to the
original.

**Why this works:** The fork gives them a place to push; the PR proposes the change back —
exactly what the fork-and-pull model is for.

## Example 2 — Real-world: a maintained long-lived fork

A company maintains a fork of an upstream library with a few custom patches. They regularly
`git fetch upstream` and merge to stay current, keeping their patches on top.

**Why this works:** The `upstream` remote makes syncing routine, so the fork benefits from
upstream fixes without losing local changes.

## Example 3 — Trade-off / pitfall: committing on your fork's `main`

A contributor commits directly on their fork's `main`. It diverges from upstream, and every
sync now conflicts. Doing the work on a **topic branch** and keeping `main` a clean mirror
of upstream would have avoided the mess.

**Why this bites:** If your `main` diverges from upstream's `main`, keeping in sync becomes a
running conflict. Reserve `main` for mirroring upstream; do work on branches.

# Common Mistakes

- **Not adding an `upstream` remote,** then having no easy way to sync with the original.
- **Working on your fork's `main`** instead of a topic branch, causing sync conflicts.
- **Opening a PR from `main`,** which entangles your branch with future syncs.
- **Skipping `CONTRIBUTING.md`** and submitting work that ignores the project's conventions.

# Best Practices

- Do every contribution on its **own branch**; keep your fork's `main` a clean mirror of
  upstream.
- Add the **`upstream`** remote right after cloning your fork.
- **Sync regularly** (`git fetch upstream` + merge/rebase) so your PRs apply cleanly.
- **Read `CONTRIBUTING.md`** and open an issue to discuss anything non-trivial first.
- Keep PRs small, explain the *why*, and be courteous.

# Summary

- A **fork** is your own GitHub copy of a repo you can't push to; it's how you contribute to
  projects you don't own.
- In the **fork-and-pull** model, `origin` is your fork and **`upstream`** is the original.
- Contribute by branching, committing, pushing to your fork, and opening a **pull request**
  upstream.
- Keep your fork current with `git fetch upstream` then merge/rebase `upstream/main`; do
  your work on branches, not `main`.

# Flash Cards

Q: What is a fork on GitHub?
A: A server-side copy of someone else's repository under your own account, which you can push to freely.

Q: In the fork-and-pull model, what does the `upstream` remote point to?
A: The original repository you forked from (while origin points to your fork).

Q: How do you propose your forked changes back to the original project?
A: Push your branch to your fork, then open a pull request from your fork's branch into the original repository.

Q: How do you keep your fork in sync with the original?
A: git fetch upstream, then merge (or rebase) upstream/main into your main, and push to your fork.

Q: Do you need write access to a project to contribute via fork-and-pull?
A: No — that's the point. You push to your own fork and propose changes with a pull request.

Q: Where should you do your contribution work in your fork?
A: On a topic branch, keeping your fork's main a clean mirror of upstream.

# Exercises

### Easy

Fork any public repository on GitHub, clone your fork, and add the original as `upstream`
with `git remote add`. Confirm both remotes with `git remote -v`.

### Medium

On your fork, create a branch, make a small change, push it, and open a pull request back to
the original repository. Describe which remote each step touched.

### Challenging

Simulate falling behind: after forking, let the upstream gain commits (or pick a busy
project). Sync your fork's `main` with `upstream/main`, then explain why doing your work on a
branch (not `main`) makes this sync painless.

# Further Reading

- GitHub Docs — [About forks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/about-forks) and [Fork a repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo)
- Pro Git, Chapter 6 — [Contributing to a Project](https://git-scm.com/book/en/v2/GitHub-Contributing-to-a-Project)
