---
id: lesson-10
slug: the-github-flow-branches-and-pull-requests
title: "The GitHub Flow: Branches & Pull Requests"
level: intermediate
order: 10
duration: 18
tags:
  - github-flow
  - pull-requests
  - code-review
  - collaboration
summary: "The lightweight, branch-based GitHub flow — branch, commit, push, open a pull request, review, merge — and what a pull request actually is."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Describe the **GitHub flow** and its steps.
- Explain what a **pull request (PR)** is and how it maps to Git branches.
- Open a PR from a pushed branch and respond to review feedback.
- Explain why teams route changes through PRs instead of committing to `main`.

# Why It Matters

Git gives you branches and merges; **GitHub flow** is the simple, popular recipe for using
them as a team. Its centerpiece — the **pull request** — is where code review, automated
checks, and discussion happen before code reaches `main`. Almost every open-source project
and most companies work this way, so it's the workflow you'll actually live in.

# Concept Explanation

### The GitHub flow

GitHub flow is a lightweight, branch-based workflow built on one rule: **`main` is always
deployable.** The steps:

1. **Branch** off `main` with a descriptive name (`add-search`, `fix/login-crash`).
2. **Commit** your work on that branch.
3. **Push** the branch and **open a pull request**.
4. **Review & discuss** — teammates comment; you push more commits to address feedback.
5. **Merge** the PR into `main` (often after checks pass and someone approves).
6. **Delete** the branch.

```text
main   ●───────────────●  (merge)
        \             /
feature  ●──●──●──────   ← push, open PR, review, merge
```

### What a pull request is

A **pull request** is a **GitHub feature** (not a Git command): a request to merge one
branch into another. It shows the **diff**, runs any **automated checks**, and hosts a
**review** conversation. Reviewers can comment, **approve**, or **request changes**; you
keep pushing commits to the same branch and the PR updates automatically. When everyone's
happy, you merge.

> GitLab calls the same idea a **merge request** — different name, same concept.

Under the hood, merging a PR performs a Git merge (or squash/rebase — next lesson) of your
branch into the base branch.

### Opening a PR

```bash
git switch -c add-search
# …commits…
git push -u origin add-search
```

Then, on GitHub, click **Compare & pull request**, write a clear title and description
(what changed and why), and open it. Reviewers and checks take it from there. Small PRs get
reviewed faster and merged sooner.

# Key Terminology

- **GitHub flow:** a lightweight branch-based workflow that keeps `main` deployable.
- **Pull request (PR):** a GitHub request to merge one branch into another, with diff,
  checks, and review.
- **Base branch:** the branch you want to merge **into** (often `main`).
- **Compare branch:** the branch with your changes.
- **Review:** approving or requesting changes on a PR.
- **Merge request:** GitLab's name for a pull request.

# Options and Trade-offs

| Approach | What happens | Trade-off |
| -------- | ------------ | --------- |
| Commit straight to `main` | Fast, no review | No safety net; easy to break `main` |
| Feature branch + PR | Review + checks before merge | A little process, much safer |
| Draft PR | Open early, marked "not ready" | Get feedback/CI before requesting review |
| Small PRs | Quick to review and revert | More PRs to manage |

# Worked Example

You add a search feature using the GitHub flow.

```bash
git switch -c add-search          # 1. branch
echo "search()" > search.js
git add search.js
git commit -m "Add search box"    # 2. commit
git push -u origin add-search     # 3. push, then open the PR on GitHub
```

A reviewer asks for a test. You add it on the **same branch**:

```bash
git add search.test.js
git commit -m "Add search test"
git push                          # 4. the PR updates automatically
```

Checks pass, the reviewer approves, you click **Merge**, and delete the branch. `main` now
contains the feature — and stayed deployable the entire time.

# Real World Analogy

A pull request is a **proposed edit submitted for review** before it goes into the official
document. You don't scribble directly in the master copy (`main`); you draft your change on
a photocopy (a branch), attach a note explaining it, and hand it to an editor. They suggest
tweaks, you revise, and only once it's approved does the change get folded into the master.

# Examples

## Example 1 — Basic: PRs even when solo

A solo developer still opens PRs so their CI runs on every change and they get a tidy,
reviewable diff and history — a checklist before merging to `main`.

**Why this works:** The PR is a quality gate and a record, valuable even without a second
person.

## Example 2 — Real-world: team review with required checks

A company requires one approval and passing tests before any PR can merge. A feature branch
goes up, CI runs, a colleague reviews, changes are pushed, and only then does the merge
button unlock.

**Why this works:** Routing every change through a reviewed PR keeps `main` releasable and
spreads knowledge across the team.

## Example 3 — Trade-off / pitfall: the giant PR

Someone works for three weeks on one branch and opens a 4,000-line PR. Reviewers dread it,
it sits for days, and it conflicts with everything. Splitting the work into small,
sequential PRs would have flowed far faster.

**Why this bites:** Review effort grows faster than PR size. Big PRs are slow to review,
risky to merge, and hard to revert.

# Common Mistakes

- **Committing directly to `main`,** skipping review and CI.
- **Opening huge PRs** that are painful to review — prefer small, focused ones.
- **Not pulling `main` before branching,** so your PR starts out stale.
- **Forgetting to push** before trying to open the PR — GitHub needs your branch first.

# Best Practices

- Keep **`main` always deployable**; do work on branches.
- Write **clear PR titles and descriptions** — what changed and *why*.
- Keep PRs **small and single-purpose**.
- Push follow-up commits to the **same branch** to address review comments.
- **Delete merged branches** to keep the repo tidy.

# Summary

- **GitHub flow**: branch → commit → push → open a **pull request** → review → merge →
  delete branch, keeping `main` deployable throughout.
- A **pull request** is a GitHub feature to propose merging one branch into another, with a
  diff, checks, and review (GitLab: "merge request").
- You respond to review by pushing more commits to the **same branch**; the PR updates
  automatically.
- Small, focused PRs are reviewed faster and are safer to merge and revert.

# Flash Cards

Q: What is a pull request?
A: A GitHub feature that proposes merging one branch into another, bundling the diff, automated checks, and a review conversation.

Q: In the GitHub flow, where do you do your work?
A: On a descriptive branch off main; you then open a pull request rather than committing directly to main.

Q: What is GitLab's name for a pull request?
A: A merge request — the same concept under a different name.

Q: How do you address review feedback on an open PR?
A: Push more commits to the same branch; the pull request updates automatically.

Q: What single rule anchors the GitHub flow?
A: main is always kept in a deployable state.

Q: Why keep pull requests small?
A: They're faster to review, less risky to merge, and easier to revert than large ones.

# Exercises

### Easy

List the six steps of the GitHub flow from memory, then describe what a pull request adds
that a plain `git merge` on your own machine does not.

### Medium

On a test repository, create a branch, push it, and open a pull request against `main`.
Then push one more commit to the branch and observe how the PR updates.

### Challenging

Explain how a pull request maps onto the Git concepts you already know (branches, commits,
merges). What does clicking "Merge" actually do to `main`, and why does the review happen
*before* that merge rather than after?

# Further Reading

- GitHub Docs — [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow)
- GitHub Docs — [About pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) and [Creating a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)
