"use client";

import { Box, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Loading from "../loading";

interface QuestionTypeSelectorProps {
  onLevelChange: (newLevel: string) => void;
  onCourseChange: (newCourse: string) => void;
  onSubjectChange: (newSubject: string) => void;
  onChapterChange: (newChapter: string) => void;
  title: string | null;
  isSubmitted: boolean;
  initialLevel?: string;
  initialCourse?: string;
  initialSubject?: string;
  initialChapter?: string;
  new?: boolean;
}

type FilterCombo = {
  course: string;
  level: string;
  subject: string;
  chapter:string;
};

type SubjectChapter = {
  subject: string;
  chapter: string;
};

export default function QuestionTypeSelector({
  onLevelChange,
  onCourseChange,
  onSubjectChange,
  onChapterChange,
  title,
  isSubmitted,
  initialLevel,
  initialCourse,
  initialSubject,
  initialChapter,
  new: isNew = false,
}: QuestionTypeSelectorProps) {
  const [course, setCourse] = useState("");
  const [level, setLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");

  const [allData, setAllData] = useState<FilterCombo[]>([]);
  const [chapters, setChapters] = useState<string[]>([]);

  const [courses, setCourses] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialCourse) setCourse(initialCourse);
    if (initialLevel) setLevel(initialLevel);
    if (initialSubject) setSubject(initialSubject);
    if (initialChapter) setChapter(initialChapter);
  }, [initialCourse, initialLevel, initialSubject, initialChapter]);

  useEffect(() => {
    if (isSubmitted) {
      setCourse("");
      setLevel("");
      setSubject("");
      setChapter("");
      setChapters([]);
    }
  }, [isSubmitted]);

  useEffect(() => {
    const fetchFilters = async () => {
      const res = await fetch(`/api/Get-availage-filter?type=${isNew ? "all" : "filtered"}`);
      if (!res.ok) return;
      const json = await res.json();
      if (json.success) {
        setAllData(json.data);
        setCourses(Array.from(new Set(json.data.map((d: FilterCombo) => d.course))));
      }
      setLoading(false);
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    if (!course) {
      setLevels([]);
      setLevel("");
      setSubjects([]);
      setSubject("");
      return;
    }
    const filtered = allData.filter((d) => d.course === course);
    setLevels(Array.from(new Set(filtered.map((d) => d.level))));
    setLevel("");
    setSubjects([]);
    setSubject("");
    setChapters([]);
  }, [course]);

  useEffect(() => {
    if (!course || !level) return;
    const filtered = allData.filter((d) => d.course === course && d.level === level);
    setSubjects(Array.from(new Set(filtered.map((d) => d.subject))));
    setSubject("");
    setChapters([]);
  }, [level]);

  useEffect(() => {
    if (!subject||!course||!level) return;
    const fetchChapters = async () => {
      if(isNew){
         const filtered = allData.filter((d) => d.course === course && d.level === level && d.subject===subject);
        setChapters(Array.from(new Set(filtered.map((d) => d.chapter))))
      }
      else{
    const res = await fetch(`/api/Fetch-SubjectWithChapters?course=${course}&level=${level}&subject=${subject}`);

      if (!res.ok) return;
      const json = await res.json();
    if (json.success) {
      console.log("f",json.data)
  setChapters(json.data);
  
}
 const filtered = allData.filter((d) => d.course === course && d.level === level && d.subject===subject);
 console.log("s",Array.from(new Set(filtered.map((d) => d.chapter))),filtered,allData)
        setChapters(Array.from(new Set(filtered.map((d) => d.chapter))))
}
    };
    fetchChapters();
  }, [subject]);

  const handleCourseChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const val = e.target.value as string;
    setCourse(val);
    onCourseChange(val);
  };

  const handleLevelChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const val = e.target.value as string;
    setLevel(val);
    onLevelChange(val);
  };

  const handleSubjectChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const val = e.target.value as string;
    setSubject(val);
    onSubjectChange(val);
  };

  const handleChapterChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const val = e.target.value as string;
    setChapter(val);
    onChapterChange(val);
  };

  if (loading) return <Loading />;

  return (
    <Box mb={0} mt={0}>
      {title && (
        <Typography variant="h5" mb={3}>
          {title}
        </Typography>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField label="Course" select fullWidth value={course} onChange={handleCourseChange}>
            {courses.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label="Level"
            select
            fullWidth
            value={level}
            onChange={handleLevelChange}
            disabled={!course}
          >
            {levels.map((l) => (
              <MenuItem key={l} value={l}>
                {l}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label="Subject"
            select
            fullWidth
            value={subject}
            onChange={handleSubjectChange}
            disabled={!level}
          >
            {subjects.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
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
            onChange={handleChapterChange}
            disabled={!subject}
          >
            {chapters.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </Box>
  );
}
