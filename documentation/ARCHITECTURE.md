# Technical architecture

```text
Browser
  ├── Next.js UI (http://localhost:3000)
  │    ├── Public pages (server-rendered GET requests)
  │    └── Dashboard (browser requests with HTTP-only session cookie)
  └── Express REST API (http://localhost:4000/api)
       ├── Public endpoints: service catalog + inquiry submission
       ├── Auth endpoints: login, current user, logout
       ├── Role-checked admin endpoints
       └── MySQL 8: users, categories, services, sections, settings, inquiries
```

The frontend and Express API are separate Node.js processes. The API is the only application component with database credentials. Queries use mysql2 prepared parameters. Public service records must be active to display. A new inquiry begins with `status='new'`.

## Access matrix

| Capability | Visitor | Staff | Manager |
|---|---|---|---|
| View published services and page content | Yes | Yes | Yes |
| Send contact inquiry | Yes | Yes | Yes |
| View/manage own assigned category services | No | Yes | Yes, all |
| View/update assigned category inquiries | No | Yes | Yes, all |
| Assign inquiry to eligible staff | No | No | Yes |
| Add and edit categories | No | No | Yes |
| Delete services | No | No | Yes |
| Edit website section copy and settings | No | No | Yes |
| Create, assign and disable staff accounts | No | No | Yes |

The database stores many-to-many `user_categories` mappings; access is evaluated server-side per request, not only hidden by frontend navigation.

## Core database relationships

- `users 1→many user_categories many←1 service_categories`
- `service_categories 1→many services`
- `service_categories 1→many inquiries` (nullable for general inquiries)
- `users 1→many inquiries` via optional staff assignee
- `users 1→many page_sections` via optional editor

## Project design conventions

- Public pages: Next.js App Router server components.
- Form and admin interactions: client components with fetch and credentials.
- API validation: Zod schemas; JSON errors.
- Auth: bcrypt password hashing + signed eight-hour JWT in HTTP-only cookie.
- Cookie: `SameSite=Lax`, `Secure` in production, `HttpOnly`.
- Protections: Helmet headers, origin checks for mutations, explicit CORS origins, login/inquiry rate limits, prepared SQL queries.
- Seed data: idempotent inserts; existing content is not overwritten.
