# API reference

Base URL: `http://localhost:4000/api` (local development). All request/response bodies are JSON.

## Public endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Server health |
| GET | `/site` | Sections, contact settings, categories, featured services |
| GET | `/services?category=travel-tourism` | Published services, optional category filter |
| GET | `/services/:slug` | Single published service |
| POST | `/inquiries` | Submit a contact form (rate-limited) |

Inquiry JSON example:

```json
{
  "full_name": "Example Visitor",
  "email": "visitor@example.com",
  "phone": "",
  "category_id": null,
  "subject": "New business inquiry",
  "message": "I would like to learn more about your business services."
}
```

## Session endpoints

| Method | Path | Purpose |
|---|---|---|
| POST | `/auth/login` | Body: `{ "email": "...", "password": "..." }`; sets cookie |
| GET | `/auth/me` | Current authenticated user |
| POST | `/auth/logout` | Clears cookie |

## Authenticated admin endpoints

| Method | Path | Required role |
|---|---|---|
| GET | `/admin/overview` | Any authenticated user (category-scoped) |
| GET | `/admin/categories` | Any authenticated user (category-scoped) |
| POST, PATCH | `/admin/categories`, `/admin/categories/:id` | Manager |
| GET, POST, PATCH | `/admin/services`, `/admin/services/:id` | Manager or authorized category staff |
| DELETE | `/admin/services/:id` | Manager |
| GET, PATCH | `/admin/inquiries`, `/admin/inquiries/:id` | Manager or authorized category staff |
| GET, PUT | `/admin/sections`, `/admin/sections/:key` | Manager |
| GET, PUT | `/admin/settings` | Manager |
| GET, POST, PATCH | `/admin/staff`, `/admin/staff/:id` | Manager |

The browser sends the session cookie with `credentials: 'include'`. Manager access and category authorization are enforced by Express.
