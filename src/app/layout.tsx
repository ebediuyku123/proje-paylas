import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from 'sonner';
import ThemeProvider from '@/components/shared/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ProjePaylaş — Yazılım Projeleri',
    template: '%s | ProjePaylaş',
  },
  description: 'Modern yazılım projelerini keşfet, incele ve indir. Açık kaynak ve kişisel projeler burada.',
  keywords: ['yazılım', 'proje', 'açık kaynak', 'geliştirici', 'portfolio'],
  authors: [{ name: 'ProjePaylaş' }],
  creator: 'ProjePaylaş',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'ProjePaylaş',
    title: 'ProjePaylaş — Yazılım Projeleri',
    description: 'Modern yazılım projelerini keşfet, incele ve indir.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProjePaylaş — Yazılım Projeleri',
    description: 'Modern yazılım projelerini keşfet, incele ve indir.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={inter.variable} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster
              theme="system"
              position="bottom-right"
              toastOptions={{
                className: 'dark:bg-[#111111] dark:border-[#222222] dark:text-white bg-white border-gray-200 text-gray-900',
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
