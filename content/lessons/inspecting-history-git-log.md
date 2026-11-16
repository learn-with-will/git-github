---
slug: inspecting-history-git-log
title: "Inspecting History with `git log`"
topic: basics-workflow
kind: technique
summary: "Navigate project history using git log with compact oneline formatting, branch graphs, and patch inspection."
tags: [git-log, history, cli]
related: [formatting-and-filtering-logs, comparing-changes-git-diff, creating-snapshots-git-commit]
---
> **In one line:** Use git log to inspect the commit graph, view authors and timestamps, and trace code evolution.

## The idea

The `git log` command is your window into the repository's historical graph. By default, typing `git log` lists all commits reachable from your current `HEAD` in reverse chronological order, including full 40-character SHA hashes, author names, dates, and commit messages.

Because raw logs can span thousands of commits, Git displays them through a pager (usually `less`). You can press `Space` to scroll down, `b` to scroll up, `/` to search for text, and `q` to quit back to your terminal prompt.

| Command Option | What It Displays | Primary Use Case |
|---|---|---|
| `git log --oneline` | Short hash and subject line only | Quick overview of recent commits |
| `git log -p` | Full patch diff introduced by each commit | Detailed code review of changes |
| `git log --stat` | List of modified files with insertion/deletion counts | High-level scope and file impact check |
| `git log --graph` | ASCII visual branch and merge graph | Understanding branch divergence and merges |

## See it

Examine different perspectives of your project history:

```bash
# View compact one-line history for the last 5 commits
git log --oneline -n 5

# Display ASCII branch graph with short hashes and branch decorations
git log --graph --oneline --decorate --all -n 10

# Inspect exact code diffs introduced in the latest 2 commits
git log -p -n 2

# Inspect file modification statistics per commit
git log --stat -n 3
```

## Go deeper

You can combine flags into powerful everyday aliases. A common community favorite is `git log --graph --oneline --decorate --all`, which visualizes every branch, tag, and merge in your local repository as an ASCII tree.

> **Tip:** In any paginated `git log` view, press `q` to immediately return to your terminal shell.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

Investing the time to configure disciplined defaults and learn primary flags pays compound dividends across every software project and team you collaborate with throughout your career.

## Watch out

- Panicking when your terminal appears 'frozen' in `git log`; it is simply waiting in the pager (`less`)—press `q`.
- Assuming `git log` shows uncommitted working tree edits; `git log` inspects committed history only.

## Remember

- `git log` displays commits reachable from the current `HEAD` in reverse chronological order.
- Use `--oneline` for concise overviews and `--graph` to visualize branch topologies.
- Press `q` to exit the terminal pager.
