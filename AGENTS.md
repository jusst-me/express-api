# Agent instructions

Context for AI coding agents working on this project.

## Project structure

- `src/` – all source code
  - `config/` – configuration (env, app settings)
  - `services/` – business logic
  - `api/` – HTTP routes/controllers
  - `utils/` – helper functions
  - `types/` – shared TypeScript types (use colocated `.types.ts` per module when possible)
- Root – configuration only (tsconfig, eslint, prettier, etc.)

## Code conventions

### Documentation and comments

All documentation and code comments must be written in English.

- README files
- JSDoc comments
- Inline comments
- API documentation

### Source files (`src/**/*.ts`)

- Keep source code in `src/`
- Entry point: `src/index.ts`

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
