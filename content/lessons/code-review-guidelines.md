---
slug: code-review-guidelines
title: "Constructive Code Reviews"
topic: pull-requests
kind: pattern
summary: "Conduct empathetic, high-leverage code reviews focused on architecture, correctness, readability, and shared ownership."
tags: [code-review, best-practices, teamwork]
related: [opening-and-reviewing-prs, the-github-flow, branch-protection-rules]
---
> **In one line:** Great code reviews focus on architecture, correctness, and maintainability, treating code review as mentorship, not a gate.

## The idea

Code review is the most effective tool software teams have for maintaining code quality, spreading domain knowledge, and preventing production incidents. However, without shared etiquette, code reviews can become subjective or confrontational.

High-performing teams follow clear review principles:
1. **Automate the nitpicks:** Formatting, linting, imports, and style rules should be enforced by automated CI linters (like ESLint, Prettier, or Ruff). Humans should not spend review time arguing about commas or indentation.
2. **Review for correctness and design:** Focus on architecture, edge cases, error handling, performance implications, and security boundaries.
3. **Be specific and constructive:** Explain *why* an alternative is better, not just that you dislike the current approach.
4. **Use conventional comments:** Label comments with prefixes like `[suggestion]`, `[question]`, or `[nitpick]` (non-blocking) so authors know what is critical versus optional.

| Review Comment Style | Example |
|---|---|
| **Poor / Unhelpful** | "This is wrong. Change it." |
| **Constructive** | "If the network drops here, `fetch` will throw an unhandled rejection. Could we wrap this in a `try/catch` block?" |
| **Non-blocking Nitpick** | "Nitpick (non-blocking): We could extract this helper function to `date-utils.ts` in a future PR." |

## See it

Review a teammate's PR locally using the GitHub CLI:

```bash
# Check out a colleague's PR locally to run tests and explore code
gh pr checkout 42

# Run local test suite against their branch
npm test

# Leave an approving review directly from terminal
gh pr review 42 --approve --body "Architecture looks solid and tests pass cleanly."
```

## Go deeper

As an author, respond to feedback graciously. When a reviewer asks a question, it often indicates the code was not self-documenting. Instead of only answering in the PR comment thread, consider adding a code comment or clarifying variable names to help future maintainers.

> **Tip:** Praise good code! If a teammate designed an elegant algorithm or wrote comprehensive test coverage, leave an appreciative comment in the review.

Mastering these underlying mechanics is what distinguishes experienced engineers from developers who rely on rote command memorization. When you understand the underlying object references, configuration boundaries, and commit graph structures, complex team workflows and unexpected edge cases become straightforward to reason through and resolve cleanly.

In production environments, adhering to these structured habits prevents subtle integration defects and keeps repository history clean, auditable, and maintainable for your entire engineering organization.

Investing the time to configure disciplined defaults and learn primary flags pays compound dividends across every software project and team you collaborate with throughout your career.

## Watch out

- Treating code review feedback as a personal critique of your engineering competence.
- Blocking a PR over personal stylistic preferences that are not covered by team linting standards.

## Remember

- Offload formatting and style enforcement to automated CI tools, saving human review for architecture.
- Use clear prefixes (`[suggestion]`, `[nit]`) to separate mandatory bugs from optional ideas.
- Code review is an opportunity for shared ownership and continuous team learning.
