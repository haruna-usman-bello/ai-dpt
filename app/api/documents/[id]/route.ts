import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const doc = await prisma.generatedDocument.findUnique({ where: { id } });

    if (!doc) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }

    return NextResponse.json(doc);
  } catch (err) {
    console.error("[GET /api/documents/[id]]", err);
    return NextResponse.json({ error: "Failed to fetch document." }, { status: 500 });
  }
}
