// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongoose";
// import QuestionBankSchema from "@/model/QuestionBankSchema";
// import { unstable_noStore as noStore } from "next/cache";

// /** ================= MOCK CONFIG ================= **/
// const MOCK_CONFIG = {
//   JEE: {
//     mockTest: { questions: 200, duration: 180 }, // 3 hrs
//     subjectWise: {
//       Physics: { questions: 60, duration: 70 },
//       Chemistry: { questions: 60, duration: 70 },
//       Maths: { questions: 60, duration: 70 },
//     },
//     chapterWise: { questions: 30, duration: 60 },
//   },
//   NEET: {
//     mockTest: { questions: 200, duration: 180 },
//     subjectWise: {
//       Physics: { questions: 60, duration: 70 },
//       Chemistry: { questions: 60, duration: 70 },
//       Biology: { questions: 80, duration: 80 },
//     },
//     chapterWise: {
//       Physics: { questions: 35, duration: 60 },
//       Chemistry: { questions: 35, duration: 60 },
//       Biology: { questions: 40, duration: 60 },
//     },
//   },
//   Foundation8: {
//     mockTest: { questions: 120, duration: 120 },
//     subjectWise: {
//       Maths: { questions: 45, duration: 50 },
//       Physics: { questions: 40, duration: 50 },
//       Social: { questions: 35, duration: 40 },
//     },
//     chapterWise: { questions: 20, duration: 45 },
//   },
//   Foundation9: {
//     mockTest: { questions: 120, duration: 120 },
//     subjectWise: {
//       Maths: { questions: 45, duration: 50 },
//       Science: { questions: 40, duration: 50 },
//       Social: { questions: 35, duration: 40 },
//     },
//     chapterWise: { questions: 20, duration: 45 },
//   },
//   Foundation10: {
//     mockTest: { questions: 120, duration: 120 },
//     subjectWise: {
//       Maths: { questions: 45, duration: 50 },
//       Science: { questions: 40, duration: 50 },
//       Social: { questions: 35, duration: 40 },
//     },
//     chapterWise: { questions: 20, duration: 45 },
//   },
// } as const;

// /** ================= TYPES ================= **/
// type CourseType = keyof typeof MOCK_CONFIG;
// type TestType = "mock" | "subject" | "chapter";
// type Subject = string;

// /** ================= MAIN ROUTE ================= **/
// export async function POST(req: Request) {
//   noStore();
//   try {
//     await connectDB();

//     const body = await req.json();
//     const { testType, course, subject, chapter } = body;

//     // Validate course
//     if (!Object.keys(MOCK_CONFIG).includes(course)) {
//       return NextResponse.json(
//         { success: false, error: "Invalid course" },
//         { status: 400 }
//       );
//     }

//     let questions: any[] = [];
//     let duration = 0;

//     switch (testType as TestType) {
//       case "mock":
//         ({ questions, duration } = await generateMockTest(course as CourseType));
//         break;

//       case "subject":
//         if (!subject) {
//           return NextResponse.json(
//             { success: false, error: "Missing subject" },
//             { status: 400 }
//           );
//         }
//         ({ questions, duration } = await generateSubjectTest(course as CourseType, subject));
//         break;

//       case "chapter":
//         if (!subject || !chapter) {
//           return NextResponse.json(
//             { success: false, error: "Missing subject or chapter" },
//             { status: 400 }
//           );
//         }
//         ({ questions, duration } = await generateChapterTest(course as CourseType, subject, chapter));
//         break;

//       default:
//         return NextResponse.json(
//           { success: false, error: "Invalid testType" },
//           { status: 400 }
//         );
//     }

//     return NextResponse.json({
//       success: true,
//       questions,
//       duration,
//       totalQuestions: questions.length,
//       hasQuestions: questions.length > 0,
//       testType,
//     });
//   } catch (err) {
//     console.error("Error in POST /api/Get-Questions-By-Type", err);
//     return NextResponse.json(
//       { success: false, error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// /** ================= HELPERS ================= **/

// // ----------------- Shuffle -----------------
// function shuffleArray<T>(arr: T[]): T[] {
//   const a = [...arr];
//   for (let i = a.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [a[i], a[j]] = [a[j], a[i]];
//   }
//   return a;
// }

// // ----------------- Mock Test -----------------
// async function generateMockTest(course: CourseType) {
//   const subjects = MOCK_CONFIG[course].subjectWise;
//   const mockConfig = MOCK_CONFIG[course].mockTest;

//   let allQuestions: any[] = [];

//   for (const [subj, subjConfig] of Object.entries(subjects)) {
//     const q = await QuestionBankSchema.find({ course, subject: subj });
//     const countToPick = Math.min(subjConfig.questions, q.length);
//     const picked = shuffleArray(q).slice(0, countToPick);

//     const tagged = picked.map((ques: any) => ({
//       ...(ques.toObject?.() || ques),
//       subject: subj,
//     }));

//     allQuestions.push(...tagged);
//   }

//   const finalQuestions = shuffleArray(allQuestions).slice(
//     0,
//     Math.min(mockConfig.questions, allQuestions.length)
//   );

//   const numbered = finalQuestions.map((q, idx) => ({
//     ...q,
//     qNo: idx + 1,
//   }));

//   return { questions: numbered, duration: mockConfig.duration * 60 };
// }

// // ----------------- Subject Test -----------------
// async function generateSubjectTest(course: CourseType, subject: Subject) {
//   const subjConfig = (MOCK_CONFIG[course].subjectWise as any)[subject];
//   if (!subjConfig) throw new Error(`Invalid subject: ${subject}`);

//   const all = await QuestionBankSchema.find({ course, subject });
//   const countToPick = Math.min(subjConfig.questions, all.length);
//   const picked = shuffleArray(all).slice(0, countToPick);

//   const numbered = picked.map((q, idx) => ({
//     ...(q.toObject?.() || q),
//     subject,
//     qNo: idx + 1,
//   }));

//   return { questions: numbered, duration: subjConfig.duration * 60 };
// }

// // ----------------- Chapter Test -----------------
// async function generateChapterTest(course: CourseType, subject: Subject, chapter: string) {
//   const chapConfig =
//     (MOCK_CONFIG[course].chapterWise as any)[subject] ||
//     MOCK_CONFIG[course].chapterWise;

//   const all = await QuestionBankSchema.find({ course, subject, chapter });
//   const countToPick = Math.min(chapConfig.questions, all.length);
//   const picked = shuffleArray(all).slice(0, countToPick);

//   const numbered = picked.map((q, idx) => ({
//     ...(q.toObject?.() || q),
//     subject,
//     chapter,
//     qNo: idx + 1,
//   }));

//   return { questions: numbered, duration: chapConfig.duration * 60 };
// }


import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import QuestionBankSchema from "@/model/QuestionBankSchema";
import { unstable_noStore as noStore } from "next/cache";
import MOCK_CONFIG from "@/utils/mock_config";

/** ================= TYPES ================= **/
type CourseType = keyof typeof MOCK_CONFIG;
type TestType = "mock" | "subject" | "chapter";
type Subject = string;

/** ================= MAIN ROUTE ================= **/
export async function POST(req: Request) {
  noStore();
  try {
    await connectDB();

    const body = await req.json();
    const { testType, course, subject, chapter } = body;

    if (!Object.keys(MOCK_CONFIG).includes(course)) {
      return NextResponse.json(
        { success: false, error: "Invalid course" },
        { status: 400 }
      );
    }

    let questions: any[] = [];
    let duration = 0;
    let subjectStats: Record<string, number> = {};

    switch (testType as TestType) {
      case "mock":
        ({ questions, duration, subjectStats } = await generateMockTest(course as CourseType));
        break;

      case "subject":
        if (!subject) {
          return NextResponse.json(
            { success: false, error: "Missing subject" },
            { status: 400 }
          );
        }
        ({ questions, duration } = await generateSubjectTest(course as CourseType, subject));
        break;

      case "chapter":
        if (!subject || !chapter) {
          return NextResponse.json(
            { success: false, error: "Missing subject or chapter" },
            { status: 400 }
          );
        }
        ({ questions, duration } = await generateChapterTest(course as CourseType, subject, chapter));
        break;

      default:
        return NextResponse.json(
          { success: false, error: "Invalid testType" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      questions,
      duration,
      totalQuestions: questions.length,
      subjectStats, // ✅ Number of questions per subject for mock
      hasQuestions: questions.length > 0,
      testType,
    });
  } catch (err) {
    console.error("Error in POST /api/Get-Questions-By-Type", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/** ================= HELPERS ================= **/
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ----------------- Mock Test -----------------
async function generateMockTest(course: CourseType) {
  const subjects = MOCK_CONFIG[course].subjectWise;
  const mockConfig = MOCK_CONFIG[course].mockTest;

  let allQuestions: any[] = [];
  const subjectStats: Record<string, number> = {};

  for (const [subj, subjConfig] of Object.entries(subjects)) {
    // Randomly fetch questions from DB
    const picked = await QuestionBankSchema.aggregate([
      { $match: { course, subject: subj } },
      { $sample: { size: subjConfig.questions } }, // fetch N random questions
    ]);

    subjectStats[subj] = picked.length;

    const tagged = picked.map((ques: any) => ({
      ...(ques.toObject?.() || ques),
      subject: subj,
    }));

    allQuestions.push(...tagged);
  }

  // Randomize all questions across subjects if needed
  const finalQuestions = shuffleArray(allQuestions).slice(
    0,
    Math.min(mockConfig.questions, allQuestions.length)
  );

  const numbered = finalQuestions.map((q, idx) => ({ ...q, qNo: idx + 1 }));

  return { questions: numbered, duration: mockConfig.duration * 60, subjectStats };
}


// ----------------- Subject Test -----------------
async function generateSubjectTest(course: CourseType, subject: Subject) {
  const subjConfig = (MOCK_CONFIG[course].subjectWise as any)[subject];
  if (!subjConfig) throw new Error(`Invalid subject: ${subject}`);

  const picked = await QuestionBankSchema.aggregate([
    { $match: { course, subject } },
    { $sample: { size: subjConfig.questions } },
  ]);

  const numbered = picked.map((q, idx) => ({
    ...(q.toObject?.() || q),
    subject,
    qNo: idx + 1,
  }));

  return { questions: numbered, duration: subjConfig.duration * 60 };
}


// ----------------- Chapter Test -----------------
async function generateChapterTest(course: CourseType, subject: Subject, chapter: string) {
  const chapConfig =
    (MOCK_CONFIG[course].chapterWise as any)[subject] ||
    MOCK_CONFIG[course].chapterWise;

  const picked = await QuestionBankSchema.aggregate([
    { $match: { course, subject, chapter } },
    { $sample: { size: chapConfig.questions } },
  ]);

  const numbered = picked.map((q, idx) => ({
    ...(q.toObject?.() || q),
    subject,
    chapter,
    qNo: idx + 1,
  }));

  return { questions: numbered, duration: chapConfig.duration * 60 };
}
