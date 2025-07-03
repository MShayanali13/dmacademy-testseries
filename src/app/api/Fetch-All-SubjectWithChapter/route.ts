import { connectDB } from "@/lib/mongoose";
import QuestionStructureSchema from "@/model/QuestionStructure";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const data = await QuestionStructureSchema.find({}, "course subject chapter"); // excluding level & level_olds
  return NextResponse.json({ success: true, data });
}
