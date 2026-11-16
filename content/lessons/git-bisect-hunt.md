---
slug: git-bisect-hunt
title: "Hunting Bugs with `git bisect`"
topic: debugging-large-repos
kind: technique
summary: "Use binary search in git bisect to find the exact commit that introduced a bug or regression in minutes."
tags: [bisect, debugging, search]
related: [automated-bisect-scripts, git-blame-and-log-search, the-commit-dag]
---
> **In one line:** git bisect uses binary search across your commit graph to identify the exact commit that introduced a regression.

## The idea

Imagine discovering that a feature that worked in last month's release (`v1.0.0`) is now completely broken in your current development branch (`HEAD`), with 600 commits between them.

Testing all 600 commits manually one by one is impossible.

**`git bisect`** solves this by applying a binary search algorithm to your commit history. Instead of testing 600 commits linearly (which takes hours), binary search tests `log2(600)` commits—meaning you will pinpoint the exact offending commit in **at most 10 steps**!

The manual bisect workflow:
1. `git bisect start`: Initiates the bisect session.
2. `git bisect bad`: Tells Git that the current commit (`HEAD`) exhibits the bug.
3. `git bisect good <commit>`: Tells Git a known commit where the code worked properly (e.g. `v1.0.0`).
4. Git checks out the commit halfway between good and bad.
5. You test the code. If it works, you type `git bisect good`. If it fails, you type `git bisect bad`.
6. Git halves the search space repeatedly until it prints the exact commit author, date, and diff that broke the code.
7. `git bisect reset`: Finishes the session and returns `HEAD` to where you started.

| Commits in Search Range | Max Binary Search Steps |
|---|---|
| 100 commits | ~7 steps |
| 500 commits | ~9 steps |
| 1,000 commits | ~10 steps |
| 10,000 commits | ~14 steps |

## See it

Find the commit that broke a test using manual bisect:

```bash
# Start bisect session
git bisect start

# Mark current HEAD as broken
git bisect bad

# Mark last month's release tag as known-good
git bisect good v1.0.0
# Git replies: "Bisecting: 250 revisions left to test after this (roughly 8 steps)"

# Test your app... if broken:
git bisect bad

# Test again at next midpoint... if working:
git bisect good

# When done, Git identifies the exact commit. Return to original branch:
git bisect reset
```

## Go deeper

If a commit checked out by bisect cannot be tested (e.g. an unrelated compilation error or missing dependency prevents running the test), run `git bisect skip`. Git will choose an adjacent commit to test instead, continuing the binary search around the untestable node.

> **Tip:** Always run `git bisect reset` when finished to restore your original branch and leave the bisect state cleanly.

## Watch out

- Forgetting to run `git bisect reset`, remaining stuck in a detached HEAD bisect state.
- Testing a commit with uncommitted local modifications, which contaminates test results across bisect steps.

## Remember

- `git bisect` uses binary search to find regressions across hundreds of commits in under 10 steps.
- Mark the boundaries with `git bisect bad` and `git bisect good <tag>`.
- Always conclude the search with `git bisect reset` to restore your working tree.
