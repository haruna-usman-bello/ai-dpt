type Token =
  | { kind: "h2";   text: string }
  | { kind: "h3";   text: string }
  | { kind: "h4";   text: string }
  | { kind: "li";   text: string }
  | { kind: "p";    text: string }
  | { kind: "gap" };

function tokenise(markdown: string): Token[] {
  const tokens: Token[] = [];
  let inList = false;

  for (const raw of markdown.split("\n")) {
    const line = raw.trimEnd();

    // Blank line
    if (!line.trim()) {
      if (inList) inList = false;
      tokens.push({ kind: "gap" });
      continue;
    }

    // Headings
    if (line.startsWith("#### ")) {
      inList = false;
      tokens.push({ kind: "h4", text: line.slice(5).trim() });
      continue;
    }
    if (line.startsWith("### ")) {
      inList = false;
      tokens.push({ kind: "h3", text: line.slice(4).trim() });
      continue;
    }
    if (line.startsWith("## ")) {
      inList = false;
      tokens.push({ kind: "h2", text: line.slice(3).trim() });
      continue;
    }

    // Bullet / list item
    const listMatch = line.match(/^[-*•]\s+(.+)/);
    if (listMatch) {
      inList = true;
      tokens.push({ kind: "li", text: listMatch[1].trim() });
      continue;
    }

    // Numbered list item — treat as list item
    const numberedMatch = line.match(/^\d+\.\s+(.+)/);
    if (numberedMatch) {
      inList = true;
      tokens.push({ kind: "li", text: numberedMatch[1].trim() });
      continue;
    }

    // Paragraph
    if (inList) inList = false;
    tokens.push({ kind: "p", text: line.trim() });
  }

  // Collapse consecutive gaps into one
  return tokens.filter((t, i) => {
    if (t.kind !== "gap") return true;
    const prev = tokens[i - 1];
    return prev?.kind !== "gap";
  });
}

function inlineFormat(text: string): React.ReactNode {
  // Handle **bold**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-zinc-900">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export function DocumentRenderer({ content }: { content: string }) {
  const tokens = tokenise(content);

  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < tokens.length) {
    const tok = tokens[i];

    if (tok.kind === "gap") {
      i++;
      continue;
    }

    if (tok.kind === "h2") {
      nodes.push(
        <h2 key={i} className="text-base font-semibold text-zinc-900 mt-10 mb-3 pb-2 border-b border-zinc-100 print:mt-8">
          {inlineFormat(tok.text)}
        </h2>
      );
      i++;
      continue;
    }

    if (tok.kind === "h3") {
      nodes.push(
        <h3 key={i} className="text-sm font-semibold text-zinc-800 mt-5 mb-2">
          {inlineFormat(tok.text)}
        </h3>
      );
      i++;
      continue;
    }

    if (tok.kind === "h4") {
      nodes.push(
        <h4 key={i} className="text-sm font-medium text-zinc-700 mt-4 mb-1.5">
          {inlineFormat(tok.text)}
        </h4>
      );
      i++;
      continue;
    }

    // Collect consecutive list items into a single <ul>
    if (tok.kind === "li") {
      const items: string[] = [];
      while (i < tokens.length && tokens[i].kind === "li") {
        items.push((tokens[i] as { kind: "li"; text: string }).text);
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} className="my-3 space-y-1.5 pl-0">
          {items.map((item, j) => (
            <li key={j} className="flex gap-3 text-sm text-zinc-700 leading-relaxed">
              <span className="mt-1.5 size-1.5 rounded-full bg-zinc-400 shrink-0" />
              <span>{inlineFormat(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (tok.kind === "p") {
      nodes.push(
        <p key={i} className="text-sm text-zinc-700 leading-7 my-2">
          {inlineFormat(tok.text)}
        </p>
      );
      i++;
      continue;
    }

    i++;
  }

  return <div className="document-body">{nodes}</div>;
}
