// /app/api/users/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/model/UserSchema";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    await connectDB();

    const existing = await User.findOne({ clerkId: userId });

    if (!existing) {
      // Fetch user info from Clerk
      const user = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      }).then((res) => res.json());

      const newUser = await User.create({
        clerkId: user.id,
        email: user.email_addresses?.[0]?.email_address || "",
        name: user.first_name + " " + user.last_name,
        // imageUrl: user.image_url,
      });

      return NextResponse.json({ user: newUser });
    }

    return NextResponse.json({ user: existing });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save user" }, { status: 500 });
  }
}
