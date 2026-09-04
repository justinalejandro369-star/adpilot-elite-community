# Security policy

AdPilot Elite processes advertising performance data that may be commercially sensitive. Security and tenant isolation take priority over convenience.

## Supported version

Security fixes are applied to the latest commit on `main`. This community snapshot is pre-1.0 and does not promise backward compatibility.

## Report a vulnerability

Do not open a public issue with exploit details, credentials, client identifiers, or campaign data. Use GitHub's **Security → Report a vulnerability** flow. Include the affected commit, impact, reproduction steps, and any proposed mitigation.

If private vulnerability reporting is unavailable, open a public issue containing only a request for a private contact channel.

## Security boundaries

- Dashboard pages and application APIs require an authenticated session.
- The built-in credentials provider has no fallback account and rejects passwords shorter than 12 characters.
- `config/clients.example.json` and all bundled metrics are synthetic.
- Private client configuration, environment files, service-account files, and private keys are ignored by Git.
- Google Sheets integration requests read-only scope.
- Public portals and the AI copilot are disabled by default.
- Enabling the AI copilot can transmit prompts and selected campaign metrics to a third-party provider.

## Not yet a production guarantee

Before a multi-tenant deployment, add SSO/OIDC, per-user authorization, tenant-isolation tests, audit logging, rate limits, secret rotation, and authenticated client portals. A passing scanner or test suite does not replace a deployment-specific threat model.
