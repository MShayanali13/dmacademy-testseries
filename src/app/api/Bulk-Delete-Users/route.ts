import {connectDB} from "@/lib/mongoose";
import UserSchema from "@/model/UserSchema";
import { unstable_noStore as noStore } from "next/cache";

export async function POST(req: Request) {
    noStore();
  await connectDB();
  const { ids } = await req.json();

  if (!Array.isArray(ids) || ids.length === 0) {
    return new Response(JSON.stringify({ success: false, message: "No IDs provided" }), { status: 400 });
  }

  try {
    await UserSchema.deleteMany({ _id: { $in: ids } });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: "Failed to delete users" }), { status: 500 });
  }
}
