# Agent Guidelines for Personal Finance Frontend

## Build & Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (runs TypeScript compiler then Vite build)
- `npm run lint` - Run ESLint on all TypeScript/TSX files
- `npm run preview` - Preview production build locally

**Note:** No test framework is configured in this project.

## Code Style & Conventions

### Imports

- Use `@/*` alias for src directory imports (configured in vite.config.ts)
- Third-party imports first, then local imports
- React and UI components: `import { Component } from "@/components/ui/component"`
- Pages: `import { PageName } from "@/pages/page-name"`
- Hooks/queries: `import { useHook } from "@/tanstack-queries/file"`

### Formatting & Styling

- **Indentation:** 2 spaces
- **Tailwind CSS v4** with CSS variables for theming
- **shadcn/ui** component library (Radix UI primitives + Tailwind)
- Use `cn()` utility from `@/lib/utils` for className merging
- Use **CVA (class-variance-authority)** for component variants
- Always add `"use client"` directive at top of client components

### TypeScript

- **Types:** Export with `T` prefix: `export type TInvoice = {...}`
- **Interfaces:** Prefix with `I`: `interface IUpdateMovement {...}`
- Component props: Intersection of `React.ComponentProps` and variant props
- Path aliases: `@/*` maps to `./src/*` (tsconfig.json)

### Naming Conventions

- **Components:** PascalCase (HomePage, Button, DarkVeil)
- **Functions:** camelCase (formatBRLInput, parseBRLInput)
- **Hooks:** camelCase with `use` prefix (useApi, useQueryMovements)
- **Query hooks:** `useQuery*` for reads, `use*` for mutations
- **Files:** kebab-case (button.tsx, card-invoices/index.tsx)
- **API functions:** `use*` prefix (useLogin, useFilterMovement)

### React Patterns

- **Routing:** TanStack Router (file-based routing in `src/routes/`)
- **Data fetching:** TanStack Query for API calls
- **Forms:** TanStack Form with Zod validation
- **Auth:** Token stored in localStorage, redirects to /login on 401
- **State:** Query invalidation after mutations, optimistic updates with onMutate

### Error Handling

- Check for 401 status in API responses, clear authToken and redirect to /login
- Use `console.error` for error logging
- Return appropriate error responses from API functions

### File Structure

- `src/components/ui/` - Reusable UI components (shadcn/ui)
- `src/components/` - Feature-specific components (team/, navbar.tsx)
- `src/pages/` - Page components (home/, login.tsx, metrics.tsx)
- `src/routes/` - Route definitions (app.home.tsx, __root.tsx)
- `src/tanstack-queries/` - React Query hooks (movements.tsx, categories.tsx)
- `src/service/` - API service layer (api.tsx)
- `src/lib/` - Utility functions (utils.ts)

### Component Patterns

- Export variants separately: `export { Button, buttonVariants }`
- Use forwardRef for interactive components
- Support `asChild` prop with Radix Slot for composition
- Use data-slot attribute for component identification

### API Integration

- Centralized API service via `useApi()` hook
- Base URL from `VITE_API_BASE_URL` env variable
- Bearer token authentication from localStorage
- Standard headers: `Content-Type: application/json`
- Query keys: arrays with resource name and filters (e.g., `["movements", safeMonth, safeYear]`)

### Notes

- This project uses **no test framework** - verify functionality manually
- Always run `npm run lint` before committing changes
- Check TypeScript compilation with `npm run build` for type errors
- Follow existing patterns when adding new features or components
