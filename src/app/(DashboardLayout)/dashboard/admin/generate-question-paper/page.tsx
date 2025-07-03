"use client";

import {
  Box,
  Button,
  Checkbox,
  Grid,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QuestionTypeSelector from "../../components/questionTypeSelector";

interface QuestionType {
  _id: string;
  text: string;
  type: string;
  chapter: string;
  course: string;
  subject: string;
}

export default function MakeQuestionPaperPage() {
  const [filterType, setFilterType] = useState("chapter");
  const [course, setCourse] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const router = useRouter();

  const fetchQuestions = async () => {
    const params = new URLSearchParams();
    if (course) params.append("course", course);
    if (subject) params.append("subject", subject);
    if (chapter) params.append("chapter", chapter);

    const res = await fetch(`/api/questions?${params.toString()}`);
    const json = await res.json();
    if (json.success) setQuestions(json.data);
  };

  useEffect(() => {
    fetchQuestions();
  }, [course, subject, chapter]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleRandomSelect = () => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10).map((q) => q._id); // pick 10 random
    setSelectedIds(selected);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>
        Create Question Paper
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            select
            label="Filter Type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            fullWidth
          >
            <MenuItem value="course">Course-wise</MenuItem>
            <MenuItem value="subject">Subject-wise</MenuItem>
            <MenuItem value="chapter">Chapter-wise</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} md={8}>
          <QuestionTypeSelector
            onCourseChange={setCourse}
            onSubjectChange={setSubject}
            onChapterChange={setChapter}
            onLevelChange={() => {}}
            new
            title={null}
            isSubmitted={true}
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="outlined" color="primary" onClick={handleRandomSelect}>
            Auto-Select Random Questions
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Select</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Question</TableCell>
                <TableCell>Chapter</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((q) => (
                <TableRow key={q._id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(q._id)}
                      onChange={() => toggleSelect(q._id)}
                    />
                  </TableCell>
                  <TableCell>{q.type}</TableCell>
                  <TableCell>{q.text}</TableCell>
                  <TableCell>{q.chapter}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>

        <Grid item xs={12} textAlign="right">
          <Button
            variant="contained"
            disabled={selectedIds.length === 0}
            onClick={() =>
              router.push(`/teacher/preview-paper?ids=${selectedIds.join(",")}`)
            }
          >
            Next Step: Preview & Generate PDF
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
