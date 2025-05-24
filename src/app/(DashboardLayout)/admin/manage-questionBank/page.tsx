"use client";
export const dynamic = 'force-dynamic'

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Grid,
  MenuItem,
  Button,
} from "@mui/material";
import { Edit, Delete, Cancel } from "@mui/icons-material";
import PageContainer from "../../components/container/PageContainer";
import { SubjectWithChaptersType, getUniqueSubjects, getChaptersBySubject } from "@/lib/getSubjectWiseChapter";
import { useRouter } from "next/navigation";
import QuestionTypeSelector from "../../components/questionTypeSelector";
import { unstable_noStore as noStore } from "next/cache";

// Define the type for a question
export interface QuestionData {
  _id: string;
  questionType: "text" | "image";
  optionType: "text" | "image";
  question: {
    text: string | null;
    imgUrl: string | null;
  };
  options: {
    text: string | null;
    imgUrl: string | null;
  }[];
  answer: "A" | "B" | "C" | "D";
  level: "Easy" | "Medium" | "Difficult";
  subject: string;
  chapter: string;
  createdAt: string; // or Date if you're converting it
  updatedAt: string; // or Date
  __v: number;
}


export default function ManageQuestionBank() {
  // Use the Question type for the state

  noStore()

  const [questions, setQuestions] = useState<QuestionData[]>([]);

  const [level, setLevel] = useState<string>("");
    const [subject, setSubject] = useState<string>("");
    const [chapter, setChapter] = useState<string>("");
  
    const [subjectWithChapters, setSubjectWithChapters] = useState<SubjectWithChaptersType[]>([]);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [chapters, setChapters] = useState<string[]>([]);
  
    

    useEffect(() => {
      const fetchSubjectWithChapters = async () => {
        const res = await fetch("/api/Fetch-SubjectWithChapters",{cache:"no-store"});
        if (!res.ok) {
          console.error("Failed to fetch subjects");
          return;
        }
        const json = await res.json();
        if (json.success) {
          setSubjectWithChapters(json.data);
          setSubjects(getUniqueSubjects(json.data));
        }
      };
      fetchSubjectWithChapters();
    }, []);
  
    useEffect(() => {
      if (subject) {
        setChapters(getChaptersBySubject(subjectWithChapters, subject));
      } else {
        setChapters([]);
      }
    }, [subject, subjectWithChapters]);
  

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await fetch("/api/Fetch-QuestionBank",{cache:"no-store"});
      if (!res.ok) {
        console.error("Failed to fetch questions");
        return;
      }
     
      const data = await res.json();
      setQuestions(data.questions || []);
    };

    fetchQuestions();
  }, []);

 const filteredQuestions = questions.filter((q) => {
  const subjectMatch = subject ? q.subject.toLowerCase().includes(subject.toLowerCase()) : true;
  const chapterMatch = chapter ? q.chapter.toLowerCase().includes(chapter.toLowerCase()) : true;
  const levelMatch = level ? q.level.toLowerCase().includes(level.toLowerCase()) : true;

  return subjectMatch && chapterMatch && levelMatch;
});


 
// const handleLevelSelect = (e: React.ChangeEvent<{ value: unknown }>) => {
//     const newLevel = e.target.value as string;
//     setLevel(newLevel);
//   };

//   const handleSubjectSelect = (e: React.ChangeEvent<{ value: unknown }>) => {
//     const newSubject = e.target.value as string;
//     setSubject(newSubject);
//     // Reset chapter when subject changes
//     setChapter("");
//   };

//   const handleChapterSelect = (e: React.ChangeEvent<{ value: unknown }>) => {
//     const newChapter = e.target.value as string;
//     setChapter(newChapter);
//   };

const handleLevelChange = (newLevel: string) => {
  setLevel(newLevel);
};

const handleSubjectChange = (newSubject: string) => {
  setSubject(newSubject);
};

const handleChapterChange = (newChapter: string) => {
  setChapter(newChapter);
};

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this question?");
    if (!confirmDelete) return;
  
    try {
      const res = await fetch(`/api/Delete-Question/${id}`,{cache:"no-store",
        method: 'DELETE',
      });
  
      if (res.ok) {
        alert('Question deleted successfully');
        // Update UI without full reload
        setQuestions(prevQuestions => prevQuestions.filter(q => q._id !== id));
      } else {
        alert('Failed to delete question');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong while deleting.');
    }
  };
  


const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    
    <PageContainer title="Manage Question Bank" description="this is manage question bank page">
      <Box  mb={3}>
        <Typography variant="h4" mb={4}>
          Question Bank
        </Typography>
        <Grid container spacing={2}>
          {/* <Grid item xs={12} sm={4}>
            <TextField
              label="Level"
              select
              fullWidth
              value={level}
              onChange={handleLevelSelect}
            >
              <MenuItem value="Easy">Easy</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Difficult">Difficult</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Subject"
              select
              fullWidth
              value={subject}
              onChange={handleSubjectSelect}
            >
              {subjects.map((subj) => (
                <MenuItem key={subj} value={subj}>
                  {subj}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Chapter"
              select
              fullWidth
              value={chapter}
              onChange={handleChapterSelect}
              disabled={!subject}
            >
              {chapters.map((chap) => (
                <MenuItem key={chap} value={chap}>
                  {chap}
                </MenuItem>
              ))}
            </TextField>
          </Grid>*/}
          <Grid item xs={12} sm={12}>
            <QuestionTypeSelector
              onLevelChange={handleLevelChange}
              onSubjectChange={handleSubjectChange}
              onChapterChange={handleChapterChange}
              
       title={null}
              isSubmitted={isSubmitted}
              />
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setLevel("");
                setSubject("");
                setChapter("");
                setIsSubmitted(true);
              }}
              sx={{
                marginTop: "20px",
                borderColor: "#1976d2",
                color: "#1976d2",
                "&:hover": {
                  backgroundColor: "#e3f2fd",
                  borderColor: "#1565c0",
                },
              }}
              disabled={!level && !subject && !chapter}
            >
              <IconButton
                sx={{
                  marginRight: 0.5,
                  color: "#d32f2f",
                  "&:hover": {
                    color: "#b71c1c",
                  },
                }}
              >
                <Cancel />
              </IconButton>
              <Typography
                variant="body1"
                sx={{
                  color: "#d32f2f",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                }}
              >
                Clear Filters
              </Typography>
            </Button>
            </Grid>
            
        </Grid> 
      </Box>

      {/* ✅ Table Scroll Wrapper */}
      <Box sx={{ overflowX: "auto" }}>
        <Box sx={{ minWidth: 780 }}>
        <TableContainer
  component={Paper}
  elevation={1}
  sx={{
    maxHeight: 500,
    borderRadius: 3,
    overflow: "auto",
  }}
>

<Table
  stickyHeader
  sx={{
    borderCollapse: "collapse",
    width: "100%",
    fontFamily: "Inter, sans-serif",
    "& thead th": {
      backgroundColor: "#f4f5f7", // subtle gray header
      color: "#333",
      fontWeight: 600,
      fontSize: "0.9rem",
      
      border: "1px solid rgb(197, 197, 197)",
      borderBottom: "2px solid #d0d7de",
      textAlign: "left",
    },
    "& tbody td": {
      // borderBottom: "1px solid #e0e0e0",
      border: "1px solid rgb(197, 197, 197)",
      fontSize: "0.87rem",
      color: "#2c2c2c",
      backgroundColor: "#ffffff",
    },
    "& tbody tr:nth-of-type(even) td": {
      backgroundColor: "#fafafa",
    },
    "& tbody tr:hover td": {
      backgroundColor: "#f0f2f5",
      transition: "background 0.3s ease",
    },
  }}
>


    <TableHead>
      <TableRow sx={{ backgroundColor: "#1976d2" }}>
        {[
          "Subject",
          "Chapter",
          "Level",
          "Question",
          "Options",
          "Answer",
          "Actions",
        ].map((header) => (
          <TableCell
            key={header}
            sx={{
              color: "#fff",
              fontWeight: "bold",
              border: "1px solid #efefef",
              backgroundColor: "#1976d2",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            {header}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>

    <TableBody>
      {filteredQuestions.map((q, index) => (
        <TableRow
          key={q._id}
          hover
          sx={{
            backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
            "&:hover": { backgroundColor: "#e3f2fd" },
          }}
        >
          <TableCell >{q.subject}</TableCell>
          <TableCell >{q.chapter}</TableCell>
          <TableCell >
            <Chip
              label={q.level}
              size="small"
              sx={{
                fontWeight: 500,
                backgroundColor:
                  q.level === "Easy"
                    ? "#E6FFFA"
                    : q.level === "Medium"
                    ? "#FFF8E1"
                    : "#FDEDE8",
                color:
                  q.level === "Easy"
                    ? "#02b3a9"
                    : q.level === "Medium"
                    ? "#ae8e59"
                    : "#f3704d",
              }}
            />
          </TableCell>
          <TableCell >
            {q.questionType === "image" ? (
              <img
                src={q.question.imgUrl || ""}
                alt="question"
                style={{ maxWidth: 195, height: "auto", borderRadius: 4 }}
              />
            ) : (
              <p style={{ wordBreak: "break-word" }}>{q.question.text}</p>
            )}
          </TableCell>
          <TableCell >
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                display: "flex",
                gap: 4,
                flexWrap: "wrap",
              }}
            >
              {q.options.map((opt, idx) => (
                <li key={idx}>
                  {q.optionType === "image" && opt.imgUrl ? (
                    <img
                      src={opt.imgUrl}
                      alt={`option-${idx}`}
                      style={{
                        maxWidth: 73,
                        height: "auto",
                        borderRadius: 3,
                      }}
                    />
                  ) : (
                    <p style={{ wordBreak: "break-word" }}>
                      {`${String.fromCharCode(65 + idx)}. ${opt.text}`}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </TableCell>
          <TableCell >{q.answer}</TableCell>
          <TableCell >
            <IconButton  href={`/admin/edit-question/${q._id}`} sx={{ color: "#1976d2" }}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => handleDelete(q._id)} sx={{ color: "#d32f2f" }}>
              <Delete />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

        </Box>
      </Box>
    </PageContainer>
  );
}


// import { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Chip,
//   Grid,
//   Button,
//   IconButton,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
// } from "@mui/material";
// import { Edit, Delete, Cancel } from "@mui/icons-material";
// import { useRouter } from "next/router";
// import PageContainer from "../../components/container/PageContainer";
// import QuestionTypeSelector from "../../components/questionTypeSelector";

// export const dynamic = 'force-dynamic'
// // Define the type for a question
// export interface QuestionData {
//   _id: string;
//   questionType: "text" | "image";
//   optionType: "text" | "image";
//   question: {
//     text: string | null;
//     imgUrl: string | null;
//   };
//   options: {
//     text: string | null;
//     imgUrl: string | null;
//   }[];
//   answer: "A" | "B" | "C" | "D";
//   level: "Easy" | "Medium" | "Difficult";
//   subject: string;
//   chapter: string;
//   createdAt: string; // or Date if you're converting it
//   updatedAt: string; // or Date
//   __v: number;
// }

// const ManageQuestionBank = () => {
//   const [questions, setQuestions] = useState<QuestionData[]>([]);
//   const [subjectWithChapters, setSubjectWithChapters] = useState<any[]>([]);
//   const [filteredQuestions, setFilteredQuestions] = useState<QuestionData[]>([]);
//   const [level, setLevel] = useState<string>("");
//   const [subject, setSubject] = useState<string>("");
//   const [chapter, setChapter] = useState<string>("");
//   const [subjects, setSubjects] = useState<string[]>([]);
//   const [chapters, setChapters] = useState<string[]>([]);


//   useEffect(() => {
//     // Fetch questions and subject data on component mount
//     const fetchData = async () => {
//       try {
//         const questionRes = await fetch(`/api/Fetch-QuestionBank`,,{cache:"no-store"});
//         const questionData = await questionRes.json();
//         setQuestions(questionData.questions || []);

//         const subjectRes = await fetch(`/api/Fetch-SubjectWithChapters`,{cache:"no-store"});
//         const subjectData = await subjectRes.json();
//         setSubjectWithChapters(subjectData.data || []);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [filteredQuestions]);

//   useEffect(() => {
//     if (subject) {
//       const foundSubject = subjectWithChapters.find((item) => item.subject === subject);
//       if (foundSubject) {
//         setChapters(foundSubject.chapters);
//       }
//     } else {
//       setChapters([]);
//     }
//   }, [subject, subjectWithChapters]);

//   useEffect(() => {
//     // Filter questions based on selected level, subject, and chapter
//     const filtered = questions.filter((q) => {
//       const subjectMatch = subject ? q.subject.toLowerCase().includes(subject.toLowerCase()) : true;
//       const chapterMatch = chapter ? q.chapter.toLowerCase().includes(chapter.toLowerCase()) : true;
//       const levelMatch = level ? q.level.toLowerCase().includes(level.toLowerCase()) : true;
//       return subjectMatch && chapterMatch && levelMatch;
//     });
//     setFilteredQuestions(filtered);
//   }, [level, subject, chapter, questions]);

//   const handleLevelChange = (newLevel: string) => {
//     setLevel(newLevel);
//   };

//   const handleSubjectChange = (newSubject: string) => {
//     setSubject(newSubject);
//   };

//   const handleChapterChange = (newChapter: string) => {
//     setChapter(newChapter);
//   };

//   const handleDelete = async (id: string) => {
//     const confirmDelete = confirm("Are you sure you want to delete this question?");
//     if (!confirmDelete) return;

//     try {
//       const res = await fetch(`/api/Delete-Question/${id}`, { method: "DELETE" },{cache:"no-store"});

//       if (res.ok) {
//         alert("Question deleted successfully");
//         // Update UI without full reload
//         setFilteredQuestions((prev) => prev.filter((q) => q._id !== id));
//       } else {
//         alert("Failed to delete question");
//       }
//     } catch (error) {
//       console.error(error);
//       alert("Something went wrong while deleting.");
//     }
//   };
//   // const [isClient, setIsClient] = useState(false);
//   // useEffect(() => {
//   //   // Check if we are on the client side
//   //   setIsClient(true);
//   // }, []);

//   // const handleEdit = (questionId: string) => {
//   //   if (isClient) {
//   //     router.push(`/admin/edit-question/${questionId}`);
//   //   }
//   // };

//   const [isSubmitted, setIsSubmitted] = useState(false);

//   return (
//     <PageContainer title="Manage Question Bank" description="This is the Manage Question Bank page">
//       <Box mb={3}>
//         <Typography variant="h4" mb={4}>
//           Question Bank
//         </Typography>
//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <QuestionTypeSelector
//               onLevelChange={handleLevelChange}
//               onSubjectChange={handleSubjectChange}
//               onChapterChange={handleChapterChange}
//               title={null}
//               isSubmitted={isSubmitted}
//             />
//             <Button
//               variant="outlined"
//               color="secondary"
//               onClick={() => {
//                 setLevel("");
//                 setSubject("");
//                 setChapter("");
//                 setIsSubmitted(true);
//               }}
//               sx={{
//                 marginTop: "20px",
//                 borderColor: "#1976d2",
//                 color: "#1976d2",
//                 "&:hover": {
//                   backgroundColor: "#e3f2fd",
//                   borderColor: "#1565c0",
//                 },
//               }}
//               disabled={!level && !subject && !chapter}
//             >
//               <IconButton sx={{ marginRight: 0.5, color: "#d32f2f", "&:hover": { color: "#b71c1c" } }}>
//                 <Cancel />
//               </IconButton>
//               <Typography variant="body1" sx={{ color: "#d32f2f", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
//                 Clear Filters
//               </Typography>
//             </Button>
//           </Grid>
//         </Grid>
//       </Box>

//       {/* Table Wrapper */}
//       <Box sx={{ overflowX: "auto" }}>
//         <TableContainer
//           component={Paper}
//           elevation={1}
//           sx={{ maxHeight: 500, borderRadius: 3, overflow: "auto" }}
//         >
//           <Table stickyHeader sx={{ borderCollapse: "collapse", width: "100%" }}>
//             <TableHead>
//               <TableRow sx={{ backgroundColor: "#1976d2" }}>
//                 {["Subject", "Chapter", "Level", "Question", "Options", "Answer", "Actions"].map((header) => (
//                   <TableCell key={header} sx={{ color: "#fff", fontWeight: "bold", border: "1px solid #efefef", backgroundColor: "#1976d2" }}>
//                     {header}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredQuestions.map((q, index) => (
//                 <TableRow
//                   key={q._id}
//                   hover
//                   sx={{
//                     backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
//                     "&:hover": { backgroundColor: "#e3f2fd" },
//                   }}
//                 >
//                   <TableCell>{q.subject}</TableCell>
//                   <TableCell>{q.chapter}</TableCell>
//                   <TableCell>
//                     <Chip
//                       label={q.level}
//                       size="small"
//                       sx={{
//                         fontWeight: 500,
//                         backgroundColor:
//                           q.level === "Easy" ? "#E6FFFA" : q.level === "Medium" ? "#FFF8E1" : "#FDEDE8",
//                         color: q.level === "Easy" ? "#02b3a9" : q.level === "Medium" ? "#ae8e59" : "#f3704d",
//                       }}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     {q.questionType === "image" ? (
//                       <img src={q.question.imgUrl || ""} alt="question" style={{ maxWidth: 195, height: "auto", borderRadius: 4 }} />
//                     ) : (
//                       <p>{q.question.text}</p>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", gap: 4, flexWrap: "wrap" }}>
//                       {q.options.map((opt, idx) => (
//                         <li key={idx}>
//                           {q.optionType === "image" && opt.imgUrl ? (
//                             <img src={opt.imgUrl} alt={`option-${idx}`} style={{ maxWidth: 73, height: "auto", borderRadius: 3 }} />
//                           ) : (
//                             <p>{`${String.fromCharCode(65 + idx)}. ${opt.text}`}</p>
//                           )}
//                         </li>
//                       ))}
//                     </ul>
//                   </TableCell>
//                   <TableCell>{q.answer}</TableCell>
//                   <TableCell>
//                     <IconButton href={`/admin/edit-question/${q._id}`} sx={{ color: "#1976d2" }}>
//                       <Edit />
//                     </IconButton>
//                     <IconButton onClick={() => handleDelete(q._id)} sx={{ color: "#d32f2f" }}>
//                       <Delete />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//     </PageContainer>
//   );
// };

// export default ManageQuestionBank;


