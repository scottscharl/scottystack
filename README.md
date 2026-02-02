# ScottyStack Project

A modern full-stack application with React + Vite frontend and PocketBase backend.

## Quick Start

**Create a new project:**
```bash
npx create-scottystack my-app
cd my-app
```

**Or clone and setup manually:**
```bash
git clone https://github.com/YOURNAME/scottystack my-app
cd my-app
npm install
npm run setup
```

The setup wizard will ask you to choose a deployment mode:

- **PocketHost** - Use a hosted PocketBase instance at pockethost.io
- **Self-hosted** - Run PocketBase locally (downloads automatically if needed)

### Start Development Servers

**Self-hosted mode:**
```bash
./start-all.sh
```

**PocketHost mode:**
```bash
cd client && npm run dev
```

## Access Points

- **React App**: http://localhost:5173
- **PocketBase Admin**: http://localhost:8090/_/

## Project Structure

```
.
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # PocketContext for auth
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilities
│   │   ├── routes/         # Page components
│   │   ├── App.jsx         # Main app
│   │   └── main.jsx        # Entry point
│   └── package.json
│
└── server/                 # PocketBase backend
    ├── pocketbase          # PocketBase executable
    ├── pb_data/            # Database (created at runtime)
    └── pb_migrations/      # Database migrations

## Features

- ✅ Complete authentication system
- ✅ Protected routes
- ✅ Automatic token refresh
- ✅ TanStack Query integration
- ✅ Tailwind CSS styling
- ✅ React Router navigation

## First Steps

1. Start the servers using `./start-all.sh`
2. Create an admin account at http://localhost:8090/_/
3. Visit http://localhost:5173 and register a user
4. Start building your app!

## Environment Variables

Environment variables are in `client/.env.local`:

```
VITE_PB_URL=http://localhost:8090
```

## Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router, TanStack Query
- **Backend**: PocketBase (SQLite + REST API + Realtime)
- **Authentication**: Built-in with PocketBase
