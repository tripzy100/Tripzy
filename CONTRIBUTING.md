# Contributing to Tripzy Tours

Thank you for contributing! Please follow the guidelines below to keep our codebase clean and professional.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Branch Naming](#branch-naming)
5. [Commit Messages](#commit-messages)
6. [Pull Requests](#pull-requests)
7. [Code Review](#code-review)
8. [Testing](#testing)
9. [Style Guide](#style-guide)

## Code of Conduct

By participating, you agree to uphold our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Getting Started

See the [Developer Setup Guide](./docs/DEV_SETUP.md) for environment setup instructions.

## Development Workflow

1. Pick a task from the project board
2. Create a feature branch from `develop`
3. Implement your changes with conventional commits
4. Write/update tests as needed
5. Push and open a Pull Request into `develop`
6. Pass CI checks
7. Get review approval
8. Merge (squash or rebase)

## Branch Naming

See the [Branch Naming Guide](./docs/BRANCH_NAMING.md) for details.

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`, `perf`, `ci`, `build`

See the [Commit Guide](./docs/COMMIT_GUIDE.md) for details.

## Pull Requests

See the [PR template](./.github/PULL_REQUEST_TEMPLATE.md). Every PR must:

- Target `develop` (or `main` for hotfixes)
- Pass CI checks
- Include screenshots for UI changes
- List testing performed
- Reference an open issue

See the [Merge Guide](./docs/MERGE_GUIDE.md) for merge strategies.

## Code Review

- All PRs require at least one approval
- Reviewers should check security, performance, and correctness
- Address all feedback before merging

## Testing

- Run `npm test` before pushing
- Add tests for new features
- Update tests for changed behavior
- Aim for meaningful coverage, not 100% for its own sake

## Style Guide

- TypeScript strict mode
- Prettier for formatting (`npm run format`)
- ESLint for linting (`npm run lint`)
- Follow existing code patterns
- No commented-out code
