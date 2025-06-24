// app/api/Save-User/route.ts
import { auth } from "@clerk/nextjs/server";
import {connectDB} from "@/lib/mongoose";
import User from "@/model/UserSchema";
import { useUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST() {
  await connectDB();
  // const {user} = useUser();
  const { userId } = await auth();

  if (!userId) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  // Get Clerk user info
  const clerkUser = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
    },
  }).then((res) => res.json());

  const { username, email_addresses, first_name, last_name } = clerkUser;

  const existingUser = await User.findOne({ clerkId: userId });

  if (existingUser) return NextResponse.json({ success: true });

  const newUser = await User.create({
    clerkId: userId,
    username,
    email: email_addresses[0]?.email_address,
    name: `${first_name} ${last_name}`,
    role: "student", // default; update later if needed
    isIndividual: true,
  });

  return NextResponse.json({ success: true, newUser });
}
