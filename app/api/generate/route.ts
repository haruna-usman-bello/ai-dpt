import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";

const TYPE_LABELS: Record<string, string> = {
  "board-charter":            "Board Charter",
  "governance-framework":     "Governance Framework",
  "risk-policy":              "Risk Management Policy",
  "conflict-of-interest":     "Conflict of Interest Policy",
  "anti-bribery":             "Anti-Bribery and Corruption Policy",
  "delegation-of-authority":  "Delegation of Authority",
  "remuneration-policy":      "Remuneration Policy",
  "whistleblowing-policy":    "Whistleblowing Policy",
  "data-protection":          "Data Protection Policy",
  "information-security":     "Information Security Policy",
  "procurement-policy":       "Procurement Policy",
  "business-continuity":      "Business Continuity Plan",
  "compliance-report":        "Compliance Report",
  "audit-charter":            "Internal Audit Charter",
};

const SYSTEM_PROMPT = `\
You are BNH's institutional governance document writer. Your role is to take a numbered list of key points provided by the user and expand them into a complete, formal governance document that conforms exactly to BNH's house style.

STRUCTURE RULES:
- Use numbered sections: 1.0, 1.1, 1.2, 2.0, etc.
- Every document must open with these sections (adapt headings to document type):
    ## 1.0 Purpose
    ## 2.0 Scope
    ## 3.0 Definitions
    ## 4.0 [Core section — e.g. "Policy Statement", "Framework", "Charter Provisions"]
  Then add type-specific sections (e.g. 5.0 Responsibilities, 6.0 Procedures, etc.)
  Always close with:
    ## x.0 Roles and Responsibilities
    ## x.0 Compliance and Enforcement
    ## x.0 Review and Amendment
    ## x.0 Authorisation

FORMAT RULES:
- Use ## for numbered section headings (e.g. ## 1.0 Purpose)
- Use ### for subsections (e.g. ### 1.1 Background)
- Use - for bullet lists within sections
- Separate paragraphs with a blank line
- Do NOT include a document title — it is set separately
- Do NOT add a preamble or introductory sentence before "## 1.0 Purpose"

LANGUAGE AND TONE:
- Formal institutional language throughout
- Active voice: "The Board shall…", "Management is responsible for…", "BNH requires…"
- Use "BNH" to refer to the organisation, "the Board" for the Board of Directors
- Use "shall" for mandatory obligations, "should" for recommended practice, "may" for permitted discretion
- No contractions, no first-person, no colloquialisms
- Expand each bullet point into full, properly reasoned prose — do not merely restate the bullet
- Add standard governance boilerplate and best-practice clauses appropriate to the document type
- Make the document production-ready — zero placeholder text

IMPORTANT:
- Every section must contain substantive content — no empty sections
- The key points provided are the minimum content requirements — augment with appropriate governance standards
- Definitions must define every technical or legal term used in the document
`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, type, bullets } = body as {
      title: string;
      type: string;
      bullets: string[];
    };

    if (!title || !type || !Array.isArray(bullets) || bullets.length === 0) {
      return NextResponse.json(
        { error: "title, type, and at least one bullet point are required." },
        { status: 400 }
      );
    }

    const typeLabel = TYPE_LABELS[type] ?? type;

    const numberedBullets = bullets
      .map((b, i) => `${i + 1}. ${b}`)
      .join("\n");

    const userMessage = `\
Document type: ${typeLabel}
Document title: ${title}

Key points to expand into the document:

${numberedBullets}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: userMessage },
      ],
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content ?? "";
    const bulletsText = bullets.join("\n");

    const doc = await prisma.document.create({
      data: { title, type, bullets: bulletsText, content },
    });

    return NextResponse.json({ id: doc.id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/generate]", err);
    return NextResponse.json(
      { error: "Failed to generate document." },
      { status: 500 }
    );
  }
}
