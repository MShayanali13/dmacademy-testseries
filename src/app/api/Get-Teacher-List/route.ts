import { connectDB } from "@/lib/mongoose";
import QuestionStructureSchema from "@/model/QuestionStructure";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const list = await QuestionStructureSchema.find({}, "uploadedBy"); // excluding level & level_olds
  return NextResponse.json({ ok: true, list });
}
