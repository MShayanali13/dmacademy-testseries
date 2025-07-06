"use client";
import { Box, Grid, Button, Typography } from "@mui/material";
import { useState, useEffect, use, useRef } from "react";
import QuestionCard from "../../components/questionCard";
import { Question } from "@/types/questionType";
import { useRouter } from "next/navigation";
import Loading from "../../loading";

import { unstable_noStore as noStore } from 'next/cache';
import PageContainer from "../../components/container/PageContainer";
import { object } from "zod";

export default function TestPage() {
  // const [timeLeft, setTimeLeft] = useState(60 * 30); // 30 minutes timer (example)

  noStore()

  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<number>(0);

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
  
  
  const [loading, setLoading] = useState(true);
  
  const generateTest = async () => {
    const params = new URLSearchParams(window.location.search);
    const level = params.get("level");
      const course = params.get("course");
    const subject = params.get("subject");
    const chapter = params.get("chapter");

    if (level && course && subject && chapter) {
      try {
        const response = await fetch("/api/Generate-Test", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            level,
            course,
            subject,
            chapter,
          }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setQuestions(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    }
  }
useEffect(() => {
  
  generateTest();
},[])

  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});



  const handleSelectOption = (questionID: string, optionIndex: number) => {
    setSelectedOptions((prev) => ({ ...prev, [questionID]: optionIndex }));
  };

  const Router=useRouter();


const handleSubmit = async () => {
  try {
    const submittedAnswers: Record<string, string> = {};

    Object.entries(selectedOptions).forEach(([qID, optIndex]) => {
      const question = questions.find(q => q._id === qID);

      if (!question) return;

      // Convert 0-based option index to A/B/C/D
      const optionLetter = String.fromCharCode(65 + +optIndex);
      submittedAnswers[qID] = optionLetter;
    });
console.log('ANS',submittedAnswers)
console.log("OPT",selectedOptions)
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
   
    // Optional: Save result to state or redirect to result page
    alert(
      `Correct: ${result.correct}\nIncorrect: ${result.incorrect}\nUnanswered: ${result.unanswered.length}\nScore: ${result.score}\nPercentage: ${result.percentage}%`
    );

    sessionStorage.setItem("testResult", JSON.stringify({ result, questions, submittedAnswers }));
    localStorage.removeItem("testEndTime");
    // window.location.href = "/dashboard/student/result";
    Router.push("/dashboard/student/result");
  } catch (error) {
    console.error("Submit error:", error);
  }
};
  


useEffect(() => {
  const handleScroll = () => {
    const centerY = window.innerHeight / 2;
    let closestIdx = 0;
    let closestDist = Infinity;
    questionRefs.current.forEach((el, idx) => {
      if (el) {
        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;
        const dist = Math.abs(elCenter - centerY);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = idx;
        }
      }
    });
    setActiveQuestion(closestIdx);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, [questions.length]);


    if (loading) {
      return (
      <Loading />
      );
    }

  return (
      <PageContainer title="Test" description="this is test page" >
        
        <Typography variant="h4" sx={{mt:"70px",display: { xs: "block", md: "none" }}} gutterBottom>
            Test
          </Typography>
             <Typography variant="h4" sx={{mt:"20px",display: { xs: "none", md: "block" }}} gutterBottom>
            Test
          </Typography>
    <Grid container spacing={5} gap={5} className="justify-center md:justify-start" sx={{ height: "calc(100vh - 100px)",paddingLeft:"0px", maxWidth:"100vw" }}>
     
      {
        questions.length!==0?(
          <>
          <Box
            sx={{
              position: "fixed",
              top: 80,
              width: "90vw",
              // marginLeft:"16px",
              alignSelf: "center",
              zIndex: 10,
              justifyContent:"space-between",
              backgroundColor: "#fb9a09",
              borderRadius: 2,
              color: "white",
justifySelf:"anchor-center",
              p: 1.5,
              textAlign: "center",
              display: { xs: "flex", md: "none" },
            }}
          >
          
            <Typography variant="h6" fontWeight="bold">
              Time Left: {formatTime(timeLeft)}
            </Typography>
              <Typography variant="h6" fontWeight="bold">
              Ques. Left: {questions.length - Object.keys(selectedOptions).length}
            </Typography>
          </Box>
          
          <Grid
            item
            xs={12}
            md={8}
            
            sx={{
              minHeight: "100vh",
              pr: { md: 2 },
              marginTop:"15px"
            }}
          >
              {questions.map((q, index) => (
                <div
                  key={q._id}
                  ref={el => questionRefs.current[index] = el}
                >
               <QuestionCard
                  key={index}
                  index={index}
                  data={q}
                  selectedOption={selectedOptions[q._id] ?? null}
                  onSelect={(optionIdx) => handleSelectOption(q._id, optionIdx)} />
                  </div>
              ))}

            </Grid><Grid
              item
              xs={12}
              md={4}
              sx={{
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                gap: 1,
                position: "fixed", // <-- use sticky, not -webkit-sticky
    top: "40px",
    width:"-webkit-fill-available",
    right:"66px",
    paddingRight:"24px",
           // <-- stick 80px from the top (adjust as needed)
    height: "-webkit-fill-available",
    justifyContent: "center", // <-- ensures sticky works inside flex/grid
              }}
            >
              <Box
                sx={{
                  p: 1.5,
                  backgroundColor: "#fb9a09",
                  borderRadius: 2,
                  textAlign: "center",
                  color: "white",
                  justifyContent:"space-between",
                  display:"flex"
                }}
              >
                <Box>
                  <Typography variant="h6">Time Left</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {formatTime(timeLeft)}
                </Typography>
                </Box>
                <Box>
                  <Typography variant="h6">Ques. Left</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {questions.length-Object.keys(selectedOptions).length}
                </Typography>
                </Box>
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
             
                {/* {questions.map((_, index) => (
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
))} */}
{questions.map((q, index) => (
  <Button
    key={q._id}
    variant={ "outlined" }
    size="small"
    sx={{
      minWidth: "32px",
      padding: "2px",
      ":hover":{
 backgroundColor:
        selectedOptions[q._id] !== undefined
          ? "#4caf50" // green if answered
          : activeQuestion === index
          ? "#1976d2" // blue if active and not answered
          : "white",
      color:
        selectedOptions[q._id] !== undefined
          ? "white"
          : activeQuestion === index
          ? "white"
          : "black",
      },
     backgroundColor:
        selectedOptions[q._id] !== undefined
          ? "#4caf50" // green if answered
          : activeQuestion === index
          ? "#1976d2" // blue if active and not answered
          : "white",
      color:
        selectedOptions[q._id] !== undefined
          ? "white"
          : activeQuestion === index
          ? "white"
          : "black",
    }}
     onClick={() => {
  const el = questionRefs.current[index];
  if (el) {
    setActiveQuestion(index); // Set active immediately
    const y = el.getBoundingClientRect().top + window.scrollY - 150; // 80px offset from top
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}}
  >
    {index + 1}
  </Button>
))}
              </Box>

              <Button variant="contained" onClick={handleSubmit}  color="error" size="large">
                Submit Test
              </Button>
            </Grid><Box
              sx={{
                ml: 6,
                pb: 5,
                width:"100%",
                
                justifyContent:"start",
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
</PageContainer>
  );
}
