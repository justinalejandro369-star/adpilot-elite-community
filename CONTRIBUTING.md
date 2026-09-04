# Contributing

Thank you for helping improve AdPilot Elite Community.

## Development workflow

1. Fork the repository and create a focused branch.
2. Copy `.env.example` to `.env.local`; never use production credentials or real client data.
3. Install exact dependencies with `npm ci`.
4. Make a small, documented change with tests where behavior changes.
5. Run:

```bash
npm run lint
npm run typecheck
npm run build
npm test
```

6. Open a pull request explaining the problem, solution, security impact, and validation performed.

## Data and privacy

Only synthetic tenant names, IDs, campaign data, screenshots, and fixtures are accepted. Pull requests containing personal data, real account identifiers, tokens, keys, webhook URLs, or private exports will be closed and the exposed credential must be rotated.

## Scope

Use an issue for large features or architecture changes before implementation. Keep pull requests reviewable and avoid unrelated formatting or dependency churn.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md). Security issues belong in the private process described in [SECURITY.md](SECURITY.md).
