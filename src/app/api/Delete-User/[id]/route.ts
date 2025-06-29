import { connectDB } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from 'next/cache';
import UserSchema from "@/model/UserSchema";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    noStore();
    await connectDB();
    const { id } = params;
    await UserSchema.findByIdAndDelete(id);

    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}
