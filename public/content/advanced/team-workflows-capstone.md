---
id: lesson-24
slug: team-workflows-capstone
title: "Team Workflows — Capstone"
level: advanced
order: 24
duration: 20
tags:
  - workflows
  - git-flow
  - trunk-based
  - conventional-commits
summary: "Compare Git Flow, GitHub Flow, and trunk-based development, adopt a commit convention, and trace one feature end to end — tying together every lesson in the course."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Compare **Git Flow**, **GitHub Flow**, and **trunk-based development**, and pick the right fit.
- Explain **Conventional Commits** and why commit conventions help.
- Trace a **full feature lifecycle** that uses the whole course together.

# Why It Matters

You now know the *tools*. A **workflow** is the team's agreement on how to use them — how branches
are named and how long they live, how code is reviewed, how releases are cut. Choosing the right
workflow (and not a heavier one than you need) is what makes a team fast *and* safe. This capstone
compares the popular models and then walks one change from idea to release, touching nearly every
lesson you've done.

# Concept Explanation

### Three common branching strategies

- **Git Flow** (Vincent Driessen, 2010): long-lived `main` **and** `develop` branches, plus
  supporting `feature/`, `release/`, and `hotfix/` branches. Structured and powerful, but heavy —
  best for software with **scheduled, versioned releases** (and multiple maintained versions). Its
  own author later noted it's often **overkill for continuously delivered web apps**.
- **GitHub Flow**: one long-lived branch (`main`, always deployable) plus **short-lived feature
  branches** merged via pull requests. Lightweight; suits **continuous deployment**.
- **Trunk-Based Development**: everyone integrates into a single **trunk** (`main`) **frequently**
  (at least daily), using very short-lived branches or small direct commits, with **feature flags**
  hiding unfinished work. It underpins high-performing CI/CD but demands **strong test automation**.

### Commit message conventions

**Conventional Commits** is a convention for commit messages of the form
`type(scope): description` — e.g. `feat: add CSV export`, `fix: handle empty input`,
`docs: update README`. Because the type is machine-readable, tools can **auto-generate
changelogs** and even infer the **SemVer** bump (`fix` → PATCH, `feat` → MINOR,
`BREAKING CHANGE` → MAJOR). It's a convention you adopt, not a Git feature.

### Bringing the whole course together

Every earlier lesson is a piece of one pipeline: **branch → commit → push → pull request → review
+ CI → merge → tag → release → deploy**, all guarded by branch protection. The capstone below
traces it.

# Key Terminology

- **Workflow / branching strategy:** a team's agreed way of using branches and releases.
- **Git Flow:** structured model with `main`/`develop` + feature/release/hotfix branches.
- **GitHub Flow:** lightweight `main` + short-lived branches via PRs.
- **Trunk-based development:** frequent integration into one trunk with tiny branches + feature
  flags.
- **Conventional Commits:** a standardized commit-message format.
- **Feature flag:** a switch that hides unfinished work in production.

# Options and Trade-offs

| Workflow | Branches | Release cadence | Complexity | Best fit |
| -------- | -------- | --------------- | ---------- | -------- |
| **Git Flow** | `main`, `develop`, feature/release/hotfix | Scheduled, versioned | High | Versioned products, multiple releases in support |
| **GitHub Flow** | `main` + short-lived feature branches | Continuous | Low | Web apps deploying frequently |
| **Trunk-based** | One trunk + tiny short-lived branches | Continuous, many/day | Low–medium (needs flags + strong CI) | High-throughput CI/CD teams |

# Worked Example

**One feature, end to end — using the whole course.**

```text
Issue #42 "Add CSV export"
   │  (Lesson 15: track the work)
   ▼
git switch -c feat/csv-export           (L6 branch off main)
   │  edit + commit with clear messages (L3; L24 Conventional Commits)
   │    feat: add CSV export
   ▼
git push -u origin feat/csv-export      (L8/L9 remotes & auth)
   │
Open a Pull Request → "feat: add CSV export … Fixes #42"   (L10 GitHub flow; L15 closes the issue)
   │  Review + required CI must pass     (L22 Actions; L23 branch protection)
   │  address feedback → push more commits (L10)
   ▼
Squash and merge into main              (L12 merge strategies)
   │  main stays deployable
   ▼
git tag -a v1.3.0 -m "Add CSV export"   (L16 tags; SemVer MINOR for a feature)
git push origin v1.3.0
   ▼
Publish a GitHub Release + deploy        (L16 releases)
```

Notice how much you used: branching, commits, remotes, authentication, the GitHub flow, issues,
merge strategy, CI, branch protection, tags, and SemVer — a single feature exercising the entire
course. Along the way, protected `main` and green CI kept quality enforced, and the closing keyword
tidied the tracker automatically.

# Real World Analogy

Choosing a workflow is choosing your team's **rules of the road**. **Git Flow** is a formal
**railway timetable** — lots of structure, ideal when releases are scheduled and must be exact.
**GitHub Flow** is a **well-run bus line** — simple, frequent, easy to follow. **Trunk-based
development** is a **busy highway** where everyone merges onto one road continuously — fast and
efficient, but only safe with good signage and guardrails (automated tests and feature flags).

# Examples

## Example 1 — Basic: small team on GitHub Flow

A three-person team keeps `main` deployable and ships each change as a short-lived branch and a
reviewed PR. Simple, fast, and enough structure to stay safe.

**Why this works:** For continuous delivery, GitHub Flow provides review and CI without the
overhead of extra long-lived branches.

## Example 2 — Real-world: trunk-based at scale

A large team deploys many times a day using trunk-based development: tiny branches merged within
hours, unfinished features hidden behind flags, and a strong test suite gating every merge.

**Why this works:** Frequent integration avoids big, painful merges; feature flags let incomplete
work ship safely; automation makes the high pace sustainable.

## Example 3 — Trade-off / pitfall: the wrong-sized workflow

A simple web app adopts full Git Flow. Developers juggle `develop`, `release/`, and `hotfix/`
branches for software that just deploys continuously — pure overhead. Meanwhile another team lets
feature branches live for weeks and drowns in merge conflicts.

**Why this bites:** Workflows should match your release model. Heavy process on a simple app wastes
effort; long-lived branches on any model breed conflicts. Prefer the **simplest workflow that
fits**, with **short-lived branches**.

# Common Mistakes

- **Cargo-culting a heavy workflow** (like Git Flow) you don't need.
- **Long-lived, divergent feature branches** that cause painful merges — favor short-lived ones.
- **Adopting a workflow without the guardrails** (branch protection + CI) that make it safe.
- **Inconsistent commit messages,** losing the benefits of a convention.

# Best Practices

- Pick the **simplest workflow** that matches your **release cadence**.
- Keep branches **short-lived** and **integrate often** to minimize conflicts.
- Back the workflow with **protected `main` + required CI** (Lessons 22–23).
- Adopt a **commit convention** (e.g. Conventional Commits) for readable history and automation.
- **Automate releases** (tag + GitHub Release) and version with **SemVer** (Lesson 16).

# Summary

- **Git Flow** (structured, scheduled releases), **GitHub Flow** (lightweight, always-deployable
  `main`), and **trunk-based development** (frequent integration to one trunk + feature flags) suit
  different release models — choose the simplest that fits.
- **Conventional Commits** standardizes messages (`feat:`, `fix:`, …), enabling changelogs and
  SemVer automation.
- A single feature's lifecycle — **branch → commit → push → PR → review + CI → merge → tag →
  release** — ties together the entire course, with protected `main` and CI enforcing quality.
- Keep branches short-lived, integrate often, and back your workflow with real server-side
  guardrails.

# Flash Cards

Q: What characterizes GitHub Flow?
A: A single, always-deployable main plus short-lived feature branches merged via pull requests — a lightweight, continuous-delivery workflow.

Q: What is trunk-based development?
A: A model where everyone integrates into one trunk (main) frequently, using very short-lived branches (often with feature flags), backed by strong test automation.

Q: What does Git Flow add that GitHub Flow doesn't?
A: Extra long-lived and supporting branches — develop, plus feature/release/hotfix — suited to scheduled, versioned releases (but often overkill for continuous delivery).

Q: What are Conventional Commits?
A: A commit-message convention (type(scope): description, e.g. feat:/fix:) that enables automated changelogs and SemVer version bumps.

Q: Which workflow best fits a simple web app that deploys continuously?
A: GitHub Flow (or trunk-based development) — lightweight and continuous; full Git Flow would be unnecessary overhead.

Q: What's the single most important habit across all these workflows?
A: Keep branches short-lived and integrate often, backed by protected main and CI — it minimizes conflicts and keeps main healthy.

# Exercises

### Easy

In your own words, contrast Git Flow, GitHub Flow, and trunk-based development in terms of branch
count and release cadence. Which would you pick for a personal project, and why?

### Medium

Write three commit messages in Conventional Commits style — a feature, a bug fix, and a breaking
change — and state which SemVer part each would bump.

### Challenging

Take a feature from issue to release on a test repository using GitHub Flow: open an issue, branch,
commit with conventional messages, open a PR that closes the issue, get CI to pass under branch
protection, squash-merge, then tag and release with an appropriate SemVer version. Note which prior
lesson each step came from.

# Further Reading

- Vincent Driessen — [A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/) (Git Flow, with the author's later note)
- GitHub Docs — [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow); [Trunk-Based Development](https://trunkbaseddevelopment.com/)
- [Conventional Commits](https://www.conventionalcommits.org/) and [Semantic Versioning](https://semver.org/)
