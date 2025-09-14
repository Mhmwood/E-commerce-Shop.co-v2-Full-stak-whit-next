# E‑commerce Shop (Next.js + Prisma + Stripe + Supabase)

This repository is a full-stack e-commerce storefront built with Next.js (App Router), TypeScript, Prisma (PostgreSQL), NextAuth, Stripe for payments, and Supabase for image storage. The app includes a public shop, product pages, cart and checkout flow, user profiles, reviews, and an admin area for managing products, users and analytics.

## Quick summary

- Framework: Next.js (App Router)
- Language: TypeScript
- ORM: Prisma (PostgreSQL)
- Auth: NextAuth (email/password + providers)
- Payments: Stripe (checkout + webhooks)
- File storage: Supabase Storage (public images)
- UI: Tailwind CSS, framer-motion, shadcn, lucide-react
- State & data fetching: Redux Toolkit + React Query

## Key features

- User registration, signin, profiles and role-based access (ADMIN / USER)
- Product catalog with rich product model (images, tags, SKU, dimensions, meta, stock, availability)
- Search and pagination components
- Cart and server-side checkout using Stripe Checkout
- Payment webhooks to track payments and create orders
- Product reviews with ratings and comments
- Admin area to manage products, users, orders and view analytics
- Image upload & deletion via Supabase Storage
- Prisma for migrations and type-safe DB access

## Data model highlights

The Prisma schema (see `prisma/schema.prisma`) includes models for:

- User, Account, Session, VerificationToken (NextAuth-compatible models)
- Product, ProductDimensions, ProductMeta, ProductReview
- CartItem, Order, OrderItem, PaymentCustomer

Relationships, indexes and common fields (createdAt, updatedAt) are defined to support queries and admin operations.

## Environment variables

Create a `.env` file in the project root. Do NOT commit real secrets. Below are the variables the app expects:

- DATABASE_URL - PostgreSQL connection string used by Prisma
- NEXTAUTH_SECRET - NextAuth session secret
- NEXTAUTH_URL - Base URL of your app (e.g. `http://localhost:3000`)
- NEXT_PUBLIC_SUPABASE_URL - Supabase project URL (client-side)
- NEXT_PUBLIC_SUPABASE_ANON_KEY - Supabase anon public key (client-side)
- STRIPE_PUBLIC_KEY - Stripe publishable key (client-side)
- STRIPE_SECRET_KEY - Stripe secret key (server-side)
- STRIPE_WEBHOOK_SECRET - Stripe webhook secret for verifying events (server-side)

Notes:

- Any env var prefixed with `NEXT_PUBLIC_` is available on the client. Keep secret keys (STRIPE_SECRET_KEY, NEXTAUTH_SECRET, DATABASE_URL) out of client-side env.
- The repository already contains a sample `.env` with example keys. Replace values with your own tokens before running in production.

## Prerequisites

- Node.js 18+ (or recommended LTS)
- npm or yarn or pnpm
- PostgreSQL (or a hosted DB such as Neon / Supabase / Heroku Postgres)
- Stripe account (for payments)
- Supabase project (for image storage) — configure a public storage bucket or adjust code accordingly

## Setup - Local development

1. Install dependencies

   npm install

2. Create `.env` and populate required variables (see section above).

3. Initialize the database and Prisma client

   npm run db:generate
   npm run db:migrate

   (If you prefer to push the schema without generating migrations)
   npm run db:push

4. Seed the database (if seed script is provided)

   npm run db:seed

5. Start the dev server

   npm run dev

6. (Optional) To test Stripe webhooks locally, run the Stripe CLI and forward events to the app:

   npm run stripe:listen

   Then create test payments with the Stripe test card numbers in the Stripe dashboard or client-side flows.

## Important scripts

- npm run dev — Start Next.js in development with turbopack
- npm run build — Build for production
- npm run start — Start the built Next.js server
- npm run lint — Run linter
- npm run db:generate — Run `prisma generate`
- npm run db:migrate — Run `prisma migrate dev --name init`
- npm run db:push — Run `prisma db push`
- npm run db:seed — Run the repository seed script (`prisma/seed.ts`)
- npm run db:studio — Open Prisma Studio
- npm run stripe:listen — Stripe CLI helper defined in package.json

## Stripe webhooks

- The app includes a webhook route at `app/api/webhook/route.ts` which validates incoming events using `STRIPE_WEBHOOK_SECRET`.
- To test webhooks locally: install the Stripe CLI, authenticate, then run `npm run stripe:listen` to forward events to `http://localhost:3000/api/webhook`.

## Supabase storage

- Images are uploaded and deleted using helper modules under `lib/upload`. They reference `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Configure CORS and storage rules in your Supabase project so that uploads and public reads work as intended.

## Authentication

- Authentication is implemented with NextAuth (see `lib/auth`). The Prisma adapter is used for persistence. Sessions, accounts and verification tokens are stored in the database.
- The middleware uses `NEXTAUTH_SECRET` and `NEXTAUTH_URL` to secure sessions and redirects.

## Admin area

- The project includes an admin UI under `app/(pages)/admin` (routes for products, users, reviews). Admin pages assume the authenticated user has the `ADMIN` role.

## Prisma & database

- The schema is in `prisma/schema.prisma`. Use the provided Prisma scripts to generate the client, run migrations and open Studio.
- Typical workflow:
  - Edit `prisma/schema.prisma`
  - Run `npm run db:migrate` to create a migration and apply it
  - Run `npm run db:generate` if needed
  - Optionally run `npm run db:studio` to inspect data

### Database Seeding

This project uses DummyJSON to populate the database with realistic fake products.
All product images are uploaded to Supabase Storage for easy access.

The seeder automatically adds:

- Product details (title, description, price, brand, stock)
- Product images (thumbnail + gallery)
- Categories
- Dimensions and metadata

## Deployment notes

- Vercel (recommended) or any Node-compatible host that supports Next.js App Router works.
- Required environment variables on the hosting platform: DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET.
- For Stripe webhooks in production, configure the webhook endpoint in the Stripe dashboard and copy the `STRIPE_WEBHOOK_SECRET` into your environment.

## Troubleshooting

- "Invalid or missing env var": ensure `.env` exists and variables are named exactly as listed.
- Supabase image issues: check storage bucket public rules and that `NEXT_PUBLIC_SUPABASE_URL` is correct.
- Stripe webhook 400/401: verify the webhook secret and that events are forwarded to the correct URL.

## Security notes

- Never commit `.env` with real secrets. Rotate any tokens accidentally committed.
- Keep `STRIPE_SECRET_KEY` and `DATABASE_URL` server-only. Only `NEXT_PUBLIC_*` keys may be exposed to the client.

## Small developer contract

- Inputs: RESTful API requests from the frontend and Stripe webhooks; env vars as configuration
- Outputs: JSON responses from API routes, rendered pages from Next.js, Stripe payment creation and order objects
- Error modes: validation errors (400), auth/permission errors (401/403), server errors (500)
