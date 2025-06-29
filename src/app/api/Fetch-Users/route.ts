import { connectDB } from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import UserSchema from '@/model/UserSchema';

export async function GET(req: NextRequest) {
    try {
        noStore();
        await connectDB();

        const users = await UserSchema.find();
        return NextResponse.json({ success: true, users: users });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}