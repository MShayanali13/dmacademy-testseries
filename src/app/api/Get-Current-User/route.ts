// app/api/auth/me/route.ts
import { useUser } from "@clerk/nextjs";
import {connectDB} from "@/lib/mongoose";
import User from "@/model/UserSchema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  // const { user } = useUser(); // Clerk ID

  
    const { userId } = await auth();

  const user = await User.findOne({ clerkId: userId });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  let isSubscribed = user.isSubscribed;

  if (user.collegeId?.subscribedTill) {
    isSubscribed ||= new Date(user.collegeId.subscribedTill) > new Date();
  }

  return NextResponse.json({
    success: true,
    user: {
      name: user.name,
      username: user.username,
      role: user.role,
      isSubscribed,
    },
  });
}
