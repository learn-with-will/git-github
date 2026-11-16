---
slug: submodule-pitfalls-and-workflows
title: "Submodule Workflows and Gotchas"
topic: debugging-large-repos
kind: pitfall
summary: "Navigate submodule traps: detached HEAD checkouts, unpushed sub-repo commits, and updating submodule pointers cleanly."
tags: [submodules, pitfalls, troubleshooting]
related: [git-submodules, head-and-detached-head, git-lfs]
---
> **In one line:** Submodules check out in detached HEAD by default; always push submodule commits before pushing the parent repository.

## The idea

Git submodules are notorious among developers for causing friction. Most submodule issues arise from two fundamental behaviors:

1. **Submodules check out in detached HEAD:** When you run `git submodule update`, Git checks out the exact pinned commit hash recorded by the parent project. It does *not* check out a branch. If you enter the submodule directory and edit code, any commits you make will be in a detached HEAD state!
2. **The unpushed submodule commit trap:** If you make a commit inside a submodule, update the parent project pointer to that new hash, and push the parent project—**but forget to push the submodule**—collaborators will be blocked! When they pull the parent project, Git attempts to check out the new hash, but the submodule server has never seen it, causing clone errors.

| Workflow Step | Parent Action | Submodule Action |
|---|---|---|
| **Pulling Updates** | `git pull` | `git submodule update --init --recursive` |
| **Updating Pointer** | `git commit -m "Bump submodule"` | `git switch main && git pull` inside submodule |
| **Pushing Work** | `git push` (push **second**) | `git push` inside submodule (push **first!**) |

## See it

Update a submodule cleanly and verify safe push order:

```bash
# Update submodule to latest upstream release
cd libs/shared-ui
git switch main
git pull origin main

# Return to parent repo and inspect the updated pointer
cd ../..
git diff libs/shared-ui

# Stage and commit the updated submodule commit pointer
git commit -am "chore: update shared-ui to latest release"

# Ensure Git checks that submodule commits are pushed before parent pushes:
git push --recurse-submodules=check
```

## Go deeper

Setting `git config --global push.recurseSubmodules check` is an essential safety guard. It instructs Git to verify that all submodule commits referenced by the parent project have been pushed to their respective remotes before allowing the parent project push to succeed.

> **Tip:** Modern package managers (npm, Cargo, Go modules, Pip) are usually simpler than submodules. Prefer native package managers when available; reserve submodules for language-agnostic or compiled C/C++ dependencies.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

## Watch out

- Pushing the parent repository when the submodule has unpushed commits; teammates' builds will fail.
- Editing code inside a submodule without switching to an active branch first.

## Remember

- Submodules are checked out in a detached HEAD state by default.
- Always push commits inside the submodule before pushing the parent repository.
- Use `git push --recurse-submodules=check` to prevent pushing orphaned pointer references.
