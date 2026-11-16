---
slug: git-rerere
title: "Reusing Recorded Resolutions: `git rerere`"
topic: conflict-resolution
kind: tool
summary: "Enable git rerere to remember how you resolved conflicted hunks and automatically reapply identical resolutions in the future."
tags: [rerere, conflicts, productivity]
related: [conflict-anatomy-diff3, the-rebase-reversal, rebase-fundamentals]
---
> **In one line:** git rerere (Reuse Recorded Resolution) remembers how you resolved a merge conflict and replays the fix automatically.

## The idea

If you maintain a long-lived topic branch that you rebase regularly onto `main`, or if you test-merge topic branches into an integration branch, you often face a frustrating experience: resolving the exact same merge conflict again and again every time you rebase.

Git has a built-in feature designed specifically to eliminate this repetitive labor: **`rerere`** (**Re**use **Re**corded **Re**solution).

When `rerere` is enabled:
1. When a merge conflict occurs, Git takes a fingerprint of the conflicted hunk and records it in `.git/rr-cache/`.
2. When you resolve the conflict and commit it, Git records your resolution.
3. In any future merge or rebase where the exact same conflict hunk appears, **Git resolves it automatically**, stages or modifies the file with your recorded fix, and prints: `Resolved 'src/app.ts' using previous resolution.`

| Configuration Command | What It Does |
|---|---|
| `git config --global rerere.enabled true` | Enables automatic recording and replay of conflict resolutions |
| `git config --global rerere.autoupdate true` | Automatically stages files that `rerere` resolved cleanly |

## See it

Enable `rerere` and let Git handle recurring conflicts:

```bash
# Enable rerere globally across all your repositories
git config --global rerere.enabled true

# Optionally let rerere automatically stage resolved files
git config --global rerere.autoupdate true

# When rerere automatically resolves a conflict during a rebase:
# Notice the terminal output: "Resolved 'file.ts' using previous resolution."
git status
```

## Go deeper

`rerere` cache files live locally inside your `.git/rr-cache/` directory. They are never pushed to remote servers or shared with teammates. If you ever make an incorrect resolution and want `rerere` to forget it so you can re-resolve manually, run `git rerere forget <file>`.

> **Tip:** `rerere` is a game-changer for rebasing long-lived branches across dozens of upstream commits, saving hours of manual conflict re-application.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

Investing the time to configure disciplined defaults and learn primary flags pays compound dividends across every software project and team you collaborate with throughout your career.

## Watch out

- Recording a bad resolution with `rerere.enabled true`; Git will happily reapply the broken code in future conflicts until you run `git rerere forget`.
- Expecting `rerere` to be active by default; it is disabled out of the box and must be turned on explicitly.

## Remember

- `rerere` stands for 'Reuse Recorded Resolution'.
- Remembers manual conflict resolutions and automatically reapplies them when identical conflicts recur.
- Enable it once globally with `git config --global rerere.enabled true`.
