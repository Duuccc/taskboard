# Taskboard API

A production-grade RESTful API for a collaborative task management system, built with Node.js, TypeScript, and PostgreSQL.

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Cache:** Redis
- **Queue:** BullMQ
- **Validation:** Zod
- **Testing:** Vitest + Supertest
- **Containerization:** Docker + Docker Compose

## Features

- JWT authentication with refresh token rotation
- Redis caching with cache invalidation
- Background job processing with BullMQ
- Input validation with structured error responses
- Pagination and filtering on list endpoints
- Rate limiting and security headers (helmet)
- Unit and integration tests
- Docker Compose setup for local development

## Project Structure

```
src/
├── routes/         # HTTP endpoints
├── controllers/    # Request/response handling
├── services/       # Business logic
├── middleware/     # Auth, validation, error handling
├── db/
│   ├── index.ts    # PostgreSQL connection
│   └── migrations/ # SQL migration files
├── cache/          # Redis caching helpers
├── jobs/           # BullMQ queue and workers
├── errors/         # Custom error classes
├── validation/     # Zod schemas
├── types/          # Shared TypeScript types
└── tests/
    ├── unit/
    └── integration/
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get tokens |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout and revoke token |

### Boards
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/boards` | Get all boards for current user |
| POST | `/api/boards` | Create a new board |
| DELETE | `/api/boards/:id` | Delete a board |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks?board_id=1` | Get paginated tasks for a board |
| POST | `/api/tasks` | Create a new task |
| PATCH | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

## Getting Started

### Prerequisites

- [Docker](https://docker.com) and Docker Compose

### Run with Docker

1. Clone the repository

```bash
git clone https://github.com/Duuccc/taskboard.git
cd taskboard
```

2. Create `.env.docker`:

```env
DB_PASS=yourpassword
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

3. Start all services:

```bash
docker compose --env-file .env.docker up --build
```

Migrations run automatically on startup. The API is available at `http://localhost:3000`.

### Run Locally (without Docker)

1. Install dependencies:

```bash
npm install
```

2. Create `.env`:

```env
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskboard
DB_USER=postgres
DB_PASS=yourpassword
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=3000
```

3. Run migrations:

```bash
npm run migrate
```

4. Start the server:

```bash
npm run dev
```

## Testing

Create `.env.test` with a separate test database, then:

```bash
# run all tests
npm run test:run

# watch mode
npm test
```

## Example Requests

**Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Duc","email":"duc@test.com","password":"123456"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"duc@test.com","password":"123456"}'
```

**Create a task (with token):**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"board_id":1,"title":"My first task","status":"todo"}'
```
