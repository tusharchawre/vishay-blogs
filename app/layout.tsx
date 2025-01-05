import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/providers";
import { Navbar } from "./_components/Navbar";
import { Gradient } from "@/components/Gradient";


export const metadata: Metadata = {
  title: "Vishay | Blogs n stuff",
  description: "Blogs Website",
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
          </div>
        </Providers>
      </body>
    </html>
  );
}
