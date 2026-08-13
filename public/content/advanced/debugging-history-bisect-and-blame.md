---
id: lesson-19
slug: debugging-history-bisect-and-blame
title: "Debugging History: bisect & blame"
level: advanced
order: 19
duration: 17
tags:
  - bisect
  - blame
  - pickaxe
  - debugging
summary: "Use git bisect to binary-search history for the commit that introduced a bug, git blame to see who last changed each line, and the pickaxe (log -S) to trace when code appeared."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Find the commit that introduced a bug with **`git bisect`** — including automating it.
- See when and by whom each line last changed with **`git blame`**.
- Trace when a string or symbol entered the codebase with the **pickaxe** (`git log -S`).

# Why It Matters

History isn't just a record — it's a **debugging tool**. When something worked last month and
is broken now, Git can pinpoint the exact commit that caused it in a handful of steps, even
across thousands of commits. And when you're staring at a puzzling line of code, Git can tell
you when it changed and what other lines changed with it. These are the detective tools.

# Concept Explanation

### `git bisect`: binary-search for the bad commit

If you know a commit where things worked ("good") and one where they're broken ("bad"),
`git bisect` does a **binary search** between them: it checks out the midpoint, you test and
mark it `good` or `bad`, and it halves the range each time — finding the first bad commit in
about **log₂(N)** steps.

```bash
git bisect start
git bisect bad                 # current commit is broken
git bisect good v1.2.0         # this older tag was fine
# Git checks out a midpoint; test it, then:
git bisect good                # …or: git bisect bad
# repeat until Git names the first bad commit
git bisect reset               # return to where you started
```

You can **automate** it with a test command that exits `0` for good and non-zero for bad:

```bash
git bisect start HEAD v1.2.0
git bisect run ./run-tests.sh  # Git drives the whole search for you
```

### `git blame`: who last touched each line

`git blame <file>` annotates every line with the commit, author, and date that **last
modified** it — great for understanding *when* and *why* a line came to be.

```bash
git blame app.py
git blame -L 40,60 app.py      # just lines 40–60
```

Blame shows the **last change**, which may be a reformat or a move — not necessarily who wrote
the underlying logic. Use `-w` to ignore whitespace-only changes.

### The pickaxe: `git log -S`

`git log -S"<string>"` finds commits where the number of occurrences of that string changed —
i.e. where it was **added or removed**. It's how you find when a function or constant first
appeared or vanished.

```bash
git log -S"calculateTax" --oneline
git log -G"regex" --oneline     # -G matches a regex in the diff
```

# Key Terminology

- **`git bisect`:** binary search over history to locate the first bad commit.
- **good / bad:** the marks you give bisect to narrow the range.
- **`git bisect run`:** automate bisect with a test script.
- **`git blame`:** show the last commit/author/date per line.
- **Pickaxe (`git log -S`):** find commits that added/removed a given string.

# Options and Trade-offs

| Tool | Question it answers |
| ---- | ------------------- |
| `git bisect` | *Which commit* introduced this behavior change? |
| `git blame` | *When/by whom* was this line last changed? |
| `git log -S` | *When* did this code (string) appear or disappear? |

# Worked Example

A test that passed at `v1.2.0` fails at `HEAD`, with ~200 commits in between. Let Git find the
culprit automatically.

```bash
git bisect start HEAD v1.2.0
git bisect run npm test
```

```text
Bisecting: 100 revisions left to test after this (roughly 7 steps)
…
a1b2c3d is the first bad commit
    Refactor date parser
git bisect reset
```

In about seven steps, Git named the exact commit. Now investigate that change:

```bash
git blame -L 20,35 src/date.js   # who last touched these lines
git log -S"parseDate" --oneline  # when parseDate was added/changed
```

You've gone from "something broke somewhere" to the precise commit and lines in minutes.

# Real World Analogy

`git bisect` is the **"guess the number" game**: "higher or lower?" halves the possibilities
each guess, so even 1,000 commits fall in ~10 questions. `git blame` is the **margin notes** in
a shared manuscript, showing who last edited each line. The **pickaxe** is a search that finds
the exact draft where a particular sentence first appeared.

# Examples

## Example 1 — Basic: understand a line

A developer sees a strange `+ 1` in a calculation. `git blame` shows the commit that added it,
whose message explains an off-by-one fix — mystery solved without asking anyone.

**Why this works:** Blame links each line to the commit (and message) that last changed it,
turning "why is this here?" into a quick lookup.

## Example 2 — Real-world: automated regression hunt

Nightly tests fail. An engineer runs `git bisect run ./test.sh` between last night's good build
and now; Git identifies the breaking commit unattended while they get coffee.

**Why this works:** `bisect run` combines binary search with an automated test, scaling to huge
commit ranges with zero manual testing.

## Example 3 — Trade-off / pitfall: blame ≠ fault, and flaky tests

Someone blames a bug on the developer `git blame` names — but that commit merely re-indented the
file; the real logic came earlier. Separately, a bisect run gives a wrong answer because the
test is flaky (sometimes passes on the same commit).

**Why this bites:** Blame shows the *last* change, not authorship of intent; and bisect assumes
a **deterministic** good/bad test — flakiness misleads the search.

# Common Mistakes

- **Reading `git blame` as assigning fault.** It shows the last change, which may be cosmetic.
- **Forgetting `git bisect reset`,** leaving you on a detached midpoint commit.
- **Bisecting with a flaky test,** which produces a wrong or unstable result.
- **Not giving bisect a known-good commit,** so it has nothing to search between.

# Best Practices

- Use **`git bisect`** for regressions where you have a clear good commit and a reliable test.
- **Automate** with `git bisect run` for large ranges.
- Always **`git bisect reset`** when done.
- Use **`git blame -w`** to skip whitespace noise, and follow the commit for context.
- Reach for **`git log -S`** to trace when a symbol entered or left the code.

# Summary

- **`git bisect`** binary-searches history (good ↔ bad) to find the first bad commit in ~log₂(N)
  steps; `git bisect run <script>` automates it.
- **`git blame`** shows the commit, author, and date that **last** changed each line (not
  necessarily who wrote the logic).
- The **pickaxe** `git log -S"str"` finds commits that **added or removed** a string; `-G` uses a
  regex.
- Together they answer *which commit*, *who/when per line*, and *when code appeared*.

# Flash Cards

Q: What does `git bisect` do?
A: It binary-searches history between a known-good and a known-bad commit to find the commit that introduced a bug.

Q: What does `git blame` show?
A: For each line of a file, the commit, author, and date that last modified it.

Q: How can you automate a bisect?
A: git bisect run <test-script> — Git checks out each midpoint and uses the script's exit code (0 = good, non-zero = bad) to drive the search.

Q: What does the pickaxe `git log -S"foo"` find?
A: Commits where the number of occurrences of "foo" changed — i.e. where it was added or removed.

Q: Does `git blame` reliably tell you who is at fault for a bug?
A: No — it shows who last changed the line, which might be a reformat or move, not the author of the underlying logic.

Q: What should you run after finishing a bisect session?
A: git bisect reset, to return to your original branch/commit.

# Exercises

### Easy

Run `git blame` on a file in any repo. Pick a line and follow its commit to read the message
that introduced it. Note what blame does and doesn't tell you.

### Medium

In a repo with history, deliberately introduce a bug a few commits back, then use `git bisect`
(marking good/bad manually) to find it. Reset when done.

### Challenging

Write a small test script that exits non-zero when a bug is present, then use `git bisect run`
to find the introducing commit automatically. Explain how many steps it took relative to the
number of commits, and why a flaky test would break the process.

# Further Reading

- Pro Git, Chapter 7 — [Debugging with Git](https://git-scm.com/book/en/v2/Git-Tools-Debugging-with-Git) (bisect and blame)
- [`git bisect`](https://git-scm.com/docs/git-bisect), [`git blame`](https://git-scm.com/docs/git-blame), and [`git log`](https://git-scm.com/docs/git-log) (`-S`/`-G`) references
