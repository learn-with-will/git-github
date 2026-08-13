---
id: lesson-18
slug: rewriting-history-safely
title: "Rewriting History Safely"
level: advanced
order: 18
duration: 18
tags:
  - rewrite-history
  - force-with-lease
  - filter-repo
  - secrets
summary: "Rewrite commits deliberately — amend, interactive rebase, and git filter-repo for whole-history surgery — while respecting shared history, force-pushing safely, and rotating leaked secrets."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain what "rewriting history" means and that it always changes commit hashes.
- Choose the right tool: `--amend`, interactive rebase, or `git filter-repo`.
- Force-push safely with `--force-with-lease` and know when force-pushing is acceptable.
- Handle a **leaked secret** correctly (rewrite **and** rotate).

# Why It Matters

Sometimes you must change the past: squash messy commits, drop a giant file that bloats every
clone, or purge a leaked API key. Git can do all of it — but rewriting history replaces commits
with new ones, which is disruptive if others share them, and it has a famous trap: removing a
secret from history does **not** make the secret safe. Doing this right protects both your
repo's integrity and your collaborators.

# Concept Explanation

### Rewriting = new commits

Every history-rewrite — `git commit --amend`, `git rebase` (including squash/interactive), and
bulk tools — produces **new commits with new hashes**. The old commits may linger (recoverable
via reflog for a while) but the branch now points at the rewritten ones.

### The three tools by scope

| Scope | Tool |
| ----- | ---- |
| Just the last commit | `git commit --amend` |
| A range of recent commits | `git rebase -i <base>` |
| The **entire** history (every commit) | `git filter-repo` |

**`git filter-repo`** is a separate, fast tool for surgery across all of history — for
example, removing a file from every commit:

```bash
git filter-repo --path secrets.txt --invert-paths   # remove secrets.txt from ALL history
```

> Git's own documentation recommends `git filter-repo` (or the BFG Repo-Cleaner) and
> **discourages the old `git filter-branch`**, which is slow and easy to misuse.

### The cardinal rule: don't rewrite shared history

Rewriting **local, unshared** commits is safe and routine. Rewriting commits others have pulled
forces them into a painful recovery. If you *must* rewrite already-pushed history (e.g. to purge
a secret), **coordinate with everyone first** — after the rewrite they'll need to re-clone or
hard-reset to the new history.

### Force-pushing safely

After rewriting pushed commits, the remote still has the old ones, so a normal push is rejected.
Update it with a **lease-checked** force push, which aborts if the remote moved unexpectedly:

```bash
git push --force-with-lease      # safer than --force
```

Use it only on **your own** branches — never on shared branches like `main`.

### Leaked secrets: rewrite *and* rotate

If a password, token, or key was committed, rewriting history removes it from future clones —
but you must still treat it as **compromised**. The secret may survive in other clones, forks,
CI logs, caches, and pull-request views. **Always rotate (revoke and replace) the secret**;
don't rely on the rewrite alone.

# Key Terminology

- **Rewrite history:** replace existing commits with new ones (new hashes).
- **`git filter-repo`:** the recommended tool for editing the entire history in bulk.
- **`filter-branch`:** the older, discouraged bulk-rewrite command.
- **`--force-with-lease`:** a force push that aborts if the remote changed unexpectedly.
- **Rotate a secret:** revoke the exposed credential and issue a new one.

# Options and Trade-offs

| Situation | Do this | Avoid |
| --------- | ------- | ----- |
| Fix your last (unpushed) commit | `git commit --amend` | Rewriting if already shared |
| Tidy recent local commits | `git rebase -i` | Rebasing shared history |
| Remove a file from all history | `git filter-repo` | `git filter-branch` (discouraged) |
| Update a rewritten own branch | `git push --force-with-lease` | `git push --force` on shared branches |
| A secret leaked | Rewrite **and** rotate it | Assuming the rewrite alone is enough |

# Worked Example

You discover `config/secret.key` was committed months ago and appears throughout history.

```bash
# 1) Remove it from EVERY commit
git filter-repo --path config/secret.key --invert-paths

# 2) Force-update the remote (coordinate with the team first!)
git push --force-with-lease --all
git push --force-with-lease --tags
```

```text
Parsed 412 commits
… config/secret.key removed from all history …
```

Then — critically — **rotate the key**: revoke the old one and issue a new one, because copies
may still exist in forks, clones, and caches. The rewrite shrinks exposure going forward; only
rotation makes the leaked value useless.

# Real World Analogy

Rewriting history is **editing earlier chapters of a book that's already in print**. If you're
the only one holding a copy, edit away. If others have copies, you can't just change yours —
you'd have to recall every printed copy and hand out the new edition (coordinate + re-clone).
And if a secret was printed on page 10, releasing a new edition without it doesn't help anyone
who already **photographed** the page — you must **change the lock** the secret opened (rotate
it).

# Examples

## Example 1 — Basic: local cleanup

Before pushing, a developer squashes and rewords their branch's commits with `git rebase -i`.
Nothing was shared, so the rewrite is completely safe.

**Why this works:** Rewriting unshared commits affects no one else; it's just tidying your own
draft.

## Example 2 — Real-world: shrink a bloated repo

A repo is huge because a 200 MB binary was committed and later deleted — but it's still in
history, so every clone downloads it. `git filter-repo` removes it from all history, and after a
coordinated force-push the repo is small again.

**Why this works:** `filter-repo` edits every commit, so the file is gone from history entirely,
not just from the latest commit.

## Example 3 — Trade-off / pitfall: "I deleted the secret, so it's safe"

Someone removes a leaked token from history and force-pushes, then leaves the token active. An
attacker who already cloned the repo (or saw it in a fork or CI log) still has a working token.

**Why this bites:** History rewriting reduces future exposure but can't recall copies that
already exist. A leaked secret must be **rotated**, full stop.

# Common Mistakes

- **Rewriting shared history** without coordinating — everyone else's clones diverge.
- **Using plain `git push --force`** on a branch others use, clobbering their commits.
- **Trusting a rewrite to secure a secret.** Always rotate the credential.
- **Reaching for `git filter-branch`,** which is discouraged; use `git filter-repo`.

# Best Practices

- Rewrite **only unshared** history freely; coordinate before touching shared history.
- Prefer **`--force-with-lease`** over `--force`, and only on your own branches.
- For whole-history surgery, use **`git filter-repo`** (or BFG), not `filter-branch`.
- On any leak, **rewrite *and* rotate** — rotation is the part that actually protects you.
- Keep secrets out of Git in the first place (env vars, secret managers, `.gitignore`).

# Summary

- Rewriting history (`--amend`, `rebase -i`, bulk tools) always creates **new commits with new
  hashes**.
- Match the tool to the scope: `--amend` (last commit), `rebase -i` (a range), **`git
  filter-repo`** (entire history; preferred over `filter-branch`).
- **Never rewrite shared history** without coordination; update your own rewritten branches with
  **`--force-with-lease`**.
- Removing a leaked secret from history is **not enough** — you must **rotate** it, because
  copies may persist elsewhere.

# Flash Cards

Q: What does rewriting history always do to the affected commits?
A: It replaces them with new commits that have new hashes.

Q: Which tool is recommended for removing a file from the entire history?
A: git filter-repo (the older git filter-branch is discouraged).

Q: Why prefer `git push --force-with-lease` over `git push --force`?
A: --force-with-lease aborts if the remote has commits you haven't seen, preventing you from clobbering someone else's work.

Q: After purging a leaked API key from all history and force-pushing, is the key safe?
A: No. Treat it as compromised and rotate it — copies may still exist in clones, forks, and caches.

Q: When is it safe to rewrite history freely?
A: When the commits are local and unshared. Rewriting shared history requires coordinating with everyone who has it.

Q: What's the golden safety step when a secret leaks into a repo?
A: Rotate the secret (revoke and replace it); rewriting history alone doesn't recall existing copies.

# Exercises

### Easy

On a throwaway branch, use `git rebase -i` to squash three commits into one. Confirm with
`git log` that the commit hashes changed, and explain why.

### Medium

Explain the difference in scope between `git commit --amend`, `git rebase -i`, and
`git filter-repo`, and give a realistic scenario that needs each.

### Challenging

Describe the complete, correct response to discovering an API key committed a year ago: how you
remove it from all history, how you update the shared remote (and what your teammates must do),
and why rotating the key is non-negotiable.

# Further Reading

- Pro Git, Chapter 7 — [Rewriting History](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History)
- [`git filter-repo`](https://github.com/newren/git-filter-repo) and GitHub Docs — [Removing sensitive data from a repository](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [`git push`](https://git-scm.com/docs/git-push) reference (`--force-with-lease`)
