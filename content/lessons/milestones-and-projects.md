---
slug: milestones-and-projects
title: "Milestones and GitHub Projects"
topic: project-management
kind: technique
summary: "Plan sprint deliverables and roadmaps using GitHub Milestones with due dates and GitHub Projects Kanban boards."
tags: [milestones, projects, kanban, planning]
related: [github-issues-and-labels, linking-prs-to-issues, semantic-versioning-rules]
---
> **In one line:** Use Milestones to track progress toward a target release date, and GitHub Projects to organize work visually in Kanban boards.

## The idea

As repositories grow, organizing issues into release goals and visualizing workflow stages becomes critical. GitHub provides two complementary planning tools: **Milestones** and **GitHub Projects**.

**Milestones:**
A Milestone groups a set of issues and pull requests toward a specific target date or release version (e.g. `v2.0.0` or `Q3 Sprint 4`). GitHub tracks the completion percentage automatically: as linked issues and PRs are closed, the milestone progress bar advances toward 100%.

**GitHub Projects:**
GitHub Projects provides customizable, spreadsheet-like tables, Kanban boards, and Gantt roadmap views. Issues and pull requests are organized into customizable columns (such as `Todo`, `In Progress`, `In Review`, `Done`). You can define custom fields (estimates, iteration dates, priority scores) and automate status movements when PRs are opened or merged.

| Feature | Primary Purpose | Key Visual |
|---|---|---|
| **Milestone** | Time-bound release or sprint target | Percentage completion bar with due date |
| **GitHub Project** | Visual workflow management & planning | Kanban board, backlog table, and roadmap timelines |

## See it

Create and track milestones using the GitHub CLI:

```bash
# Create a milestone with a target release date
gh api repos/{owner}/{repo}/milestones -f title="v1.2.0" -f due_on="2026-12-01T00:00:00Z"

# Assign an issue to the milestone
gh issue edit 42 --milestone "v1.2.0"

# View open issues under milestone v1.2.0
gh issue list --milestone "v1.2.0"
```

## Go deeper

GitHub Projects can span multiple repositories across an organization. A single engineering project board can aggregate issues and pull requests from frontend, backend, and infrastructure repositories into a unified sprint view.

> **Tip:** You can set up built-in workflows in GitHub Projects to automatically move an issue to 'In Review' as soon as a pull request mentioning it is opened.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

Investing the time to configure disciplined defaults and learn primary flags pays compound dividends across every software project and team you collaborate with throughout your career.

## Watch out

- Creating milestones without due dates, turning them into neglected endless backlogs.
- Spending more time tweaking custom project board fields than actually shipping code.

## Remember

- Milestones group issues and PRs toward a target date with an automated progress bar.
- GitHub Projects organizes work across Kanban boards, tables, and timeline roadmaps.
- Project boards can aggregate issues across multiple organization repositories.
