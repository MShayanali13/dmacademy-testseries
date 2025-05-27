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

import * as XLSX from "xlsx";

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
  uploadedBy: string;
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
    const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  
    

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



const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    const data = new Uint8Array(event.target?.result as ArrayBuffer);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

    // Call your API to save questions
    const res = await fetch("/api/Import-Questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questions: jsonData }),
    });

    if (res.ok) {
      alert("Questions imported successfully!");
      location.reload(); // or re-fetch questions
    } else {
      alert("Failed to import questions.");
    }
  };

  reader.readAsArrayBuffer(file);
};

const handleDownloadExcel = () => {
  const exportData = filteredQuestions.map((q) => ({
    questionType: q.questionType ?? "",
    optionType: q.optionType ?? "",

    "question.text": q.question?.text ?? "",
    "question.imgUrl": q.question?.imgUrl ?? "",

    "optionA.text": q.options?.[0]?.text ?? "",
    "optionA.imgUrl": q.options?.[0]?.imgUrl ?? "",

    "optionB.text": q.options?.[1]?.text ?? "",
    "optionB.imgUrl": q.options?.[1]?.imgUrl ?? "",

    "optionC.text": q.options?.[2]?.text ?? "",
    "optionC.imgUrl": q.options?.[2]?.imgUrl ?? "",

    "optionD.text": q.options?.[3]?.text ?? "",
    "optionD.imgUrl": q.options?.[3]?.imgUrl ?? "",

    answer: q.answer ?? "",
    level: q.level ?? "",
    subject: q.subject ?? "",
    chapter: q.chapter ?? "",
    uploadedBy: q.uploadedBy ?? "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData, {
    header: [
      "questionType",
      "optionType",
      "question.text",
      "question.imgUrl",
      "optionA.text",
      "optionA.imgUrl",
      "optionB.text",
      "optionB.imgUrl",
      "optionC.text",
      "optionC.imgUrl",
      "optionD.text",
      "optionD.imgUrl",
      "answer",
      "level",
      "subject",
      "chapter",
      "uploadedBy",
    ],
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Questions");

  XLSX.writeFile(workbook, "QuestionBank.xlsx");
};


  return (
    
    <PageContainer title="Manage Question Bank" description="this is manage question bank page">
      <Box  mb={3}>
        <Typography variant="h4" mb={4}>
          Question Bank
        </Typography>
        <Grid container spacing={2}>
        
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
            <Button
  variant="contained"
  component="label"
  sx={{ marginTop: "20px", marginLeft: "15px" }}
>
  Import Questions
  <input
    type="file"
    accept=".xlsx, .xls"
    hidden
    onChange={handleExcelUpload}
  />
</Button>
<Button
  variant="contained"
  color="primary"
  onClick={handleDownloadExcel}
  sx={{ marginTop: "20px", marginLeft: "15px" }}
>
  Export Questions
</Button>

{selectedQuestions.length > 0 && (
  <Button
    variant="contained"
    color="error"
    sx={{ marginTop: "20px", marginLeft: "15px" }}
    onClick={async () => {
      const confirmDelete = confirm("Are you sure you want to delete selected questions?");
      if (!confirmDelete) return;

      try {
        const res = await fetch("/api/Bulk-Delete-Questions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: selectedQuestions }),
        });

        if (res.ok) {
          alert("Selected questions deleted successfully");
          setQuestions(prev => prev.filter(q => !selectedQuestions.includes(q._id)));
          setSelectedQuestions([]);
        } else {
          alert("Failed to delete selected questions");
        }
      } catch (error) {
        console.error(error);
        alert("Something went wrong");
      }
    }}
  >
    Delete Selected ({selectedQuestions.length})
  </Button>
)}

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
      {/* <TableRow sx={{ backgroundColor: "#1976d2" }}>
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
      </TableRow> */}
      <TableRow sx={{ backgroundColor: "#1976d2" }}>
  <TableCell
    padding="checkbox"
    sx={{
      position: "sticky",
      top: 0,
      zIndex: 1,
      backgroundColor: "#1976d2",
    }}
  >
    <input
      type="checkbox"
      checked={filteredQuestions.length > 0 && selectedQuestions.length === filteredQuestions.length}
      onChange={(e) => {
        if (e.target.checked) {
          setSelectedQuestions(filteredQuestions.map((q) => q._id));
        } else {
          setSelectedQuestions([]);
        }
      }}
    />
  </TableCell>
  {["Subject", "Chapter", "Level", "Question", "Options", "Answer", "Actions"].map((header) => (
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
          <TableCell padding="checkbox">
  <input
    type="checkbox"
    checked={selectedQuestions.includes(q._id)}
    onChange={(e) => {
      if (e.target.checked) {
        setSelectedQuestions((prev) => [...prev, q._id]);
      } else {
        setSelectedQuestions((prev) => prev.filter((id) => id !== q._id));
      }
    }}
  />
</TableCell>

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




