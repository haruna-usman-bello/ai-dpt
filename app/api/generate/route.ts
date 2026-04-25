import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AI_DOCUMENT_SYSTEM_PROMPT } from "@/lib/system-prompt";
import { generateGovernanceDocument } from "@/lib/document-generation";
import { DocumentType } from "@/lib/generated/prisma/client";

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
    const systemPrompt = AI_DOCUMENT_SYSTEM_PROMPT;
    const cleanSubject = subject.trim();
    const cleanInstructions = specificInstructions?.trim() || null;
    const generatedOutput = await generateGovernanceDocument({
      documentType: type,
      subject: cleanSubject,
      bulletPoints: cleanBulletPoints,
      specificInstructions: cleanInstructions,
    });

    const doc = await prisma.generatedDocument.create({
      data: {
        documentType:         type,
        subject:              cleanSubject,
        bulletPoints:         cleanBulletPoints.join("\n"),
        specificInstructions: cleanInstructions,
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
