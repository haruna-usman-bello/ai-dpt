import Link from "next/link";
import { Button } from "@/components/ui/button";

const DOC_TYPES = [
  "Board Charter",
  "Governance Framework",
  "Risk Management Policy",
  "Conflict of Interest Policy",
  "Anti-Bribery & Corruption Policy",
  "Delegation of Authority",
  "Remuneration Policy",
  "Whistleblowing Policy",
  "Data Protection Policy",
  "Procurement Policy",
  "Business Continuity Plan",
  "Internal Audit Charter",
];

const HOW_IT_WORKS = [
  {
    step: "01",
    heading: "Enter key points",
    body: "Type the essential requirements, decisions, or provisions — one line each. No need to write prose.",
  },
  {
    step: "02",
    heading: "Select document type",
    body: "Choose from BNH's governance catalogue. The AI applies the correct structure and standard clauses for that type.",
  },
  {
    step: "03",
    heading: "Review and export",
    body: "Your document is produced in seconds, fully formatted in BNH's house style. Copy or print to PDF.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="border-b border-zinc-100 py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-6">
              BNH · AI Document Production
            </p>
            <h1 className="text-5xl font-light tracking-tight text-zinc-900 leading-[1.15] mb-6">
              Bullet points in.
              <br />
              Governance documents out.
            </h1>
            <p className="text-lg text-zinc-500 leading-relaxed max-w-xl mb-10">
              Enter your key requirements as bullet points. BNH&apos;s AI expands them into
              complete, formally structured governance documents — ready to review and approve.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/generate">
                <Button size="lg" className="rounded-none px-8 h-12 text-sm font-medium">
                  Generate a document
                </Button>
              </Link>
              <Link href="/documents">
                <Button
                  variant="ghost"
                  size="lg"
                  className="rounded-none px-8 h-12 text-sm font-medium text-zinc-500 hover:text-zinc-900"
                >
                  View library
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="py-20 px-6 border-b border-zinc-100">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-12">
              How it works
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
              {HOW_IT_WORKS.map((item, i) => (
                <div
                  key={item.step}
                  className={`pr-8 py-2 ${i < HOW_IT_WORKS.length - 1 ? "sm:border-r border-zinc-100 sm:mr-8 mb-10 sm:mb-0" : ""}`}
                >
                  <p className="text-3xl font-light text-zinc-200 mb-4">{item.step}</p>
                  <h3 className="text-sm font-semibold text-zinc-900 mb-2">{item.heading}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Document types ── */}
        <section className="py-20 px-6 border-b border-zinc-100">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-10">
              Supported document types
            </p>
            <div className="flex flex-wrap gap-2">
              {DOC_TYPES.map((t) => (
                <span
                  key={t}
                  className="text-xs border border-zinc-200 px-3 py-1.5 text-zinc-600"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-16 px-6 bg-zinc-950">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-base font-medium text-white mb-1">
                Ready to draft your first document?
              </p>
              <p className="text-sm text-zinc-400">
                Takes under a minute. Outputs board-ready governance documents.
              </p>
            </div>
            <Link href="/generate">
              <Button
                variant="outline"
                size="lg"
                className="rounded-none px-8 h-12 text-sm font-medium bg-transparent text-white border-zinc-700 hover:bg-zinc-800 hover:text-white"
              >
                Get started
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
