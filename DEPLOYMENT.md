# Deployment

## Environment variables

Set these in `.env.local` for development and in the Vercel project settings for production:

```text
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=a-long-random-value
NEXTAUTH_URL=https://your-domain.example
NEXT_PUBLIC_SITE_URL=https://your-domain.example
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=use-a-strong-bootstrap-password
```

Never commit `.env` files or share a database URL in command output. If a URL is exposed, rotate its Neon password before continuing.

## First database setup

After setting a new `DATABASE_URL`, validate it, apply the non-destructive initial migration, and create the bootstrap administrator:

```powershell
npx prisma migrate status
npx prisma migrate deploy
npm run prisma:seed
```

The seed is idempotent: it upserts the six current catalogue products, home content blocks, and the administrator specified by `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

## Vercel

1. Connect the repository to Vercel.
2. Add the environment variables above for Production, Preview, and Development as appropriate.
3. Deploy. The build command remains `npm run build`.
4. Sign in with the seeded admin account and confirm `/admin` shows products, content blocks, and requests.
