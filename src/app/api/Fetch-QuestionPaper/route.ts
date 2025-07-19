import { connectDB } from "@/lib/mongoose";
import { QuestionPaper } from "@/model/QuestionPaper";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const tests = await QuestionPaper.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, tests });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Failed to fetch question papers." }, { status: 500 });
  }
}
