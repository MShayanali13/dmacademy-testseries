"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

type QuestionType = {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: string;
};

type TestType = {
  title: string;
  instructions: string;
  date: string;
  time: string;
};

export default function PrintableQuestionPaperPage() {
  const { id } = useParams();
  const [test, setTest] = useState<TestType | null>(null);
  const [questions, setQuestions] = useState<QuestionType[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(`/api/Get_Question-Paper/${id}`);
      setTest(res.data.test);
      setQuestions(res.data.questions);
    }
    fetchData();
  }, [id]);

  if (!test) return <div>Loading...</div>;

  return (
    <div className="print-container p-6 text-black">
      {questions.map((q, index) => (
        <div
          key={q._id}
          className="question-page break-after-page text-[14px] leading-[1.8]"
        >
          {/* Top bar (repeated every page) */}
          <div className="border-b pb-2 mb-4">
            <div className="flex justify-between items-center text-sm">
              <div>DM Academy</div>
              <div>
                Date: {test.date} | Time: {test.time}
              </div>
            </div>
            <div className="text-center font-semibold text-lg mt-2">
              {test.title || "Question Paper"}
            </div>
          </div>

          {/* Instructions only on first page */}
          {index === 0 && (
            <div className="mb-4 text-sm">
              <div className="font-semibold">Instructions:</div>
              <div className="whitespace-pre-line">{test.instructions}</div>
            </div>
          )}

          {/* Question */}
          <div className="mb-2">
            <span className="font-bold">Q{index + 1}.</span> {q.question}
          </div>

          {/* Options */}
          <div className="pl-6">
            {q.options.map((opt, i) => (
              <div key={i} className="mb-1">
                {String.fromCharCode(65 + i)}. {opt}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
