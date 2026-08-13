---
id: lesson-12
slug: pr-merge-strategies-merge-squash-and-rebase
title: "PR Merge Strategies: Merge, Squash & Rebase"
level: intermediate
order: 12
duration: 17
tags:
  - merge-methods
  - squash
  - rebase
  - github
summary: "GitHub's three ways to merge a pull request — a merge commit, squash and merge, or rebase and merge — what each does to history, and when to choose which."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Describe GitHub's three PR merge methods and exactly what each does to `main`'s history.
- Choose the right method for messy vs. meaningful commit histories.
- Explain why **squash** and **rebase** change commit identities.

# Why It Matters

When a pull request is ready, GitHub offers a merge button with (up to) three options. They
produce very different histories on `main`: one preserves every commit, one collapses them
into a single commit, and one lays them down in a straight line. Picking the wrong one — or
not knowing what it does — leads to noisy or confusing history. This lesson makes the choice
deliberate.

# Concept Explanation

Say a PR branch has three commits: `wip`, `fix typo`, `actually works`.

### 1. Create a merge commit

GitHub adds **all** the branch's commits to `main` and creates a **merge commit** with two
parents that ties the branch back in. History is complete but **non-linear**.

```text
main …──●─────────────●   ← merge commit (2 parents)
         \           /
          wip──fix──works
```

### 2. Squash and merge

GitHub **combines all the branch's commits into a single new commit** on `main`. The three
messy commits become one clean commit; the individual history is not kept on `main`. History
stays **linear**.

```text
main …──●──[squash: "Add feature"]
```

### 3. Rebase and merge

GitHub **replays each of the branch's commits individually** onto `main`, with **no merge
commit**. History is **linear** and keeps the separate commits — but they are **rewritten**
(new hashes), and there's no explicit record of a merge.

```text
main …──●──wip'──fix'──works'      (commits reapplied, new hashes)
```

### Which to choose

- **Merge commit** — preserve the exact commits and record that a branch existed; good when
  the individual commits and the merge point matter.
- **Squash** — collapse noisy work-in-progress commits into one tidy commit per PR; the most
  popular choice for a clean `main`.
- **Rebase** — keep meaningful individual commits *and* a linear history, when each commit is
  already clean and self-contained.

A repository's admins choose which of these three methods are **enabled**, so your options
depend on the project's settings.

# Key Terminology

- **Merge commit method:** adds all commits plus a two-parent merge commit.
- **Squash and merge:** combines a PR's commits into one commit on the base.
- **Rebase and merge:** replays a PR's commits onto the base with no merge commit.
- **Linear history:** history with no merge commits.
- **Rewrite:** producing new commits (new hashes) from the same changes.

# Options and Trade-offs

| Method | Commits on `main` | Merge commit? | History | Best for |
| ------ | ----------------- | ------------- | ------- | -------- |
| Merge commit | All of the branch's | Yes (2 parents) | Non-linear | Preserving exact history + the merge point |
| Squash and merge | One combined commit | No | Linear | Collapsing messy WIP into one clean commit |
| Rebase and merge | Each commit, rewritten | No | Linear | Keeping clean, meaningful individual commits |

# Worked Example

A PR contains three noisy commits. Compare the result on `main` under each method.

```text
PR branch:   A(wip) — B(fix typo) — C(actually works)

Merge commit →  main gets A, B, C and a merge commit M (parents: old tip + C)
Squash       →  main gets ONE commit "Add feature" (A+B+C combined)
Rebase       →  main gets A', B', C' in a line (reapplied, new hashes; no M)
```

If your team wants `main` to read one clean commit per feature, **squash** turns this noisy
branch into a single, well-described commit. If each of A, B, C were already meaningful,
**rebase** would keep them, just linearized.

# Real World Analogy

Think of merging a packet of draft pages into a bound binder.

- **Merge commit:** staple the whole packet in, with a cover sheet noting "pages from the
  feature draft." Everything's there, including the seam.
- **Squash:** retype the packet as a **single clean page** and file that.
- **Rebase:** slot **each page** of the packet directly into the binder in order, no cover
  sheet — a smooth run of pages, but re-transcribed.

# Examples

## Example 1 — Basic: squash a messy branch

A branch has commits `wip`, `oops`, `fix`, `fix again`. Squash-and-merge turns them into one
commit, `Add CSV export`, so `main`'s history reads cleanly.

**Why this works:** The intermediate commits had no lasting value; collapsing them keeps
`main` readable.

## Example 2 — Real-world: a team convention

A project enables **only** squash-and-merge. Every PR becomes exactly one commit on `main`,
making the history a clean list of features and fixes that's easy to scan and revert.

**Why this works:** A single convention removes per-PR decisions and yields a uniform,
linear history.

## Example 3 — Trade-off / pitfall: expecting old hashes after rebase

A developer rebase-merges a PR, then is confused that the commit hashes on `main` differ
from their branch, and that a teammate who checked out the branch now sees a divergence.

**Why this bites:** Both squash and rebase **rewrite** commits — new hashes. Anyone still on
the old branch must reset to the new history. Squash also discards the granular commits, so
you can't `bisect` within that feature later.

# Common Mistakes

- **Expecting individual commits on `main` after a squash.** They're combined into one.
- **Assuming rebase-and-merge leaves a merge commit.** It doesn't — history is linear.
- **Forgetting that squash/rebase change hashes,** surprising anyone still on the branch.
- **Not knowing which methods the repo enables,** then hunting for a missing button.

# Best Practices

- Agree on a **team convention** and stick to it.
- Use **squash** for branches full of work-in-progress commits.
- Use **rebase** (or a merge commit) when the individual commits are clean and worth
  keeping.
- Write a **good squash commit message** — it's the one that lands on `main`.
- After a squash/rebase merge, **delete the branch**; don't keep building on the old hashes.

# Summary

- GitHub offers three PR merge methods: **merge commit**, **squash and merge**, and **rebase
  and merge**.
- **Merge commit** keeps all commits and adds a two-parent merge commit (non-linear).
- **Squash** collapses the PR into one commit; **rebase** replays commits linearly with no
  merge commit — both **rewrite** commits into new hashes.
- Choose by whether you want to preserve exact history, collapse noise, or keep clean
  individual commits — within the methods the repo enables.

# Flash Cards

Q: What does "Squash and merge" do?
A: It combines all of a pull request's commits into a single new commit on the base branch.

Q: Which merge method creates a merge commit with two parents?
A: "Create a merge commit" — it adds all the branch's commits plus a two-parent merge commit.

Q: What does "Rebase and merge" do to history?
A: It replays each of the PR's commits onto the base branch with no merge commit, producing a linear history (with rewritten commit hashes).

Q: Do squash and rebase preserve the original commit hashes?
A: No — both rewrite the commits into new hashes; squash also collapses them into one.

Q: Your PR has eight noisy "wip"/"fix" commits and the team wants one commit per feature on main. Which method?
A: Squash and merge.

Q: Who decides which merge methods are available on a repository?
A: The repository's admins enable or disable each method in its settings.

# Exercises

### Easy

Describe, for a branch with commits `A`, `B`, `C`, what ends up on `main` under each of the
three merge methods.

### Medium

On a test repo, create a branch with three small commits and open a PR. Merge it with
"Squash and merge," then inspect `main` with `git log --oneline`. Explain what happened to
the three commits.

### Challenging

Your team wants a linear `main` but also wants to preserve meaningful individual commits.
Which method fits, and what's the catch regarding commit hashes and anyone who still has the
old branch checked out?

# Further Reading

- GitHub Docs — [About merge methods on GitHub](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github)
- GitHub Docs — [Merging a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/merging-a-pull-request)
