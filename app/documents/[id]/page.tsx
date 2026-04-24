export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen bg-background">

      {/* Sticky action bar */}
      <div className="print:hidden border-b bg-background/95 backdrop-blur-sm px-6 py-3 flex items-center justify-between sticky top-14 z-10">
        <Link
          href="/documents"
          className="text-xs text-muted-foreground hover:text-foreground uppercase tracking-widest font-medium transition-colors"
        >
          ← Documents
        </Link>
        <div className="flex items-center gap-2">
          <DocumentActions content={doc.content} />
          <Link href="/generate">
            <Button variant="outline" size="sm">New document</Button>
          </Link>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-14 print:px-0 print:py-0">

        {/* Print header */}
        <div className="hidden print:block mb-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">BNH</p>
          <Separator className="border-foreground" />
        </div>

        {/* Document header */}
        <header className="mb-8">
          <Badge variant="secondary" className="mb-3 print:hidden">
            {typeLabel}
          </Badge>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground leading-tight mb-2 print:text-3xl">
            {doc.title}
          </h1>
          <p className="text-sm text-muted-foreground">{formatDate(doc.createdAt)}</p>
        </header>

        <Separator className="mb-8" />

        {/* Key points — hidden in print */}
        {bulletList.length > 0 && (
          <Card className="mb-10 print:hidden">
            <CardHeader>
              <CardTitle className="text-sm">Key points used</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {bulletList.map((b: string, i: number) => (
                  <li key={i} className="flex gap-3 text-sm text-foreground">
                    <span className="text-muted-foreground tabular-nums shrink-0">{i + 1}.</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}

        {/* Generated document body */}
        <DocumentRenderer content={doc.content} />

        {/* Print footer */}
        <div className="hidden print:block mt-16 pt-4">
          <Separator />
          <p className="mt-4 text-xs text-muted-foreground">
            BNH &mdash; {typeLabel} &mdash; {formatDate(doc.createdAt)}
          </p>
        </div>

      </article>
    </div>
  );
}
