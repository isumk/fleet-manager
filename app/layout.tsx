import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fleet Manager',
  description: 'Fleet and machine management system built with Supabase and Vercel.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
