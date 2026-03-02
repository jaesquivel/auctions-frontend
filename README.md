# Remates Judiciales — Frontend

Next.js application for managing judicial auction assets with TypeScript, Tailwind CSS, and Clerk authentication.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Authentication**: Clerk
- **Internationalization**: next-intl (Spanish default, English)
- **Package Manager**: pnpm 10

## Prerequisites

- Node.js 22 LTS
- pnpm 10

---

## Development

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

Copy the example and fill in your values:

```bash
cp .env.local .env.local
```

Required variables:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (baked at build time) |
| `CLERK_SECRET_KEY` | Clerk secret key (server-side only, runtime) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in route (default `/sign-in`) |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up route (default `/sign-up`) |
| `NEXT_PUBLIC_API_PORT` | Backend port (default `8080`) |
| `NEXT_PUBLIC_API_BASE_PATH` | Backend base path (default `/api/v1`) |
| `NEXT_PUBLIC_LOG_TOKENS` | Log auth tokens to console (default `false`) |

The API base URL is derived at runtime from the browser's `window.location` hostname + `NEXT_PUBLIC_API_PORT` + `NEXT_PUBLIC_API_BASE_PATH`, so no separate URL variable is needed.

### 3. Start the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Production Build

```bash
# Build
pnpm build

# Start
pnpm start
```

---

## Docker

The image uses a three-stage build (`deps → builder → runner`) and emits a minimal standalone server via `output: 'standalone'`.

### Build

`NEXT_PUBLIC_*` variables are baked into the JS bundle at build time — pass them as build args:

```bash
docker build \
  --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx \
  -t auctions-frontend:latest .
```

Or use the package.json shortcut (reads `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` from the current shell):

```bash
pnpm docker:build
```

### Run

`CLERK_SECRET_KEY` is server-side only — pass it at runtime:

```bash
docker run -p 3000:3000 \
  -e CLERK_SECRET_KEY=sk_live_xxx \
  auctions-frontend:latest
```

Or:

```bash
pnpm docker:run
```

### Behind nginx (recommended for production)

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    location / {
        proxy_pass         http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Project Structure

```text
src/
├── app/
│   ├── [locale]/
│   │   ├── (public)/           # Landing, sign-in, sign-up
│   │   └── (app)/              # Protected pages
│   │       ├── properties/     # Real estate properties
│   │       ├── vehicles/       # Vehicle auctions
│   │       ├── assets/         # General assets
│   │       ├── edicts/         # Judicial edicts
│   │       ├── bulletins/      # Judicial bulletins
│   │       ├── extracted-*/    # Extraction results
│   │       ├── tags/           # Property tags
│   │       ├── territorial/    # Provinces / Cantons / Districts
│   │       └── config/         # System configuration
├── components/
│   ├── ui/                     # shadcn/ui primitives
│   ├── data-grid/              # DataGrid with filtering, sorting, pagination
│   ├── layout/                 # Sidebar, MobileNav
│   └── forms/                  # CRUD forms
├── hooks/                      # Custom React hooks
├── lib/                        # api-client, formatters, utils
├── messages/                   # Translations (es.json, en.json)
├── services/                   # API service layer
├── types/                      # TypeScript types
└── i18n/                       # next-intl config
```

---

## Key Components

### DataGrid (`src/components/data-grid/`)

Reusable data grid with:

- Column sorting (multi-column)
- Advanced filter dialog (multiple groups, AND/OR logic)
- Saved filters — persist named filter sets via the API (`GET/POST/PUT/DELETE /saved_filters`)
- Tag picker for tag-based filters
- Datetime filter support
- Resizable columns, pagination, row actions

### API Client (`src/lib/api-client.ts`)

- Attaches Clerk JWT to every request (`Authorization: Bearer ...`)
- Derives base URL from `window.location.hostname` + `NEXT_PUBLIC_API_PORT`
- Configurable request timeout (default 30 s)
- Shows toast notifications on API errors

### Services (`src/services/`)

| Service | Endpoint prefix |
| --- | --- |
| `propertiesService` | `/properties` |
| `savedFiltersService` | `/saved_filters` |
| `tagsService` | `/tags` |
| `edictsService` | `/edicts` |
| `assetsService` | `/assets` |
| `vehiclesService` | `/vehicles` |
| `bulletinsService` | `/bulletins` |
| `territorialService` | `/provinces`, `/cantons`, `/districts` |

---

## License

©2026 Ad Nebula LLC., All rights reserved.
