export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FilePlus, Library } from "lucide-react";
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
      <div className="print:hidden border-b bg-background/95 backdrop-blur-sm px-6 py-3 flex flex-col gap-3 sticky top-14 z-10 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/documents"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground uppercase tracking-widest font-medium transition-colors"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          All documents
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <DocumentActions content={doc.generatedOutput} />
          <Link href="/documents">
            <Button variant="outline" size="sm">
              <Library aria-hidden="true" />
              All documents
            </Button>
          </Link>
          <Link href="/generate">
            <Button size="sm">
              <FilePlus aria-hidden="true" />
              Create another
            </Button>
          </Link>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 py-12 print:px-0 print:py-0">

        {/* Print header */}
        <div className="hidden print:block mb-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">BNH</p>
          <Separator />
        </div>

        {/* Document header */}
        <header className="mb-8 max-w-3xl">
          <div className="mb-3 flex flex-wrap items-center gap-2 print:hidden">
            <Badge variant="secondary">{typeLabel}</Badge>
            <span className="text-xs text-muted-foreground">
              Created {formatDate(doc.createdAt)}
            </span>
          </div>
          <h1 className="text-3xl font-light tracking-tight text-foreground leading-tight mb-2 print:text-3xl">
            {doc.subject}
          </h1>
          <p className="text-sm text-muted-foreground">
            Generated governance document ready for executive review.
          </p>
        </header>

        <Separator className="mb-8" />

        <section className="grid gap-4 mb-8 print:hidden md:grid-cols-[1fr_1.35fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Document details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
                  Document type
                </p>
                <p className="text-sm font-medium">{typeLabel}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
                  Subject
                </p>
                <p className="text-sm font-medium">{doc.subject}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
                  Created date
                </p>
                <p className="text-sm font-medium">{formatDate(doc.createdAt)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Original inputs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">
                  Original bullet points
                </p>
                {bulletList.length > 0 ? (
                  <ol className="space-y-2">
                    {bulletList.map((b, i) => (
                      <li key={i} className="flex gap-3 text-sm leading-relaxed">
                        <span className="text-muted-foreground tabular-nums shrink-0">{i + 1}.</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm text-muted-foreground">No bullet points recorded.</p>
                )}
              </div>
              <Separator />
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
                  Specific instructions
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {doc.specificInstructions || "No specific instructions provided."}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Generated document body */}
        <Card className="mb-10">
          <CardHeader className="border-b">
            <CardTitle className="text-sm">Generated output</CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-2 md:px-8">
            <DocumentRenderer content={doc.generatedOutput} />
          </CardContent>
        </Card>

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
