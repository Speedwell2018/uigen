# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Initial setup (install deps + generate Prisma client + run migrations)
npm run setup

# Development server (Turbopack)
npm run dev

# Build for production
npm run build

# Lint
npm run lint

# Run all tests
npm test

# Run a single test file
npx vitest run src/components/chat/__tests__/ChatInterface.test.tsx

# Reset database
npm run db:reset
```

Tests use Vitest with jsdom environment and `@testing-library/react`.

## Database

The database schema is defined in `prisma/schema.prisma`. Reference it whenever you need to understand the structure of data stored in the database.

## Code style

Use comments sparingly — only for complex logic that isn't self-evident from the code.

## Environment

Create a `.env` file with:
```
ANTHROPIC_API_KEY=your-key-here   # Optional — mock provider used if absent
JWT_SECRET=your-secret            # Optional — defaults to "development-secret-key"
```

Without `ANTHROPIC_API_KEY`, the app uses `MockLanguageModel` (see `src/lib/provider.ts`), which returns hardcoded counter/form/card components.

## Architecture

### Request flow

1. User types a message in `ChatInterface` → sent to `POST /api/chat`
2. The API route calls `streamText` (Vercel AI SDK) with two tools: `str_replace_editor` and `file_manager`
3. Tool calls stream back to the client; `ChatContext` routes each via `FileSystemContext.handleToolCall`
4. `FileSystemContext` mutates the in-memory `VirtualFileSystem`; `refreshTrigger` increments to notify consumers
5. `PreviewFrame` reads all files from VFS, runs `createImportMap` (which Babel-transforms each JS/TS/JSX/TSX file into a blob URL), injects an `<importmap>` into a sandboxed iframe, and renders the result

### Virtual file system

`VirtualFileSystem` (`src/lib/file-system.ts`) is a pure in-memory tree — nothing is written to disk. It supports create/read/update/delete/rename and serializes to/from plain JSON objects for persistence and wire transfer. The singleton `fileSystem` export is used server-side; the client uses the instance held in `FileSystemContext`.

### AI tools

- `str_replace_editor` (`src/lib/tools/str-replace.ts`): `create`, `str_replace`, `insert`, `view` commands operating on VFS
- `file_manager` (`src/lib/tools/file-manager.ts`): `rename` and `delete` commands

### Preview rendering

`src/lib/transform/jsx-transformer.ts` handles everything needed for in-browser preview:
- `transformJSX`: Babel-compiles a single file (strips TS types, transforms JSX, removes CSS imports)
- `createImportMap`: iterates all VFS files, transforms each, creates blob URLs, builds an `<importmap>` JSON that maps import specifiers to blob URLs; third-party packages resolve to `https://esm.sh/<pkg>`; missing local imports get placeholder stub modules
- `createPreviewHTML`: produces the full iframe HTML with Tailwind CDN, the importmap, collected CSS, and a module script that imports the entry point and mounts it via `ReactDOM.createRoot`

### Auth & persistence

- JWT sessions via `jose`, stored in an HTTP-only cookie (`auth-token`), 7-day expiry — see `src/lib/auth.ts`
- `src/middleware.ts` protects routes; anonymous users can use the app on `/` but cannot save projects
- Anonymous work is tracked in localStorage via `src/lib/anon-work-tracker.ts` so it can be recovered after sign-in
- `Project` rows store `messages` (JSON array) and `data` (serialized VFS nodes) as plain strings in SQLite
- Prisma client is generated into `src/generated/prisma` (not the default location)

### Contexts

- `FileSystemProvider` (`src/lib/contexts/file-system-context.tsx`): owns the VFS instance, exposes file operations and `handleToolCall`
- `ChatProvider` (`src/lib/contexts/chat-context.tsx`): wraps Vercel AI SDK's `useChat`, passes serialized VFS in every request body, wires `onToolCall` to `handleToolCall`

Both contexts must be nested inside each other in that order (FileSystem wraps Chat), as `ChatProvider` consumes `useFileSystem`.
