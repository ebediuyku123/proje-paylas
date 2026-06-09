import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from 'sonner';

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
    <html lang="tr" className={inter.variable}>
      <body className="bg-[#0A0A0A] text-white antialiased">
        <AuthProvider>
          {children}
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#111111',
                border: '1px solid #222222',
                color: '#FFFFFF',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
