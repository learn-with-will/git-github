---
slug: interactive-rebase
title: "Interactive Rebase: Curating History"
topic: rebasing-history
kind: technique
summary: "Curate, reword, squash, split, reorder, and drop commits using the powerful git rebase -i command."
tags: [interactive-rebase, history-editing, cli]
related: [rebase-fundamentals, golden-rule-of-rebasing, squash-and-merge-deep-dive]
---
> **In one line:** Use git rebase -i to edit commit messages, squash work-in-progress commits, and reorder history before sharing.

## The idea

Interactive rebase (`git rebase -i`) is Git's Swiss Army knife for history editing. It opens an editor displaying a todo list of commits, allowing you to rewrite your local commit history before opening a pull request or pushing to a shared repository.

When you run `git rebase -i HEAD~4`, Git presents the last 4 commits in chronological order (oldest first, unlike `git log`) with an action command preceding each commit:

| Command | Action | Practical Purpose |
|---|---|---|
| `pick` (or `p`) | Use commit as-is | Keep the commit untouched |
| `reword` (or `r`) | Use commit, but edit message | Fix typos or improve commit explanation |
| `edit` (or `e`) | Pause for amending | Amend file contents, split into two commits |
| `squash` (or `s`) | Melt commit into previous commit | Combine WIP commits; prompts for combined message |
| `fixup` (or `f`) | Melt commit into previous, discard message | Silently fold minor fixes or typos into prior commit |
| `drop` (or `d`) | Delete commit entirely | Remove accidental or experimental commits |

## See it

Clean up the last 3 local commits interactively:

```bash
# Start interactive rebase for the last 3 commits
git rebase -i HEAD~3

# In your editor, change 'pick' to your chosen action:
# pick 4a1e9f1 feat(auth): add user registration
# fixup 8b2d3c4 fix typo in email validation
# reword 9c3f4e5 docs: update api documentation

# Save and exit editor; Git executes each instruction sequentially
# Verify cleaned-up, professional log history
git log --oneline -n 2
```

## Go deeper

You can also reorder commits simply by changing the order of lines in the interactive rebase todo file. Git will replay the commits in the new order you defined. If you delete a line from the todo file entirely, Git treats that as a `drop` instruction and removes the commit from history.

> **Tip:** Use `fixup` instead of `squash` when folding small bug fixes or linting corrections into an earlier commit; `fixup` automatically discards the redundant commit message without opening an editor prompt.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

## Watch out

- Rebasing interactively on commits that have already been pushed to a shared remote branch.
- Accidentally deleting lines in the rebase todo list when you intended to keep the commits.

## Remember

- `git rebase -i` opens an interactive todo list for curating recent local commits.
- Use `reword` to fix commit messages, `squash`/`fixup` to combine commits, and `drop` to delete.
- Interactive rebase is your opportunity to turn messy local exploration into clean, professional history.
