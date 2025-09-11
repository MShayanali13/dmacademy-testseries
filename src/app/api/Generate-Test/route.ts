import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import QuestionBankSchema from '@/model/QuestionBankSchema';

import { unstable_noStore as noStore } from 'next/cache';

export async function POST(req: Request) {
    noStore();
    
    try {
        // Parse the request body
        const body = await req.json();
        const { level, subject, chapter, course } = body;

        // Validate the required fields
        if (!course) {
            return NextResponse.json(
                { error: 'Missing required field: course' },
                { status: 400 }
            );
        }

        // Connect to the database
        await connectDB();

        // Build match criteria based on available fields
        let matchCriteria: any = { course };
        
        if (subject && subject.trim() !== '') {
            matchCriteria.subject = subject;
        }
        
        if (chapter && chapter.trim() !== '') {
            matchCriteria.chapter = chapter;
        }

        // Fetch data from the Question schema with filters and limit
        const questions = await QuestionBankSchema.aggregate([
            {
                $match: matchCriteria,
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