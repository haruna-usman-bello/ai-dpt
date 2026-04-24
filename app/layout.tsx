import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: { default: "BNH · Document Production", template: "%s · BNH" },
  description: "AI-powered governance document production for BNH.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="min-h-screen bg-white text-zinc-900 antialiased font-sans">

        {/* Global nav — hidden when printing */}
        <header className="print:hidden border-b border-zinc-100 px-6 h-14 flex items-center justify-between sticky top-0 z-20 bg-white">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-sm font-semibold tracking-tight text-zinc-900">BNH</span>
            <span className="text-zinc-200 text-xs">|</span>
            <span className="text-xs text-zinc-400 font-medium tracking-wide">Document Production</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/documents"
              className="text-xs font-medium text-zinc-500 hover:text-zinc-900 uppercase tracking-widest transition-colors"
            >
              Library
            </Link>
            <Link
              href="/generate"
              className="text-xs font-medium bg-zinc-900 text-white px-4 py-1.5 hover:bg-zinc-700 transition-colors uppercase tracking-widest"
            >
              New document
            </Link>
          </nav>
        </header>

        {children}
      </body>
    </html>
  );
}
