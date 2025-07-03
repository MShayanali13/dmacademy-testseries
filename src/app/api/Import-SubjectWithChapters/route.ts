import { NextRequest, NextResponse } from "next/server";
import {connectDB} from "@/lib/mongoose";
import { unstable_noStore as noStore } from "next/cache";
import QuestionStructure from "@/model/QuestionStructure";



export async function POST(request: Request) {
    noStore()
  try {
    await connectDB(); // make sure DB connected

    const data = await request.json();

    if (!data.subjectWithChapter || !Array.isArray(data.subjectWithChapter)) {
      return NextResponse.json(
        { error: "Invalid input: correct array required" },
        { status: 400 }
      );
    }
// console.log(data)
    const formattedSubjectWithChapter = data.subjectWithChapter.map((q: any) => {
      
      return {
       
           course: q.course,
        subject: q.subject,
        chapter: q.chapter,
       
      };
    });
// console.log(formattedSubjectWithChapter)

    // Insert many at once
    await QuestionStructure.insertMany(formattedSubjectWithChapter);

    return NextResponse.json({ message: "SubjectWithChapter imported successfully" });
  } catch (error: any) {
    console.error("Bulk import error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}