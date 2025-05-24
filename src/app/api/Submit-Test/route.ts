import { NextResponse } from "next/server";
import { Question } from "@/types/questionType";

type SubmittedAnswers = Record<number, string>;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { generatedQuestions, submittedAnswers }: {
      generatedQuestions: Question[];
      submittedAnswers: SubmittedAnswers;
    } = body;

    let correct = 0;
    let incorrect = 0;
    const unanswered: number[] = [];

    const totalQuestions = generatedQuestions.length;

    generatedQuestions.forEach((question, index) => {
      const selected = submittedAnswers[index];

      if (!selected) {
        unanswered.push(index);
      } else if (selected === question.answer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const score = correct * 4 - incorrect * 1;
    const percentage = Math.round((correct / totalQuestions) * 100);

    return NextResponse.json({
      correct,
      incorrect,
      unanswered,
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
