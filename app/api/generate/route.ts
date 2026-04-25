import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";
import { AI_DOCUMENT_SYSTEM_PROMPT } from "@/lib/system-prompt";
import { DocumentType } from "@/lib/generated/prisma/client";

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
    const systemPrompt = AI_DOCUMENT_SYSTEM_PROMPT;
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
