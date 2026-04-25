"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── Types ────────────────────────────────────────────────────────────────────

type DocumentType = "ROLE_MANDATE" | "SUBSIDIARY_BRIEF" | "BOARD_NOTE";

interface FormErrors {
  documentType?: string;
  subject?: string;
  bulletPoints?: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const DOCUMENT_TYPES: { value: DocumentType; label: string; description: string }[] = [
  {
    value: "ROLE_MANDATE",
    label: "Role Mandate",
    description: "Defines the purpose, authority, and responsibilities of a specific role.",
  },
  {
    value: "SUBSIDIARY_BRIEF",
    label: "Subsidiary Brief",
    description: "Executive overview of a subsidiary's governance, operations, and context.",
  },
  {
    value: "BOARD_NOTE",
    label: "Board Note",
    description: "Formal note presented to the Board for information, noting, or decision.",
  },
];

const MIN_RECOMMENDED = 5;
const MAX_BULLETS = 10;
const INITIAL_BULLET_COUNT = 5;

// ── Helpers ───────────────────────────────────────────────────────────────────

function BulletCounter({ filled }: { filled: number }) {
  if (filled === 0) return null;

  const isGood = filled >= MIN_RECOMMENDED;

  return (
    <Badge variant={isGood ? "secondary" : "outline"} className="text-xs font-normal">
      {filled} {filled === 1 ? "point" : "points"}
      {!isGood && ` · ${MIN_RECOMMENDED}–${MAX_BULLETS} recommended`}
    </Badge>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function GeneratePage() {
  const router = useRouter();

  const [documentType, setDocumentType] = useState<DocumentType | "">("");
  const [subject, setSubject]           = useState("");
  const [bullets, setBullets]           = useState<string[]>(
    Array(INITIAL_BULLET_COUNT).fill("")
  );
  const [instructions, setInstructions] = useState("");
  const [errors, setErrors]             = useState<FormErrors>({});
  const [submitError, setSubmitError]   = useState("");
  const [loading, setLoading]           = useState(false);

  // ── Bullet management ──────────────────────────────────────────────────────

  function updateBullet(index: number, value: string) {
    setBullets((prev) => prev.map((b, i) => (i === index ? value : b)));
  }

  function addBullet() {
    if (bullets.length >= MAX_BULLETS) return;
    setBullets((prev) => [...prev, ""]);
  }

  function removeBullet(index: number) {
    if (bullets.length <= 1) return;
    setBullets((prev) => prev.filter((_, i) => i !== index));
  }

  const filledBullets = bullets.map((b) => b.trim()).filter(Boolean);

  // ── Validation ─────────────────────────────────────────────────────────────

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!documentType) errs.documentType = "Please select a document type.";
    if (!subject.trim()) errs.subject = "Subject is required.";
    if (filledBullets.length === 0) errs.bulletPoints = "At least one bullet point is required.";
    return errs;
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentType,
          subject: subject.trim(),
          bulletPoints: filledBullets,
          specificInstructions: instructions.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Generation failed.");
      }

      const { id } = await res.json();
      router.push(`/documents/${id}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Breadcrumb */}
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground uppercase tracking-widest font-medium transition-colors"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Home
          </Link>
        </div>

        {/* Page header */}
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">
            New Document
          </p>
          <h1 className="text-3xl font-light tracking-tight text-foreground mb-2">
            Generate a governance document
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Select a document type, provide a subject, and enter your key points.
            BNH&apos;s AI will produce a formally structured document ready for review.
          </p>
        </div>

        <Separator className="mb-8" />

        <form onSubmit={handleSubmit} noValidate className="space-y-8">

          {/* ── Document type ── */}
          <div className="space-y-2">
            <Label htmlFor="documentType">Document type</Label>
            <Select
              value={documentType}
              onValueChange={(v) => {
                setDocumentType(v as DocumentType);
                if (errors.documentType) setErrors((p) => ({ ...p, documentType: undefined }));
              }}
            >
              <SelectTrigger
                id="documentType"
                className="w-full"
                aria-invalid={Boolean(errors.documentType)}
              >
                <SelectValue placeholder="Select a document type…" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type description */}
            {documentType && (() => {
              const selected = DOCUMENT_TYPES.find((t) => t.value === documentType);
              return selected ? (
                <p className="text-xs text-muted-foreground">{selected.description}</p>
              ) : null;
            })()}

            {errors.documentType && (
              <p className="text-xs text-destructive">{errors.documentType}</p>
            )}
          </div>

          {/* ── Subject ── */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                if (errors.subject) setErrors((p) => ({ ...p, subject: undefined }));
              }}
              aria-invalid={Boolean(errors.subject)}
              placeholder="e.g. Chief Risk Officer, Acme Subsidiary, Q3 Risk Review"
            />
            {errors.subject && (
              <p className="text-xs text-destructive">{errors.subject}</p>
            )}
          </div>

          {/* ── Bullet points ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Key points</Label>
              <BulletCounter filled={filledBullets.length} />
            </div>

            <div className="space-y-2">
              {bullets.map((bullet, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground tabular-nums w-5 text-right shrink-0">
                    {i + 1}
                  </span>
                  <Input
                    value={bullet}
                    onChange={(e) => {
                      updateBullet(i, e.target.value);
                      if (errors.bulletPoints) {
                        setErrors((p) => ({ ...p, bulletPoints: undefined }));
                      }
                    }}
                    placeholder={`Point ${i + 1}`}
                    aria-label={`Bullet point ${i + 1}`}
                    aria-invalid={Boolean(errors.bulletPoints)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeBullet(i)}
                    disabled={bullets.length <= 1}
                    aria-label="Remove point"
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <X aria-hidden="true" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addBullet}
                disabled={bullets.length >= MAX_BULLETS}
                className="text-muted-foreground"
              >
                <Plus aria-hidden="true" />
                Add point
              </Button>
              <p className="text-xs text-muted-foreground">
                {bullets.length}/{MAX_BULLETS} rows · 5–10 recommended for best results
              </p>
            </div>

            {filledBullets.length < MIN_RECOMMENDED && filledBullets.length > 0 && (
              <p className="text-xs text-muted-foreground">
                For best results, provide at least {MIN_RECOMMENDED} points. You have {filledBullets.length}.
              </p>
            )}

            {errors.bulletPoints && (
              <p className="text-xs text-destructive">{errors.bulletPoints}</p>
            )}
          </div>

          {/* ── Specific instructions ── */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="instructions">Specific instructions</Label>
              <Badge variant="outline" className="text-xs font-normal">Optional</Badge>
            </div>
            <Textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Any additional constraints, audience notes, tone guidance, or clauses to include or exclude…"
              className="resize-none min-h-24"
            />
          </div>

          {/* ── Submit error ── */}
          {submitError && (
            <Card className="border-destructive/40 bg-destructive/5">
              <CardContent className="py-3">
                <p className="text-sm text-destructive">{submitError}</p>
              </CardContent>
            </Card>
          )}

          {/* ── Submit ── */}
          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Generating document…" : "Generate document"}
          </Button>

        </form>
      </div>
    </div>
  );
}
