import { connectDB } from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';
import SubjectWithChaptersSchema from '@/model/SubjectWithChaptersSchema';

import { unstable_noStore as noStore } from 'next/cache';

export async function GET(req: NextRequest) {
    try {
        noStore();
        await connectDB();

        const data = await SubjectWithChaptersSchema.find({}, 'subject chapter');
        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}