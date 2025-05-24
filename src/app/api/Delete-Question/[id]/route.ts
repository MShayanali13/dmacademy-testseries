import { connectDB } from "@/lib/mongoose";
import QuestionBankSchema from "@/model/QuestionBankSchema";
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from 'next/cache';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    noStore();
    await connectDB();
    const { id } = params;
    await QuestionBankSchema.findByIdAndDelete(id);

    return NextResponse.json({ message: "Question deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}
