---
slug: open-source-contribution-etiquette
title: "Open Source Contribution Etiquette"
topic: pull-requests
kind: pattern
summary: "Follow open-source etiquette: reading CONTRIBUTING.md, respecting issue trackers, and writing minimal, focused patches."
tags: [open-source, etiquette, collaboration]
related: [fork-and-pull-model, syncing-upstream-forks, opening-and-reviewing-prs]
---
> **In one line:** Successful open-source contributions start by reading CONTRIBUTING.md and opening an issue before writing large PRs.

## The idea

Contributing to open source is an exciting milestone, but open-source maintainers are often volunteers managing dozens of issues and PRs in their free time. Respecting their contribution guidelines dramatically increases the likelihood that your PR will be reviewed and merged.

Key open-source etiquette rules:
1. **Read `CONTRIBUTING.md` first:** Most major projects have a `CONTRIBUTING.md` file in the root or `.github/` folder. It specifies coding standards, commit formatting, test requirements, and license agreements.
2. **Open an issue before writing major code:** Never write a massive 2,000-line rewrite without asking. Open an issue first to discuss whether the feature aligns with the project roadmap.
3. **Keep PRs small and singular:** Fix one bug or add one feature per PR. Do not combine a bug fix with a cosmetic code reformatting across 30 files.
4. **Sign the CLA or DCO if required:** Many projects (like Linux, CNCF, or Apache) require you to sign a Contributor License Agreement (CLA) or pass the Developer Certificate of Origin (`git commit -s` for Signed-off-by).

| Practice | Respectful Approach | Frustrating Approach |
|---|---|---|
| **Scope** | One bug fix with a regression unit test | Fixing a bug + rewriting 10 files in your favorite style |
| **Discussion** | Open an issue first to propose architecture | Dropping a giant surprise PR on maintainers |
| **Tests** | All existing tests pass + new test added | "Tests failed on CI, please fix" |

## See it

Inspect contribution guidelines and sign off commits:

```bash
# Check if project provides contribution guidelines
cat CONTRIBUTING.md

# Sign off a commit with Developer Certificate of Origin (DCO)
git commit -s -m "fix(parser): handle trailing commas in json payloads"

# Run project linter and test suite locally before pushing
npm run lint && npm test
```

## Go deeper

The `-s` flag (`--signoff`) appends a `Signed-off-by: Your Name <email>` trailer to your commit message. This certifies that you authored the code or have the right to submit it under the project's open-source license.

> **Tip:** If a maintainer asks for changes, do not open a new PR. Push additional commits to the same branch on your fork; the existing PR will update automatically.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

## Watch out

- Bumping dependency versions or reformatting code in files unrelated to your actual bug fix.
- Demanding immediate reviews from open-source maintainers who volunteer their personal time.

## Remember

- Always read `CONTRIBUTING.md` to follow project-specific development guidelines.
- Discuss large architectural proposals in an issue before writing code.
- Use `git commit -s` when contributing to projects that enforce the Developer Certificate of Origin.
