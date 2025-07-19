import { connectDB } from "@/lib/mongoose";
import { QuestionPaper } from "@/model/QuestionPaper";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const deleted = await QuestionPaper.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "question paper not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Failed to delete question paper" }, { status: 500 });
  }
}
