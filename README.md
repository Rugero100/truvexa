# TRUVEXA SERVICES LTD

A complete, editable company website starter: **Next.js 16 + React 19** frontend, **Node.js + Express 5** API, and **MySQL 8** persistence. Includes a premium responsive site, contact inquiries, manager/staff authentication, role-based access, and a content dashboard.

## What's inside

```text
TRUVEXA_SERVICES_LTD/
├── frontend/                 Next.js App Router website + dashboard
│   ├── app/(site)/           Home, About, Services, Contact
│   ├── app/dashboard/        Overview, Services, Inquiries, Content, Staff
│   ├── components/           Public UI and form components
│   └── lib/                  Public and authenticated API clients
├── backend/
│   ├── src/routes/          Public, authentication, admin APIs
│   ├── scripts/seed.js      First manager + illustrative site data
│   └── tests/               Node test runner checks
├── database/schema.sql      MySQL database definition
└── documentation/           Architecture, API and deployment notes
```

## Quick start on Windows 10/11 (VS Code)

**Requirements**
- Node.js **20.9 or newer** (Node.js 22 or 24 LTS recommended). Verify: `node -v`
- MySQL Server **8.0+** running; MySQL Workbench is optional.
- VS Code and a terminal such as PowerShell.
- Two terminal tabs. An 8 GB RAM computer can run this for local development, but close heavy apps.

1. Extract the ZIP, open the `TRUVEXA_SERVICES_LTD` folder in VS Code.
2. Create the database. In MySQL Workbench, open `database/schema.sql` and execute the entire file. Or from Windows Command Prompt if `mysql` is on PATH:

   ```bat
   mysql -u root -p < database\schema.sql
   ```

3. Copy `backend/.env.example` to `backend/.env` and edit it:
   - Enter your real `DB_USER` and `DB_PASSWORD`.
   - Replace `JWT_SECRET` with a **random secret of 32+ characters** (prefer 64+).
   - Change `ADMIN_EMAIL` to your manager email.
   - Set a new unique `ADMIN_PASSWORD` with 12+ characters.
   - Keep `FRONTEND_ORIGIN=http://localhost:3000` for local development.
4. Copy `frontend/.env.example` to `frontend/.env.local` (defaults work for local development).
5. In the VS Code terminal, from the project root:

   ```powershell
   npm install
   npm run db:seed
   npm run dev
   ```

6. Visit:
   - **Public website:** http://localhost:3000
   - **Manager sign-in:** http://localhost:3000/login
   - **API health check:** http://localhost:4000/api/health

Sign in using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` you chose in `backend/.env`. Seed runs **once to create the manager** and safely skips existing sample data on subsequent runs. If you change the manager password in `.env` after seeding, the existing password is *not* automatically changed.

> Never upload `.env` files, passwords, or your MySQL data to public repositories. The ZIP contains example files only, no actual credentials.

## How to manage your company website

1. **Site content:** Update the hero, About text, approach and contact call-to-action. Add real email, phone, location and social links.
2. **Services:** Create/edit services, select categories, set optional HTTPS image URLs, choose Featured and Published.
3. **Team & access:** Managers create staff credentials and assign service categories. Staff see and edit services and inquiries *only within assigned categories*. Staff cannot edit site-wide content, create users or delete services.
4. **Inquiries:** New contact submissions appear in the dashboard. Staff can update the status; managers can assign to appropriately scoped staff.

The first content is **illustrative**, not a statement of verified company facts, partners or experience. Replace it before launch.

## Useful commands

| Command | Action |
|---|---|
| `npm run dev` | Start Next.js (port 3000) and Express (port 4000) |
| `npm run build` | Build production frontend |
| `npm run test` | Run backend unit tests |
| `npm run db:seed` | Create first manager and default content if missing |
| `npm run start:api` | Start Express in the configured environment |
| `npm run start:web` | Serve an already-built Next.js frontend |

## Important setup notes

- The public website shows clearly labelled **preview content** if its API/database is unavailable, but contact submission and sign-in require a running Express server and MySQL.
- Real image file uploads, payment processing, email sending, password recovery, multi-factor authentication and analytics are **not** part of this project. Services currently accept externally hosted image URLs.
- This project is an **operational starting point**, not a security certification. Before accepting real customer data on a public domain, review HTTPS, reverse proxy, secure cookies, CSRF protections, backups, retention/privacy notices, monitoring, account recovery, secrets and hosting as explained in [deployment notes](documentation/DEPLOYMENT.md).
- Don't expose MySQL to the public internet. The Express API connects privately to the database.

## Troubleshooting

**PowerShell blocks npm.ps1:** Open the VS Code Command Prompt terminal and use `npm.cmd install`, `npm.cmd run dev`, etc. This avoids changing your system execution policy.

**Access denied for user 'root':** Check MySQL username/password in `backend/.env`.

**Unknown database 'truvexa':** Run `database/schema.sql` in MySQL first.

**Port 3000 or 4000 already in use:** Stop the other process, or update the backend `PORT` and both frontend API URL values (plus the allowed frontend origin if you change the web port).

**Login unsuccessful:** Confirm `npm run db:seed` completed, use the original manager password, and confirm the browser and API both use `localhost` consistently rather than mixing `localhost` with `127.0.0.1`.

**The site keeps showing preview content:** Check the API server output, MySQL service, and `frontend/.env.local` URLs; restart `npm run dev` after changing environment files.

## License

Created for TRUVEXA SERVICES LTD. Customize and deploy it for your company.
