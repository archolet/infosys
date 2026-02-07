import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gastro POS | InfoSYS',
  description: 'Enterprise Restaurant Point of Sale System',
  keywords: ['POS', 'Restaurant', 'Point of Sale', 'InfoSYS'],
  authors: [{ name: 'InfoSYS' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Inline script to prevent FOUC — runs before React hydration
// SECURITY NOTE: This is a static hardcoded string, not user input — no XSS risk
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(!t||t==='system')&&window.matchMedia('(prefers-color-scheme:dark)').matches;if(d)document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
