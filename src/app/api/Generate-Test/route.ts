import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import QuestionBankSchema from '@/model/QuestionBankSchema';

export async function POST(req: Request) {
    try {
        // Parse the request body
        const body = await req.json();
        const { level, subject, chapter } = body;

        // Validate the required fields
        if (!level || !subject || !chapter) {
            return NextResponse.json(
                { error: 'Missing required fields: level, subject, or chapter' },
                { status: 400 }
            );
        }

        // Connect to the database
        await connectDB();

        // Fetch data from the Question schema with filters and limit
        const questions = await QuestionBankSchema.find({ level, subject, chapter })
            .limit(50)
           

        // Return the fetched data
        return NextResponse.json({ success: true, data: questions });
    } catch (error) {
        console.error('Error fetching questions:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}