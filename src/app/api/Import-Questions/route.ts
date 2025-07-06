import { NextRequest, NextResponse } from "next/server";
import {connectDB} from "@/lib/mongoose";
import QuestionBank from "@/model/QuestionBankSchema"; // update path as needed
import { unstable_noStore as noStore } from "next/cache";



export async function POST(request: Request) {
    noStore()
  try {
    await connectDB(); // make sure DB connected

    const data = await request.json();

    if (!data.questions || !Array.isArray(data.questions)) {
      return NextResponse.json(
        { error: "Invalid input: questions array required" },
        { status: 400 }
      );
    }

    const formattedQuestions = data.questions.map((q: any) => {
      // Transform separate optionA, optionB... to array options
      return {
        questionType: q.questionType,
        optionType: q.optionType,
        question: {
          text: q["question.text"] || "",
          imgUrl: q["question.imgUrl"] || "",
        },
        options: [
          { text: q["optionA.text"] || "", imgUrl: q["optionA.imgUrl"] || "" },
          { text: q["optionB.text"] || "", imgUrl: q["optionB.imgUrl"] || "" },
          { text: q["optionC.text"] || "", imgUrl: q["optionC.imgUrl"] || "" },
          { text: q["optionD.text"] || "", imgUrl: q["optionD.imgUrl"] || "" },
        ],
        answer: q.answer,
        level: q.level,
           course: q.course,
        subject: q.subject,
        chapter: q.chapter,
        uploadedBy: q.uploadedBy,
        hintType:q.hintType,
        hint:{
          text: q["hint.text"] || "",
          imgUrl: q["hint.imgUrl"] || "",
        },
      };
    });

    // Optional: validate each question options length === 4
    for (const fq of formattedQuestions) {
      if (fq.options.length !== 4) {
        return NextResponse.json(
          { error: "Each question must have exactly 4 options" },
          { status: 400 }
        );
      }
    }

    // Insert many at once
    await QuestionBank.insertMany(formattedQuestions);

    return NextResponse.json({ message: "Questions imported successfully",ok:true });
  } catch (error: any) {
    console.error("Bulk import error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}