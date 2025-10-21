# ReelBoost - SMM Panel Platform

## Overview

ReelBoost is a professional Social Media Marketing (SMM) panel that allows users to purchase social media engagement services (followers, likes, views) across multiple platforms including Instagram, YouTube, Facebook, Twitter, TikTok, and Telegram. The application features a modern dashboard for managing orders, wallet-based payments, referral systems, and admin controls for service management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast hot module replacement
- **Wouter** for client-side routing (lightweight alternative to React Router)
- **TanStack Query (React Query)** for server state management and data fetching

**UI Component System**
- **Shadcn/ui** component library based on Radix UI primitives
- **Tailwind CSS** for utility-first styling with custom design tokens
- **Design System**: "New York" style variant inspired by Linear and Notion, emphasizing data clarity and professional aesthetics
- **Theme Support**: Light and dark mode with CSS custom properties
- **Typography**: Inter font family (Google Fonts) for consistency

**State Management Strategy**
- Server state managed through React Query with query key-based caching
- Authentication state derived from `/api/auth/user` endpoint
- No global client state management library - local component state used where appropriate
- Form state handled by React Hook Form with Zod schema validation

### Backend Architecture

**Server Framework**
- **Express.js** with TypeScript running on Node.js
- Middleware stack includes JSON parsing, URL encoding, and request/response logging
- Custom error handling middleware for consistent error responses

**Authentication & Authorization**
- **Replit Auth** integration using OpenID Connect (OIDC) strategy
- Passport.js for authentication middleware
- Session management via `express-session` with PostgreSQL-backed session store
- Role-based access control (user, reseller, admin) enforced at route level
- API key authentication for reseller API endpoints

**Database Layer**
- **Drizzle ORM** for type-safe database operations
- **Neon Serverless PostgreSQL** as the database provider with WebSocket connections
- Schema-driven development with migrations managed through Drizzle Kit
- Enums for constrained values (platforms, order status, transaction types, user roles)

**Data Models**
- **Users**: Authentication, wallet balance, referral codes, API keys, role assignment
- **Services**: Platform-specific offerings with pricing, quantity limits, delivery times
- **Orders**: User purchases with status tracking, target links, quantity, calculated amounts
- **Transactions**: Financial records for deposits, order charges, refunds, referral commissions
- **Referrals**: Commission tracking for user-referred signups
- **Payment Proofs**: UPI payment verification with screenshot uploads and admin approval workflow

**API Design**
- RESTful conventions with `/api` prefix
- Rate limiting (100 requests per 15 minutes per IP) on all API routes
- Authentication required for all endpoints except landing page
- Dedicated `/api/reseller` routes for API-based integrations
- Admin-only routes protected with `isAdmin` middleware

### Payment System

**Wallet-Based Architecture**
- Users must pre-fund wallets before placing orders
- UPI manual payment flow: user transfers funds, submits UTR number and screenshot
- Admin approval required for wallet top-ups (prevents fraud)
- Decimal precision maintained for monetary calculations
- Transaction history provides full audit trail

**Referral Commission System**
- Each user receives a unique referral code on signup
- Referrers earn commission when referred users make purchases
- Commission amounts tracked in separate transactions

### External Dependencies

**Third-Party Services**
- **Replit Auth**: OAuth/OIDC authentication provider (`process.env.ISSUER_URL`, `process.env.REPL_ID`)
- **Neon Database**: Serverless PostgreSQL hosting (`process.env.DATABASE_URL`)
- **Google Fonts**: Inter and Roboto Mono font families loaded via CDN

**UI Component Libraries**
- **Radix UI**: Accessible, unstyled component primitives (accordion, dialog, dropdown, select, tabs, toast, etc.)
- **Lucide React**: Icon library for consistent iconography
- **date-fns**: Date manipulation and formatting
- **cmdk**: Command palette component
- **Recharts**: Charting library for data visualization (referenced but not heavily implemented)
- **Stripe**: Payment processing infrastructure (installed but UPI manual flow used instead)

**Development Tools**
- **Replit-specific plugins**: Cartographer, dev banner, runtime error overlay for Replit IDE integration
- **TSX**: TypeScript execution for development server
- **ESBuild**: Production build bundling for server code

### Security & Performance

**Security Measures**
- Session cookies with `httpOnly`, `secure` flags and 1-week TTL
- CSRF protection through session-based authentication
- Rate limiting on API routes to prevent abuse
- Role-based authorization checks on sensitive routes
- Environment variable validation at startup

**Performance Optimizations**
- Query result caching via React Query with infinite stale time
- Memoization for expensive OIDC configuration lookups
- WebSocket connections to Neon Database for reduced latency
- Vite's optimized build output with code splitting

### Project Structure Decisions

**Monorepo Layout**
- `/client`: Frontend React application with components, pages, hooks, and utilities
- `/server`: Backend Express application with routes, database layer, and authentication
- `/shared`: Shared TypeScript types and Drizzle schema definitions
- Path aliases configured: `@/` for client, `@shared/` for shared code, `@assets/` for static assets

**Build & Deployment Strategy**
- Development: Vite dev server proxies API requests to Express backend
- Production: Vite builds static assets, ESBuild bundles server code
- Single deployment artifact with static files served from `/dist/public`
- Environment-based configuration via `NODE_ENV` variable