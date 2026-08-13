---
id: lesson-03
slug: the-three-states-and-your-first-commit
title: "The Three States & Your First Commit"
level: beginner
order: 3
duration: 18
tags:
  - staging-area
  - commit
  - git-add
  - git-status
  - workflow
summary: "The working tree, the staging area (index), and the repository — and the add → commit workflow that moves changes between them to create your first snapshot."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Name Git's **three areas** — the working tree, the staging area, and the repository — and what lives in each.
- Describe the **file lifecycle**: untracked, modified, staged, committed.
- Turn a folder into a repository with `git init` and read its state with `git status`.
- Use `git add` to **stage** changes and `git commit` to record a **snapshot**.
- Explain exactly **what a commit contains**.

# Why It Matters

Git's most confusing idea for beginners is the **staging area** — the step between "I
changed a file" and "I saved it to history." Once it clicks, everything else about Git
gets easier, because almost every command is really about moving changes between three
places. This lesson builds that mental model and walks you through your very first
commit.

# Concept Explanation

### The three areas

A Git project has three parts:

```text
  working tree            staging area (index)         repository (.git)
  ------------            --------------------         ----------------
  the files you   --git add-->  what will go    --git commit-->  permanent
  edit right now                in the next commit               snapshots
```

- **Working tree:** the actual files on disk that you open and edit.
- **Staging area (also called the *index*):** a holding space where you assemble exactly
  what your next commit will contain.
- **Repository (`.git` directory):** where Git permanently stores committed snapshots and
  all history.

### The matching three states

A file moves through these states:

- **Untracked:** Git doesn't know about it yet (a brand-new file).
- **Modified:** a tracked file has changed since the last commit, but the change isn't
  staged.
- **Staged:** the change is marked to go into the next commit.
- **Committed:** the change is safely stored in the repository.

### Starting a repository

`git init` creates a hidden `.git` directory, turning an ordinary folder into a
repository:

```bash
mkdir hello && cd hello
git init
```

```text
Initialized empty Git repository in /home/ada/hello/.git/
```

### The everyday loop: status → add → commit

`git status` tells you where everything stands. Let's create a file and watch:

```bash
echo "# Hello" > README.md
git status
```

```text
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	README.md
```

Stage it, then commit it:

```bash
git add README.md
git commit -m "Add README"
```

```text
[main (root-commit) a1b2c3d] Add README
 1 file changed, 1 insertion(+)
 create mode 100644 README.md
```

`git status` now reports a clean working tree — nothing to commit.

**`git add` does two jobs:** it starts tracking a new file, and it stages the file's
current content. A useful shortcut once files are already tracked is `git commit -a`,
which stages every tracked, modified file and commits in one step (it does **not** pick
up brand-new untracked files).

### What a commit actually is

A commit is a **snapshot plus metadata**. It records:

- a reference to the full **tree** (the state of all your files at that moment),
- the **author** and **committer** (name, email) and timestamps,
- your **message**,
- the **parent** commit (the one before it), and
- a unique **hash** (an ID computed from all of the above).

Because the hash is derived from the content, the same content always produces the same
ID, and any change to history changes the IDs — that's what makes Git tamper-evident.

# Key Terminology

- **Working tree:** the files you can see and edit.
- **Staging area / index:** the assembled contents of your next commit.
- **Repository (`.git`):** where committed snapshots live.
- **Untracked / modified / staged / committed:** the states a file passes through.
- **`git init`:** create a new repository in the current folder.
- **`git add`:** stage a file's current content (and begin tracking new files).
- **`git commit`:** record the staged snapshot into the repository.
- **`git status`:** show what's untracked, modified, and staged.

# Options and Trade-offs

| Command | What it does | Use when |
| ------- | ------------ | -------- |
| `git add <file>` then `git commit` | Stage specific changes, then record them | You want to craft a focused commit |
| `git add .` | Stage everything changed in the current folder | You truly want all changes in one commit |
| `git commit -a -m "…"` | Stage all **tracked** modified files and commit | Quick commit when no new files are involved |
| `git commit` (no `-m`) | Opens your editor for a longer message | The change needs an explanatory body |

# Worked Example

Watch a change move through all three areas.

```bash
echo "print('hi')" > app.py
git add app.py            # working tree → staging area
git status --short
```

```text
A  app.py
```

The `A` in the left column means "added (staged)." Now commit:

```bash
git commit -m "Add app.py"
```

```text
[main 9f8e7d6] Add app.py
 1 file changed, 1 insertion(+)
```

After the commit, history has two snapshots:

```text
  A---B   main
          ^
         HEAD   (B = "Add app.py")
```

Each letter is a commit; `main` points to the newest one, and `HEAD` marks where you
are. You'll meet `HEAD` and branches properly in the branching lesson.

# Real World Analogy

The staging area is a **packing box** you fill before sealing it. You move items (changes)
from your desk (the working tree) into the box (`git add`), arranging exactly what you
want. When the box has the right contents, you tape it shut and label it (`git commit`) —
now it's a permanent, dated package in storage (`.git`). Editing a file after staging is
like changing an item on your desk *after* you put a copy in the box: the box still holds
the old copy until you add the new one.

# Examples

## Example 1 — Basic: your first repository

Run `git init`, create a `README.md`, `git add README.md`, then
`git commit -m "Initial commit"`. You now have a repository with one snapshot and a clean
working tree.

**Why this works:** It's the whole loop in miniature — initialize, stage, commit — and
every project you ever start begins this way.

## Example 2 — Real-world: a focused commit

You fixed a bug in `parser.py` and also started an unrelated experiment in `notes.md`.
You run `git add parser.py` (only that file) and commit just the fix, leaving `notes.md`
for later. Your history stays clean and each commit means one thing.

**Why this works:** The staging area lets you choose *exactly* what goes into a commit,
so history reads as a series of clear, single-purpose changes.

## Example 3 — Trade-off / pitfall: editing after staging

You run `git add report.txt`, then edit `report.txt` again, then commit. The commit
contains the version from when you ran `git add` — **not** your latest edit. `git status`
would have warned you by listing the file as both "staged" and "modified."

**Why this bites:** `git add` snapshots the file *at that moment*. Any later edit needs
another `git add` before it's included. Checking `git status` before committing catches
this every time.

# Common Mistakes

- **Thinking `git add` saves your work.** It only stages; nothing is in history until you
  `git commit`.
- **Editing a file after staging and expecting the new edit in the commit.** Re-run
  `git add` after further edits.
- **Committing with nothing staged.** Git replies "nothing to commit"; you forgot to
  `git add` (or use `-a`).
- **Getting stranded in the editor** after `git commit` with no `-m`. Write a message and
  save, or configure a `core.editor` you know how to exit.

# Best Practices

- Run **`git status` often** — it's the compass that tells you what state you're in.
- Make **small, focused commits**: one logical change per commit.
- Review what you're about to record with **`git diff --staged`** before committing.
- Write a clear, present-tense commit message (e.g. "Add login form validation").
- Use the staging area deliberately — it's a feature, not a hoop to jump through.

# Summary

- Git organizes work into three areas: the **working tree**, the **staging area
  (index)**, and the **repository (`.git`)**.
- Files move through states: **untracked → modified → staged → committed**.
- `git init` starts a repo; `git status` shows state; `git add` stages a file's current
  content; `git commit` records the staged snapshot.
- `git add` stages the file **as it is when you run it** — edit again and you must re-add.
- A **commit** = a snapshot of all files + author/committer + message + parent + a unique
  content-derived hash.

# Flash Cards

Q: What are the three areas of a Git project?
A: The working tree (files you edit), the staging area / index (the next commit's contents), and the repository (.git, where snapshots are stored).

Q: What does `git add` actually do?
A: It stages a file's current content for the next commit — and begins tracking the file if it was new. It does not save to history.

Q: What command records the staged changes into the repository?
A: git commit (add -m "message" to supply the message inline).

Q: You run `git add file`, edit the file again, then commit. What's in the commit?
A: The version from when you ran git add; the later edit isn't staged, so you'd need to git add again.

Q: What does a single commit contain?
A: A snapshot of all files (a tree), the author/committer and timestamps, your message, the parent commit, and a unique hash.

Q: Which command turns an ordinary folder into a Git repository?
A: git init (it creates the hidden .git directory).

# Exercises

### Easy

Create a new folder, run `git init`, add a file, and make your first commit. Run
`git status` before and after the commit and describe how the output changes.

### Medium

Make changes to two files. Stage only one of them, then run `git status`. Explain which
file will and won't be in your next commit, and why.

### Challenging

Stage a file with `git add`, then modify it again without re-staging. Run `git status`
and read carefully — the same file appears under two headings. Explain what each heading
means and what `git commit` will actually record.

# Further Reading

- Pro Git, Chapter 2 — [Getting a Git Repository](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository) and [Recording Changes to the Repository](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)
- [`git add`](https://git-scm.com/docs/git-add), [`git commit`](https://git-scm.com/docs/git-commit), and [`git status`](https://git-scm.com/docs/git-status) references
