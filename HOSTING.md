# Hosting

Cloudflare Pages project: `ev-characters` (GitHub `main`).
Build: `npm run build`; output: `dist`.

## Shared access

The browser sign-in uses username `players` and the password stored in the
Cloudflare **secret** `SITE_PASSWORD`. Never put that password in source code,
templates, or a `VITE_` environment variable (those become public JavaScript).

Set the secret for Production and, if enabled, Preview deployments. Redeploy
after adding or changing it. Missing configuration blocks access with HTTP 503.
`public/_routes.json` ensures assets also require authentication. Configure Pages
Functions to **fail closed** when the free request quota is exhausted.

Old deployments made before this gate must be deleted or separately protected;
their individual deployment URLs do not inherit new application code. Likewise,
old deployments retain old secrets after a password change. Check historical
deployments when rotating the shared password.

This is a shared group gate, not individual accounts. Browsers retain Basic Auth
credentials for their session. Local Vite development does not run the gate.
Character data remains stored in each player's browser; use Save for backups.

Check the gate with `node --test scripts/site-access.test.js`.
