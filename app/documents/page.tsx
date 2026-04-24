export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">

        <div className="mb-10">
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground uppercase tracking-widest font-medium transition-colors">
            ← Home
          </Link>
        </div>

        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">
              BNH
            </p>
            <h1 className="text-3xl font-light tracking-tight text-foreground">
              Document library
            </h1>
          </div>
          <Link href="/generate">
            <Button>New document</Button>
          </Link>
        </div>

        <Separator className="mb-8" />

        {documents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <p className="text-sm text-muted-foreground">
                No documents have been generated yet.
              </p>
              <Link href="/generate">
                <Button variant="outline">Generate your first document</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc: typeof documents[number]) => (
                  <TableRow key={doc.id} className="cursor-pointer">
                    <TableCell>
                      <Badge variant="secondary" className="whitespace-nowrap">
                        {TYPE_LABELS[doc.type] ?? doc.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium relative">
                      <Link
                        href={`/documents/${doc.id}`}
                        className="before:absolute before:inset-0"
                      >
                        {doc.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground tabular-nums">
                      {formatDate(doc.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <p className="mt-4 text-xs text-muted-foreground text-right">
              {documents.length} {documents.length === 1 ? "document" : "documents"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
