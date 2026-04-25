import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AI_DOCUMENT_SYSTEM_PROMPT } from "@/lib/system-prompt";
import { Separator } from "@/components/ui/separator";

export default function SystemPromptPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground uppercase tracking-widest font-medium transition-colors"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Home
          </Link>
        </div>

        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">
            AI Configuration
          </p>
          <h1 className="text-3xl font-light tracking-tight text-foreground mb-2">
            System prompt
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This is the exact system prompt used by the document generation API.
          </p>
        </div>

        <Separator className="mb-8" />

        <pre className="whitespace-pre-wrap rounded-lg border bg-muted/30 p-5 text-sm leading-6 text-foreground overflow-x-auto">
          {AI_DOCUMENT_SYSTEM_PROMPT}
        </pre>
      </main>
    </div>
  );
}
