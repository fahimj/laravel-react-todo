# To-Do App

Full-stack CRUD to-do app — Laravel API + React/Vite + SQLite.

## Functional Requirements

- **Create task** — form with `title` and `description` fields, default status `pending`
- **List tasks** — display all tasks from the API
- **Update task** — edit `title`, `description`, and toggle `status` (`pending` / `done`)
- **Delete task** — remove a task permanently
- All API responses are JSON
- Task list refreshes automatically after any CRUD operation
- Basic error handling (alert on fetch failure)

## Scope

**In scope:**

- CRUD endpoints for a single `tasks` resource
- React UI for listing, creating, editing, and deleting tasks
- SQLite for persistence
- Laravel backend tests
- React/Vite frontend tests

**Out of scope:**

- Authentication / authorization
- Pagination, search, or filtering
- Multi-user support
- Soft deletes or audit history
- API versioning
- Production deployment or CI/CD

## Quick Start

```bash
# Backend
cd backend
composer install
cp .env.example .env   # then set DB_* vars for pgsql
php artisan key:generate
php artisan migrate
php artisan serve       # :8000

# Frontend
cd frontend
npm install
npm run dev             # :5173
```

## API

| Method | Endpoint | Action |
|--------|----------|--------|
| GET | /api/tasks | List tasks |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/{id} | Update task |
| DELETE | /api/tasks/{id} | Delete task |

## Testing

```bash
cd backend && php artisan test
cd frontend && npm run test
```
