import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import QuestionBankSchema from '@/model/QuestionBankSchema';

import { unstable_noStore as noStore } from 'next/cache';

export async function POST(req: Request) {
    noStore();
    
    try {
        // Parse the request body
        const body = await req.json();
        const { level, subject, chapter,course } = body;

        // Validate the required fields
        if (!level || !subject || !chapter || !course) {
            return NextResponse.json(
                { error: 'Missing required fields: level, subject, or chapter or course' },
                { status: 400 }
            );
        }

        // Connect to the database
        await connectDB();

        // Fetch data from the Question schema with filters and limit
        const questions = await QuestionBankSchema.aggregate([
  {
    $match: {
      level,
      subject,
      chapter,
      course,
    },
  },
  { $sample: { size: 50 } }, // randomly select 50 documents
]);
           

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