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
import { DocumentType } from "@/lib/generated/prisma/client";

const TYPE_LABELS: Record<DocumentType, string> = {
  ROLE_MANDATE:     "Role Mandate",
  SUBSIDIARY_BRIEF: "Subsidiary Brief",
  BOARD_NOTE:       "Board Note",
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
  const doc = await prisma.generatedDocument.findUnique({ where: { id } });

  if (!doc) notFound();

  const bulletList = doc.bulletPoints
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const typeLabel = TYPE_LABELS[doc.documentType];

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
          <DocumentActions content={doc.generatedOutput} />
          <Link href="/generate">
            <Button variant="outline" size="sm">New document</Button>
          </Link>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-14 print:px-0 print:py-0">

        {/* Print header */}
        <div className="hidden print:block mb-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">BNH</p>
          <Separator />
        </div>

        {/* Document header */}
        <header className="mb-8">
          <Badge variant="secondary" className="mb-3 print:hidden">
            {typeLabel}
          </Badge>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground leading-tight mb-2 print:text-3xl">
            {doc.subject}
          </h1>
          <p className="text-sm text-muted-foreground">{formatDate(doc.createdAt)}</p>
        </header>

        <Separator className="mb-8" />

        {/* Key points used */}
        {bulletList.length > 0 && (
          <Card className="mb-10 print:hidden">
            <CardHeader>
              <CardTitle className="text-sm">Key points used</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {bulletList.map((b, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="text-muted-foreground tabular-nums shrink-0">{i + 1}.</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}

        {/* Specific instructions (if any) */}
        {doc.specificInstructions && (
          <Card className="mb-10 print:hidden">
            <CardHeader>
              <CardTitle className="text-sm">Specific instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {doc.specificInstructions}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Generated document body */}
        <DocumentRenderer content={doc.generatedOutput} />

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
