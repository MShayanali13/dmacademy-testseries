"use client";
import { getChaptersBySubject, getUniqueSubjects, SubjectWithChaptersType } from "@/lib/getSubjectWiseChapter";
import { Box, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { unstable_noStore as noStore } from "next/cache";

const subjectsWithChapters: Record<string, string[]> = {
  Physics: ["Kinematics", "Laws of Motion", "Gravitation"],
  Chemistry: ["Atomic Structure", "Thermodynamics", "Organic Chemistry"],
  Biology: ["Cell Structure", "Genetics", "Human Physiology"],
  Math: ["Quadratic Equations", "Calculus", "Probability"]
};

interface QuestionTypeSelectorProps {
  onLevelChange: (newLevel: string) => void;
  onSubjectChange: (newSubject: string) => void;
  onChapterChange: (newChapter: string) => void;
  title: string | null;
  isSubmitted: boolean;
  initialLevel?: string;
  initialSubject?: string;
  initialChapter?: string;
}

export default function QuestionTypeSelector({
  onLevelChange,
  onSubjectChange,
  onChapterChange,
  title,
  isSubmitted,
  initialLevel,
  initialSubject,
  initialChapter,
}: QuestionTypeSelectorProps) {

  noStore()

  const [level, setLevel] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [chapter, setChapter] = useState<string>("");

useEffect(() => {
  if (initialLevel&&initialSubject&&initialChapter) {
    setLevel(initialLevel);
    setSubject(initialSubject);
    setChapter(initialChapter);
  }
}, [initialLevel,initialSubject,initialChapter]);

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

const resetForm = () => {
  setLevel("");
  setChapter("");
  setSubject("");

};
useEffect(() => {
  if (isSubmitted) {
    resetForm();
  }
}, [isSubmitted]);
  // Handlers for state change
  const handleLevelSelect = (e: React.ChangeEvent<{ value: unknown }>) => {
    const newLevel = e.target.value as string;
    setLevel(newLevel);
    onLevelChange(newLevel);
  };

  const handleSubjectSelect = (e: React.ChangeEvent<{ value: unknown }>) => {
    const newSubject = e.target.value as string;
    setSubject(newSubject);
    onSubjectChange(newSubject);
    // Reset chapter when subject changes
    setChapter("");
  };

  const handleChapterSelect = (e: React.ChangeEvent<{ value: unknown }>) => {
    const newChapter = e.target.value as string;
    setChapter(newChapter);
    onChapterChange(newChapter);
  };

  return (
    <Box mb={0} mt={0}>
      {title&&
      <Typography variant="h5" mb={3} gutterBottom>
        {title? title : ""}
      </Typography>
}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
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
        </Grid>
      </Grid>
    </Box>
  );
}
