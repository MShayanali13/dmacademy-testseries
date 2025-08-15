import { NextResponse } from "next/server";
import { Question } from "@/types/questionType";

import { unstable_noStore as noStore } from 'next/cache';

type SubmittedAnswers = Record<string, string>;

export async function POST(req: Request) {
  noStore();
  
  try {
    const body = await req.json();
    const { generatedQuestions, submittedAnswers }: {
      generatedQuestions: Question[];
      submittedAnswers: SubmittedAnswers;
    } = body;

    let correct = 0;
    let incorrect = 0;
    
    const Answers: { id: string; ans: string;selected:string; }[]= [];
    
    const unanswered: string[] = [];

    const totalMarks = generatedQuestions.length*4;

    generatedQuestions.forEach((question, index) => {
      const selected = submittedAnswers[question._id];

      if (!selected) {
        unanswered.push(question._id);
      } else if (selected === question.answer) {
        correct++;
        Answers.push({id:question._id,ans:"correct",selected})
      } else {
        incorrect++;
        Answers.push({id:question._id,ans:"incorrect",selected})
      }
    });

    const score = correct * 4 - incorrect * 1;
    const percentage = Math.round((score / totalMarks) * 100);

    return NextResponse.json({
      correct,
      incorrect,
      unanswered,
      Answers,
      score,
      percentage,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
