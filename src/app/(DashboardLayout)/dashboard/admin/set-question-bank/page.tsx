"use client";
import { Box, Button, Typography } from "@mui/material";
import SetQuestion, { QuestionData } from "./question";
import { useEffect, useState } from "react";
import QuestionTypeSelector from "../../components/questionTypeSelector";
import Loading from "@/app/loading";
import PageContainer from "../../components/container/PageContainer";
import { unstable_noStore as noStore } from "next/cache";
import { useUser } from "@clerk/nextjs";

export default function SetTest() {

  noStore()

  const [loading, setLoading] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);
  const [questions, setQuestions] = useState<Record<number, QuestionData>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const addNewQuestion = () => {
    setQuestionCount((prev) => prev + 1);
  };

  const handleChange = (qNo: number, data: QuestionData) => {
    setQuestions((prev) => ({
      ...prev,
      [qNo]: data,
    }));
  };

  const [level, setLevel] = useState<string>('Easy');
  
  const [course, setCourse] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [chapter, setChapter] = useState<string>('');
 const { user } = useUser();
  // Handlers to update the state
  const handleLevelChange = (newLevel: string) => {
    setLevel(newLevel);
  };

   const handleCourseChange = (newCourse: string) => {
    setCourse(newCourse);
  };

  const handleSubjectChange = (newSubject: string) => {
    setSubject(newSubject);
  };

  const handleChapterChange = (newChapter: string) => {
    setChapter(newChapter);
  };
const handleSubmit = async () => {
  // Collecting data (this would be the questions array and additional metadata)
  const data = {
    questions: Object.keys(questions).map((qNo) => {
      const questionData = questions[parseInt(qNo)];
      return {
        questionType: questionData.questionType,
        question: questionData.question,
        options: questionData.options.map((opt) => ({ value: opt })), // wrap options to match the schema
        optionType: questionData.optionType,
        answer: questionData.answer,
        hint:questionData.hint,
        hintType:questionData.hintType,
        level,
        course,
        subject, // Add the selected subject
        chapter, // Add the selected chapter
      };
    }),
    uplodedBy:user?.username
  };

  // Log the data to console for debugging

  setIsSubmitted(true);
  try {
    const response = await fetch('/api/Set_QuestionBank', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        
      },
      cache:"no-store",
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (response.ok) {
      alert('Questions saved successfully');
    } else {
      alert(result.message || 'Failed to save the questions');
    }
  } catch (error) {
    alert('Error occurred while saving the questions');
  }
};


  if (loading) {
    return (
    <Loading />
    );
  }
  
  return (
    <PageContainer title="Set Question Bank" description="this is set question bank page">
      
          <QuestionTypeSelector
        onLevelChange={handleLevelChange}
         onCourseChange={handleCourseChange}
        onSubjectChange={handleSubjectChange}
        onChapterChange={handleChapterChange}
        title="Select Type of Questions"
        new={true}
        isSubmitted={isSubmitted}
      />

          <Typography variant="h5" mt={6}>
            Add Question Bank
          </Typography>

          <>
          {Array.from({ length: questionCount }).map((_, i) => (
            <SetQuestion key={i} qNo={i + 1} onChange={handleChange} isSubmitted={isSubmitted} />
          ))}
          </>

          <Box mt={3} display="flex" gap={2}>
            <Button variant="outlined" onClick={addNewQuestion}>
              ➕ Add Question
            </Button>
            <Button
              variant="contained"
              sx={{ ml: "auto" }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Box>
  
    
    </PageContainer>
  );
}
