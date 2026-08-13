---
id: lesson-04
slug: viewing-and-ignoring-history
title: "Viewing & Ignoring History"
level: beginner
order: 4
duration: 17
tags:
  - git-log
  - git-diff
  - gitignore
  - history
summary: "Read history with git log, inspect changes with git diff (working vs staged vs committed), and keep junk out of your repo with .gitignore — including why it only affects untracked files."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Browse history with `git log` and its most useful options.
- Use `git diff` to see changes that are **unstaged**, **staged**, or between commits.
- Write a `.gitignore` file to keep generated and secret files out of the repository.
- Explain the crucial rule that **`.gitignore` only affects untracked files**.

# Why It Matters

History is only useful if you can read it, and a repository is only pleasant to work in
if it isn't cluttered with build output, dependencies, and secrets. `git log` and
`git diff` are the two windows into what happened and what's about to happen; `.gitignore`
is how you keep the noise out. You'll use all three constantly.

# Concept Explanation

### Reading history with `git log`

By default, `git log` lists commits newest-first with their hash, author, date, and
message. A few options make it far more useful:

```bash
git log --oneline            # one compact line per commit
git log --oneline --graph    # add an ASCII graph of branches/merges
git log --stat               # which files changed, and how much
git log -p                   # the full patch (diff) for each commit
git log -2                   # only the last 2 commits
git log --grep="fix"         # commits whose message matches "fix"
git log -- path/to/file      # only commits that touched this file
```

```text
9f8e7d6 Add input validation
a1b2c3d Add README
```

### Seeing changes with `git diff`

`git diff` compares two of Git's areas. Which two depends on the flags:

- **`git diff`** — working tree vs. staging area: your **unstaged** changes.
- **`git diff --staged`** (same as `--cached`) — staging area vs. last commit: **what
  will be committed**.
- **`git diff HEAD`** — working tree vs. last commit: **all** changes since the last
  commit.
- **`git diff <commitA> <commitB>`** — the difference between two commits.

Git shows changes as a **unified diff** — removed lines start with `-`, added lines with
`+`:

```diff
--- a/README.md
+++ b/README.md
@@ -1 +1,2 @@
 # Hello
+A friendly greeting project.
```

### Keeping files out with `.gitignore`

A `.gitignore` file lists patterns of files Git should **not track**. Put it at the repo
root (you can have more in subfolders). It uses simple glob patterns:

```text
# comments start with a hash
*.log            # ignore every .log file
build/           # ignore a whole directory (trailing slash)
.env             # ignore a specific file (often secrets)
node_modules/    # ignore dependencies
!keep.log        # but do NOT ignore this one (negation)
/secret.txt      # a leading slash anchors to the repo root
```

**The one rule everyone forgets:** `.gitignore` only stops Git from tracking files that
are **currently untracked**. If a file is **already committed**, adding it to
`.gitignore` does nothing — Git keeps tracking it. To stop tracking a file you already
committed, remove it from the index (but not your disk) with `git rm --cached <file>`,
then commit that change.

# Key Terminology

- **`git log`:** show the commit history.
- **`git diff`:** show line-by-line changes between two states.
- **Unified diff:** the `+`/`-` format Git uses to display changes.
- **`.gitignore`:** a file of patterns for intentionally untracked files.
- **Glob pattern:** a wildcard match like `*.log` or `build/`.
- **`git rm --cached`:** stop tracking a file while keeping it on disk.

# Options and Trade-offs

| `git log` option | Shows | Reach for it when |
| ---------------- | ----- | ----------------- |
| `--oneline` | One line per commit | You want a quick overview |
| `--graph` | ASCII branch/merge graph | Untangling branch history |
| `--stat` | Files changed + counts | "What areas did this touch?" |
| `-p` / `--patch` | The actual diffs | Reviewing exactly what changed |
| `--grep` / `--author` | Filtered commits | Searching history |

# Worked Example

You make two commits, review them, inspect an unstaged change, then ignore a log file.

```bash
git log --oneline
```

```text
9f8e7d6 Add input validation
a1b2c3d Add README
```

You edit `README.md` but haven't staged it. See what changed:

```bash
git diff
```

```diff
--- a/README.md
+++ b/README.md
@@ -1 +1,2 @@
 # Hello
+Now with docs.
```

Your program keeps writing `debug.log`, which you never want in Git:

```bash
echo "debug.log" >> .gitignore
git add .gitignore
git commit -m "Ignore debug.log"
```

From now on `git status` won't nag you about `debug.log`, because the pattern makes Git
treat it as intentionally untracked.

# Real World Analogy

`git log` is the **ship's logbook** — a dated record of everything that happened, which
you can skim or read in full. `.gitignore` is the **"do not pack" list** for a trip:
sand, wet towels, and half-eaten sandwiches never make it into the suitcase. But if you
already packed the sandwich last week, adding it to the list now won't remove it — you
have to take it out yourself (`git rm --cached`).

# Examples

## Example 1 — Basic: skim the history

A developer joins a project and runs `git log --oneline --graph` to get a one-screen
picture of recent work and how branches came together, then `git log -p somefile.py` to
see how one file evolved.

**Why this works:** `--oneline` compresses noise; adding `-p` or a path zooms in only
where needed.

## Example 2 — Real-world: a starter `.gitignore`

A Node.js project commits a `.gitignore` on day one containing `node_modules/`, `dist/`,
and `.env`. Dependencies, build output, and secrets never clutter the repo or leak into
history.

**Why this works:** Ignoring generated and sensitive files keeps the repository small,
reviewable, and safe. GitHub even offers ready-made templates per language.

## Example 3 — Trade-off / pitfall: ignoring an already-tracked file

Someone commits `.env` by accident, then adds it to `.gitignore` and is surprised it's
still tracked (and still in history). `.gitignore` doesn't untrack files. They run
`git rm --cached .env` and commit — future changes are now ignored (though the secret is
still in past history and should be rotated).

**Why this bites:** `.gitignore` is preventive, not retroactive. A committed secret stays
in history until it's actively removed, so the safe move is to change the secret.

# Common Mistakes

- **Expecting `.gitignore` to untrack a committed file.** It won't; use
  `git rm --cached`.
- **Committing secrets before ignoring them.** Once in history, a secret must be treated
  as compromised — rotate it.
- **Confusing `git diff` and `git diff --staged`.** The first shows unstaged changes; the
  second shows what's about to be committed.
- **Reading only `git log`'s default view** when `--oneline`, `--graph`, or `-p` would
  answer your question faster.

# Best Practices

- Add a `.gitignore` **early**, ideally in your first commit; start from a language
  template.
- **Review before you commit** with `git diff --staged` — it shows exactly what will be
  recorded.
- Learn `git log --oneline --graph --decorate` as your everyday history view.
- Never commit secrets; keep them in ignored files like `.env` and out of history.

# Summary

- `git log` shows history; `--oneline`, `--graph`, `--stat`, and `-p` shape the view.
- `git diff` compares states: bare = **unstaged**, `--staged` = **about to be committed**,
  `HEAD` = **everything since the last commit**, and `A B` = **between two commits**.
- `.gitignore` holds glob patterns for files Git should leave untracked.
- `.gitignore` **only affects untracked files** — remove an already-tracked file with
  `git rm --cached`.

# Flash Cards

Q: What does `git diff` with no arguments show?
A: Your unstaged changes — the difference between the working tree and the staging area.

Q: Which command shows exactly what will be included in your next commit?
A: git diff --staged (also spelled --cached), comparing the staging area to the last commit.

Q: What is a .gitignore file for?
A: Listing glob patterns for files Git should not track, such as build output, dependencies, and secrets.

Q: You added a file to .gitignore but Git still tracks it. Why?
A: It was already committed; .gitignore only affects untracked files. Use git rm --cached to stop tracking it.

Q: How do you view history with one compact line per commit?
A: git log --oneline (often combined with --graph).

Q: How do you stop tracking a committed file without deleting it from disk?
A: git rm --cached <file>, then commit the change.

# Exercises

### Easy

In a repo with a few commits, run `git log`, then `git log --oneline`, then
`git log --oneline --graph`. Describe what each adds.

### Medium

Edit a tracked file. Run `git diff`. Now `git add` it and run `git diff` again, then
`git diff --staged`. Explain why the output moved between the two commands.

### Challenging

Commit a file called `temp.log`, then add `*.log` to `.gitignore` and commit that.
Confirm `temp.log` is still tracked. Make it ignored going forward without deleting it
from your disk, and explain each command you used.

# Further Reading

- Pro Git, Chapter 2 — [Viewing the Commit History](https://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History) and [Recording Changes: Ignoring Files](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository#_ignoring)
- [`gitignore` reference](https://git-scm.com/docs/gitignore) and GitHub's [gitignore templates](https://github.com/github/gitignore)
- [`git log`](https://git-scm.com/docs/git-log) and [`git diff`](https://git-scm.com/docs/git-diff) references
