"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DOCUMENT_TYPES = [
  { value: "board-charter",           label: "Board Charter" },
  { value: "governance-framework",    label: "Governance Framework" },
  { value: "risk-policy",            label: "Risk Management Policy" },
  { value: "conflict-of-interest",   label: "Conflict of Interest Policy" },
  { value: "anti-bribery",           label: "Anti-Bribery & Corruption Policy" },
  { value: "delegation-of-authority",label: "Delegation of Authority" },
  { value: "remuneration-policy",    label: "Remuneration Policy" },
  { value: "whistleblowing-policy",  label: "Whistleblowing Policy" },
  { value: "data-protection",        label: "Data Protection Policy" },
  { value: "information-security",   label: "Information Security Policy" },
  { value: "procurement-policy",     label: "Procurement Policy" },
  { value: "business-continuity",    label: "Business Continuity Plan" },
  { value: "compliance-report",      label: "Compliance Report" },
  { value: "audit-charter",          label: "Internal Audit Charter" },
];

const PLACEHOLDER = `Board to comprise a minimum of seven (7) directors
At least three directors must be independent non-executive
Chairperson and Chief Executive Officer roles must be separated
Board meetings to be held quarterly, with a quorum of five members
Annual board effectiveness review to be conducted by an independent party
Directors must disclose conflicts of interest at every meeting`;

export default function GeneratePage() {
  const router = useRouter();
  const [title, setTitle]       = useState("");
  const [type, setType]         = useState("");
  const [rawBullets, setRawBullets] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

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
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-16">

        {/* Breadcrumb */}
        <div className="mb-12">
          <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-700 uppercase tracking-widest font-medium">
            ← Home
          </Link>
        </div>

        <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-3">
          New Document
        </p>
        <h1 className="text-3xl font-light tracking-tight text-zinc-900 mb-2">
          Generate a governance document
        </h1>
        <p className="text-sm text-zinc-500 leading-relaxed mb-10 max-w-lg">
          Enter a document title, choose a type, then add your key points — one per line.
          BNH&apos;s AI will expand them into a complete, formally structured document.
        </p>

        <form onSubmit={handleSubmit} className="space-y-7">

          {/* Title */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
              Document title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Board Charter 2025"
              className="h-11 rounded-none border-zinc-200 focus-visible:ring-zinc-900 text-sm"
              required
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
              Document type
            </label>
            <Select value={type} onValueChange={(v) => setType(v ?? "")}>
              <SelectTrigger className="h-11 rounded-none border-zinc-200 text-sm w-full">
                <SelectValue placeholder="Select document type…" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                {DOCUMENT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value} className="text-sm">
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bullet points */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                Key points
              </label>
              {bullets.length > 0 && (
                <span className="text-xs text-zinc-400">
                  {bullets.length} {bullets.length === 1 ? "point" : "points"} detected
                </span>
              )}
            </div>
            <Textarea
              value={rawBullets}
              onChange={(e) => setRawBullets(e.target.value)}
              placeholder={PLACEHOLDER}
              className="rounded-none border-zinc-200 focus-visible:ring-zinc-900 text-sm min-h-52 resize-none font-mono leading-6"
              required
            />
            <p className="text-xs text-zinc-400 leading-relaxed">
              Each line becomes a key point. Write as concise statements — the AI will expand them into full sections.
            </p>
          </div>

          {/* Preview */}
          {bullets.length > 0 && (
            <div className="border border-zinc-100 bg-zinc-50 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
                Points to expand
              </p>
              <ol className="space-y-1.5">
                {bullets.map((b, i) => (
                  <li key={i} className="text-sm text-zinc-700 flex gap-3">
                    <span className="text-zinc-400 shrink-0 tabular-nums">{i + 1}.</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 border border-red-200 bg-red-50 px-4 py-3">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={!canSubmit}
            className="w-full h-12 rounded-none text-sm font-medium tracking-wide"
          >
            {loading ? "Generating document…" : "Generate document"}
          </Button>
        </form>
      </div>
    </div>
  );
}
