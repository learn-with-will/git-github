---
slug: github-issues-and-labels
title: "GitHub Issues, Templates & Labels"
topic: project-management
kind: tool
summary: "Track bugs and enhancements on GitHub using structured issue templates, markdown checklists, and organized labels."
tags: [issues, labels, project-management]
related: [milestones-and-projects, linking-prs-to-issues, opening-and-reviewing-prs]
---
> **In one line:** GitHub Issues track bugs, tasks, and feature requests with structured templates, colored labels, and assignees.

## The idea

Software development requires disciplined tracking of bugs, tasks, user feedback, and architectural enhancements. **GitHub Issues** is GitHub's built-in issue tracker integrated directly with your code repository, pull requests, and commit history.

An issue is not merely a ticket; it supports full GitHub Flavored Markdown, interactive task checklists (`- [ ] task`), code blocks, user `@mentions`, and drag-and-drop file attachments.

To organize hundreds of issues, teams establish a taxonomy of **Labels**:
- **Type:** `bug` (red), `feature` (blue), `documentation` (yellow), `refactor` (purple).
- **Priority:** `priority: high`, `priority: low`.
- **Status:** `blocked`, `needs-repro`, `help wanted`.

Repositories can also define issue templates in `.github/ISSUE_TEMPLATE/` (using YAML forms or Markdown) to prompt bug reporters for reproduction steps, environment details, and expected behavior.

| Feature | Purpose | Example |
|---|---|---|
| **Labels** | Categorize and filter issues by type, priority, and area | `bug`, `documentation`, `good first issue` |
| **Assignees** | Clarify which developers are actively responsible | `@alexchen` |
| **Task Lists** | Interactive checklists that track completion progress | `- [x] Write unit test` |
| **Templates** | Enforce required reporting fields for bug submitters | `.github/ISSUE_TEMPLATE/bug_report.yml` |

## See it

Create and filter issues using the GitHub CLI:

```bash
# Create a new bug issue directly from terminal
gh issue create --title "fix(auth): session expires prematurely on safari"                 --body "Session token cookie missing SameSite attribute."                 --label "bug,priority:high"

# List open bugs assigned to you
gh issue list --label "bug" --assignee "@me"

# View specific issue details and comments
gh issue view 42
```

## Go deeper

GitHub provides special recognized labels: `good first issue` and `help wanted`. When applied to public repositories, GitHub highlights these issues to the broader open-source community, making it easy for new contributors to discover welcoming entry-level tasks.

> **Tip:** You can convert any task list item in an issue into its own standalone child issue with a single click in GitHub's web interface.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

Investing the time to configure disciplined defaults and learn primary flags pays compound dividends across every software project and team you collaborate with throughout your career.

## Watch out

- Allowing an issue tracker to fill with vague reports like 'app crashed' without reproduction steps.
- Creating dozens of redundant labels with overlapping colors, making search filters ineffective.

## Remember

- GitHub Issues tracks bugs, tasks, and enhancements directly alongside repository code.
- Use labels to categorize issues by type, priority, and functional component.
- Define issue templates in `.github/ISSUE_TEMPLATE/` to standardize bug reports.
