
import { connectDB } from "@/lib/mongoose";
import QuestionStructureSchema from "@/model/QuestionStructure";
import { NextResponse } from "next/server";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  await QuestionStructureSchema.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
