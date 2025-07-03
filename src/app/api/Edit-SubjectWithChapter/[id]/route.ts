import { connectDB } from "@/lib/mongoose";
import QuestionStructureSchema from "@/model/QuestionStructure";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const body = await req.json();
  const { course, subject, chapter } = body;

  const updated = await QuestionStructureSchema.findByIdAndUpdate(
    params.id,
    { course, subject, chapter },
    { new: true }
  );

  return NextResponse.json({ success: true, updated });
}
