# Remates Judiciales - Frontend

A Next.js application for managing judicial auction assets with TypeScript, React, Tailwind CSS, and Clerk authentication.

## Features

- **Multi-language Support**: Spanish (default) and English
- **Dark/Light Theme**: Dark blue-based UI with theme toggle
- **Responsive Design**: Desktop sidebar and mobile hamburger menu
- **Authentication**: Clerk-based authentication with 2FA support
- **Data Management**: CRUD operations for properties, vehicles, assets, edicts, and more

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **UI Library**: React 18+
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Authentication**: Clerk
- **Internationalization**: next-intl
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your Clerk keys
```

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/properties
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/properties
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

### Development

```bash
# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── (public)/           # Public pages (no auth required)
│   │   │   ├── page.tsx        # Home
│   │   │   ├── info/           # Information
│   │   │   ├── sign-in/        # Sign in
│   │   │   └── sign-up/        # Sign up
│   │   └── (app)/              # Protected pages (auth required)
│   │       ├── properties/     # Properties management
│   │       ├── vehicles/       # Vehicles management
│   │       ├── assets/         # Assets management
│   │       ├── edicts/         # Edicts management
│   │       ├── bulletins/      # Judicial bulletins
│   │       ├── extracted-*/    # Data extraction
│   │       ├── tags/           # Property tags
│   │       ├── territorial/    # Provinces, Cantons, Districts
│   │       └── config/         # General configuration
│   └── layout.tsx              # Root layout
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── data-grid/              # Reusable DataGrid component
│   ├── layout/                 # Sidebar, MobileNav, etc.
│   └── forms/                  # CRUD form components
├── hooks/                      # Custom React hooks
├── lib/                        # Utilities (formatters, etc.)
├── messages/                   # i18n translations (es.json, en.json)
├── services/                   # API service stubs
├── types/                      # TypeScript type definitions
└── i18n/                       # Internationalization config
```

## Pages

### Public Pages (No Authentication)
- **Home** (`/`): Landing page with sign in/up links
- **Information** (`/info`): About the platform
- **Sign In** (`/sign-in`): Clerk sign-in with 2FA
- **Sign Up** (`/sign-up`): Clerk registration

### Protected Pages (Requires Authentication)
- **Properties**: Real estate property management
- **Vehicles**: Vehicle auction tracking
- **Assets**: General asset management
- **Edicts**: Judicial edict management
- **Bulletins**: Judicial bulletin processing
- **Extracted Edicts/Assets**: Data extraction results
- **Tags**: Property classification tags
- **Territorial Division**: Provinces, Cantons, Districts
- **Configuration**: System settings

## Key Components

### DataGrid
A reusable, parameterized data grid component with:
- Compact row height
- Fixed-width columns with dividers
- Single row selection
- Actions column anchored to the right
- Pagination with editable page input
- Toolbar with filter, download, and reload buttons

### Sidebar
Collapsible navigation sidebar with:
- Grouped menu items with submenus
- Icons-only collapsed mode
- Theme toggle
- Language selector
- User profile menu

### Modal
Semi-transparent modal dialog for CRUD operations.

## Data Formats

- **Currency**: ISO 3-digit prefix (CRC, USD, EUR)
- **Tags**: Colored badges with hex colors
- **Timestamps**: YYYY-MM-DD HH:mm (24-hour)

## Internationalization

The app supports Spanish (default) and English. Translations are in `src/messages/`:
- `es.json`: Spanish translations ("Remates", "Bienes", etc.)
- `en.json`: English translations ("Auctions", "Assets", etc.)

## API Integration

The frontend is designed to work with a REST API backend.

### Services

API services are located in `src/services/`:

- `propertiesService` - Properties CRUD operations
- `edictsService` - Edicts CRUD operations
- `tagsService` - Property tags CRUD operations
- `vehiclesService` - Vehicles CRUD operations
- `assetsService` - Assets CRUD operations
- `bulletinsService` - Bulletins CRUD operations
- `territorialService` - Provinces, Cantons, Districts

### API Client

The API client (`src/lib/api-client.ts`) provides:
- Bearer token authentication (Clerk JWT)
- Request timeout handling
- Error handling with `ApiError` class
- Base URL configured via `NEXT_PUBLIC_API_URL`

## License

©2026 Ad Nebula LLC., All rights reserved.