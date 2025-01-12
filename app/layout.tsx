import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/providers";
import { Navbar } from "./_components/Navbar";
import { Gradient } from "@/components/Gradient";
import { Toaster } from "sonner";


export const metadata: Metadata = {
  title: "V-shy Blogs",
  description: "Blogging Website",
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
          <Navbar />
          <div className="relative overflow-hidden">
            <Gradient />
            <div className="relative z-10">{children}</div>
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}
