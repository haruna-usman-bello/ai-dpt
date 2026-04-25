import { DocumentType } from "@/lib/generated/prisma/client";
import { openai } from "@/lib/openai";
import { AI_DOCUMENT_SYSTEM_PROMPT } from "@/lib/system-prompt";

const TYPE_LABELS: Record<DocumentType, string> = {
  ROLE_MANDATE: "Role Mandate",
  SUBSIDIARY_BRIEF: "Subsidiary Brief",
  BOARD_NOTE: "Board Note",
};

export interface GenerateDocumentInput {
  documentType: DocumentType;
  subject: string;
  bulletPoints: string[];
  specificInstructions?: string | null;
}

function buildUserPrompt({
  documentType,
  subject,
  bulletPoints,
  specificInstructions,
}: GenerateDocumentInput) {
  const numberedPoints = bulletPoints
    .map((point, index) => `${index + 1}. ${point}`)
    .join("\n");

  return [
    `Document type: ${TYPE_LABELS[documentType]}`,
    `Subject: ${subject}`,
    "",
    "Bullet points:",
    numberedPoints,
    "",
    "Specific instructions or constraints:",
    specificInstructions?.trim() || "None provided.",
  ].join("\n");
}

export async function generateGovernanceDocument(input: GenerateDocumentInput) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o",
    messages: [
      { role: "system", content: AI_DOCUMENT_SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(input) },
    ],
    temperature: 0.2,
  });

  const generatedOutput = completion.choices[0]?.message?.content?.trim();

  if (!generatedOutput) {
    throw new Error("The model returned an empty document.");
  }

  return generatedOutput;
}
