import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'HRVCC Member Directory',
    template: '%s | HRVCC Member Directory',
  },
  description:
    'HRVCC Member Directory - Connect with businesses in the HRVCC community. Browse business profiles, find services, and network with members.',
  keywords: [
    'HRVCC',
    'member directory',
    'businesses',
    'networking',
    'chamber of commerce',
    'directory',
  ],
  authors: [{ name: 'HRVCC' }],
  creator: 'HRVCC',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'HRVCC Member Directory',
    description: 'Connect with businesses in the HRVCC community',
    siteName: 'HRVCC Member Directory',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HRVCC Member Directory',
    description: 'Connect with businesses in the HRVCC community',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
