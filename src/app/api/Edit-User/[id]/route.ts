import { connectDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import QuestionBankSchema from "@/model/QuestionBankSchema";

import { unstable_noStore as noStore } from 'next/cache';
import UserSchema from "@/model/UserSchema";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    noStore();
    await connectDB();

    const body = await req.json();
    const {username,
    email,
    name,
    role,
    isSubscribed, } = body;

    // Find the existing User by ID
    const existingUser = await UserSchema.findById(params.id);
    if (!existingUser) {
      throw new Error("User not found");
    }
   let updatedUser = {
    username,
    email,
    isSubscribed,name,role
    };


    await UserSchema.findByIdAndUpdate(params.id, updatedUser);

    return NextResponse.json({ message: 'User updated successfully', updatedUser, ok:true }, { status: 200 });
  } catch (err: any) {
    console.error('Error updating User:', err);
    return NextResponse.json({ message: err.message || 'Internal server error' }, { status: 500 });
  }
}
