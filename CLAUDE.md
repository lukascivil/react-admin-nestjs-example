# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project layout

Yarn 4 (Berry) workspaces monorepo with three apps:

- `apps/postgres` — Docker Compose wrapper for the Postgres 16 database the API depends on. DB `test`, user `cafe`, password `cafe`, port `5432`.
- `apps/nestjs-example` — NestJS 11 REST API (port `3000`) with TypeORM, Postgres, JWT/Passport auth, Swagger (`/api`), Terminus health (`/health`), and an Apollo GraphQL endpoint (auto-generates `apps/nestjs-example/schema.gql`).
- `apps/react-admin-example` — React 19 + react-admin 5 frontend (port `3001`) built with Vite (the `rolldown-vite` drop-in). Includes an experimental RTK Query playground under `src/resources/rtk-test`.

## Common commands

Run from the repo root unless noted.

```bash
# Install
yarn

# Start everything: brings up Postgres via Docker, then runs API + frontend in parallel
yarn start

# Bump deps interactively across workspaces
yarn up
```

Workspace-scoped commands use Yarn workspace syntax, e.g. `yarn workspace nestjs-example test`.

### NestJS API (`apps/nestjs-example`)

```bash
yarn workspace nestjs-example start          # nest start --watch
yarn workspace nestjs-example start:debug    # with --debug
yarn workspace nestjs-example build          # nest build (clears dist first)
yarn workspace nestjs-example lint
yarn workspace nestjs-example semantic-check # tsc --noemit, full type check
yarn workspace nestjs-example test           # jest unit tests (*.spec.ts under src/)
yarn workspace nestjs-example test:e2e       # jest using test/jest-e2e.json
yarn workspace nestjs-example test -- path/to/file.spec.ts   # single test file
yarn workspace nestjs-example test -- -t "pattern"           # filter by name
yarn workspace nestjs-example compodoc       # architecture docs at http://localhost:8080
```

TypeORM migrations (the `typeorm` script builds first, so always run via these wrappers, not raw `typeorm`):

```bash
yarn workspace nestjs-example migration:generate src/database/migrations/<Name>
yarn workspace nestjs-example migration:run
yarn workspace nestjs-example migration:revert
```

`data-source.ts` reads `apps/nestjs-example/.env` (`DATABASE_HOST/PORT/USERNAME/PASSWORD/NAME`). `synchronize: false` is intentional — schema changes must go through migrations.

### React admin frontend (`apps/react-admin-example`)

```bash
yarn workspace react-admin-example start    # vite dev server on :3001
yarn workspace react-admin-example build    # tsc + vite build → ../../build/apps/react-admin-example
yarn workspace react-admin-example preview
```

There is no lint script wired up here, but ESLint is configured (`eslint.config.mjs`) and can be invoked directly if needed.

### Database (`apps/postgres`)

```bash
yarn workspace postgres start    # docker compose up -d
yarn workspace postgres stop     # docker compose down
```

## First-run setup

The seeder module is wired in but the README's bootstrap path is to insert an initial user by hand once Postgres is up and migrations have run:

```sql
INSERT INTO "public"."user" ("id", "name", "email", "password")
VALUES (1, 'admin', 'admin@gmail.com', 'admin');
```

Passwords are stored and compared as plaintext in `AuthService.validateUser` — this is example/lab code, not production-grade.

## Architecture

### React-admin ↔ NestJS contract

The frontend uses `ra-data-simple-rest` pointed at `http://localhost:3000`. That dialect drives several non-obvious conventions on the API side, all of which live in `apps/nestjs-example/src/shared/`:

- **List queries** arrive as URL params `filter` (JSON object), `range` (JSON `[start, end]`), and `sort` (JSON `[field, order]`). `GetListQuery` (`shared/models/get-list-query.model.ts`) parses and validates them via `class-transformer` + `class-validator` (`SortValidator`, `FilterValidator`). Controllers branch on which fields are present to dispatch to `getList` vs `getMany`.
- **List responses** must expose a `Content-Range` header (`resource start-end/total`). `ListPaginationInterceptor` (`shared/interceptors/list-pagination.interceptor.ts`) is applied per-controller (`@UseInterceptors`) and rewrites the response: it unwraps `{ data, contentRange }` into a bare array and sets the header, while leaving single-record `{ data }` responses to return the unwrapped record. New list endpoints must return the same `GetListResult` / `GetManyResult` / `GetOneResult` shapes for this interceptor to work.
- Services return RxJS `Observable`s (NestJS unwraps them). Controllers compose `from(repo.xxx())` with `map`/`switchMap` rather than async/await.

When adding a new resource, mirror `tasks/` or `users/`: a module folder with `*.controller.ts`, `*.service.ts`, plus a `shared/` subfolder containing `entity/`, `dto/`, and `services/`. Health probes are co-located (`*.health.ts`) and registered in `health/health.module.ts`.

### Auth flow

- `apps/nestjs-example/src/auth` exposes Passport `local` (login) and `jwt` (request guard) strategies. JWT secret is hardcoded in `auth.constant.ts` for the example; access token TTL is short (~45m), refresh token ~1h, and `/auth/refresh` accepts the refresh token in the body.
- The frontend `authProvider.ts` posts credentials to `/auth/login`, stores the `{ access_token, refresh_token }` envelope in `localStorage` under the key `auth`, and the global `httpclient.ts` reads that key on every request to set `Authorization: Bearer ...`. On 401, `checkError` calls `/auth/refresh` and replaces the stored token. Anything that constructs requests outside `httpClient` (e.g. `authProvider` itself) hits `http://localhost:3000` directly.
- Controllers are guarded by `JwtAuthGuard` at the class level — new controllers should follow suit unless explicitly public.

### Frontend store

`create-admin-store.ts` builds a Redux Toolkit store that combines three RTK Query API slices (`usersApi`, `resourcesApi`, `healthApi` under `src/store/api/`) and is wrapped around `<Admin>` via `<Provider>`. React-admin's own data layer is independent of this store; the RTK slices exist to power the `/rtk` custom routes and demonstrate patterns like `upsertQueryEntries`, optimistic updates, and request-batching (`usersApi.ts` `getManyUsers`). When touching `usersApi`, note the bespoke `batch()` helper that coalesces concurrent `getMany` calls into one request.

`httpclient-adapter.ts` adapts the same axios-based `httpClient` for use as an RTK Query `baseQuery`, so RTK endpoints and react-admin's `dataProvider` share auth handling.

`vite.config.ts` uses `vite-tsconfig-paths` and the tsconfig has `baseUrl: "src"` — imports like `resources/tasks/...` and `models/user.model` are absolute from `src/`, not relative.

### Build output

`yarn workspace react-admin-example build` writes to the repo-root `build/apps/react-admin-example` (configured in `vite.config.ts`), not to a per-app `dist/`. The NestJS app uses its own `apps/nestjs-example/dist/` (required by the `typeorm` script's entity/migration globs).

## Conventions

- Prettier config (root `.prettierrc`): no semicolons, single quotes, `printWidth: 120`, `trailingComma: 'none'`, `arrowParens: 'avoid'`. The NestJS workspace overrides this implicitly via its own ESLint/Prettier setup that does emit semicolons in `src/` — match the surrounding file.
- Imports in NestJS files are grouped with `// Packages`, `// Models`, `// Entities`, `// Dtos`, `// Services`, etc. comments. Keep that grouping when editing.
- `@Controller` classes apply `ValidationPipe({ whitelist: true, transform: true })` per route via `@UsePipes`; DTOs lean on `class-validator` decorators and `class-transformer` `@Transform` to coerce JSON-stringified query params.
