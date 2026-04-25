import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";
import { DocumentType } from "@/lib/generated/prisma/client";

// ── System prompts ────────────────────────────────────────────────────────────

const BASE_STYLE = `\
STRUCTURE:
- Use numbered sections: 1.0, 2.0, 2.1, 2.2, 3.0, etc.
- Use ## for top-level section headings (e.g. ## 1.0 Purpose)
- Use ### for subsections (e.g. ### 2.1 Definitions)
- Use - for bullet lists within sections
- Separate paragraphs with a blank line
- Do NOT include the document title — it is set separately
- Do NOT add a preamble before the first section heading

LANGUAGE:
- Formal institutional language throughout
- Use "BNH" for the organisation, "the Board" for the Board of Directors
- Use "shall" for obligations, "should" for recommendations, "may" for discretion
- Active voice: "The Board shall…", "Management is responsible for…"
- No contractions, no first-person, no colloquialisms
- Expand each bullet point into substantive, well-reasoned prose
- Add appropriate governance boilerplate and best-practice clauses
- Zero placeholder text — every section must be production-ready`;

const SYSTEM_PROMPTS: Record<DocumentType, string> = {
  ROLE_MANDATE: `\
You are BNH's institutional governance writer. Produce a formal Role Mandate document.

A Role Mandate defines the purpose, authority, key responsibilities, and accountability framework of a specific organisational role.

REQUIRED SECTIONS (adapt headings as appropriate):
## 1.0 Purpose
## 2.0 Scope and Application
## 3.0 Role Overview
## 4.0 Key Responsibilities
## 5.0 Authority and Decision Rights
## 6.0 Accountability and Reporting Lines
## 7.0 Key Relationships
## 8.0 Performance Standards
## 9.0 Review and Amendment

${BASE_STYLE}`,

  SUBSIDIARY_BRIEF: `\
You are BNH's institutional governance writer. Produce a formal Subsidiary Brief document.

A Subsidiary Brief is an executive-level briefing document providing a structured overview of a subsidiary entity's governance structure, operational context, strategic priorities, and key risks.

REQUIRED SECTIONS (adapt headings as appropriate):
## 1.0 Executive Summary
## 2.0 Subsidiary Overview
## 3.0 Governance Structure
## 4.0 Operational Context
## 5.0 Strategic Priorities
## 6.0 Financial Overview
## 7.0 Key Risks and Mitigants
## 8.0 Regulatory Environment
## 9.0 Reporting and Oversight

${BASE_STYLE}`,

  BOARD_NOTE: `\
You are BNH's institutional governance writer. Produce a formal Board Note.

A Board Note is a structured document presented to the Board of Directors for the purposes of information, noting, or decision-making. It must be concise, evidence-based, and action-oriented.

REQUIRED SECTIONS (adapt headings as appropriate):
## 1.0 Executive Summary
## 2.0 Background and Context
## 3.0 Current Position / Analysis
## 4.0 Key Considerations
## 5.0 Options and Recommendations
## 6.0 Financial and Resource Implications
## 7.0 Risk Assessment
## 8.0 Proposed Resolution
## 9.0 Appendices (if applicable)

${BASE_STYLE}`,
};

const TYPE_LABELS: Record<DocumentType, string> = {
  ROLE_MANDATE:     "Role Mandate",
  SUBSIDIARY_BRIEF: "Subsidiary Brief",
  BOARD_NOTE:       "Board Note",
};

const MAX_BULLET_POINTS = 10;

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      documentType: string;
      subject: string;
      bulletPoints: string[];
      specificInstructions?: string | null;
    };

    const { documentType, subject, bulletPoints, specificInstructions } = body;

    // Validate
    if (!documentType || !Object.values(DocumentType).includes(documentType as DocumentType)) {
      return NextResponse.json({ error: "A valid document type is required." }, { status: 400 });
    }
    if (!subject?.trim()) {
      return NextResponse.json({ error: "Subject is required." }, { status: 400 });
    }
    const cleanBulletPoints = Array.isArray(bulletPoints)
      ? bulletPoints.map((point) => point.trim()).filter(Boolean)
      : [];

    if (cleanBulletPoints.length === 0) {
      return NextResponse.json({ error: "At least one bullet point is required." }, { status: 400 });
    }
    if (cleanBulletPoints.length > MAX_BULLET_POINTS) {
      return NextResponse.json({ error: "Please provide no more than 10 bullet points." }, { status: 400 });
    }

    const type     = documentType as DocumentType;
    const systemPrompt = SYSTEM_PROMPTS[type];
    const typeLabel    = TYPE_LABELS[type];

    const numberedPoints = cleanBulletPoints
      .map((b, i) => `${i + 1}. ${b}`)
      .join("\n");

    const userMessage = [
      `Document type: ${typeLabel}`,
      `Subject: ${subject.trim()}`,
      "",
      "Key points to expand:",
      numberedPoints,
      specificInstructions?.trim()
        ? `\nAdditional instructions:\n${specificInstructions.trim()}`
        : "",
    ]
      .join("\n")
      .trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: userMessage },
      ],
      temperature: 0.3,
    });

    const generatedOutput = completion.choices[0]?.message?.content ?? "";

    const doc = await prisma.generatedDocument.create({
      data: {
        documentType:         type,
        subject:              subject.trim(),
        bulletPoints:         cleanBulletPoints.join("\n"),
        specificInstructions: specificInstructions?.trim() || null,
        systemPrompt,
        generatedOutput,
      },
    });

    return NextResponse.json({ id: doc.id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/generate]", err);
    return NextResponse.json({ error: "Failed to generate document." }, { status: 500 });
  }
}
