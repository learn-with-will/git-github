---
slug: formatting-and-filtering-logs
title: "Formatting and Filtering Logs"
topic: basics-workflow
kind: technique
summary: "Filter commits by author, date, file path, and commit message, and define custom output formats."
tags: [git-log, filtering, search]
related: [inspecting-history-git-log, git-blame-and-log-search, comparing-changes-git-diff]
---
> **In one line:** Filter git log by author, date ranges, file paths, or custom format strings to pinpoint exact commits.

## The idea

On mature projects with thousands of commits, scrolling through `git log` chronologically is inefficient. Git provides precise filtering flags that isolate commits by author, date ranges, touched file paths, and commit message contents.

You can also design custom output formats using `--format` specifiers to produce machine-readable outputs or customized team displays.

| Filter Flag | Example Usage | Matches |
|---|---|---|
| `--author` | `git log --author="Alex"` | Commits authored by Alex |
| `--since` / `--until` | `git log --since="2 weeks ago"` | Commits within specified relative or absolute dates |
| `--grep` | `git log --grep="CVE-"` | Commits whose message contains the string |
| `-- <path>` | `git log -- package.json` | Commits that touched the specified file or folder |

## See it

Filter commits using specific criteria:

```bash
# Find commits touching a specific file over the last 30 days
git log --since="30 days ago" --oneline -- src/auth.ts

# Search commit messages for issue numbers or bug references
git log --grep="fix(#120)" --oneline

# Format custom output showing short hash, author date, author, and subject
git log --format="%h | %ad | %an: %s" --date=short -n 5

# View commits authored by a specific developer
git log --author="Alex" --oneline -n 5
```

## Go deeper

When filtering by file path (`git log -- <path>`), Git performs history simplification: it walks the commit graph and skips any commit where the tree for that specific file did not change. This lets you trace the complete evolution of a single module across years of development.

You can also combine path filtering with patch inspection using `git log -p -- <path>`. This displays only the commits that modified that specific file along with the exact code diffs introduced in each commit, turning Git into an authoritative audit trail for critical security modules or configuration files.

> **Tip:** You can combine `--author` and `--grep` to find commits written by a specific teammate that address a specific feature.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

Investing the time to configure disciplined defaults and learn primary flags pays compound dividends across every software project and team you collaborate with throughout your career.

## Watch out

- Placing file path arguments before options without the `--` delimiter, which can confuse branch names with file paths.
- Forgetting that `--grep` searches commit messages, not the code changes inside the commit (use `-S` for code).

## Remember

- Filter commits by author (`--author`), date (`--since`), and message (`--grep`).
- Append `-- <path>` to trace all commits that modified a specific file or directory.
- Custom `--format` strings let you tailor log outputs for CLI viewing or scripts.
