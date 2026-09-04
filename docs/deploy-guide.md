# Deployment guide

This guide describes a safe baseline for deploying AdPilot Elite Community. It intentionally contains no tenant names, account identifiers, spreadsheet IDs, webhook URLs, or credentials.

## 1. Start with the mock provider

Validate the build before connecting external data:

```bash
npm ci
cp .env.example .env.local
npm run lint
npm run typecheck
npm run build
```

Keep `DATA_SOURCE=mock`, `ENABLE_PUBLIC_PORTALS=false`, and `ENABLE_AI_COPILOT=false` during this stage.

## 2. Configure authentication

Generate a unique `NEXTAUTH_SECRET` for every environment and store it in the hosting platform's encrypted secret store. The bundled credentials provider is for controlled evaluation. Production, multi-user, or multi-tenant deployments should replace it with SSO/OIDC and explicit role checks.

## 3. Add private tenant configuration

Create `config/clients.local.json` from `config/clients.example.json` and set:

```env
CLIENT_CONFIG_FILE=clients.local.json
```

The local file is ignored by Git. Do not place API keys, service-account JSON, personal data, or webhook secrets in this file.

## 4. Connect Google Sheets safely

1. Create a dedicated service account.
2. Share only the required sheets with Viewer access.
3. Keep the application scope read-only.
4. Store the service-account JSON in the deployment secret manager as `GOOGLE_SERVICE_ACCOUNT_KEY`.
5. Set `DATA_SOURCE=sheets` only after access has been verified.

Use a different service account per environment where practical. Rotate it immediately if its private key is ever committed or logged.

## 5. Optional features

`ENABLE_AI_COPILOT=true` allows selected campaign metrics and user prompts to leave your infrastructure for the configured AI provider. Enable it only after a privacy, contractual, and data-retention review.

`ENABLE_PUBLIC_PORTALS=true` exposes the bundled demo portal routes without authentication. Do not enable this flag for real tenant data; implement authenticated, tenant-scoped portal access first.

## 6. Platform controls

For GitHub, enable secret scanning, push protection, Dependabot, CodeQL, and protected default-branch rules. For the runtime platform, require HTTPS, restrict preview deployments, redact logs, and review environment-variable access.

## 7. Release verification

Before promoting a release:

```bash
npm ci
npm run lint
npm run typecheck
npm run build
npm test
```

Also run a secret scanner against the full Git history and confirm that no private tenant configuration is tracked.
