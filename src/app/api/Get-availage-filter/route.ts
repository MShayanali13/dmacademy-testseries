import { connectDB } from "@/lib/mongoose";
import QuestionBank from "@/model/QuestionBankSchema";
import QuestionStructure from "@/model/QuestionStructure";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "filtered" or "all"

    if (!type) {
      return NextResponse.json({
        success: false,
        message: "Missing 'type' in query params",
      });
    }

    if (type === "filtered") {
      const distinctCombos = await QuestionBank.aggregate([
        {
          $group: {
            _id: {
              course: "$course",
              level: "$level",
              subject: "$subject",
              chapter:"$chapter",
            },
          },
        },
        {
          $project: {
            _id: 0,
            course: "$_id.course",
            level: "$_id.level",
            subject: "$_id.subject",
            chapter:"$_id.chapter"
          },
        },
      ]);

      return NextResponse.json({
        success: true,
        data: distinctCombos,
      });
    }

    if (type === "all") {
      // const data = await QuestionBank.find({}, "subject");
      // const uniqueSubjects = Array.from(new Set(data.map((q) => q.subject)));

      // const levels = ["Easy", "Medium", "Difficult"];
      // const courses = ["JEE", "NEET", "CET"];

      // return NextResponse.json({
      //   success: true,
      //   data: {
      //     levels,
      //     courses,
      //     subjects: uniqueSubjects,
      //   },
      // });

      const data = await QuestionStructure.find({}, "-_id course level subject chapter");

      
      const course=Array.from(new Set(data.map((q) => q.course)));
      
      const level=Array.from(new Set(data.map((q) => q.level)));
      
      const subject=Array.from(new Set(data.map((q) => q.subject)));
      
      const chapter=Array.from(new Set(data.map((q) => q.course)));

      return NextResponse.json({
        success: true,
        data,
      });
    }

    return NextResponse.json({
      success: false,
      message: "Invalid 'type' value",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
