export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { DocumentRenderer } from "@/components/document-renderer";
import { DocumentActions } from "@/components/document-actions";

const TYPE_LABELS: Record<string, string> = {
  "board-charter":            "Board Charter",
  "governance-framework":     "Governance Framework",
  "risk-policy":              "Risk Management Policy",
  "conflict-of-interest":     "Conflict of Interest Policy",
  "anti-bribery":             "Anti-Bribery & Corruption Policy",
  "delegation-of-authority":  "Delegation of Authority",
  "remuneration-policy":      "Remuneration Policy",
  "whistleblowing-policy":    "Whistleblowing Policy",
  "data-protection":          "Data Protection Policy",
  "information-security":     "Information Security Policy",
  "procurement-policy":       "Procurement Policy",
  "business-continuity":      "Business Continuity Plan",
  "compliance-report":        "Compliance Report",
  "audit-charter":            "Internal Audit Charter",
};

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function DocumentPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const doc = await prisma.document.findUnique({ where: { id } });

  if (!doc) notFound();

  const bulletList = doc.bullets
    .split("\n")
    .map((l: string) => l.trim())
    .filter(Boolean);

  const typeLabel = TYPE_LABELS[doc.type] ?? doc.type;

  return (
    <div className="min-h-screen bg-white">
      {/* ── Screen nav (hidden when printing) ── */}
      <div className="print:hidden border-b border-zinc-100 px-6 py-3 flex items-center justify-between bg-white sticky top-14 z-10">
        <Link
          href="/documents"
          className="text-xs text-zinc-400 hover:text-zinc-700 uppercase tracking-widest font-medium"
        >
          ← Documents
        </Link>
        <DocumentActions content={doc.content} />
      </div>

      {/* ── Document body ── */}
      <article className="max-w-3xl mx-auto px-6 py-14 print:px-0 print:py-0">

        {/* Print header — only visible in print */}
        <div className="hidden print:block mb-8">
          <p className="text-xs uppercase tracking-widest text-zinc-400 mb-1">BNH</p>
          <div className="border-b-2 border-zinc-900 pb-2" />
        </div>

        {/* Document header */}
        <header className="mb-10">
          <Badge
            variant="secondary"
            className="rounded-none text-xs font-medium mb-4 print:hidden"
          >
            {typeLabel}
          </Badge>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 mb-2 leading-tight print:text-3xl">
            {doc.title}
          </h1>
          <p className="text-xs text-zinc-400">{formatDate(doc.createdAt)}</p>
        </header>

        {/* Key points source — collapsed in print */}
        {bulletList.length > 0 && (
          <div className="mb-10 bg-zinc-50 border border-zinc-100 px-5 py-4 print:hidden">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
              Key points used
            </p>
            <ol className="space-y-1.5">
              {bulletList.map((b: string, i: number) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-600">
                  <span className="text-zinc-400 tabular-nums shrink-0">{i + 1}.</span>
                  <span>{b}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Generated content */}
        <DocumentRenderer content={doc.content} />

        {/* Print footer */}
        <div className="hidden print:block mt-16 pt-4 border-t border-zinc-200">
          <p className="text-xs text-zinc-400">
            BNH &mdash; {typeLabel} &mdash; Generated {formatDate(doc.createdAt)}
          </p>
        </div>
      </article>
    </div>
  );
}
