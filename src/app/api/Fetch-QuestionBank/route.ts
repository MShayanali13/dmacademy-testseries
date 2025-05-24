import { connectDB } from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';
import QuestionBankSchema from '@/model/QuestionBankSchema';
import { unstable_noStore as noStore } from 'next/cache';

export async function GET(req: NextRequest) {
    try {
        noStore();
        await connectDB();

        const questions = await QuestionBankSchema.find();
        return NextResponse.json({ success: true, questions: questions });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}