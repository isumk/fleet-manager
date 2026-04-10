# Fleet Manager - Supabase + Vercel

This project is a mobile-friendly machine fleet management application built with Next.js, Supabase, TypeScript, Tailwind CSS, QR generation, QR scanning, audit logging, CSV export, and role-based access control.

## Included features
- Secure login with Supabase Auth
- Admin vs regular user roles
- Machine creation, viewing, and editing
- QR code generation and PDF download
- Camera-based QR scanning
- Dashboard cards, filters, search, and pie chart
- CSV export
- User creation screen for admins
- Audit logs and scan logs in the database
- Multi-location support through `location_name` and `location_scope`

## Local setup
1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Create `.env.local` from `.env.example`.
4. Run `npm install`.
5. Run `npm run dev`.

## First admin
Create your first user in Supabase Authentication, then run:

```sql
update public.profiles
set role = 'admin'
where email = 'your-admin-email@example.com';
```

## Environment variables
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Deployment
Push the repository to GitHub, import it into Vercel, add the environment variables, and redeploy.
