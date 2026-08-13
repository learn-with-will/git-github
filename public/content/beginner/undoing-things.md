---
id: lesson-05
slug: undoing-things
title: "Undoing Things"
level: beginner
order: 5
duration: 20
tags:
  - undo
  - git-restore
  - git-reset
  - git-revert
  - amend
summary: "Fix mistakes safely: amend the last commit, unstage and discard changes with git restore, understand the three git reset modes, and undo shared commits with git revert."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Fix the most recent commit with `git commit --amend`.
- Unstage and discard changes with `git restore`.
- Explain the three `git reset` modes — `--soft`, `--mixed`, `--hard` — and which touch your files.
- Choose between `git reset` and `git revert`, and know which is safe on shared history.
- Recognize which undo commands can **destroy work** and act carefully around them.

# Why It Matters

Everyone makes mistakes: a typo in a commit message, a file staged too early, a commit
that should never have happened. Git can undo almost all of it — but the undo commands
range from perfectly safe to permanently destructive, and they look deceptively similar.
Knowing which is which is the difference between a calm fix and a lost afternoon.

# Concept Explanation

### Fix the last commit: `git commit --amend`

Forgot a file, or wrote a bad message? Stage anything you missed, then:

```bash
git add forgotten-file.txt
git commit --amend -m "Add feature with its config"
```

This **replaces** the previous commit with a new one (new hash). It's great for the
commit you *just* made — but because it rewrites that commit, **don't amend a commit
you've already pushed** and others have pulled.

### Unstage and discard: `git restore`

`git restore` is the modern, purpose-built command for the working tree and the index:

```bash
git restore --staged file.txt   # unstage: keep the edit, remove it from staging
git restore file.txt            # DISCARD unstaged edits to file.txt (destructive!)
```

The second form throws away your uncommitted changes to that file — there's no undo, so
be sure. (Older guides use `git reset HEAD file` to unstage and `git checkout -- file`
to discard; `restore` does both jobs more clearly.)

### Move the branch: `git reset`

`git reset` moves the current branch to point at a different commit. What happens to your
files depends on the mode:

| Mode | Moves the branch? | Staging area | Working tree | Result |
| ---- | ----------------- | ------------ | ------------ | ------ |
| `--soft` | Yes | Unchanged | Unchanged | The commit's changes become **staged** |
| `--mixed` (default) | Yes | Reset to target | Unchanged | The changes become **unstaged** |
| `--hard` | Yes | Reset to target | **Reset to target** | The changes are **discarded** |

So `git reset --soft HEAD~1` "uncommits" the last commit but keeps its changes ready to
re-commit, while `git reset --hard HEAD~1` deletes the last commit **and** its changes
from your working tree. `--hard` is the one that loses work.

### Undo safely on shared history: `git revert`

`git revert <commit>` doesn't remove anything. It creates a **new commit** that applies
the inverse of the target commit — cleanly undoing its effect while leaving history
intact.

```bash
git revert a1b2c3d      # makes a new "Revert …" commit
```

Because it only adds to history (never rewrites it), `revert` is the **safe** way to undo
a commit that has already been pushed and shared. `reset` rewrites which commits a branch
contains, so using it on shared history forces everyone else into a messy recovery.

> Reassurance: even a bad `reset` on **commits** is usually recoverable via the *reflog*
> (a later lesson). But changes that were never committed and get wiped by `reset --hard`
> or `restore` are gone. Commit early; it's your safety net.

# Key Terminology

- **`git commit --amend`:** replace the most recent commit with a new one.
- **`git restore`:** discard working-tree edits, or unstage with `--staged`.
- **`git reset`:** move the current branch to another commit; `--soft`/`--mixed`/`--hard`
  decide what happens to the index and working tree.
- **`git revert`:** add a new commit that undoes a previous one.
- **Destructive:** an operation that can permanently lose uncommitted work
  (`reset --hard`, `restore <file>`).
- **`HEAD~1`:** "one commit before `HEAD`" (the previous commit).

# Options and Trade-offs

| Goal | Command | Safe? |
| ---- | ------- | ----- |
| Fix the last commit's message/content | `git commit --amend` | Safe if **not pushed** |
| Unstage a file (keep the edit) | `git restore --staged <file>` | Safe |
| Throw away unstaged edits to a file | `git restore <file>` | **Destructive** |
| Uncommit but keep changes staged | `git reset --soft HEAD~1` | Safe (local) |
| Delete the last commit and its changes | `git reset --hard HEAD~1` | **Destructive** |
| Undo a commit that's already shared | `git revert <commit>` | Safe on shared history |

# Worked Example

You just committed, then realize you forgot to include a file — and the message has a
typo. Nothing has been pushed yet.

```bash
git add config.yml          # the file you forgot
git commit --amend -m "Add server with config"
```

```text
[main 7a6b5c4] Add server with config
 2 files changed, 12 insertions(+)
```

The old commit is replaced by one that includes `config.yml` and the corrected message.

Now imagine instead the commit was already **pushed** and a teammate pulled it. Amending
or resetting would rewrite shared history. Instead you undo it forward:

```bash
git revert 7a6b5c4
```

```text
[main 9d8c7b6] Revert "Add server with config"
```

History now reads: the commit happened, then a later commit undid it — honest and safe
for everyone.

# Real World Analogy

Think of your project history as a **published ledger**.

- `git revert` writes a new correcting entry: "Entry #42 was a mistake; here is the
  reversal." The original stays visible. Anyone reading along stays in sync.
- `git reset` **tears pages out** of the ledger. Fine in your private draft, but chaos if
  others are reading from copies of the same book.
- `git reset --hard` tears out pages *and* shreds the loose notes on your desk — the
  uncommitted work you hadn't written into the ledger yet.

# Examples

## Example 1 — Basic: fix a commit message

You commit with the message "updte readme". Before pushing, you run
`git commit --amend -m "Update README"`. The typo is gone and no one ever sees it.

**Why this works:** Amending a not-yet-pushed commit is local surgery — safe and clean.

## Example 2 — Real-world: uncommit but keep the work

You committed too early — the feature isn't done. `git reset --soft HEAD~1` removes the
commit but leaves all its changes **staged**, so you keep working and commit again when
it's actually finished.

**Why this works:** `--soft` moves only the branch pointer; your files are untouched, so
nothing is lost.

## Example 3 — Trade-off / pitfall: `reset --hard` on uncommitted work

Frustrated with some experiments, you run `git reset --hard`. It discards **all**
uncommitted changes in the working tree instantly. The commits you'd made are
recoverable via the reflog, but the experiments you never committed are simply gone.

**Why this bites:** `--hard` rewrites the working tree to match the target commit with no
confirmation. Reach for it only when you're certain you want to throw current changes
away.

# Common Mistakes

- **Amending or resetting commits that are already pushed.** You rewrite shared history;
  use `git revert` instead.
- **Running `git reset --hard` with uncommitted work you actually wanted.** It's gone —
  commit or `git stash` first.
- **Confusing `reset` and `revert`.** `reset` moves the branch backward (rewrites
  history); `revert` adds a forward undo commit (safe to share).
- **Forgetting that `git restore <file>` discards edits.** Double-check the filename and
  that you mean it.

# Best Practices

- On anything **pushed or shared**, undo with **`git revert`**.
- Prefer **`git restore`** for unstaging/discarding — its intent is clearer than
  `reset`/`checkout`.
- **Commit (or `git stash`) before risky operations** so nothing important is
  uncommitted when you run a `--hard`.
- Say `HEAD~1`, `HEAD~2`, … to target "N commits back" precisely.
- When unsure, remember the reflog can rescue lost **commits** — but not lost uncommitted
  changes.

# Summary

- `git commit --amend` replaces the last commit — safe only if you haven't pushed it.
- `git restore --staged <file>` unstages; `git restore <file>` **discards** unstaged
  edits (destructive).
- `git reset` moves the branch: `--soft` keeps changes staged, `--mixed` (default) keeps
  them unstaged, `--hard` **discards** them.
- `git revert` adds a new commit that undoes an old one — the **safe** choice for shared
  history, because it never rewrites the past.
- Commit early; the reflog can recover lost commits, but never uncommitted changes.

# Flash Cards

Q: What does `git revert <commit>` do?
A: It creates a new commit that applies the inverse of the target commit, undoing its effect while leaving history intact.

Q: Which `git reset` mode discards changes in the working tree?
A: --hard. It resets both the staging area and the working tree to the target commit, throwing away uncommitted work.

Q: What does `git reset --soft HEAD~1` accomplish?
A: It removes the last commit but keeps all of its changes staged, ready to be re-committed.

Q: Why prefer `git revert` over `git reset` on a pushed commit?
A: revert adds a forward undo commit without rewriting history, so shared branches stay consistent; reset would rewrite history others already have.

Q: What's the modern command to unstage a file while keeping your edits?
A: git restore --staged <file>.

Q: Is it safe to `git commit --amend` a commit you've already pushed?
A: No — amend rewrites that commit, diverging from the shared copy. Use git revert instead.

# Exercises

### Easy

Make a commit with a deliberately misspelled message. Before pushing, correct it with
`git commit --amend`. Confirm with `git log --oneline` that only the fixed commit remains.

### Medium

Commit some changes, then run `git reset --soft HEAD~1`. Use `git status` to show the
changes are staged again. Explain what would have differed had you used `--mixed` or
`--hard`.

### Challenging

A commit you pushed yesterday introduced a bug and teammates have already pulled it.
Describe, with the exact command, how to undo its effect without rewriting shared history,
and explain why `git reset` would be the wrong tool here.

# Further Reading

- Pro Git, Chapter 2 — [Undoing Things](https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things)
- Pro Git, Chapter 7 — [Reset Demystified](https://git-scm.com/book/en/v2/Git-Tools-Reset-Demystified)
- [`git restore`](https://git-scm.com/docs/git-restore), [`git reset`](https://git-scm.com/docs/git-reset), and [`git revert`](https://git-scm.com/docs/git-revert) references
