# UIGen

AI-powered React component generator with live preview. Describe a component in plain English, watch it get built in real time, and iterate with follow-up prompts.

## Prerequisites

- Node.js 18+
- npm

## Setup

1. Copy `.env.example` to `.env` and configure:

```
ANTHROPIC_API_KEY=your-api-key-here   # Optional — mock provider used if absent
JWT_SECRET=your-secret                 # Optional — defaults to a development key
```

Without `ANTHROPIC_API_KEY` the app runs with a built-in mock that returns hardcoded components, useful for UI development without incurring API costs.

2. Install dependencies and initialize the database:

```bash
npm run setup
```

This installs dependencies, generates the Prisma client, and runs migrations.

## Development

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # Lint
npm test         # Run tests
npm run db:reset # Reset the database
```

## Usage

1. Sign up or continue as an anonymous user
2. Describe the React component you want in the chat
3. Watch it appear in the live Preview panel as it's generated
4. Switch to Code view to browse and edit the generated files
5. Keep chatting to refine or extend the component

Anonymous work is preserved in localStorage so nothing is lost if you sign up mid-session.

## How it works

- **Chat** — prompts stream to `POST /api/chat`, which calls Claude with two tools: `str_replace_editor` (create/edit files) and `file_manager` (rename/delete)
- **Virtual file system** — all generated files live in memory; nothing is written to disk
- **Live preview** — files are Babel-compiled to blob URLs in the browser, wired together via an import map, and rendered in a sandboxed iframe with Tailwind and React 19
- **Persistence** — signed-in users get projects saved to SQLite (messages + file system snapshot)

## Tech Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Vercel AI SDK + Anthropic Claude (claude-haiku-4-5)
- Prisma + SQLite
- Babel Standalone (in-browser JSX transform)
- Monaco Editor
