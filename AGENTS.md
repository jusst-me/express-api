# Agent instructions

Context for AI coding agents working on this project.

## Project structure

- `src/` – all source code
  - `config/` – configuration (env, app settings)
  - `constants/` – shared constants (HTTP status, JSend status, errors, API paths, validation limits)
  - `services/` – business logic
  - `api/` – HTTP routes/controllers
  - `utils/` – helper functions
  - `types/` – shared TypeScript types (use colocated `.types.ts` per module when possible)
- Root – configuration only (tsconfig, eslint, prettier, etc.)

## Code conventions

### Constants

Avoid magic values. Use constants from `src/constants/`:

- `HttpStatus` – HTTP status codes (OK, CREATED, BAD_REQUEST, NOT_FOUND, etc.)
- `JSendStatus` – JSend response status (SUCCESS, FAIL, ERROR)
- `ErrorMessages` – API error messages
- `ApiPaths` – API path segments (BASE, DOCS)
- `ValidationLimits` – field length limits (NAME_MAX, TITLE_MAX, EMAIL_MAX)
- `DbFilenames`, `DB_DATA_DIR` – database paths

### API responses (JSend)

All API responses use the [JSend](https://github.com/omniti-labs/jsend) format. Use the helpers in `src/utils/jsend.ts`:

- `success(res, data, statusCode?)` – success responses
- `fail(res, data, statusCode?)` – client errors (validation, not found, etc.)
- `error(res, message, options?)` – server errors (500)

The error handler (`src/utils/errorHandler.ts`) already maps exceptions to JSend `fail`/`error` responses.

### Documentation and comments

All documentation and code comments must be written in English.

- README files
- JSDoc comments
- Inline comments
- API documentation

### Source files (`src/**/*.ts`)

- Keep source code in `src/`
- Entry point: `src/index.ts`

### ESLint rule overrides

When a rule must be disabled for a specific file, add an `eslint-disable` comment at the top of that file rather than in `eslint.config.mjs`. This keeps the exception local and documents why it applies.

```ts
/* eslint-disable n/no-sync */
import fs from 'fs';
```

## Commands

| Command         | Description                                |
| --------------- | ------------------------------------------ |
| `pnpm dev`      | Development with watcher (restart on save) |
| `pnpm build`    | Compile TypeScript to `dist/`              |
| `pnpm start`    | Run built application                      |
| `pnpm test`     | Run Jest tests                             |
| `pnpm eslint`   | Run ESLint                                 |
| `pnpm prettier` | Check formatting                           |
| `pnpm format`   | Fix formatting                             |
| `pnpm lint`     | Run ESLint + Prettier                      |

## Before committing

Pre-commit hooks (Husky + lint-staged) run ESLint and Prettier on staged files automatically. Run `pnpm lint` manually to check the full codebase.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
```

### Type

- `feat` – new feature
- `fix` – bug fix
- `docs` – documentation only
- `chore` – maintenance (deps, config, etc.)
- `refactor` – code change without fixing a bug or adding a feature
- `test` – adding or updating tests
- `style` – formatting, no code change

### Rules

- Use imperative mood: "add" not "added", "fix" not "fixed"
- Subject line: max ~50 characters
- Body: wrap at ~72 characters
- Scope is optional (e.g. `feat(auth): add login`)

### Examples

```
feat: add user authentication
fix(api): handle empty response
docs: update installation steps
chore(deps): bump typescript to 5.10
```

### Cursor users

For Cursor's "Generate Commit Message" feature to follow these conventions, the project includes `.cursor/rules/commit-messages.mdc`. This rule is applied when generating commit messages via the Source Control sparkle button.
