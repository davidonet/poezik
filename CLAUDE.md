# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

poezik is a performance workshop booking system built with SvelteKit 5 and Tailwind CSS 4. The application manages periodic workshops with teachers and participants, featuring waiting lists and admin functionality.

## Tech Stack

- **Frontend**: Svelte 5 + SvelteKit 2
- **Styling**: Tailwind CSS 4 (via Vite plugin)
- **Build Tool**: Vite 7
- **Package Manager**: pnpm
- **Deployment**: Vercel
- **Planned Backend**: MongoDB + Redis
- **Planned Auth**: Vercel KV for magic links

## Essential Commands

```bash
# Development
pnpm dev          # Start development server on http://localhost:5173

# Build & Preview
pnpm build        # Build for production
pnpm preview      # Preview production build

# Code Quality
pnpm format       # Format all files with Prettier
pnpm lint         # Check formatting (no automatic fixes)

# Setup
pnpm install      # Install dependencies
pnpm prepare      # Sync SvelteKit types
```

## Project Architecture

The codebase follows SvelteKit's file-based routing convention:

- `src/routes/` - Pages and API endpoints
- `src/lib/` - Shared components and utilities
- `src/app.css` - Global styles with Tailwind directives
- `static/` - Static assets served directly

### Key Configuration Files

- `svelte.config.js` - Configures Vercel adapter for deployment
- `vite.config.js` - Integrates Tailwind CSS 4 and SvelteKit plugins
- `.prettierrc` - Enforces consistent code style (no semicolons, single quotes)

## Development Guidelines

1. **Routing**: Use SvelteKit's file-based routing. Create `+page.svelte` for pages and `+server.js` for API endpoints.

2. **Styling**: Use Tailwind utility classes. The new Tailwind CSS 4 is configured via Vite plugin.

3. **Code Style**: Prettier is configured with no semicolons and single quotes. Always run `pnpm format` before committing.

4. **State Management**: Use Svelte's built-in stores for reactive state management.

## Planned Features (from README)

- User registration with magic link authentication (15-day expiration)
- Event management (max 2 teachers, 14 participants)
- Waiting list functionality
- Admin dashboard with full CRUD capabilities
- Responsive event carousel
- User profiles and booking history
