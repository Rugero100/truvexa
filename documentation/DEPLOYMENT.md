# Production deployment checklist

This is a two-process Node.js application backed by MySQL. You need hosting capable of running **Next.js as a Node server**, **Express as a Node server**, and a **managed/private MySQL instance**. A static-only hosting plan cannot run the full application.

1. Provision separate HTTPS origins such as `https://truvexa.example` and `https://api.truvexa.example`. Replace these example domains with your real domain.
2. Create a dedicated MySQL database and restricted database user. Apply `database/schema.sql` using a secure database connection. Take routine encrypted backups and test restores.
3. Set backend environment variables using hosting secret management. Use a unique long `JWT_SECRET`, `NODE_ENV=production`, `COOKIE_SECURE=true` and exact `FRONTEND_ORIGIN=https://your-domain`. Never commit real secrets.
4. Set frontend `NEXT_PUBLIC_API_URL=https://api.your-domain/api` and `API_INTERNAL_URL` to an API address reachable from the Next.js server. The frontend browser and API must be configured for cross-site cookies if on truly different sites; using subdomains under the same registrable domain is simpler.
5. Install dependencies, seed the first manager with a secret password, build Next.js (`npm run build`), start both Node processes under a supervisor, and configure reverse proxy routing/TLS.
6. Confirm GET `/api/health`, public content, login/logout, service changes, staff category restrictions, inquiry submission, and mobile layout.
7. Before launch, arrange a production security review: CSRF design for your chosen domains, rate limiting behind your proxy (trust proxy correctly), monitoring, audit logging, vulnerability scanning, privacy policy and data retention, disaster recovery, account recovery / MFA, and abuse protections.
8. Replace all illustrative copy; verify real company details, social links, images, legal terms and privacy notices. The current inquiry form stores personal information in MySQL but does not send notification email.

Note: HTTP-only JWTs are intentionally inaccessible to JavaScript. In a public deployment, the API and website domains must be configured so browser cookies can reach the API; cross-site deployments may require an alternate cookie strategy and additional CSRF safeguards. Do not simply disable secure cookie settings.
