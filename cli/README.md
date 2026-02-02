# create-scottystack

Scaffold a new ScottyStack project - React + PocketBase full-stack starter.

## Usage

```bash
npx create-scottystack my-app
```

Or with npm:

```bash
npm create scottystack my-app
```

## What it does

1. Downloads the ScottyStack template
2. Installs dependencies
3. Runs the setup wizard to configure:
   - **PocketHost** - Use hosted PocketBase at pockethost.io
   - **Self-hosted** - Run PocketBase locally

## Options

```bash
# Create in specific directory
npx create-scottystack my-app

# Create in current directory
npx create-scottystack .

# Interactive mode (prompts for name)
npx create-scottystack
```

## Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router, TanStack Query
- **Backend**: PocketBase (SQLite + REST API + Realtime)
- **Auth**: Built-in with PocketBase

