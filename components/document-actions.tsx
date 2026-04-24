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

  return (
    <div className="flex items-center gap-2 print:hidden">
      <Button variant="outline" size="sm" onClick={handleCopy}>
        {copied ? "Copied" : "Copy text"}
      </Button>
      <Button variant="outline" size="sm" onClick={() => window.print()}>
        Print / PDF
      </Button>
    </div>
  );
}
