export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TYPE_LABELS: Record<string, string> = {
  "board-charter":            "Board Charter",
  "governance-framework":     "Governance Framework",
  "risk-policy":              "Risk Policy",
  "conflict-of-interest":     "Conflict of Interest",
  "anti-bribery":             "Anti-Bribery",
  "delegation-of-authority":  "Delegation of Authority",
  "remuneration-policy":      "Remuneration",
  "whistleblowing-policy":    "Whistleblowing",
  "data-protection":          "Data Protection",
  "information-security":     "Info. Security",
  "procurement-policy":       "Procurement",
  "business-continuity":      "Business Continuity",
  "compliance-report":        "Compliance Report",
  "audit-charter":            "Audit Charter",
};

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function DocumentsPage() {
  const documents = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, type: true, createdAt: true },
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">

        <div className="mb-10">
          <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-700 uppercase tracking-widest font-medium">
            ← Home
          </Link>
        </div>

        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-2">BNH</p>
            <h1 className="text-3xl font-light tracking-tight text-zinc-900">Document library</h1>
          </div>
          <Link href="/generate">
            <Button className="rounded-none h-10 px-6 text-sm font-medium">
              New document
            </Button>
          </Link>
        </div>

        {documents.length === 0 ? (
          <div className="border border-zinc-100 py-24 text-center">
            <p className="text-sm text-zinc-400 mb-5">No documents have been generated yet.</p>
            <Link href="/generate">
              <Button variant="outline" className="rounded-none text-sm h-10 px-6">
                Generate your first document
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 border-t border-b border-zinc-100">
            {documents.map((doc: typeof documents[number]) => (
              <Link
                key={doc.id}
                href={`/documents/${doc.id}`}
                className="group flex items-center justify-between py-4 hover:bg-zinc-50 -mx-3 px-3 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <Badge
                    variant="secondary"
                    className="rounded-none text-xs font-medium shrink-0 tabular-nums"
                  >
                    {TYPE_LABELS[doc.type] ?? doc.type}
                  </Badge>
                  <span className="text-sm text-zinc-900 truncate group-hover:text-zinc-600 transition-colors">
                    {doc.title}
                  </span>
                </div>
                <span className="text-xs text-zinc-400 shrink-0 ml-4 tabular-nums">
                  {formatDate(doc.createdAt)}
                </span>
              </Link>
            ))}
          </div>
        )}

        {documents.length > 0 && (
          <p className="mt-5 text-xs text-zinc-400 text-right">
            {documents.length} {documents.length === 1 ? "document" : "documents"}
          </p>
        )}
      </div>
    </div>
  );
}
