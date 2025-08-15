"use client";
export const dynamic = "force-dynamic";

import {
  Box,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Edit, Delete, PictureAsPdf } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import PageContainer from "../../components/container/PageContainer";
import QuestionTypeSelector from "../../components/questionTypeSelector";
import { QuestionPaper } from "@/types/QuestionPaper";



export default function ManageQuestionPaper() {
  const router = useRouter();
  const [QuestionPaper, setQuestionPaper] = useState<QuestionPaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [level, setLevel] = useState<string>("");
  const [course, setCourse] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [chapter, setChapter] = useState<string>("");

  useEffect(() => {
    const fetchQuestionPaper = async () => {
      const res = await fetch("/api/Fetch-QuestionPaper", { cache: "no-store" });
      if (!res.ok) {
        console.error("Failed to fetch question papers");
        return;
      }
      const json = await res.json();
      setQuestionPaper(json.tests || []);
      setIsLoading(false);
    };

    fetchQuestionPaper();
  }, []);

  const filteredQuestionPaper = QuestionPaper.filter((t) => {
    const courseMatch = course ? t.course === course : true;
    const subjectMatch = subject ? t.subject === subject : true;
    const chapterMatch = chapter ? t.chapter === chapter : true;
    const levelMatch = level ? t.level === level : true;

    return courseMatch && subjectMatch && chapterMatch && levelMatch;
  });

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this test?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/Delete-QuestionPaper/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Test deleted successfully");
        setQuestionPaper((prev) => prev.filter((t) => t._id !== id));
      } else {
        alert("Failed to delete test");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <PageContainer title="Manage Question Paper" description="Manage created question papers">
      <Box mb={3}>
        <Typography variant="h4" mb={4}>
          Manage Question Paper
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <QuestionTypeSelector
              onCourseChange={setCourse}
              onSubjectChange={setSubject}
              onChapterChange={setChapter}
              onLevelChange={setLevel}
              title={null}
              isSubmitted={false}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, mr: 2 }}
              onClick={() => router.push("/dashboard/admin/generate-question-paper")}
            >
              Add New Test
            </Button>
          </Grid>
        </Grid>
      </Box>

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 3 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {["Title", "Course", "Subject", "Chapter", "Questions", "Marks", "Duration", "Created", "Actions"].map((head) => (
                <TableCell key={head} sx={{ fontWeight: 600, backgroundColor: "#f4f5f7" }}>
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredQuestionPaper.map((test) => (
              <TableRow key={test._id}>
                <TableCell>{test.title}</TableCell>
                <TableCell>{test.course}</TableCell>
                <TableCell>{test.subject}</TableCell>
                <TableCell>{test.chapter}</TableCell>
                
                <TableCell>{test.questionIds.length}</TableCell>
                <TableCell>{test.totalMarks}</TableCell>
                <TableCell>{test.duration} min</TableCell>
                <TableCell>{new Date(test.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                
                  <IconButton color="error" onClick={() => handleDelete(test._id)}>
                    <Delete />
                  </IconButton>
                  <IconButton color="secondary" onClick={()=>router.push(`/dashboard/admin/printable-question-paper/${test?._id}`)}>
                    <PictureAsPdf />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredQuestionPaper.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No Question Paper found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </PageContainer>
  );
}
