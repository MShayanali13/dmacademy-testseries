import { connectDB } from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import QuestionBankSchema from '@/model/QuestionBankSchema';

import { unstable_noStore as noStore } from 'next/cache';

// Match the schema fields exactly
type QuestionPayload = {
  questionType: 'text' | 'image';
  optionType: 'text' | 'image';
  question: string; // either text or base64 image
  options: { value: string }[]; // 4 options, each text or base64 image
  answer: 'A' | 'B' | 'C' | 'D';
  level: 'Easy' | 'Medium' | 'Difficult';
  hintType:'text'|'image';
hint:string;
  subject: string;
  chapter: string;
};

export async function POST(req: NextRequest) {
  try {
    noStore();
    await connectDB();
    const body = await req.json();
    const questions: QuestionPayload[] = body.questions;
const processedQuestions = await Promise.all(
  questions.map(async (q) => {
    let questionData: { text: string | null; imgUrl: string | null } = { text: null, imgUrl: null };

    if (q.questionType === 'image') {
      const uploadRes = await cloudinary.uploader.upload(q.question, {
        folder: 'test-series/questions',
        resource_type: 'image',
      });
      questionData.imgUrl = uploadRes.secure_url;
    } else {
      questionData.text = q.question;
    }



 let hintData: { text: string | null; imgUrl: string | null } = { text: null, imgUrl: null };

    if (q.hintType === 'image') {
      const uploadRes = await cloudinary.uploader.upload(q.hint, {
        folder: 'test-series/hints',
        resource_type: 'image',
      });
      hintData.imgUrl = uploadRes.secure_url;
    } else {
      hintData.text = q.hint;
    }



    const updatedOptions = await Promise.all(
      q.options.map(async (opt) => {
        if (q.optionType === 'image') {
          const uploadRes = await cloudinary.uploader.upload(opt.value, {
            folder: 'test-series/options',
            resource_type: 'image',
          });
          return { text: null, imgUrl: uploadRes.secure_url };
        }
        return { text: opt.value, imgUrl: null };
      })
    );

    return {
      questionType: q.questionType,
      optionType: q.optionType,
      question: questionData,
      options: updatedOptions,
      answer: q.answer,
      hint:hintData,
      hintType:q.hintType,
      level: q.level,
      subject: q.subject,
      chapter: q.chapter,
      uploadedBy: 'admin', // Replace with actual user ID if available
    };
  })
);

    const saved = await QuestionBankSchema.insertMany(processedQuestions);

    return NextResponse.json({ message: 'Questions saved successfully', saved }, { status: 201 });
  } catch (err: any) {
    console.error('Error saving questions:', err);
    return NextResponse.json({ message: err.message || 'Internal server error' }, { status: 500 });
  }
}
