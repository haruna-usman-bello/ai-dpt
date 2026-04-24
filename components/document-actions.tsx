"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function DocumentActions({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="flex items-center gap-2 print:hidden">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="h-8 rounded-none text-xs px-4 border-zinc-200"
      >
        {copied ? "Copied" : "Copy text"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrint}
        className="h-8 rounded-none text-xs px-4 border-zinc-200"
      >
        Print / PDF
      </Button>
    </div>
  );
}
