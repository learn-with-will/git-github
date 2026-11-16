---
slug: conflict-anatomy-diff3
title: "Conflict Anatomy and `diff3` Style"
topic: conflict-resolution
kind: technique
summary: "Configure merge.conflictstyle diff3 to reveal the original common ancestor inside conflict markers, making resolutions obvious."
tags: [conflicts, diff3, troubleshooting]
related: [the-rebase-reversal, checkout-ours-theirs, git-rerere]
---
> **In one line:** Setting merge.conflictstyle to diff3 displays the common ancestor inside conflicts, clarifying why both sides changed.

## The idea

By default, Git's conflict markers show only two pieces of information: what your current branch has (`HEAD`) and what the incoming branch has.

```text
<<<<<<< HEAD
const PORT = 8080;
=======
const PORT = 9000;
>>>>>>> feature-network
```

Looking at this default display, you are missing the most critical piece of the puzzle: **What was the original code before either branch touched it?** Did someone change it from 3000 to 8080, or did someone change it from 8080 to 9000?

Enabling **`diff3` conflict style** solves this by adding a middle section (`|||||||`) showing the common ancestor snapshot from the `merge-base`.

With `diff3`, the conflict becomes instantly transparent:

```text
<<<<<<< HEAD
const PORT = 8080;
||||||| base
const PORT = 3000;
=======
const PORT = 9000;
>>>>>>> feature-network
```

Now you see clearly: the original port was 3000. `HEAD` changed it to 8080, while `feature-network` changed it to 9000. You now have the full context to make an informed decision.

| Conflict Style | Marker Sections | Information Shown |
|---|---|---|
| **Default (`merge`)** | `<<<<<<<`, `=======`, `>>>>>>>` | `ours` and `theirs` only |
| **`diff3`** | `<<<<<<<`, `|||||||`, `=======`, `>>>>>>>` | `ours`, **original base**, and `theirs` |
| **`zdiff3`** | Zealous `diff3` | Same as `diff3`, but trims common leading/trailing lines |

## See it

Configure `diff3` or `zdiff3` globally:

```bash
# Enable the modern zealous diff3 conflict style globally
git config --global merge.conflictstyle zdiff3

# Verify the setting is active
git config merge.conflictstyle

# When conflicts occur, inspect the 3-way hunk directly in your editor
git diff
```

## Go deeper

In Git 2.35+, Git introduced `zdiff3` ('zealous diff3'). Standard `diff3` can sometimes include surrounding lines in the conflict hunk that both branches agreed on. `zdiff3` trims away those matching lines, leaving only the genuinely disputed differences while retaining the base ancestor view.

> **Tip:** Set `merge.conflictstyle zdiff3` on day one; it transforms merge conflict resolution from guesswork into logical deductive reasoning.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

## Watch out

- Forgetting to delete the `||||||| base` marker and base code block when saving your manual conflict resolution.
- Attempting to resolve conflicts without knowing what the original code did.

## Remember

- Default conflict markers only show what both branches changed to, not what the code was originally.
- `diff3` and `zdiff3` add the common ancestor base block between `ours` and `theirs`.
- Use `git config --global merge.conflictstyle zdiff3` for clearer conflict analysis.
