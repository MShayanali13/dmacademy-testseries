import { connectDB } from "@/lib/mongoose";
import QuestionBank from "@/model/QuestionBankSchema";
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
            },
          },
        },
        {
          $project: {
            _id: 0,
            course: "$_id.course",
            level: "$_id.level",
            subject: "$_id.subject",
          },
        },
      ]);

      return NextResponse.json({
        success: true,
        data: distinctCombos,
      });
    }

    if (type === "all") {
      const data = await QuestionBank.find({}, "subject");
      const uniqueSubjects = Array.from(new Set(data.map((q) => q.subject)));

      const levels = ["Easy", "Medium", "Difficult"];
      const courses = ["JEE", "NEET", "CET"];

      return NextResponse.json({
        success: true,
        data: {
          levels,
          courses,
          subjects: uniqueSubjects,
        },
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
