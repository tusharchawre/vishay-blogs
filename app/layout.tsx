import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/providers";
import { Navbar } from "./_components/Navbar";
import { Gradient } from "@/components/Gradient";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "V-shy Blogs",
  description: "A modern blogging platform for sharing your thoughts and ideas",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'V-shy Blogs',
    title: 'V-shy Blogs - Share Your Stories',
    description: 'A modern blogging platform for sharing your thoughts and ideas',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'V-shy Blogs',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'V-shy Blogs - Share Your Stories',
    description: 'A modern blogging platform for sharing your thoughts and ideas',
    images: ['/twitter-image.png'],
    creator: '@tusharctwt',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification'
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="relative overflow-hidden">
            <Gradient />
            <Navbar />
            <div className="relative z-10">{children}</div>
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}
