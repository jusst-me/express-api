# Node Template

Minimal Node.js TypeScript template for backend projects (Express, NestJS, etc.).

## Project structure

- `src/` – source code
  - `config/` – configuration (env, app settings)
  - `services/` – business logic
  - `api/` – HTTP routes/controllers
  - `utils/` – helper functions
  - `types/` – shared TypeScript types
- Root – configuration (tsconfig, eslint, etc.)
- `AGENTS.md` – instructions for AI coding agents

## Requirements

- Node.js >= 24
- pnpm

## Installation

```bash
pnpm install
```

### Git GUIs (Fork, SourceTree, etc.)

If pre-commit hooks fail with "command not found", run once:

```bash
pnpm run prepare:gui
```

This creates `~/.config/husky/init.sh` so your Node/pnpm path is available in Git GUIs. [Husky docs](https://typicode.github.io/husky/how-to.html#node-version-managers-and-guis)

## Scripts

| Command           | Description                                      |
| ----------------- | ------------------------------------------------ |
| `pnpm dev`        | Start development with watcher (restart on save) |
| `pnpm dev:docker` | Start development in Docker with hot reload      |
| `pnpm build`      | Compile TypeScript to `dist/`                    |
| `pnpm start`      | Start the built application                      |
| `pnpm test`       | Run Jest tests                                   |
| `pnpm eslint`     | Run ESLint                                       |
| `pnpm prettier`   | Check formatting with Prettier                   |
| `pnpm format`     | Format code with Prettier                        |
| `pnpm lint`       | Run ESLint + Prettier                            |

## Development

**Local** (requires Node.js and pnpm):

```bash
pnpm dev
```

The application restarts automatically when you save files.

**Docker** (no local Node.js needed):

```bash
pnpm run dev:docker
# or: docker compose up app-dev
```

Source code is mounted as a volume, so changes are reflected immediately via hot reload.

## Production

```bash
pnpm build
pnpm start
```

## Docker

**Development** (hot reload): see [Development](#development) above.

**Production**:

```bash
docker build -t node-template .
docker run node-template
```

## CI

GitHub Actions runs on push and pull requests: lint, test, and `pnpm audit --audit-level=high`.
