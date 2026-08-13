# Git & GitHub Study Pathway
### A Comprehensive, Phase-by-Phase Curriculum

> **Based on:** *Pro Git* (2nd ed., Chacon & Straub, free at git-scm.com/book), the
> official Git reference (git-scm.com/docs), GitHub Docs (docs.github.com) including
> GitHub Actions, and — for the versioning lesson — Semantic Versioning (semver.org)
> and Conventional Commits (conventionalcommits.org).
> **Approach:** teach Git the tool first, then GitHub the platform, then the power
> tools and automation. Every command and behavior is verified against a primary
> source; where reasonable people disagree (merge vs rebase), it is taught as a
> trade-off, not a rule.
> **Language:** plain and welcoming; every term is defined the first time it appears.
> No prior version-control knowledge assumed.

---

## Phase 1 — Beginner: Git Fundamentals

**Goal:** Get comfortable with Git on your own machine — make commits, read history,
undo mistakes, branch, merge, and sync with a remote.
**Exit criteria:** You can initialize a repository, stage and commit changes, read and
ignore history, undo common mistakes safely, create and merge a branch (resolving a
conflict), and push/pull from a remote.

1. **What Is Version Control?** — what a version-control system is; local vs
   centralized vs **distributed** (Git); why Git stores **snapshots, not diffs**; the
   crucial **Git ≠ GitHub** distinction; a little history (Torvalds, 2005).
2. **Installing & Configuring Git** — installing per OS; `git config` and its three
   levels (system / global / local); setting `user.name` / `user.email`;
   `init.defaultBranch`; checking settings with `git config --list`.
3. **The Three States & Your First Commit** — the working tree, the **staging area
   (index)**, and the repository; `git init`, `git status`, `git add`, `git commit`;
   what a commit actually is (a snapshot + metadata + parent + hash).
4. **Viewing & Ignoring History** — `git log` (and useful options), `git diff` (working
   vs staged vs committed), and **`.gitignore`** patterns (and why it only affects
   untracked files).
5. **Undoing Things** — `git commit --amend`, `git restore` / `git restore --staged`,
   `git reset` (`--soft` / `--mixed` / `--hard`), and `git revert`; which are safe and
   which destroy work.
6. **Branching Basics** — a branch as a **movable pointer**; `HEAD`; `git branch`,
   `git switch` / `git switch -c` (and the `git checkout` equivalents); detached HEAD.
7. **Merging & Conflicts** — **fast-forward vs three-way merge**; the merge commit and
   its two parents; what a conflict is; reading conflict markers, resolving, and
   `git merge --abort`.
8. **Working with Remotes** — `git clone`; `git remote`; `origin` and tracking
   branches; **`git fetch` vs `git pull`** (fetch + merge); `git push`.

---

## Phase 2 — Intermediate: GitHub & Collaboration

**Goal:** Use GitHub to collaborate — publish repositories, propose changes with pull
requests, contribute to other people's projects, and manage work with issues and
releases.
**Exit criteria:** You can authenticate to GitHub, push a repo, open and review a pull
request, fork and contribute upstream, choose a merge strategy deliberately, rebase and
resolve conflicts confidently, track work with issues, and cut a tagged release.

9. **Meet GitHub: Repositories & Authentication** — Git vs GitHub again, in practice;
   creating and cloning repos; **HTTPS + Personal Access Token** vs **SSH keys** (no
   account passwords for Git operations); README and license.
10. **The GitHub Flow: Branches & Pull Requests** — the lightweight GitHub flow; feature
    branch → push → open a **pull request** → review → merge; what a PR is (a GitHub
    feature) and how it maps to Git.
11. **Forking & Contributing to Open Source** — what a **fork** is (a server-side copy);
    the **`upstream`** remote; keeping a fork in sync; the etiquette of a good
    contribution.
12. **PR Merge Strategies: Merge, Squash & Rebase** — GitHub's three merge-button
    options, exactly what each does to history, and when to pick which.
13. **Rebasing** — `git rebase`; **interactive rebase** (`pick` / `reword` / `squash` /
    `fixup` / `drop` / reorder); rebase vs merge as a trade-off; the **Golden Rule of
    Rebasing**.
14. **Resolving Conflicts in Depth** — the anatomy of a conflict; strategies and tools;
    `git rerere`; aborting vs continuing during a merge or rebase.
15. **Issues, Labels, Milestones & Projects** — tracking work on GitHub; labels,
    milestones, and Projects; **linking issues to PRs** with closing keywords.
16. **Tags, Releases & Semantic Versioning** — **lightweight vs annotated tags**;
    `git tag` and pushing tags; GitHub Releases; **Semantic Versioning**
    (MAJOR.MINOR.PATCH) as a convention.

---

## Phase 3 — Advanced: Power Tools & Automation

**Goal:** Reach for the sharper tools with confidence — rescue lost work, rewrite
history safely, hunt bugs through history, manage big/multi-repo projects, understand
what Git is doing under the hood, and automate quality with GitHub Actions.
**Exit criteria:** You can stash and cherry-pick, recover with the reflog, rewrite
history without endangering shared branches, find a regression with bisect, reason
about Git's object model, and stand up a CI workflow with branch protection.

17. **Stash, Cherry-pick & Reflog** — `git stash` for work-in-progress; `git cherry-pick`
    to copy a commit; **`git reflog`** as the safety net that recovers "lost" commits.
18. **Rewriting History Safely** — interactive rebase in depth; **`--force-with-lease`**
    vs `--force`; `git filter-repo` for large surgery (and why `filter-branch` is
    discouraged); when rewriting is and is not allowed.
19. **Debugging History: bisect & blame** — **`git bisect`** (binary search for the
    commit that introduced a bug); `git blame` (who last changed each line); the pickaxe
    (`git log -S`).
20. **Submodules & Git LFS** — **submodules** (a repo inside a repo, pinned to a commit);
    **Git LFS** (pointer files for large binaries); when each helps and when it hurts.
21. **Git Internals: Objects, Refs & the DAG** — the four object types (blob, tree,
    commit, tag), content-addressing by hash, refs and `HEAD`, and the commit **DAG**;
    peeking with `git cat-file` and the `.git` directory.
22. **GitHub Actions: CI Basics** — workflows, **events/triggers**, **jobs**, **steps**,
    and **runners**; writing a minimal "run the tests on every push" pipeline in YAML.
23. **Guarding `main`: Branch Protection, Reviews & Hooks** — branch protection rules /
    rulesets; required reviews and status checks; **CODEOWNERS**; client-side **git
    hooks** (e.g. `pre-commit`) and a note on the pre-commit framework.
24. **Team Workflows — Capstone** — **Git Flow vs GitHub Flow vs trunk-based
    development**; commit-message conventions (Conventional Commits); tying a full
    feature lifecycle together from branch to release.

---

## How to use this pathway

- **Don't skip.** Phase 2 assumes you can branch, merge, and use a remote; Phase 3
  assumes you understand branches, merges, and rebases. Pull requests build on branching
  and remotes; rebasing builds on merging; internals explain everything before it.
- **Type the commands.** Git is a skill of the hands. Every lesson's exercises are
  safe-to-try tasks in a throwaway repository — run them.
- **Know what's reversible.** Most of Git is recoverable (that's what the reflog is
  for); a few commands (`reset --hard`, `push --force`, history rewrites) can lose work.
  The lessons flag these every time.
- **Take the quizzes.** Every lesson has a quiz; a passing score means the ideas landed.
- **Verify against the sources.** When unsure what a flag does, check the git-scm man
  page or Pro Git — accuracy over assumption.
