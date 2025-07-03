import { connectDB } from "@/lib/mongoose";
import QuestionStructure from "@/model/QuestionStructure";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();
  const { ids } = await req.json();
  await QuestionStructure.deleteMany({ _id: { $in: ids } });
  return NextResponse.json({ success: true });
}
