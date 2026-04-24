"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DOCUMENT_TYPES = [
  { value: "board-charter",            label: "Board Charter" },
  { value: "governance-framework",     label: "Governance Framework" },
  { value: "risk-policy",             label: "Risk Management Policy" },
  { value: "conflict-of-interest",    label: "Conflict of Interest Policy" },
  { value: "anti-bribery",            label: "Anti-Bribery & Corruption Policy" },
  { value: "delegation-of-authority", label: "Delegation of Authority" },
  { value: "remuneration-policy",     label: "Remuneration Policy" },
  { value: "whistleblowing-policy",   label: "Whistleblowing Policy" },
  { value: "data-protection",         label: "Data Protection Policy" },
  { value: "information-security",    label: "Information Security Policy" },
  { value: "procurement-policy",      label: "Procurement Policy" },
  { value: "business-continuity",     label: "Business Continuity Plan" },
  { value: "compliance-report",       label: "Compliance Report" },
  { value: "audit-charter",           label: "Internal Audit Charter" },
];

const PLACEHOLDER = `Board to comprise a minimum of seven (7) directors
At least three directors must be independent non-executive
Chairperson and Chief Executive Officer roles must be separated
Board meetings to be held quarterly, with a quorum of five members
Annual board effectiveness review to be conducted by an independent party
Directors must disclose conflicts of interest at every meeting`;

export default function GeneratePage() {
  const router = useRouter();
  const [title, setTitle]           = useState("");
  const [type, setType]             = useState("");
  const [rawBullets, setRawBullets] = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  const bullets = useMemo(
    () => rawBullets.split("\n").map((l) => l.trim()).filter(Boolean),
    [rawBullets]
  );

  const canSubmit = title.trim() && type && bullets.length >= 1 && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), type, bullets }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Generation failed.");
      }
      const { id } = await res.json();
      router.push(`/documents/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16">

        <div className="mb-10">
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground uppercase tracking-widest font-medium transition-colors">
            ← Home
          </Link>
        </div>

        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">
            New Document
          </p>
          <h1 className="text-3xl font-light tracking-tight text-foreground mb-2">
            Generate a governance document
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Enter a title, choose a document type, then add your key points — one per line.
            BNH&apos;s AI expands them into a formally structured document.
          </p>
        </div>

        <Separator className="mb-8" />

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="space-y-2">
            <Label htmlFor="title">Document title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Board Charter 2025"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Document type</Label>
            <Select value={type} onValueChange={(v) => setType(v ?? "")}>
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder="Select document type…" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="bullets">Key points</Label>
              {bullets.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {bullets.length} {bullets.length === 1 ? "point" : "points"}
                </span>
              )}
            </div>
            <Textarea
              id="bullets"
              value={rawBullets}
              onChange={(e) => setRawBullets(e.target.value)}
              placeholder={PLACEHOLDER}
              className="min-h-52 resize-none font-mono text-sm leading-6"
              required
            />
            <p className="text-xs text-muted-foreground">
              Each line is one key point. The AI expands them into full sections.
            </p>
          </div>

          {bullets.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Points to expand</CardTitle>
                <CardDescription>
                  These will be turned into full governance sections.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {bullets.map((b, i) => (
                    <li key={i} className="flex gap-3 text-sm text-foreground">
                      <span className="text-muted-foreground tabular-nums shrink-0">{i + 1}.</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="pt-4">
                <p className="text-sm text-destructive">{error}</p>
              </CardContent>
            </Card>
          )}

          <Button type="submit" disabled={!canSubmit} className="w-full" size="lg">
            {loading ? "Generating document…" : "Generate document"}
          </Button>

        </form>
      </div>
    </div>
  );
}
