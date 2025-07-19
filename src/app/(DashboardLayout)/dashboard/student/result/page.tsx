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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ResultPage() {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [submittedAnswers, setSubmittedAnswers] = useState<string[]>([]);
  
  const [answers, setAnswers] = useState<{id:string;ans:string;selected:string;}[]>([]);
  
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


    setAnswers(result.Answers || []);
    
    setSubmittedAnswers(
      Object.values(submittedAnswers || {}) as string[]
    );

    setCorrectCount(result?.correct || 0);
    setIncorrectCount(result?.incorrect || 0);
    setUnansweredCount(result?.unanswered?.length || 0);
    
    setScore(result?.score || 0);


    setPercentage(result?.percentage?.toFixed?.(2) || "0.00");

    setLoading(false);
    setTimeout(() => sessionStorage.removeItem("testResult"), 300000)
  } catch (err) {
    console.error("Session parse error:", err);
  }

}, []);

// const handleDownload = async () => {
//   const element = document.getElementById("result-pdf");
//   if (!element) return;

//   // Wait for all images to load
//   const images = element.querySelectorAll("img");
//   const promises = Array.from(images).map(
//     (img) =>
//       new Promise<void>((resolve) => {
//         if (img.complete) resolve();
//         else {
//           img.onload = () => resolve();
//           img.onerror = () => resolve();
//         }
//       })
//   );
//   await Promise.all(promises);

//   const html2pdf = (await import("html2pdf.js")).default;

//   html2pdf()
//     .set({
//       margin: 0.5,
//       filename: "result.pdf",
//       image: { type: "jpeg", quality: 100 },
//       html2canvas: {
//         scale: 2,
//         dpi: 192,
//         letterRendering: true,
//         useCORS: true, // <-- ENABLE CORS
//       },
//       jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
//     })
//     .from(element)
//     .save();
// };
const handleDownload = async () => {
  const original = document.getElementById("result-pdf");
  if (!original) return;

  // Clone and style
  const clone = original.cloneNode(true) as HTMLElement;
  clone.style.width = "1200px"; // Approx A4 width in px
  clone.style.padding = "20px";
  clone.style.background = "#fff";
  clone.style.color = "#000";
  clone.style.position = "absolute";
  clone.style.left = "200vw"; // Hide off-screen
  clone.style.top = "0";
  clone.style.zIndex = "-1";
  document.body.appendChild(clone);

  // Ensure all images inside clone have crossOrigin attribute
  clone.querySelectorAll("img").forEach((img) => {
    img.setAttribute("crossorigin", "anonymous");
  });

  // Wait for images to load
  const images = clone.querySelectorAll("img");
  const loadPromises = Array.from(images).map((img) =>
    new Promise<void>((resolve) => {
      if (img.complete) resolve();
      else {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      }
    })
  );
  await Promise.all(loadPromises);

  // Generate canvas
  const canvas = await html2canvas(clone, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  // Generate PDF
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgProps = pdf.getImageProperties(imgData);
  const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save("result.pdf");
  document.body.removeChild(clone); // cleanup
};


if(loading) {
  return(
    <Loading />
  )
}
  return (
    <Box sx={{   
      maxWidth:"100vw",
        "@media (min-width: 1200px)": {
      maxWidth: "calc(100vw - 335px)",
    },
overflowX:"hidden"}}>
      <PageContainer title="Result" description="this is result page">
   
    <Box p={2} > 
    {/* Download Button */}
      <Box mb={1} display="flex" flexWrap={"wrap"} justifyContent="end">
        <Button variant="outlined" sx={{mb:"-40px"}} onClick={handleDownload}>
          Download PDF
        </Button>
        
      </Box>
      <Box id="result-pdf" sx={{mt:0,}}>
      <Typography variant="h4" sx={{width:"100%",textAlign:"left"}} gutterBottom>
        Result Summary
      </Typography>

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
  <TableContainer
    component={Paper}
    elevation={1}
    sx={{
      // Ensures table is wider than screen
      border: "0.2px solid #efefef",
      mt: 4,
    }}
  >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: "0.7px solid #888",textAlign:"center",fontSize:"16px", py: 1, px: 1  ,maxWidth:"50px",minWidth:"40px"}}><strong>No</strong></TableCell>
                    <TableCell sx={{ border: "0.7px solid #888",textAlign:"center",fontSize:"16px", py: 1, px: 1 ,maxWidth:"350px" }}><strong>Question</strong></TableCell>

                       {/* <TableCell sx={{ border: "0.7px solid #888",textAlign:"center",fontSize:"16px", py: 1, px: 1 ,maxWidth:"100px" }}><strong>Options</strong></TableCell> */}

              <TableCell sx={{ border: "0.7px solid #888",textAlign:"center",fontSize:"16px", py: 1, px: 1,maxWidth:"250px"  }}><strong>Hint</strong></TableCell>
             
              {/* <TableCell sx={{ border: "0.7px solid #888",textAlign:"center",fontSize:"16px", py: 1, px: 1  }}><strong>Correct</strong></TableCell> */}
              {/* <TableCell sx={{ border: "0.7px solid #888",textAlign:"center",fontSize:"16px", py: 1, px: 1  }}><strong>Result</strong></TableCell> */}
              <TableCell sx={{ border: "0.7px solid #888",textAlign:"center",fontSize:"16px", py: 1, px: 1,maxWidth:"200px",minWidth:"180px"  }}><strong>Result</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((q, i) => {
              const answerObj = answers.find(a => a.id === q._id);
              const selected = answerObj;
              const result =
                !selected?.ans ? "⧗ Skipped" : selected?.ans === "correct" ? "✅ Correct" : "❌ Incorrect";
              const color =
                result === "✅ Correct"
                  ? "green"
                  : result === "❌ Incorrect"
                  ? "red"
                  : "#1c3967";

              return (
                <TableRow key={i}>
                  <TableCell sx={{ border: "0.7px solid #888", py: 1, px: 1,maxWidth:"50px",minWidth:"40px"  }}>  <span style={{fontSize:"15px",fontWeight:500}}> {i + 1}</span></TableCell>

                  <TableCell sx={{ border: "0.7px solid #888", py: 1, px: 1 ,maxWidth:"350px" }}>

                  {q.questionType=="text"?
                  (  <span style={{fontSize:"15px",fontWeight:500}}> {q.question.text}</span>
                  ):
                  (<Box component="img" src={q.question.imgUrl} alt="question" crossOrigin="anonymous"  sx={{ maxWidth: '340px', objectFit: 'contain' }} />
)
}
<h2 style={{fontSize:"15px",fontWeight:500,marginTop:15,paddingTop:5,marginBottom:10,borderTop:"1px dashed", color:"blue"}}>Options :-</h2>
 {
                    q.options.map((option, idx) => (
                      <Box key={idx} sx={{ mb: 1 ,paddingLeft:4}}>
                        {q.optionType === "text" ? 
                       <span style={{fontSize:"15px",fontWeight:500}}> {option.text} </span>
                        : (
                         <Box component="img" src={option.imgUrl} alt="option" crossOrigin="anonymous"  sx={{ maxWidth: '70px', objectFit: 'contain' }} />
                        )}
                      </Box>
                    ))
                  }
</TableCell>
                  

                  {/* <TableCell sx={{ border: "0.7px solid #888", py: 1, px: 1 ,maxWidth:"100px" }}>
                    
                   {
                    q.options.map((option, idx) => (
                      <Box key={idx} sx={{ mb: 1 }}>
                        {q.optionType === "text" ? 
                       <span style={{fontSize:"15px",fontWeight:500}}> {option.text} </span>
                        : (
                         <Box component="img" src={option.imgUrl} alt="option" crossOrigin="anonymous"  sx={{ maxWidth: '90px', objectFit: 'contain' }} />
                        )}
                      </Box>
                    ))
                  }

                    
                    
                    </TableCell> */}
                  

                  {/* {q.optionType=="text"?
                    
                            (<TableCell sx={{ border: "0.7px solid #888", py: 1, px: 1 ,maxWidth:"300px" }}>{q.options.text}</TableCell>):
                  (<TableCell sx={{ border: "0.7px solid #888", py: 1, px: 1 ,maxWidth:"300px" }}><Box component="img" src={q.question.imgUrl} alt="question" crossOrigin="anonymous"  sx={{ maxWidth: '300px', maxHeight: 150, objectFit: 'contain' }} />
</TableCell>)
                      
                    
              
                  } */}

                  
                  {q.hintType=="text"?
                  (<TableCell sx={{ border: "0.7px solid #888", py: 1, px: 1,maxWidth:"250px"  }}>  <span style={{fontSize:"15px",fontWeight:500}}> {q.hint.text||"—"}
                  </span></TableCell>):
                  (<TableCell sx={{ border: "0.7px solid #888", py: 1, px: 1,maxWidth:"250px"  }}><Box component="img" src={q.hint.imgUrl} alt="hint" crossOrigin="anonymous"  sx={{ maxWidth: '240px', objectFit: 'contain' }} />
</TableCell>)
                  }
                  {/* <TableCell sx={{ color, fontWeight: "bold", border: "0.7px solid #888", py: 1, px: 1  }}></TableCell> */}
                  <TableCell sx={{ border: "0.7px solid #888", py: 1, px: 1,maxWidth:"200px",minWidth:"180px"  }}>
                      <span style={{fontSize:"12px",fontWeight:300,lineHeight:"20px"}}> 
                        <b>Your Answer: {selected?.selected|| "skipped"}</b>
                        <br/>
                        <b>Correct Ans.: {q.answer}</b>
                        </span>
                    <br/><br/><br/>
                    <span style={{color, fontWeight: "bold",fontSize:"15px"}}>{result}</span>
                  </TableCell>
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
// Removed custom html2canvas stub, using library import instead.
}

