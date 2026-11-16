---
slug: ignoring-files-gitignore
title: "Ignoring Files with `.gitignore`"
topic: basics-workflow
kind: technique
summary: "Keep build artifacts, dependencies, and credentials out of your repository using pattern matching in .gitignore."
tags: [gitignore, best-practices, security]
related: [three-areas-three-states, staging-with-git-add, removing-sensitive-data]
---
> **In one line:** A .gitignore file specifies untracked file patterns that Git should ignore, preventing junk and secrets from entering history.

## The idea

Every software project generates files that should never be committed to version control: compiled binaries, package dependencies (`node_modules`), temporary editor files, operating system artifacts (`.DS_Store`), and sensitive environment variables (`.env`).

A `.gitignore` file placed in your repository root specifies filename patterns that Git should ignore. Once ignored, these files will not appear as untracked in `git status`, and commands like `git add .` will skip them automatically.

Crucially: **`.gitignore` only affects untracked files**. If a file has already been committed to Git in the past, adding it to `.gitignore` does nothing! Git continues tracking changes to committed files until you explicitly untrack them.

| Pattern | Matches | Example |
|---|---|---|
| `node_modules/` | Any directory named `node_modules` | Dependencies folder |
| `*.log` | Any file ending in `.log` | Application debug logs |
| `.env*` | Any file starting with `.env` | Environment files and secrets |
| `!important.log` | Negates a previous ignore rule | Keeps a specific log file tracked |

## See it

Create a standard `.gitignore` file and untrack accidentally tracked files:

```bash
# Create a .gitignore file with standard patterns
cat << 'EOF' > .gitignore
# Dependencies and builds
node_modules/
dist/
build/

# Environment files and credentials
.env
.env.local

# Operating system files
.DS_Store
Thumbs.db
EOF

# Untrack a file already committed without deleting it from disk
git rm --cached .env
git commit -m "Untrack .env file"
```

## Go deeper

You can also establish global ignore rules across all repositories on your machine by setting `core.excludesfile` (e.g. `~/.gitignore_global`). This is ideal for machine-specific editor files like `.vscode/` or operating system files like `.DS_Store`.

> **Tip:** If a file seems ignored and you don't know why, run `git check-ignore -v <path>` to find the exact line in `.gitignore` responsible.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

## Watch out

- Adding a file to `.gitignore` and wondering why Git still tracks it—you must run `git rm --cached <file>`.
- Committing secrets (`.env`) thinking `.gitignore` protects them retroactively; secrets in past commits remain in history.

## Remember

- `.gitignore` prevents untracked files from appearing in status or being staged by `git add .`.
- `.gitignore` only affects untracked files; committed files must be removed from the cache first with `git rm --cached`.
- Inspect why a file is ignored using `git check-ignore -v <file>`.
