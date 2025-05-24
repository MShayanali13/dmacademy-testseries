"use client";
import { Box, Grid, Button, Typography } from "@mui/material";
import { useState, useEffect, use } from "react";
import QuestionCard from "../../components/questionCard";
import { Question } from "@/types/questionType";
import { useRouter } from "next/navigation";

export default function TestPage() {
  // const [timeLeft, setTimeLeft] = useState(60 * 30); // 30 minutes timer (example)

  const [timeLeft, setTimeLeft] = useState(0);

useEffect(() => {
  const duration = 60 * 30; // 30 minutes
  const storageKey = "testEndTime";

  let endTime = localStorage.getItem(storageKey);

  if (!endTime) {
    const newEndTime = Date.now() + duration * 1000;
    localStorage.setItem(storageKey, newEndTime.toString());
    endTime = newEndTime.toString();
  }

  const calculateTimeLeft = () => {
    const diff = Math.floor((+endTime! - Date.now()) / 1000);
    return diff > 0 ? diff : 0;
  };

  setTimeLeft(calculateTimeLeft());

  const timer = setInterval(() => {
    const newTimeLeft = calculateTimeLeft();
    setTimeLeft(newTimeLeft);

    if (newTimeLeft <= 0) {
      clearInterval(timer);
      localStorage.removeItem(storageKey); // optional: clear timer
    }
  }, 1000);

  return () => clearInterval(timer);
}, []);


  // Countdown timer logic
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
  //   }, 1000);
  //   return () => clearInterval(timer);
  // }, []);

  // Format time nicely (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };


  const [questions, setQuestions] = useState<Question[]>([
    // {
    //   _id: "1",
    //   questionType: "text",
    //   optionType: "text",
    //   question: {
    //     text: "What is 2 + 2?"
    //   },
    //   options: [
    //     { text: "3" },
    //     { text: "4" },
    //     { text: "5" },
    //     { text: "6" },
    //   ],
    //   answer: "B",
    //   level: "Easy",
    //   subject: "Mathematics",
    //   chapter: "Addition",
    //   uploadedBy: "admin",
    // },
    // {
    //   _id: "2",
    //   questionType: "image",
    //   optionType: "image",
    //   question: {
    //     imgUrl: "/images/question.png",
    //   },
    //   options: [
    //     { imgUrl: "/images/option1.png" },
    //     { imgUrl: "/images/option2.png" },
    //     { imgUrl: "/images/option3.png" },
    //     { imgUrl: "/images/option4.png" },
    //   ],
    //   answer: "C",
    //   level: "Medium",
    //   subject: "Science",
    //   chapter: "Plants",
    //   uploadedBy: "admin",
    // },
  ]);

  
  
  const generateTest = async () => {
    const params = new URLSearchParams(window.location.search);
    const level = params.get("level");
    const subject = params.get("subject");
    const chapter = params.get("chapter");

    if (level && subject && chapter) {
      try {
        const response = await fetch("/api/Generate-Test", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            level,
            subject,
            chapter,
          }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setQuestions(data.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    }
  }
useEffect(() => {
  
  generateTest();
},[])

  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  
  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    setSelectedOptions((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const Router=useRouter();


const handleSubmit = async () => {
  try {
    const submittedAnswers: Record<number, string> = {};

    Object.entries(selectedOptions).forEach(([qIndex, optIndex]) => {
      const question = questions[+qIndex];
      if (!question) return;

      // Convert 0-based option index to A/B/C/D
      const optionLetter = String.fromCharCode(65 + +optIndex);
      submittedAnswers[+qIndex] = optionLetter;
    });

    const response = await fetch("/api/Submit-Test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        generatedQuestions: questions,
        submittedAnswers,
      }),
    });

    const result = await response.json();
    console.log("Result:", result);

    // Optional: Save result to state or redirect to result page
    alert(
      `Correct: ${result.correct}\nIncorrect: ${result.incorrect}\nUnanswered: ${result.unanswered.length}\nScore: ${result.score}\nPercentage: ${result.percentage}%`
    );

    sessionStorage.setItem("testResult", JSON.stringify({ result, questions, submittedAnswers }));
    localStorage.removeItem("testEndTime");
    // window.location.href = "/student/result";
    Router.push("/student/result");
  } catch (error) {
    console.error("Submit error:", error);
  }
};
  
  

  return (
    <Grid container spacing={2} sx={{ height: "calc(100vh - 100px)", padding: 2 }}>
     
      {
        questions.length!==0?(
          <><Box
            sx={{
              position: "fixed",
              top: 10,
              width: "90vw",
              alignSelf: "center",
              zIndex: 10,
              backgroundColor: "#fb9a09",
              borderRadius: 2,
              color: "white",
              p: 1.5,
              textAlign: "center",
              display: { xs: "flex", md: "none" },
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              Time Left: {formatTime(timeLeft)}
            </Typography>
          </Box><Grid
            item
            xs={12}
            md={8}
            sx={{
              overflowY: "scroll",
              minHeight: "100vh",
              pr: { md: 2 },
            }}
          >
              {questions.map((q, index) => (
                <QuestionCard
                  key={index}
                  index={index}
                  data={q}
                  selectedOption={selectedOptions[index] ?? null}
                  onSelect={(optionIdx) => handleSelectOption(index, optionIdx)} />
              ))}

            </Grid><Grid
              item
              xs={12}
              md={4}
              sx={{
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                gap: 1,
                position: "-webkit-sticky",
                right: "100px",
                top: "80px",
                height: "fit-content",
              }}
            >
              <Box
                sx={{
                  p: 1.5,
                  backgroundColor: "#fb9a09",
                  borderRadius: 2,
                  textAlign: "center",
                  color: "white",
                }}
              >
                <Typography variant="h6">Time Left</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {formatTime(timeLeft)}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: 1,
                  backgroundColor: "#f1f1f1",
                  p: 2,
                  borderRadius: 2,
                }}
              >
             
                {questions.map((_, index) => (
  <Button
    key={index}
    variant={selectedOptions[index] !== undefined ? "contained" : "outlined"}
    size="small"
    sx={{
      minWidth: "32px",
      padding: "2px",
      backgroundColor: selectedOptions[index] !== undefined ? "#4caf50" : "white",
      color: selectedOptions[index] !== undefined ? "white" : "black",
    }}
  >
    {index + 1}
  </Button>
))}

              </Box>

              <Button variant="contained" onClick={handleSubmit} color="error" size="large">
                Submit Test
              </Button>
            </Grid><Box
              sx={{
                mt: 4,
                mb: 6,
                justifyContent: "center",
                display: { xs: "flex", md: "none" },
              }}
            >
              <Button
                variant="contained"
                color="error"
                size="large"
                onClick={handleSubmit}
              >
                Submit Test
              </Button>
            </Box></>
  ):(
    <h2>No Question Ready For this test..</h2>
  )
}

</Grid>
  );
}
