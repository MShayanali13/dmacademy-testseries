import { connectDB } from "@/lib/mongoose";
import QuestionBankSchema from "@/model/QuestionBankSchema";
import { NextResponse } from "next/server";

import { unstable_noStore as noStore } from 'next/cache';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    noStore();
    await connectDB();
    const { id } = params;
    const question = await QuestionBankSchema.findById(id).lean();

    if (!question) {
      return NextResponse.json({ message: "Question not found" }, { status: 404 });
    }

    return NextResponse.json(question, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Fetch failed" }, { status: 500 });
  }
}
