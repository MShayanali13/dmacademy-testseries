"use client";

import {
  Box,
  Button,
  Checkbox,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QuestionTypeSelector from "../../components/questionTypeSelector";

interface QuestionType {
  _id: string;
  questionType: string;
  question: {imgUrl:string,text:string};
  answer: string;
  chapter: string;
  course: string;
  subject: string;
}

const marksPerQuestion = 4;

export default function AddTestPaper() {
  const router = useRouter();

  const [duration, setDuration] = useState(60);
  
  
  const [name, setName] = useState("");
  
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));

const [course, setCourse] = useState("");
const [subject, setSubject] = useState("");
const [chapter, setChapter] = useState("");

const [questions, setQuestions] = useState<QuestionType[]>([]);
const [filteredQuestions, setFilteredQuestions] = useState<QuestionType[]>([]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchQuestions = async () => {
   
    const res = await fetch(`/api/Fetch-QuestionBank`, {
      cache: "no-store",
    });
    const json = await res.json();
    if (json.questions) setQuestions(json.questions);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(questions.map((q) => q._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleGenerateTest = async () => {
    if (!date||!name || selectedIds.length === 0) {
      alert("Please enter date, teacher's name and select questions");
      return;
    }

    const res = await fetch("/api/Set-QuestionPaper", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        
        duration,
        date,
        name,
        totalMarks: selectedIds.length * marksPerQuestion,
        questionIds: selectedIds,
        course,
        subject,
        chapter,
        level: "Easy",
      }),
    });

    if (res.ok) {
      alert("Test created successfully");
      router.push("/dashboard/admin/manage-tests");
    } else {
      alert("Failed to create test paper");
    }
  };
const filterQuestions = (
  questions: QuestionType[],
  course: string,
  subject: string,
  chapter: string
): QuestionType[] => {
  let filter=questions.filter((q) => {
    const matchCourse = course ? q.course?.toLowerCase() === course.toLowerCase() : true;
    const matchSubject = subject ? q.subject?.toLowerCase() === subject.toLowerCase() : true;
    const matchChapter = chapter ? q.chapter?.toLowerCase() === chapter.toLowerCase() : true;
    return matchCourse && matchSubject && matchChapter;
  })
  setFilteredQuestions(filter)
  return filter
};
useEffect(()=>{filterQuestions(questions,course,subject,chapter)},[course,questions,subject,chapter])

  return (
    <Box p={4}>
      <Box sx={{display:"flex",justifyContent:"space-between"}}>
        <Typography variant="h5" mb={3}>
      Create New Question Paper
      </Typography>
 {selectedIds.length > 0 && (
          <Grid item xs={12} md={4} textAlign="center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateTest}
            >
              Generate Question Paper ({selectedIds.length})
            </Button>
          </Grid>
        )}
        </Box>
      <Grid container spacing={2}>

         <Grid item xs={12}>
          <QuestionTypeSelector
            onCourseChange={setCourse}
            onSubjectChange={setSubject}
            onChapterChange={setChapter}
            onLevelChange={() => {}}
            isSubmitted={true}
            title={null}
          />
        </Grid>


        <Grid item xs={12} md={4}>
          <TextField
            label="Test Date"
            fullWidth
            type="date"
            value={typeof date === "string" ? date : new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            label="Duration (min)"
            type="number"
            fullWidth
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            label="Total Marks"
            value={selectedIds.length * marksPerQuestion}
            InputProps={{ readOnly: true }}
            fullWidth
          />
        </Grid>
     <Grid item xs={12} md={4}> 
 <TextField
            label="Teacher's Name"
            placeholder="Teacher's Name"
            fullWidth
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            
          />
        </Grid>
       
 
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ borderRadius: 3, maxHeight: 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
  checked={
    filteredQuestions.length > 0 &&
    filteredQuestions.every((q) => selectedIds.includes(q._id))
  }
  onChange={(e) => {
    if (e.target.checked) {
      // Add only filtered questions that are not already selected
      const newSelected = [...selectedIds];
      filteredQuestions.forEach((q) => {
        if (!newSelected.includes(q._id)) {
          newSelected.push(q._id);
        }
      });
      setSelectedIds(newSelected);
    } else {
      // Remove all filtered question IDs from selectedIds
      const newSelected = selectedIds.filter(
        (id) => !filteredQuestions.find((q) => q._id === id)
      );
      setSelectedIds(newSelected);
    }
  }}
/>

                  </TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Question</TableCell>
                  <TableCell>Correct Answer</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredQuestions.map((q) => (
                  <TableRow
                    key={q._id}
                    sx={{
                      backgroundColor: selectedIds.includes(q._id)
                        ? "#e3f2fd"
                        : undefined,
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds.includes(q._id)}
                        onChange={() => toggleSelect(q._id)}
                      />
                    </TableCell>
                    <TableCell>{q.subject}</TableCell>
                    <TableCell>{q.course}</TableCell>
                   <TableCell>
  {q.questionType === "image" ? (
    <img src={q.question?.imgUrl || ""} style={{ maxWidth: 180 }} />
  ) : (
    q.question?.text || "-"
  )}
</TableCell>

                    <TableCell>{q.answer}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        
      </Grid>
    </Box>
  );
}
