---
slug: workflow-secrets-and-caching
title: "Workflow Secrets and Dependency Caching"
topic: ci-workflows
kind: technique
summary: "Securely inject deployment credentials using GitHub Encrypted Secrets, and accelerate CI builds with dependency caching."
tags: [github-actions, secrets, caching, security]
related: [github-actions-fundamentals, actions-ci-pipeline, removing-sensitive-data]
---
> **In one line:** Store sensitive tokens in GitHub Encrypted Secrets, and use actions/cache to accelerate repetitive CI dependency downloads.

## The idea

CI/CD pipelines frequently require access to sensitive credentials: API keys, cloud deployment tokens, Docker registry passwords, or npm publishing keys.

**Never hardcode secrets in workflow YAML files!** Workflow files are stored in plaintext in your Git repository. Anyone with read access can view them.

GitHub provides **Encrypted Secrets**. You store sensitive keys in repository settings under **Secrets and variables → Actions**. Secrets are encrypted at rest using Libsodium public-key cryptography. In your workflow YAML, you reference them via `${{ secrets.MY_SECRET_NAME }}`. GitHub masks secrets in build logs automatically, printing `***` if they are echoed.

Additionally, downloading hundreds of megabytes of dependencies on every push wastes time and minutes. Actions like `actions/setup-node` or `actions/cache` cache dependencies between runs.

| Feature | Where Configured | How Injected in YAML |
|---|---|---|
| **Encrypted Secrets** | Repo Settings → Secrets | `env: API_KEY: ${{ secrets.STRIPE_KEY }}` |
| **Configuration Variables** | Repo Settings → Variables | `env: API_URL: ${{ vars.API_ENDPOINT }}` |
| **Dependency Caching** | Handled in `setup-node` action | `with: cache: 'npm'` |

## See it

Inject secrets and enable dependency caching in a workflow:

```yaml
name: Deploy Service

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node with npm cache enabled
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci

      - name: Deploy to Cloud Platform
        env:
          DEPLOY_TOKEN: ${{ secrets.PRODUCTION_DEPLOY_TOKEN }}
          APP_ENV: production
        run: npx deploy-cli --token "$DEPLOY_TOKEN" --env "$APP_ENV"
```

## Go deeper

GitHub prevents pull requests from forked open-source repositories from accessing repository secrets. This protects your organization from malicious PRs that attempt to print or exfiltrate private credentials. If a PR from a fork runs CI, `secrets.*` resolves to empty strings.

> **Tip:** Enable `cache: 'npm'` (or `'yarn'`, `'pnpm'`) directly inside `actions/setup-node@v4` for zero-configuration dependency caching.

## Watch out

- Printing secrets to console logs using `echo $SECRET` in debugging steps; masked values can still leak via base64 encoding.
- Accidentally committing credentials to workflow files instead of using GitHub Secrets.

## Remember

- Store all deployment keys and tokens in GitHub Encrypted Secrets, never in YAML files.
- GitHub automatically masks secret values in build logs with `***`.
- Enable caching in setup actions (`cache: 'npm'`) to slash CI build times.
