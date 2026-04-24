import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
    body: "Type the essential requirements or provisions — one line each. No need to write prose.",
  },
  {
    step: "02",
    heading: "Select document type",
    body: "Choose from BNH's governance catalogue. The AI applies the correct structure and standard clauses.",
  },
  {
    step: "03",
    heading: "Review and export",
    body: "Your document is produced in seconds, formatted in BNH's house style. Copy or print to PDF.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">

        {/* Hero */}
        <section className="border-b py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-6">
              BNH · AI Document Production
            </p>
            <h1 className="text-5xl font-light tracking-tight text-foreground leading-[1.15] mb-6">
              Bullet points in.
              <br />
              Governance documents out.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-10">
              Enter your key requirements as bullet points. BNH&apos;s AI expands them into
              complete, formally structured governance documents — ready to review and approve.
            </p>
            <div className="flex items-center gap-3">
              <Link href="/generate">
                <Button size="lg">Generate a document</Button>
              </Link>
              <Link href="/documents">
                <Button variant="ghost" size="lg" className="text-muted-foreground">
                  View library
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-6 border-b">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-10">
              How it works
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {HOW_IT_WORKS.map((item) => (
                <Card key={item.step}>
                  <CardHeader>
                    <p className="text-3xl font-light text-muted-foreground/40 mb-1">{item.step}</p>
                    <CardTitle className="text-sm">{item.heading}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="leading-relaxed">{item.body}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Document types */}
        <section className="py-20 px-6 border-b">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-8">
              Supported document types
            </p>
            <div className="flex flex-wrap gap-2">
              {DOC_TYPES.map((t) => (
                <Badge key={t} variant="outline">{t}</Badge>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 bg-foreground">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-base font-medium text-background mb-1">
                Ready to draft your first document?
              </p>
              <p className="text-sm text-background/60">
                Takes under a minute. Outputs board-ready governance documents.
              </p>
            </div>
            <Link href="/generate">
              <Button variant="outline" size="lg" className="bg-transparent text-background border-background/30 hover:bg-background/10 hover:text-background">
                Get started
              </Button>
            </Link>
          </div>
        </section>

      </main>

      <Separator />
      <footer className="px-6 py-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">BNH · Document Production</p>
        <p className="text-xs text-muted-foreground">AI-generated drafts require human review before approval.</p>
      </footer>
    </div>
  );
}
