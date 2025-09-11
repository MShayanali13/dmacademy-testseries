import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import QuestionBankSchema from '@/model/QuestionBankSchema';
import { unstable_noStore as noStore } from 'next/cache';

export async function GET() {
    noStore();
    
    try {
        // Connect to the database
        await connectDB();

        // Get course-wise question counts
        const courseCounts = await QuestionBankSchema.aggregate([
            {
                $group: {
                    _id: '$course',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Get subject-wise question counts for each course
        const subjectCounts = await QuestionBankSchema.aggregate([
            {
                $group: {
                    _id: {
                        course: '$course',
                        subject: '$subject'
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Get chapter-wise question counts for each subject
        const chapterCounts = await QuestionBankSchema.aggregate([
            {
                $group: {
                    _id: {
                        course: '$course',
                        subject: '$subject',
                        chapter: '$chapter'
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Filter and format the data
        const courses = courseCounts
            .filter(item => item._id && item.count >= 180) // Only show courses with at least 180 questions
            .map(item => ({
                name: item._id,
                count: item.count
            }));

        const subjects = subjectCounts
            .filter(item => item._id.course && item._id.subject && item.count >= 90) // Only show subjects with at least 90 questions
            .map(item => ({
                course: item._id.course,
                name: item._id.subject,
                count: item.count
            }));

        const chapters = chapterCounts
            .filter(item => item._id.course && item._id.subject && item._id.chapter && item.count >= 30) // Only show chapters with at least 30 questions
            .map(item => ({
                course: item._id.course,
                subject: item._id.subject,
                name: item._id.chapter,
                count: item.count
            }));

        return NextResponse.json({ 
            success: true, 
            courses,
            subjects,
            chapters
        });
    } catch (error) {
        console.error('Error fetching available options:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
