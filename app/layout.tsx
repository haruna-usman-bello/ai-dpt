import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";

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
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">

        <header className="print:hidden h-14 flex items-center justify-between px-6 sticky top-0 z-20 bg-background border-b">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-sm font-semibold tracking-tight">BNH</span>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-xs text-muted-foreground font-medium tracking-wide">
              Document Production
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              href="/system-prompt"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              System prompt
            </Link>
            <Link
              href="/documents"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Library
            </Link>
            <Link
              href="/generate"
              className={buttonVariants({ size: "sm" })}
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
