"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Button, Grid, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { Question } from "@/types/questionType";

type SubmittedAnswers = Record<number, string>;

interface TestResult {
  correct: number;
  incorrect: number;
  unanswered: number[];
  score: number;
  percentage: number;
}

export default function ResultPage() {
  const [resultData, setResultData] = useState<{
    result: TestResult;
    questions: Question[];
    submittedAnswers: SubmittedAnswers;
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    const data = sessionStorage.getItem("testResult");
    if (!data) {
    //   router.push("/student/select-test");
      return;
    }
    setResultData(JSON.parse(data));
    sessionStorage.removeItem("testResult");
  }, [router]);

  if (!resultData) {
    return <Typography>Loading...</Typography>;
  }

  const { result, questions, submittedAnswers } = resultData;

  return (
    <Box sx={{ padding: 4, maxWidth: "900px", margin: "auto" }}>
      <Typography variant="h4" fontWeight="bold" mb={3} align="center">
        Test Results
      </Typography>

      <Paper elevation={3} sx={{ padding: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6">Correct Answers:</Typography>
            <Typography variant="body1" color="green">{result.correct}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Incorrect Answers:</Typography>
            <Typography variant="body1" color="red">{result.incorrect}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Unanswered Questions:</Typography>
            <Typography variant="body1">{result.unanswered.length}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Score:</Typography>
            <Typography variant="body1">{result.score}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Percentage:</Typography>
            <Typography variant="body1">{result.percentage}%</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h5" mb={2}>Detailed Review</Typography>

      {questions.map((question, idx) => {
        const userAnswer = submittedAnswers[idx];
        const correctAnswer = question.answer;

        const isCorrect = userAnswer === correctAnswer;
        const isUnanswered = !userAnswer;

        return (
          <Paper
            key={idx}
            elevation={2}
            sx={{
              mb: 2,
              p: 2,
              borderLeft: isCorrect ? "5px solid green" : isUnanswered ? "5px solid gray" : "5px solid red",
              backgroundColor: isCorrect ? "#e8f5e9" : isUnanswered ? "#f5f5f5" : "#ffebee",
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Q{idx + 1}: {question.questionType === "text" ? question.question.text : <img src={question.question.imgUrl} alt={`Question ${idx + 1}`} style={{ maxWidth: "100%", maxHeight: 150 }} />}
            </Typography>

            <Box sx={{ pl: 2 }}>
              {question.options.map((opt, optionIndex) => {
                const letter = String.fromCharCode(65 + optionIndex); // A, B, C, D

                const isUserSelected = userAnswer === letter;
                const isCorrectOption = correctAnswer === letter;

                return (
                  <Typography
                    key={optionIndex}
                    sx={{
                      color: isCorrectOption ? "green" : isUserSelected ? "red" : "black",
                      fontWeight: isCorrectOption || isUserSelected ? "bold" : "normal",
                      textDecoration: isUserSelected && !isCorrectOption ? "line-through" : "none",
                      mb: 0.5,
                    }}
                  >
                    {letter}. {question.optionType === "text" ? opt.text : <img src={opt.imgUrl} alt={`Option ${letter}`} style={{ maxWidth: "150px", maxHeight: 100 }} />}
                  </Typography>
                );
              })}
            </Box>

            <Typography sx={{ mt: 1, fontStyle: "italic" }}>
              Your Answer: {isUnanswered ? "Not Answered" : userAnswer} <br />
              Correct Answer: {correctAnswer}
            </Typography>
          </Paper>
        );
      })}

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button variant="contained" color="primary" onClick={() => router.push("/student/select-test")}>
          Take Another Test
        </Button>
      </Box>
    </Box>
  );
}
