# ScottyStack

React + Vite frontend with PocketBase backend.

## Deployment Modes

This project supports two deployment modes, configured via `npm run setup`:

1. **PocketHost** - Backend hosted at pockethost.io (set VITE_PB_URL to your instance)
2. **Self-hosted** - PocketBase runs locally in /server (VITE_PB_URL=http://127.0.0.1:8090)

## Project Structure

- `/client` - React frontend (Vite, Tailwind, React Router, TanStack Query)
- `/server` - PocketBase binary and data (self-hosted mode only)
- `/cli` - `create-scottystack` npm package for scaffolding new projects
- `/setup.mjs` - Interactive setup wizard

## CLI Package (create-scottystack)

The `/cli` folder contains a publishable npm package. Users can run:
```
npx create-scottystack my-app
```

To publish: update `TEMPLATE_REPO` in `cli/index.mjs` to your GitHub repo, then `cd cli && npm publish`.

## Key Files

- `client/.env.local` - Contains VITE_PB_URL (created by setup wizard)
- `client/src/context/PocketContext.jsx` - Auth context, PocketBase client
- `start-all.sh` - Starts both PocketBase and React dev server

## Commands

- `npm run setup` - Configure deployment mode
- `npm run dev` - Start all servers (self-hosted)
- `npm run client` - Start React only (PocketHost mode)

## Environment Variables

- `VITE_PB_URL` - PocketBase URL (required)
