"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import QuestionTypeSelector from "../../../components/questionTypeSelector";
import {unstable_noStore as noStore} from 'next/cache';
import Loading from "@/app/(DashboardLayout)/dashboard/loading";

export default function EditQuestionPage() {
noStore()

  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [questionType, setQuestionType] = useState<"text" | "image">("text");
  const [optionType, setOptionType] = useState<"text" | "image">("text");
  
  const [hintType, setHintType] = useState<"text" | "image">("text");
  const [question, setQuestion] = useState<{ text: string | null; imgUrl: string | null }>({ text: "", imgUrl: null });
  const [hint, setHint] = useState<{ text: string | null; imgUrl: string | null }>({ text: "", imgUrl: null });
  const [options, setOptions] = useState<{ text: string | null; imgUrl: string | null }[]>([
    { text: "", imgUrl: null },
    { text: "", imgUrl: null },
    { text: "", imgUrl: null },
    { text: "", imgUrl: null },
  ]);
  const [answer, setAnswer] = useState<string>("");
  const [level, setLevel] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [chapter, setChapter] = useState<string>('');

  const [initialLevel, setInitialLevel] = useState<string>('');
  const [initialSubject, setInitialSubject] = useState<string>('');
  const [initialChapter, setInitialChapter] = useState<string>('');

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Handlers to update the state
  const handleLevelChange = (newLevel: string) => {
    setLevel(newLevel);
  };

  const handleSubjectChange = (newSubject: string) => {
    setSubject(newSubject);
  };

  const handleChapterChange = (newChapter: string) => {
    setChapter(newChapter);
  };



  const questionImageRef = useRef<HTMLInputElement>(null);
  
  const hintImageRef = useRef<HTMLInputElement>(null);
  const optionImageRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const convertToBase64 = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      callback(reader.result as string);
    };
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/Get-Question/${id}`,{cache:"no-store"});
        const data = await res.json();

        if (data) {
          setQuestionType(data.questionType);
          setQuestion(data.question); 
           setHintType(data.hintType);
          setHint(data.hint);
          setOptionType(data.optionType);
          setOptions(data.options||[
            { text: "", imgUrl: null },
  { text: "", imgUrl: null },
  { text: "", imgUrl: null },
  { text: "", imgUrl: null },
          ]); // Set options with text or imgUrl
          setAnswer(data.answer);
          setInitialLevel(data.level);
          setInitialSubject(data.subject);
          setInitialChapter(data.chapter);
        }
      } catch (error) {
        console.error("Error fetching question:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchData();
  }, [id]);

  const handleSave = async () => {
    try {
      // Prepare data to send to backend
      const updatedData = {
        questionType,
        question,
        hint,
        hintType,
        optionType,
        options,
        answer,
        level: level !== "" ? level : initialLevel,
        subject: subject !== "" ? subject : initialSubject,
        chapter: chapter !== "" ? chapter : initialChapter,
      };

      const res = await fetch(`/api/Edit-Question/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache:"no-store",
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        alert("Question updated successfully!");
        setIsSubmitted(true);
        router.push("/admin/manage-questionBank");
      } else {
        alert("Failed to update question.");
      }
    } catch (error) {
      console.error("Error saving question:", error);
    }
  };

  const handleBack = () => {
    router.push("/admin/manage-questionBank");
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const handleOptionImageChange = (index: number, file: File) => {
    convertToBase64(file, (base64) => {
      const newOptions = [...options];
      newOptions[index].imgUrl = base64;
      setOptions(newOptions);
    });
  };

  const handleQuestionImageChange = (file: File) => {
    convertToBase64(file, (base64) => {
      setQuestion({ ...question, imgUrl: base64 });
    });
  };

   const handleHintImageChange = (file: File) => {
    convertToBase64(file, (base64) => {
      setHint({ ...hint, imgUrl: base64 });
    });
  };

  if (loading) {
    return (
    <Loading />
    );
  }

  return (
    <Box mt={4} p={4}>
      <Typography variant="h6" mb={4}>
        Edit Question
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
               <QuestionTypeSelector
                  onLevelChange={handleLevelChange}
                  onSubjectChange={handleSubjectChange}
                  onChapterChange={handleChapterChange}
                  initialLevel={initialLevel}
                  initialSubject={initialSubject}
                  initialChapter={initialChapter}
                  title={null}
                  isSubmitted={isSubmitted}
                />
        </Grid>
        {/* Question Type */}
        <Grid item xs={12}>
          <ToggleButtonGroup
            value={questionType}
            exclusive
            onChange={(e, val) => {
              if (val) {
                setQuestionType(val);
                setQuestion({ text: "", imgUrl: null }); // Reset question if type changes
              }
            }}
          >
            <ToggleButton value="text">Text</ToggleButton>
            <ToggleButton value="image">Image</ToggleButton>
          </ToggleButtonGroup>
        </Grid>

        {/* Question Input */}
        <Grid item xs={12}>
          {questionType === "text" ? (
            <TextField
              label="Enter Question"
              fullWidth
              multiline
              rows={3}
              value={question.text || ""}
              onChange={(e) => setQuestion({ ...question, text: e.target.value })}
            />
          ) : (
            <>
              <Button variant="outlined" component="label">
                Upload Question Image
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  ref={questionImageRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleQuestionImageChange(file); // Handling image change
                    }
                  }}
                />
              </Button>
              {question?.imgUrl && (
  <Box mt={1}>
    <img
      src={question?.imgUrl || undefined}
      alt="question"
      style={{ maxWidth: "250px" }}
    />
  </Box>
)}

            </>
          )}
        </Grid>

        {/* Option Type */}
        <Grid item xs={12}>
          <ToggleButtonGroup
            value={optionType}
            exclusive
            onChange={(e, val) => {
              if (val) {
                setOptionType(val);
                setOptions([
                  { text: "", imgUrl: null },
                  { text: "", imgUrl: null },
                  { text: "", imgUrl: null },
                  { text: "", imgUrl: null },
                ]);
              }
            }}
          >
            <ToggleButton value="text">Text</ToggleButton>
            <ToggleButton value="image">Image</ToggleButton>
          </ToggleButtonGroup>
        </Grid>

        {/* Options */}
        {[0, 1, 2, 3].map((index) => (
          <Grid item xs={12} md={6} key={index}>
            {optionType === "text" ? (
              <TextField
                label={`Option ${index + 1}`}
                fullWidth
                value={options[index].text || ""}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
            ) : (
              <>
                <Button variant="outlined" component="label" fullWidth>
                  Upload Option {index + 1} Image
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    ref={optionImageRefs[index]}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleOptionImageChange(index, file); // Handling image change for options
                      }
                    }}
                  />
                </Button>
                {options?.[index]?.imgUrl && (
  <Box mt={1}>
    <img
      src={options[index].imgUrl || undefined}
      alt={`option-${index}`}
      style={{ maxWidth: "250px" }}
    />
  </Box>
)}


              </>
            )}
          </Grid>
        ))}

         {/* Hint Type */}
        <Grid item xs={12}>
          <ToggleButtonGroup
            value={hintType}
            exclusive
            onChange={(e, val) => {
              if (val) {
                setHintType(val);
                setHint({ text: "", imgUrl: null }); // Reset Hint if type changes
              }
            }}
          >
            <ToggleButton value="text">Text</ToggleButton>
            <ToggleButton value="image">Image</ToggleButton>
          </ToggleButtonGroup>
        </Grid>

        {/* Question Input */}
        <Grid item xs={12}>
          {hintType === "text" ? (
            <TextField
              label="Enter Hint"
              fullWidth
              multiline
              rows={3}
              value={hint.text || ""}
              onChange={(e) => setHint({ ...hint, text: e.target.value })}
            />
          ) : (
            <>
              <Button variant="outlined" component="label">
                Upload Hint Image
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  ref={hintImageRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleHintImageChange(file); // Handling image change
                    }
                  }}
                />
              </Button>
              {hint?.imgUrl && (
  <Box mt={1}>
    <img
      src={hint?.imgUrl || undefined}
      alt="hint"
      style={{ maxWidth: "250px" }}
    />
  </Box>
)}

            </>
          )}
        </Grid>

        {/* Correct Answer */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="answer-label">Correct Option (A/B/C/D)</InputLabel>
            <Select
              labelId="answer-label"
              value={answer}
              label="Correct Option"
              onChange={(e) => setAnswer(e.target.value)}
            >
              <MenuItem value="A">A</MenuItem>
              <MenuItem value="B">B</MenuItem>
              <MenuItem value="C">C</MenuItem>
              <MenuItem value="D">D</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Buttons */}
        <Grid item xs={12} display="flex" justifyContent="space-between" mt={4}>
          <Button variant="outlined" onClick={handleBack}>
            Back
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
