# Mkhasa — Next.js App Router

Fully migrated from React Router DOM + Vite to **Next.js 14 App Router**.

## Architecture

```
app/                        ← Next.js App Router pages (server components by default)
├── layout.jsx              ← Root layout: metadata, fonts, analytics, global providers
├── providers.jsx           ← Client providers: TanStack Query, Auth, Cart, Notifications
├── not-found.jsx           ← Global 404
└── (site)/                 ← Site route group (Navbar + Footer layout)
    ├── layout.jsx          ← Async server component — fetches categories server-side
    ├── page.jsx            ← Home — metadata + server data fetch
    ├── page.client.jsx     ← Home client shell
    ├── products/[productName]/
    │   ├── page.jsx        ← Product — generateMetadata + JSON-LD + server data
    │   └── page.client.jsx ← Product client shell
    ├── brands/...
    ├── categories/...
    └── ...

src/
├── app-pages/              ← Client page components (marked "use client")
├── components/             ← Shared UI components (marked "use client" where needed)
├── contexts/               ← Auth and Cart contexts only (client-side state)
├── hooks/                  ← TanStack Query hooks and utility hooks
├── seo/                    ← Server-side metadata helpers (nextMetadata.js, serverData.js)
├── utils/                  ← Pure utilities: paths, slugify, cn, productApi, etc.
└── legacy/                 ← Minimal shim layer (router-shim, loaders-client, route-loaders)
```

## Key changes from React Router

| Before | After |
|--------|-------|
| `import { Link } from "react-router-dom"` | `import Link from "next/link"` |
| `import { useNavigate } from "react-router-dom"` | `import { useRouter } from "next/navigation"` + `router.push()` |
| `import { useParams } from "react-router-dom"` | `import { useParams } from "next/navigation"` |
| `import { useSearchParams } from "react-router-dom"` | `import { useSearchParams } from "next/navigation"` |
| `<Helmet>` / `react-helmet-async` | `export const metadata` in `page.jsx` (server) |
| `react-router-dom` alias shim | Removed entirely |
| `src/App.jsx` + `src/main.jsx` | Removed (Next.js App Router owns routing) |
| `AppProviders` with HelmetProvider + legacy contexts | Clean `app/providers.jsx` |
| `ProductContext`, `BrandContext`, `AppealContext` | Removed; data fetched per-page via server components or TanStack Query |
| `vite.config.js`, `webpack.config.js` | Removed |
| Site layout (`"use client"` + `useEffect` category fetch) | `async` server component with `fetch()` + ISR |

## SEO

- Every public page has `export const metadata` or `export async function generateMetadata()` in its `page.jsx` server component
- Product pages include JSON-LD structured data (`@type: Product`)
- Canonical URLs are set via `alternates.canonical` in metadata
- `robots.txt` and XML sitemaps remain in `public/`
- The site layout fetches categories server-side (no client-side flash)
- `noindex` pages are declared in `app/(site)/.../layout.jsx` or via `noIndexMetadata.js`

## Environment variables

```env
NEXT_PUBLIC_BASE_URL=https://mkhasa-bfdb6fabd978.herokuapp.com/api/v1
NEXT_PUBLIC_SITE_URL=https://www.mkhasa.com
```

## Dev

```bash
npm install
npm run dev       # http://localhost:3000
npm run build
npm start
```
