import { connectDB } from '@/lib/mongoose';
import QuestionBank from '@/model/QuestionBankSchema';
import { NextRequest, NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';

export async function GET(req: NextRequest) {
  try {
    noStore();
    await connectDB();

    const { searchParams } = new URL(req.url);
    const course = searchParams.get("course");
    const level = searchParams.get("level");
    const subject = searchParams.get("subject");

    if (!course || !level || !subject) {
      return NextResponse.json(
        { success: false, message: "Missing course, level, or subject in query" },
        { status: 400 }
      );
    }

    const chapters = await QuestionBank.distinct("chapter", {
      course,
      level,
      subject,
    });

    return NextResponse.json({ success: true, data: chapters });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
