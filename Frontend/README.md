# 234deals-frontend

Frontend for the 234 Deals marketplace built with Next.js and Tailwind CSS.

## Quick start

Prerequisites: Node.js 16+ and npm/yarn/pnpm.

Install dependencies and run locally:

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Available scripts

- `npm run dev` — start development server
- `npm run build` — build production app
- `npm run start` — start production server after build
- `npm run lint` — run linter
- `npm run format` — format code (if configured)

## Environment

Place runtime variables in a `.env.local` file at the project root. Common keys this project may use:

- `NEXTAUTH_URL` — the canonical site URL (e.g. `http://localhost:3000`)
- `NEXT_PUBLIC_API_URL` — the base URL for the backend API (e.g. `http://localhost:5000/api`)
- `NEXTAUTH_SECRET` — secret for NextAuth session signing
- `DATABASE_URL` — (if applicable) connection string for the database

This project currently uses a Credentials provider example for auth. Adjust `src/lib/auth/auth.ts` if you connect a real user store.

## Contributing

See `CONTRIBUTING.md` for contribution guidelines.

## License

Specify a license in the repository if desired.

<!-- Trigger redeployment -->
