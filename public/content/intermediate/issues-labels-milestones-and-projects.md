---
id: lesson-15
slug: issues-labels-milestones-and-projects
title: "Issues, Labels, Milestones & Projects"
level: intermediate
order: 15
duration: 16
tags:
  - issues
  - labels
  - milestones
  - projects
summary: "Track work on GitHub with issues, organize them with labels and milestones, plan with Projects, and auto-close issues by linking pull requests with closing keywords."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Use **issues** to track bugs, tasks, and feature requests.
- Organize work with **labels** and **milestones**.
- Plan and visualize work with **Projects** (boards and tables).
- **Link a pull request to an issue** so merging the PR closes the issue automatically.

# Why It Matters

Code is only half of a project; the other half is deciding **what** to build and **tracking**
it. GitHub's issue tracker, labels, milestones, and Projects are where that planning lives,
right next to the code. Learning to connect issues and pull requests keeps your plan and your
work in sync automatically.

# Concept Explanation

### Issues

An **issue** is a tracked item — a bug report, a task, a feature request, or a question. It
has a title, a Markdown description, a comment thread, and metadata: **assignees**,
**labels**, and a **milestone**. Anyone with access (and, on public repos, the wider
community) can open issues.

### Labels

**Labels** are colored tags for categorizing issues and PRs — `bug`, `enhancement`,
`documentation`, `good first issue`, `help wanted`. GitHub provides defaults; you can add your
own. Filter by label to triage ("show me all open `bug`s").

### Milestones

A **milestone** groups issues and PRs toward a goal — often a release like `v2.0`. It tracks
progress (how many items are done) and can have a due date.

### Projects

**Projects** give you boards (kanban columns like *To do / In progress / Done*), tables, and
roadmaps to organize many issues and PRs across one or more repositories, with custom fields
for things like priority or status.

### Linking PRs to issues (the automation)

Put a **closing keyword** followed by the issue number in a PR description (or a commit
message on the default branch), and merging the PR **automatically closes** the issue:

```text
Fixes #42
Closes #7
Resolves #13
```

The recognized keywords are `close`/`closes`/`closed`, `fix`/`fixes`/`fixed`, and
`resolve`/`resolves`/`resolved`. A plain `#42` still creates a link, but only the keywords
auto-close.

# Key Terminology

- **Issue:** a tracked bug, task, feature request, or question.
- **Label:** a category tag applied to issues/PRs.
- **Milestone:** a group of issues/PRs working toward a goal or release.
- **Assignee:** the person responsible for an issue or PR.
- **Project:** a board/table/roadmap for organizing work items.
- **Closing keyword:** `Fixes`/`Closes`/`Resolves #N` — links a PR to an issue and auto-closes
  it on merge.

# Options and Trade-offs

| Tool | Best for | Scope |
| ---- | -------- | ----- |
| Issue | One task, bug, or request | A single item |
| Label | Categorizing and filtering | Applied across many issues/PRs |
| Milestone | Grouping toward a release/goal | A set of issues/PRs with progress |
| Project | Planning and visualizing workflow | Many items, often across repos |

# Worked Example

You track and fix a bug end to end.

1. Open an issue: **"Login button unresponsive on Safari."** Add the `bug` label, assign
   yourself, and add it to the `v1.1` milestone.
2. Branch, fix the bug, and open a PR whose description says:

```text
The click handler wasn't bound on Safari. This binds it on mount.

Fixes #42
```

3. Reviewers approve; you merge. Because of `Fixes #42`, GitHub **closes issue #42
   automatically** and links it to the merging PR — the milestone's progress ticks up.

No one had to remember to close the issue by hand; the keyword did it.

# Real World Analogy

Issues are a shared **ticket system** or to-do list for the project. **Labels** are colored
sticky flags you slap on tickets to sort them. A **milestone** is a folder labeled "everything
due for v1.1." A **Project board** is the team **whiteboard** with *To do / In progress / Done*
columns where tickets move as work progresses. The closing keyword is a rule that says: "when
this fix ships, tear up the matching ticket for me."

# Examples

## Example 1 — Basic: a good bug report

A user opens an issue with a clear title, exact steps to reproduce, expected vs. actual
behavior, and their environment. A maintainer labels it `bug` and can act on it immediately.

**Why this works:** A precise, single-topic issue is actionable; labels make it findable.

## Example 2 — Real-world: planning a release

A team creates a `v2.0` milestone, files every planned change as a labeled issue, and drops
them onto a Project board. The board shows what's `In progress` and the milestone shows how
close v2.0 is.

**Why this works:** Milestones answer "are we there yet?" and Projects show "who's doing
what," together giving a full picture.

## Example 3 — Trade-off / pitfall: the un-closed issue

A developer fixes a bug and merges the PR, but wrote "addresses #42" instead of a closing
keyword. The issue stays open, and the milestone looks incomplete until someone closes it by
hand.

**Why this bites:** Only the recognized closing keywords auto-close. Without one, the link is
informational and the issue lingers.

# Common Mistakes

- **Forgetting the closing keyword,** leaving issues open after the fix ships.
- **Vague issues** with no reproduction steps — hard to act on.
- **Cramming many problems into one issue,** which can't be closed cleanly.
- **Skipping labels/milestones,** making triage and release tracking painful.

# Best Practices

- **One problem per issue,** with a clear title and (for bugs) reproduction steps.
- **Label, assign, and milestone** issues so they're findable and trackable.
- **Link PRs to issues** with `Fixes #N` so merges keep your tracker tidy.
- Use a **Project board** for the bigger picture of what's in flight.

# Summary

- **Issues** track bugs, tasks, and requests, with labels, assignees, and milestones.
- **Labels** categorize; **milestones** group work toward a goal/release; **Projects** provide
  boards and tables to plan across many items.
- A PR containing a **closing keyword** (`Fixes #N`, `Closes #N`, `Resolves #N`)
  **auto-closes** that issue when merged; a bare `#N` only links.

# Flash Cards

Q: What are GitHub Issues used for?
A: Tracking bugs, tasks, feature requests, and questions, each with a description, comments, labels, assignees, and a milestone.

Q: Which keyword in a PR auto-closes an issue when the PR merges?
A: A closing keyword like Fixes, Closes, or Resolves followed by the issue number (e.g. Fixes #42).

Q: What is a milestone?
A: A group of issues and PRs working toward a goal or release, with progress tracking and an optional due date.

Q: What do GitHub Projects provide?
A: Boards, tables, and roadmaps (with custom fields) to plan and visualize work across many issues and PRs.

Q: You merged a fix but the issue stayed open — why?
A: The PR didn't use a recognized closing keyword linking it to the issue, so the issue wasn't auto-closed.

Q: What's the difference between a label and a milestone?
A: A label is a category tag applied across many items; a milestone groups items toward a specific goal or release.

# Exercises

### Easy

Open an issue in a test repository. Add a label, assign it to yourself, and write a clear
description. Note which metadata fields you set.

### Medium

Create a milestone, add two issues to it, and open a PR that closes one of them with a closing
keyword. After merging, confirm the issue closed and the milestone progress updated.

### Challenging

Explain the difference between issues, milestones, and Projects, and design a small plan: how
you'd use all three to organize a two-week effort with several bugs and one feature. Where does
the closing-keyword automation fit?

# Further Reading

- GitHub Docs — [About issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/about-issues) and [Linking a pull request to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue)
- GitHub Docs — [About labels](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/managing-labels), [About milestones](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/about-milestones), and [About Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects)
