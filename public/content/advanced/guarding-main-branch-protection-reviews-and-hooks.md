---
id: lesson-23
slug: guarding-main-branch-protection-reviews-and-hooks
title: "Guarding main: Branch Protection, Reviews & Hooks"
level: advanced
order: 23
duration: 18
tags:
  - branch-protection
  - code-review
  - codeowners
  - git-hooks
summary: "Protect important branches with server-side rules (required PRs, reviews, and status checks), route reviews with CODEOWNERS, and get fast local feedback from git hooks."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Configure **branch protection** to require pull requests, reviews, and passing checks.
- Use a **CODEOWNERS** file to require review from specific people.
- Write a client-side **git hook** (like `pre-commit`) for local checks.
- Explain why hooks are **not** an enforcement mechanism, and what is.

# Why It Matters

Keeping `main` healthy isn't about trusting everyone to be careful — it's about **guardrails**
that make the safe path the default. GitHub's **branch protection** enforces review and passing
tests before anything merges, while **git hooks** give you fast feedback *before* you even commit.
Knowing which is enforced (server-side) and which is a convenience (client-side) is the key
insight.

# Concept Explanation

### Branch protection (server-side, enforced)

**Branch protection rules** (and the newer **rulesets**) guard important branches like `main`.
Common options:

- **Require a pull request** before merging (no direct pushes to `main`).
- **Require approvals** — e.g. at least one reviewer must approve.
- **Require status checks to pass** — the PR can't merge until CI is green.
- **Require the branch to be up to date** with the base before merging.
- **Restrict who can push**, and **block force-pushes and deletions**.
- Optionally **require signed commits** or **linear history**.

These run on GitHub's servers, so contributors **can't bypass** them.

### CODEOWNERS: route required reviews

A **`CODEOWNERS`** file maps file paths to owners:

```text
# path            owner(s)
/src/payments/    @acme/payments-team
*.sql             @db-admin
```

Combined with "require review from Code Owners," any PR touching those paths **must** be approved
by the listed owner — so the right experts see the right changes.

### Git hooks (client-side, convenient but bypassable)

**Git hooks** are scripts Git runs at lifecycle points. They live in `.git/hooks/` (with
`.sample` examples). The most common is **`pre-commit`**, which runs *before* a commit is created
and can **abort** it if a check fails:

```bash
# .git/hooks/pre-commit  (make it executable)
#!/bin/sh
npm run lint || exit 1     # block the commit if linting fails
```

Other hooks include `commit-msg` (validate the message) and `pre-push`.

**Two crucial caveats:**

1. Hooks in `.git/hooks/` are **local and not versioned** — they don't travel with a clone. Teams
   share hooks using tools like the **pre-commit framework** or **Husky**, which install hooks
   from versioned config.
2. Client hooks can be **skipped** (`git commit --no-verify`). So they're a **convenience for fast
   feedback**, *not* a security gate. Real enforcement lives in **branch protection + required
   CI** on the server.

# Key Terminology

- **Branch protection / ruleset:** server-side rules guarding a branch.
- **Required status check:** a CI check that must pass before merging.
- **CODEOWNERS:** a file mapping paths to required reviewers.
- **Git hook:** a local script Git runs at a lifecycle point (e.g. `pre-commit`).
- **`--no-verify`:** the flag that skips client-side hooks.

# Options and Trade-offs

| Mechanism | Where it runs | Enforced? | Good for |
| --------- | ------------- | --------- | -------- |
| Branch protection / required checks | GitHub server | **Yes** — can't be bypassed | The real gate on `main` |
| Required reviews / CODEOWNERS | GitHub server | Yes | Ensuring the right people approve |
| Client-side hooks (`pre-commit`) | Your machine | No (`--no-verify` skips) | Fast local feedback before committing |

# Worked Example

Lock down `main` and add local pre-commit feedback.

**On GitHub (branch protection for `main`):**

- Require a pull request with **1 approval**.
- Require the **CI** status check to pass.
- **Block force-pushes** and direct pushes.

Now nobody can push straight to `main`; every change goes through a reviewed, tested PR.

**Locally (fast feedback before committing):**

```bash
# .git/hooks/pre-commit
#!/bin/sh
npm run lint && npm test || {
  echo "Lint/tests failed — commit aborted."
  exit 1
}
```

The hook catches problems on your machine in seconds; branch protection guarantees the same
standards for everyone, even if someone skips the hook with `--no-verify`.

# Real World Analogy

Branch protection is the **bouncer at the door of `main`**, checking the guest list — reviews
approved, checks green — and refusing anyone who doesn't qualify. You can't sweet-talk the
bouncer. A **pre-commit hook** is your **own pre-flight checklist** before you leave the house:
genuinely useful, but you *can* choose to skip it. **CODEOWNERS** is the rule that "any change to
the vault requires the head of security to sign off."

# Examples

## Example 1 — Basic: a linting pre-commit hook

A developer adds a `pre-commit` hook that runs the linter. Typos and style slips are caught before
they ever become commits, keeping their local history clean.

**Why this works:** Hooks give instant, local feedback at the exact moment you commit — the
cheapest place to fix a problem.

## Example 2 — Real-world: a protected main

A team protects `main`: PR required, one approval, green CI, no force-pushes, and CODEOWNERS
routing database changes to the DBA. `main` stays releasable and the right eyes see risky changes.

**Why this works:** Server-side rules apply to everyone uniformly and can't be skipped, so the
branch's health doesn't depend on individual discipline.

## Example 3 — Trade-off / pitfall: trusting hooks for enforcement

A team relies only on a shared `pre-commit` hook to run tests — but a contributor commits with
`--no-verify`, and another never installed the hook. Broken code reaches `main` because there was
no server-side check.

**Why this bites:** Client hooks are local and bypassable. Without branch protection + required
CI, there's no real gate — only a suggestion.

# Common Mistakes

- **Treating client-side hooks as security.** They're bypassable (`--no-verify`) and not shared by
  default.
- **Not versioning/sharing hooks,** so they run for some people and not others (use a framework).
- **No branch protection,** leaving `main` open to direct pushes and force-pushes.
- **Requiring a status check that doesn't exist,** which blocks *all* merges until it's fixed.

# Best Practices

- **Protect `main`:** require PRs, at least one review, and passing status checks; block
  force-pushes and deletions.
- Use **CODEOWNERS** to require the right reviewers for sensitive paths.
- Use client-side hooks (via a **framework** so they're shared) for **fast local feedback**.
- Remember the division of labor: **hooks help individuals; branch protection + CI enforce the
  team standard.**

# Summary

- **Branch protection / rulesets** are **server-side, enforced** guards on a branch: require PRs,
  reviews, and passing checks; block force-pushes.
- **CODEOWNERS** requires review from specific owners for the paths they own.
- **Git hooks** (e.g. `pre-commit`) run locally for fast feedback but are **not versioned by
  default** and can be **bypassed** with `--no-verify`.
- Enforcement lives **server-side** (branch protection + required CI); hooks are a convenience,
  not a gate.

# Flash Cards

Q: What do branch protection rules do?
A: They enforce conditions before changes reach a branch — e.g. require a PR, approvals, and passing status checks, and block force-pushes — on the server, so contributors can't bypass them.

Q: When does a pre-commit hook run, and what can it do?
A: It runs locally, right before a commit is created, and can abort the commit if a check (like linting) fails.

Q: What is a CODEOWNERS file for?
A: It maps file paths to owners so that changes to those paths require review from the listed people.

Q: Why are client-side hooks not a reliable enforcement mechanism?
A: They're local, not shared by default, and can be skipped with --no-verify — so real enforcement must be server-side (branch protection + CI).

Q: Which is enforced and unbypassable: a pre-commit hook or a required status check?
A: The required status check (branch protection) — it runs on GitHub's servers; the hook is local and can be bypassed.

Q: How do teams share git hooks so everyone runs them?
A: With a hook-management framework (e.g. the pre-commit framework or Husky) that installs hooks from versioned config.

# Exercises

### Easy

Add a `pre-commit` hook that runs your linter and blocks the commit on failure. Test it, then show
that `git commit --no-verify` skips it.

### Medium

On a test repository, enable branch protection on `main` requiring a pull request and one approval.
Try to push directly to `main` and describe what happens.

### Challenging

Explain the division of responsibility between client-side hooks and server-side branch
protection. Given a team that wants "no untested code on `main`," design the combination of hooks,
required checks, and CODEOWNERS you'd use, and state exactly which part is the true enforcement.

# Further Reading

- GitHub Docs — [About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches) and [About code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- Pro Git, Chapter 8 — [Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [pre-commit framework](https://pre-commit.com/)
