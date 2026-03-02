# Frontend Project Guide for Claude Code

This document provides context and guidelines for working with Claude Code on this Next.js frontend application.

## Project Overview

This is a Next.js application built with TypeScript and React.

## Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **UI Library**: React 18+
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm

## Project Structure

```
frontend-fai/
├── .claude/                    # Claude Code configuration
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── [route]/            # Route folders
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI components
│   │   └── [feature]/          # Feature-specific components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions and configs
│   ├── services/               # API service functions
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets
├── .env.local                  # Local environment variables
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## Key Conventions

### File Naming
- Components: PascalCase (`Button.tsx`, `UserCard.tsx`)
- Hooks: camelCase with `use` prefix (`useAuth.ts`, `useFetch.ts`)
- Utilities: camelCase (`formatDate.ts`, `cn.ts`)
- Types: PascalCase (`User.ts`, `ApiResponse.ts`)

### Component Structure
```tsx
// Imports
import { useState } from 'react';

// Types
interface ComponentProps {
  title: string;
  onClick?: () => void;
}

// Component
export function Component({ title, onClick }: ComponentProps) {
  // Hooks
  const [state, setState] = useState(false);

  // Handlers
  const handleClick = () => {
    onClick?.();
  };

  // Render
  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
}
```

### Code Style
- Use functional components with hooks
- Prefer named exports over default exports
- Use TypeScript strict mode
- Use `interface` for object shapes, `type` for unions/intersections
- Destructure props in function parameters

## Development Workflow

### Commands
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Type checking
pnpm tsc --noEmit
```

### Environment Variables
Create `.env.local` for local development:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

## Best Practices

### When Making Changes
1. Read existing code first to understand patterns
2. Follow established conventions
3. Keep components small and focused
4. Use TypeScript strictly - avoid `any`
5. Test changes in development before committing
6. **Always update README.md** with pertinent information when adding features, changing setup steps, or modifying project configuration

### Component Development
- Keep components small and reusable
- Extract logic into custom hooks
- Use composition over inheritance
- Handle loading and error states

### API Integration
- Use services layer for API calls
- Handle errors gracefully
- Show loading states
- Type all API responses

## Git Workflow

### Commit Message Format
```
feat: Add user profile page
fix: Correct navigation bug
refactor: Extract auth logic to hook
chore: Update dependencies
docs: Add API documentation
```