"use client";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useEffect, useRef, useState } from "react";

export interface QuestionData {
  questionType: "text" | "image";
  question: string ;
  options: (string )[];
  optionType: "text" | "image";
  answer: string; // Ideally this should be an index A/B/C/D
}

export default function SetQuestion({
  qNo,
  onChange,
  isSubmitted,
}: {
  qNo: number;
  onChange: (qNo: number, data: QuestionData) => void;
   isSubmitted: boolean;
}) {
  const [questionType, setQuestionType] = useState<"text" | "image">("text");
  const [optionType, setOptionType] = useState<"text" | "image">("text");

  const [question, setQuestion] = useState<string >("");
  const [options, setOptions] = useState<(string )[]>(["", "", "", ""]);
  const [answer, setAnswer] = useState<string>("");
const questionImageRef = useRef<HTMLInputElement>(null);
const optionImageRefs = [
  useRef<HTMLInputElement>(null),
  useRef<HTMLInputElement>(null),
  useRef<HTMLInputElement>(null),
  useRef<HTMLInputElement>(null),
];

const resetForm = () => {
  setQuestionType("text");
  setQuestion("");
  setOptionType("text");
  setOptions(["", "", "", ""]);
  setAnswer("");

  // Reset file inputs manually (you’ll assign refs below)
  questionImageRef.current?.value && (questionImageRef.current.value = "");
  optionImageRefs.forEach((ref) => {
    ref.current?.value && (ref.current.value = "");
  });
};


const convertToBase64 = (file: File, callback: (base64: string) => void) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    callback(reader.result as string);
  };
};


  const handleOptionChange = (index: number, value: string ) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const isText = (val: unknown): val is string => typeof val === "string";

useEffect(() => {
    if(isSubmitted){
      resetForm();
    }
  }, [isSubmitted]);

  useEffect(() => {
    const questionValid =
      (questionType === "text" && isText(question) && question.trim() !== "") ||
      (questionType === "image" && question);

    const optionsValid = options.every((opt) =>
      optionType === "text" ? typeof opt === "string" && opt.trim() !== "" : opt 
    );

    const answerValid = answer.trim() !== "" && ["A", "B", "C", "D"].includes(answer);

    if (questionValid && optionsValid && answerValid) {
      onChange(qNo, {
        questionType,
        question,
        options,
        optionType,
        answer,
      });
    }
  }, [questionType, question, options, optionType, answer]);



  return (
    <Box mt={4}  border={"1px solid #ccc"} borderRadius={2} p={4}>
      <Typography variant="h6" mb={2}>
        Q. {qNo}
      </Typography>
      <Grid container spacing={2}>
        {/* Question Type */}
        <Grid item xs={12}>
          <ToggleButtonGroup
            value={questionType}
            exclusive
            onChange={(e, val) => {
              if (val) {
                setQuestionType(val);
                setQuestion(""); // Reset the question when type changes
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
              value={question}
               onChange={(e) => {
      setQuestion(e.target.value);
      onChange(qNo, {
        questionType,
        question: e.target.value,
        optionType,
        options,
        answer,
      });
    }}
            />
          ) : (
            <>
              <Button variant="outlined" component="label">
                Upload Question Image
                <input
                  hidden
                  type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) {
        convertToBase64(file, (base64) => {
          setQuestion(base64);
          onChange(qNo, {
            questionType,
            question: base64,
            optionType,
            options,
            answer,
          });
        });
      }
    }}
    ref={questionImageRef}
                />
              </Button>
              {questionType=="image" && question&& (
                <Box mt={1}>
                  <img
                    src={question}
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
                setOptions(["", "", "", ""]); // Reset options when type changes
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
                value={options[index]}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
            ) : (
              <>
                <Button variant="outlined" component="label" fullWidth>
                  Upload Option {index + 1} Image
                  <input
                    hidden
                    accept="image/*"
                    type="file"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) {
        convertToBase64(file, (base64) => {
          handleOptionChange(index, base64);
        });
      }
    }}
     ref={optionImageRefs[index]}
                  />
                </Button>
                {options[index] && optionType=="image" && (
                  <Box mt={1}>
                    <img
                      src={options[index]}                     
                      alt={`option-${index}`}
                      style={{ maxWidth: "250px" }}
                    />
                  </Box>
                )}
              </>
            )}
          </Grid>
        ))}

        {/* Correct Answer */}
        <Grid item xs={12}>
          {/* <TextField
            label="Correct Option (A/B/C/D)"
            fullWidth
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          /> */}
          <FormControl fullWidth>
  <InputLabel id="answer-label">Correct Option (A/B/C/D)</InputLabel>
  <Select
    labelId="answer-label"
    id="answer"
    value={answer}
    label="Correct Answer"
    onChange={(e) => setAnswer(e.target.value)}
  >
    <MenuItem value="A">A</MenuItem>
    <MenuItem value="B">B</MenuItem>
    <MenuItem value="C">C</MenuItem>
    <MenuItem value="D">D</MenuItem>
  </Select>
</FormControl>
        </Grid>
      </Grid>
    </Box>
  );
}
