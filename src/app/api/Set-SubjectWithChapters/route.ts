import { connectDB } from "@/lib/mongoose";
import QuestionStructureSchema from "@/model/QuestionStructure";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const { course, subject, chapter } = body;

  const created = await QuestionStructureSchema.create({ course, subject, chapter,level:"Easy",level_old:"" });
  return NextResponse.json({ success: true, created });
}


// old


// import { connectDB } from '@/lib/mongoose';
// import { NextRequest, NextResponse } from 'next/server';
// import { unstable_noStore as noStore } from 'next/cache';
// import SubjectWithChaptersSchema from '@/model/SubjectWithChaptersSchema';

// // Match the schema fields exactly
// type SubjectWithChaptersPayload = {
//   subject: string;
//   chapter: string;
// };

// export async function POST(req: NextRequest) {
//   try {
//     noStore();
//     await connectDB();
//     const body = await req.json();
//     const payload: SubjectWithChaptersPayload[] = body;
// const SubjectsWithChapters = await Promise.all(
//   payload.map(async (item) => {
 
  

//     return {
//         subject: item.subject,
//         chapter: item.chapter,
//     };
//   })
// );

//     const saved = await SubjectWithChaptersSchema.insertMany(SubjectsWithChapters);

//     return NextResponse.json({ message: 'Subject and chapters saved successfully', saved }, { status: 201 });
//   } catch (err: any) {
//     console.error('Error saving Subject and chapters:', err);
//     return NextResponse.json({ message: err.message || 'Internal server error' }, { status: 500 });
//   }
// }


