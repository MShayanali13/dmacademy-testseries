import { connectDB } from "@/lib/mongoose";
import { QuestionPaper } from "@/model/QuestionPaper";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import QuestionBankSchema from "@/model/QuestionBankSchema";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { questionIds, totalMarks, duration, date } = body;

    if (!questionIds || questionIds.length === 0) {
      return NextResponse.json({ success: false, message: "No questions provided." }, { status: 400 });
    }

    // Convert to ObjectId
    const objectIds = questionIds.map((id: string) => new mongoose.Types.ObjectId(id));

    // Fetch the question documents
    const questions = await QuestionBankSchema.find({ _id: { $in: objectIds } });

    if (questions.length !== questionIds.length) {
      return NextResponse.json({ success: false, message: "Some questions not found." }, { status: 404 });
    }

    // Determine test type
    const courses = new Set(questions.map(q => q.course));
    const subjects = new Set(questions.map(q => q.subject));
    const chapters = new Set(questions.map(q => q.chapter));

    let testType = "mixed";

    if (courses.size === 1) {
      if (subjects.size === 1) {
        testType = chapters.size === 1 ? "chapter-wise" : "subject-wise";
      } else {
        testType = "course-wise";
      }
    }

    // Extract consistent values
    let course = "", subject = "", chapter = "";

    if (courses.size === 1) course = courses.values().next().value;
    if (subjects.size === 1) subject = subjects.values().next().value;
    if (chapters.size === 1) chapter = chapters.values().next().value;

    // Create and save the test
    const newTest = new QuestionPaper({
      title:`${course!=="-"&&course} ${subject!=="-"&&`- ${subject}`} ${chapter!=="-"&&`- ${chapter}`}`,
      questionIds: objectIds,
      totalMarks,
      duration,
      date,
      course:course?course:"-",
      subject:subject?subject:"-",
      chapter:chapter?chapter:"-",
      level: "Easy", // or body.level if dynamic
      testType,
    });

    await newTest.save();

    return NextResponse.json({ ok: true, test: newTest });
  } catch (err) {
    console.error("Error saving test:", err);
    return NextResponse.json(
      { success: false, message: "Failed to create question paper." },
      { status: 500 }
    );
  }
}
