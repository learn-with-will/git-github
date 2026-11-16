---
slug: git-blame-and-log-search
title: "Code Archaeology: `git blame` and the Pickaxe"
topic: debugging-large-repos
kind: technique
summary: "Inspect who last touched each line with git blame, and search code history for specific strings using the pickaxe (-S)."
tags: [git-blame, pickaxe, code-archaeology]
related: [formatting-and-filtering-logs, git-bisect-hunt, inspecting-history-git-log]
---
> **In one line:** Use git blame to see who last modified each line, and the pickaxe (git log -S) to find when code strings appeared or vanished.

## The idea

When modifying unfamiliar code, you often need to understand *why* a particular line exists: What problem was the author solving? Was this line a quick workaround or an intentional architecture design?

Git provides two complementary code archaeology tools:

1. **`git blame <file>`:** Displays the file line by line, annotating each line with the short commit hash, author name, and date of the commit that last touched that exact line.
2. **The Pickaxe (`git log -S <string>`):** Searches historical commits for changes where a specific string was added or removed. It does not search commit messages—it searches the actual code patches across all time.

| Tool | Answers the Question | Example |
|---|---|---|
| `git blame -L 40,60 <file>` | Who last changed lines 40–60, and in which commit? | Investigating a cryptic regex |
| `git log -S "AUTH_TOKEN_V2"` | Which commits added or removed this exact variable? | Finding when a configuration key was created |
| `git log -G "regex"` | Which commits modified lines matching a regular expression? | Tracing function signature migrations |

## See it

Trace code origins using blame and the pickaxe:

```bash
# Blame lines 15 through 30 of a specific file
git blame -L 15,30 src/auth/token.ts

# Ignore whitespace-only commits during blame
git blame -w -L 15,30 src/auth/token.ts

# Use the pickaxe (-S) to find when a specific function was introduced or deleted
git log -S "verifyJwtSignature" --oneline -p

# Inspect the full commit and PR context of the identified commit
git show 4e2a1b9
```

## Go deeper

The `-w` flag in `git blame` ignores pure whitespace changes. If someone reformatted the entire file with Prettier or indentation rules, `-w` looks past that reformatting commit to reveal the original author who actually wrote the logic.

> **Tip:** You can also pass `--ignore-rev <hash>` (or `.git-blame-ignore-revs`) to permanently skip massive automated reformatting commits in `git blame`.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

## Watch out

- Treating `git blame` as a tool for assigning fault; its primary purpose is finding the commit context and PR discussion.
- Confusing `git log --grep` (searches commit messages) with `git log -S` (searches actual code changes).

## Remember

- `git blame` shows the author, commit hash, and timestamp for every line in a file.
- Use `git blame -w` to ignore cosmetic whitespace reformatting commits.
- The pickaxe (`git log -S <string>`) finds commits that added or removed specific code strings.
