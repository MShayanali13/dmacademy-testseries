import { connectDB } from "@/lib/mongoose";
import { QuestionPaper } from "@/model/QuestionPaper";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const newTest = new QuestionPaper(body);
    await newTest.save();

    return NextResponse.json({ success: true, test: newTest });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Failed to create question paper." }, { status: 500 });
  }
}
