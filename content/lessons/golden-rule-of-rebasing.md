---
slug: golden-rule-of-rebasing
title: "The Golden Rule of Rebasing"
topic: rebasing-history
kind: pitfall
summary: "Learn the essential safety rule of Git: never rebase commits that exist outside your local repository on shared public branches."
tags: [rebase, pitfalls, best-practices]
related: [rebase-fundamentals, interactive-rebase, force-with-lease]
---
> **In one line:** The Golden Rule of Rebasing: Never rebase commits that exist outside your repository and that other people have based work on.

## The idea

Rebasing is an extraordinary tool for keeping your own local work clean and linear. But with great power comes the potential for severe disruption if you ignore the **Golden Rule of Rebasing**:

> **The Golden Rule:** Never rebase commits that have been pushed to a public or shared repository where colleagues may have based work on them.

Why is this rule so vital?
Remember that rebasing creates brand new commits with brand new SHA hashes and abandons the old ones.

If you rebase commits that teammates have already pulled into their local repositories, their local histories still point to the old commit hashes. When they pull from the remote again, Git sees two competing histories that contain the same code with different hashes. Git attempts to merge them together, creating duplicate commits, confusing merge conflicts, and chaos for your entire engineering team.

| Branch Type | Is Rebasing Allowed? | Why? |
|---|---|---|
| **Local Private Feature Branch** | **YES (Encouraged)** | No one else has pulled these commits; rewriting is completely safe |
| **Personal PR Branch (Solo)** | **YES (With caution)** | Safe if you are the only author working on the PR branch |
| **Shared Team Branch (`main`, `dev`)** | **NO (Forbidden)** | Rewriting breaks all colleagues' upstream tracking references |

## See it

Safe vs unsafe rebase workflows:

```bash
# SAFE: Rebasing your private unpushed feature branch onto main
git switch feature-checkout
git rebase main
# (Safe because feature-checkout has never been pushed or shared)

# UNSAFE: Rebasing a shared branch like main or a release branch
# DO NOT RUN:
# git switch main
# git rebase some-other-branch
```

## Go deeper

If a teammate accidentally rebases a shared branch and force-pushes it, your local branch will diverge. You can recover by fetching and running `git rebase --onto origin/main <old-base> <your-branch>`, but preventing the accident with branch protection rules is vastly preferable.

> **Tip:** Treat rebasing as a local hygiene tool. Polish your commits before sharing them; once shared on a public trunk, treat history as immutable.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

## Watch out

- Rebasing `main` onto another branch, breaking the history anchor for every developer on the project.
- Rebasing a shared feature branch that multiple colleagues are actively co-authoring without coordination.

## Remember

- The Golden Rule: Never rebase commits that exist on shared remote branches.
- Rebasing creates new hashes; rewriting shared history forces teammates into painful reconciliation.
- Use rebase freely on local, private topic branches before pushing to remotes.
