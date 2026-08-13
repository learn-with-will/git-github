---
id: lesson-14
slug: resolving-conflicts-in-depth
title: "Resolving Conflicts in Depth"
level: intermediate
order: 14
duration: 19
tags:
  - conflicts
  - ours-theirs
  - rerere
  - mergetool
summary: "Read conflicts precisely (including the ours/theirs reversal during a rebase), take a whole side with checkout --ours/--theirs, use mergetool, and let rerere replay repeated resolutions."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Read a conflict's **ours/theirs** sides — and know how they **flip during a rebase**.
- Resolve conflicts by hand or by taking a whole side with `--ours` / `--theirs`.
- Continue or abort a conflicted merge or rebase.
- Enable **`rerere`** to auto-replay repeated conflict resolutions.

# Why It Matters

You met basic conflicts in the merging lesson. In real work — long-lived branches, rebases,
repeated merges — conflicts get trickier, and one detail bites almost everyone: **during a
rebase, "ours" and "theirs" are the opposite of what you'd expect**. Getting comfortable with
the full toolkit turns conflicts from scary into routine.

# Concept Explanation

### Anatomy, revisited

```diff
<<<<<<< HEAD
timeout = 30
=======
timeout = 60
>>>>>>> feature
```

- Between `<<<<<<< HEAD` and `=======` is the **"ours"** side.
- Between `=======` and `>>>>>>> feature` is the **"theirs"** side.

To resolve, edit to the final content, **remove all three marker lines**, then `git add` the
file.

### The rebase reversal (read carefully)

- During a **merge**, `HEAD` (**ours**) is **your current branch**, and **theirs** is the
  branch you're merging in. Intuitive.
- During a **rebase**, Git checks out the target branch and **replays your commits onto it**.
  So `HEAD` (**ours**) is the **branch you're rebasing onto**, and **theirs** is **your own
  commit** being reapplied. It feels backwards — because your commit is the thing being
  "brought in."

Keep this straight or you'll accidentally throw away the wrong side.

### Taking a whole side

When you want one side entirely, don't hand-edit:

```bash
git checkout --ours  config.yml    # keep our side of this file
git checkout --theirs config.yml   # take their side of this file
git add config.yml
```

(Remember the rebase reversal when deciding which is which.)

### Tools and escape hatches

```bash
git status              # lists files under "Unmerged paths"
git diff                # shows the conflicting hunks
git mergetool           # open a configured visual merge tool
git merge --abort       # cancel a conflicted merge
git rebase --abort      # cancel a conflicted rebase
```

After resolving all files: `git commit` (to finish a merge) or `git rebase --continue` (to
finish a rebase).

### `rerere`: reuse recorded resolution

Enable **`rerere`** and Git remembers how you resolved a particular conflict; if the *same*
conflict appears again (common in long rebases or repeated merges of a long-lived branch),
Git replays your resolution automatically:

```bash
git config --global rerere.enabled true
```

# Key Terminology

- **Ours / theirs:** the two sides of a conflict — meaning depends on merge vs. rebase.
- **`git checkout --ours/--theirs`:** take one whole side of a conflicted file.
- **`git mergetool`:** launch a visual tool to resolve conflicts.
- **`--abort`:** cancel an in-progress merge or rebase.
- **`rerere`:** "reuse recorded resolution" — auto-replays past conflict fixes.
- **Modify/delete conflict:** one side edited a file the other deleted.

# Options and Trade-offs

| Approach | When to use | Watch out for |
| -------- | ----------- | ------------- |
| Hand-edit the markers | Overlapping logic needs a real merge | Slower; remove **all** markers |
| `checkout --ours/--theirs` | You want one side entirely | Easy to take the wrong side (rebase reversal) |
| `git mergetool` | A visual, three-pane view helps | Needs a tool configured |
| `rerere` | Repetitive, recurring conflicts | It replays *past* choices — review the result |

# Worked Example

You're rebasing `feature` onto `main` and hit a conflict in `config.yml`.

```bash
git switch feature
git rebase main
```

```text
CONFLICT (content): Merge conflict in config.yml
```

Open the file:

```diff
<<<<<<< HEAD
timeout = 30      (this is main's value — "ours" during a rebase)
=======
timeout = 60      (this is your feature commit — "theirs")
>>>>>>> Add longer timeout
```

You want your feature's value (`60`). Edit to a single clean line, remove the markers, then:

```bash
git add config.yml
git rebase --continue
```

Had you reflexively run `git checkout --ours config.yml`, you'd have kept `main`'s `30` and
silently discarded your change — the rebase reversal in action.

# Real World Analogy

A conflict is two editors rewriting the same paragraph and handing you both versions to
reconcile. **`rerere`** is a diligent assistant who, once you've settled a recurring
argument ("we always keep the Oxford comma here"), remembers your decision and applies it
automatically the next time the same dispute comes up — saving you from re-deciding the same
thing during a long rebase.

# Examples

## Example 1 — Basic: a clean manual resolve

Two branches changed the same function differently. The developer reads both sides, writes a
combined version that keeps both intents, removes the markers, `git add`s, and commits. Done.

**Why this works:** Overlapping *logic* needs a human to synthesize both sides — exactly what
manual resolution is for.

## Example 2 — Real-world: rerere on a long rebase

Rebasing a large, long-lived branch surfaces the same conflict on several commits. With
`rerere` enabled, the developer resolves it once and Git auto-applies that resolution to each
recurrence.

**Why this works:** `rerere` records the resolution and replays it, removing repetitive
busywork from big rebases.

## Example 3 — Trade-off / pitfall: wrong side during a rebase

A developer rebases and runs `git checkout --theirs` expecting to keep `main`'s version — but
during a rebase, `--theirs` is **their own commit**, so they get the opposite of what they
intended.

**Why this bites:** The ours/theirs meaning flips between merge and rebase. Always confirm
which side each label refers to before taking a whole side.

# Common Mistakes

- **Assuming ours/theirs mean the same in rebase as in merge.** They're reversed during a
  rebase.
- **Taking a whole side and losing needed changes** from the other.
- **Committing a file that still contains markers.** Search for `<<<<<<<` before finishing.
- **Forgetting `git rebase --continue`** (or `git commit`) after resolving.

# Best Practices

- **Read both sides** before editing; prefer manual resolution for overlapping logic.
- Confirm the **ours/theirs** meaning for your situation (merge vs. rebase) before using
  `--ours`/`--theirs`.
- **Test** after resolving — a merge can be clean yet wrong.
- Turn on **`rerere`** to avoid re-resolving recurring conflicts.
- Keep branches **short and rebase/merge often** so conflicts stay small.

# Summary

- A conflict shows **ours** (`HEAD…=======`) and **theirs** (`=======…>>>>>>>`); resolve, remove
  all markers, then `git add`.
- **During a rebase the sides flip:** `HEAD`/ours is the branch you're rebasing **onto**, and
  theirs is **your commit** being replayed.
- Take a whole side with `git checkout --ours/--theirs`; escape with `git merge --abort` or
  `git rebase --abort`; finish with `git commit` or `git rebase --continue`.
- **`rerere`** records and replays your resolutions for recurring conflicts.

# Flash Cards

Q: In a conflict, what sits between ======= and >>>>>>>?
A: The "theirs" side — the incoming version (during a merge) or your replayed commit (during a rebase).

Q: How do ours/theirs differ between a merge and a rebase?
A: In a merge, ours (HEAD) is your current branch. In a rebase, ours is the branch you're rebasing onto, and theirs is your own commit being reapplied — the labels are reversed.

Q: What does `git rerere` do?
A: It records how you resolve a conflict and automatically replays that resolution if the same conflict recurs.

Q: How do you take an entire side of a conflicted file?
A: git checkout --ours <file> or git checkout --theirs <file>, then git add it.

Q: After resolving conflicts during a rebase, how do you proceed?
A: git rebase --continue (or git rebase --abort to cancel the whole rebase).

Q: How can you tell a file still has an unresolved conflict?
A: It still contains conflict markers (<<<<<<<, =======, >>>>>>>); git status also lists it under "Unmerged paths."

# Exercises

### Easy

Create a content conflict by changing the same line on two branches, then merge and resolve
it by hand. Confirm no markers remain, then complete the merge.

### Medium

Enable `rerere` (`git config rerere.enabled true`), create a conflict, resolve it, then
recreate the same conflict and observe Git replaying your resolution. Describe what happened.

### Challenging

Reproduce the rebase reversal: rebase a branch that conflicts with `main`, and use
`git checkout --ours`/`--theirs` — first taking the wrong side, then the right one. Explain
precisely which side each label referred to and why it's the opposite of a merge.

# Further Reading

- Pro Git, Chapter 3 — [Basic Merge Conflicts](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging#_basic_merge_conflicts)
- Pro Git, Chapter 7 — [Rerere](https://git-scm.com/book/en/v2/Git-Tools-Rerere)
- [`git mergetool`](https://git-scm.com/docs/git-mergetool) and [`git rerere`](https://git-scm.com/docs/git-rerere) references
