"use client";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import { Question } from "@/types/questionType";
import Loading from "@/app/loading";
import PageContainer from "../../components/container/PageContainer";

export default function ResultPage() {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [submittedAnswers, setSubmittedAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [unansweredCount, setUnansweredCount] = useState(0);
  const [percentage, setPercentage] = useState("0");

  // useEffect(() => {
  //   const questionsData = JSON.parse(searchParams.get("questions") || "[]");
  //   const submittedData = JSON.parse(searchParams.get("submittedAnswers") || "[]");

  //   setQuestions(questionsData);
  //   setSubmittedAnswers(submittedData);

  //   let correct = 0;
  //   let incorrect = 0;
  //   let unanswered = 0;

  //   questionsData.forEach((q: Question, i: number) => {
  //     const submitted = submittedData[i];
  //     if (!submitted) {
  //       unanswered++;
  //     } else if (submitted === q.answer) {
  //       correct++;
  //     } else {
  //       incorrect++;
  //     }
  //   });

  //   const calculatedScore = correct * 4 - incorrect;
  //   const total = questionsData.length;
  //   const percentageVal = total === 0 ? "0.00" : ((correct / total) * 100).toFixed(2);

  //   setCorrectCount(correct);
  //   setIncorrectCount(incorrect);
  //   setUnansweredCount(unanswered);
  //   setScore(calculatedScore);
  //   setPercentage(percentageVal);
  //   setLoading(false);
  // }, [searchParams]);
  useEffect(() => {
  const stored = sessionStorage.getItem("testResult");

  if (!stored) return;

  try {
    const parsed = JSON.parse(stored);
    const { result, questions, submittedAnswers } = parsed;

    setQuestions(questions || []);
    setSubmittedAnswers(
      Object.values(submittedAnswers || {}) as string[]
    );

    setCorrectCount(result?.correct || 0);
    setIncorrectCount(result?.incorrect || 0);
    setUnansweredCount(result?.unanswered?.length || 0);
    setScore(result?.score || 0);
    setPercentage(result?.percentage?.toFixed?.(2) || "0.00");

    setLoading(false);
    sessionStorage.removeItem("testResult");
  } catch (err) {
    console.error("Session parse error:", err);
  }

}, []);

const handleDownload = async () => {
  const element = document.getElementById("result-pdf");
  if (!element) return;

  // Wait for all images to load
  const images = element.querySelectorAll("img");
  const promises = Array.from(images).map(
    (img) =>
      new Promise<void>((resolve) => {
        if (img.complete) resolve();
        else {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        }
      })
  );
  await Promise.all(promises);

  const html2pdf = (await import("html2pdf.js")).default;

  html2pdf()
    .set({
      margin: 0.5,
      filename: "result.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        dpi: 192,
        letterRendering: true,
        useCORS: true, // <-- ENABLE CORS
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    })
    .from(element)
    .save();
};



if(loading) {
  return(
    <Loading />
  )
}
  return (
    <Box sx={{maxWidth:"100vw"}}>
      <PageContainer title="Result" description="this is result page">
   
    <Box p={2} > 
    {/* Download Button */}
      <Box mb={1} display="flex" flexWrap={"wrap"} justifyContent="space-between">
        <Button variant="outlined" onClick={handleDownload}>
          Download PDF
        </Button>
        <Typography variant="h4" mt={1} gutterBottom>
        Result Summary
      </Typography>
      </Box>
      <Box id="result-pdf" sx={{mt:0,}}>
      

      {/* Summary Boxes */}
      <Grid container spacing={2} mb={4} mt={2}>
        {[
          { label: "Correct", value: correctCount, color: "#c8e6c9" },
          { label: "Incorrect", value: incorrectCount, color: "#ffcdd2" },
          { label: "Skipped", value: unansweredCount, color: "#eeeeee" },
          { label: "Score", value: score, color: "#bbdefb" },
          { label: "Percentage", value: `${percentage}%`, color: "#fff9c4" },
        ].map((item, idx) => (
          <Grid item xs={6} sm={4} md={2.4} key={idx}>
            <Paper sx={{ p: 2, textAlign: "center", backgroundColor: item.color }}>
              <Typography variant="subtitle1">{item.label}</Typography>
              <Typography variant="h6" fontWeight="bold">
                {item.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

     

      {/* Question-wise Details Table */}
      <Typography variant="h6" gutterBottom>
        Question-wise Details
      </Typography>

      <TableContainer  sx={{ border: "0.2px solid #efefef",  mt:4}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: "0.7px solid #888", py: 1.5, px: 2  }}><strong>Q. No</strong></TableCell>
                    <TableCell sx={{ border: "0.7px solid #888", py: 1.5, px: 2  }}><strong>Question</strong></TableCell>
              <TableCell sx={{ border: "0.7px solid #888", py: 1.5, px: 2  }}><strong>Your Answer</strong></TableCell>
              <TableCell sx={{ border: "0.7px solid #888", py: 1.5, px: 2  }}><strong>Hint</strong></TableCell>
             
              <TableCell sx={{ border: "0.7px solid #888", py: 1.5, px: 2  }}><strong>Correct</strong></TableCell>
              <TableCell sx={{ border: "0.7px solid #888", py: 1.5, px: 2  }}><strong>Result</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((q, i) => {
              const selected = submittedAnswers[i];
              const result =
                !selected ? "Skipped" : selected === q.answer ? "Correct" : "Incorrect";
              const color =
                result === "Correct"
                  ? "green"
                  : result === "Incorrect"
                  ? "red"
                  : "gray";

              return (
                <TableRow key={i}>
                  <TableCell sx={{ border: "0.7px solid #888", py: 1.5, px: 2  }}>{i + 1}</TableCell>
                  
                  {q.questionType=="text"?
                  (<TableCell sx={{ border: "0.7px solid #888", py: 1.5, px: 2  }}>{q.question.text}</TableCell>):
                  (<TableCell sx={{ border: "0.7px solid #888", py: 1.5, px: 2  }}><Box component="img" src={q.question.imgUrl} alt="question" crossOrigin="anonymous"  sx={{ maxWidth: '100%', maxHeight: 150, objectFit: 'contain' }} />
</TableCell>)
                  }
                  <TableCell sx={{ border: "0.7px solid #888", py: 1.5, px: 2  }}>{selected || "—"}</TableCell>
                  
                  {q.hintType=="text"?
                  (<TableCell sx={{ border: "0.7px solid #888", py: 1.5, px: 2  }}>{q.hint.text||"—"}</TableCell>):
                  (<TableCell sx={{ border: "0.7px solid #888", py: 1.5, px: 2  }}><Box component="img" src={q.hint.imgUrl} alt="hint" crossOrigin="anonymous"  sx={{ maxWidth: '100%', maxHeight: 150, objectFit: 'contain' }} />
</TableCell>)
                  }
                    <TableCell sx={{ border: "0.7px solid #888", py: 1.5, px: 2  }}>{q.answer}</TableCell>
                  <TableCell sx={{ color, fontWeight: "bold", border: "0.7px solid #888", py: 1.5, px: 2  }}>{result}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>
    </Box>
    </PageContainer>
    </Box>
  );
}
