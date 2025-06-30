// app/api/Save-User/route.ts
import { auth } from "@clerk/nextjs/server";
import {connectDB} from "@/lib/mongoose";
import User from "@/model/UserSchema";
import { useUser } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import UserSchema from "@/model/UserSchema";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
   
      await connectDB();
  
      const body = await req.json();
      const {username,
      email,
      name,
      role,
      isSubscribed, } = body;
  // Find the existing User by ID
      const existingUser = await UserSchema.findById(params.id);
      if (existingUser) {
       return NextResponse.json({ success: true,  });
      }

  const newUser = await User.create({
   
    username,
    email,
    name,
    role, 
    isSubscribed
  });

  return NextResponse.json({ success: true, newUser });
}
