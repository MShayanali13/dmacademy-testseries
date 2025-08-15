// src/app/api/Get_Question-Paper/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import QuestionBankSchema from "@/model/QuestionBankSchema";
import { QuestionPaper } from "@/model/QuestionPaper";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const test = await QuestionPaper.findById(id).lean();
    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    // Ensure correct type for test to access questionIds
    const questionIds = (test as { questionIds?: string[] }).questionIds || [];

    const questions = await QuestionBankSchema.find({
      _id: { $in: questionIds.map((qid: string) => new mongoose.Types.ObjectId(qid)) },
    }).lean();

    // Explicitly type questions as array of objects with _id property
    type QuestionType = { _id: mongoose.Types.ObjectId | string; [key: string]: any };
    const typedQuestions = questions as QuestionType[];
    
const map = new Map(
  typedQuestions.map((q) => [q._id.toString(), q])
);

const orderedQuestions = questionIds.map((id: string) =>
  map.get(id.toString()) ?? null
);
    return NextResponse.json({ test, questions: orderedQuestions });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
