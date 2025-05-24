"use client";
import { Question } from "@/types/questionType";
import { Box, Typography, Radio, FormControlLabel } from "@mui/material";
import Image from "next/image";


interface Props {
  index: number;
  data: Question;
  selectedOption: number | null;
  onSelect: (optionIndex: number) => void;
}

export default function QuestionCard({index, data, selectedOption, onSelect }: Props) {
  return (
    <Box
      sx={{
        mb: 3,
        p: 3,
        border: "1px solid #ddd",
        borderRadius: 3,
        backgroundColor: "white",
      }}
    >
    <Typography fontWeight="bold" mb={2}>
  Q{index + 1}.
</Typography>

{/* Question */}
{data.questionType === "text" ? (
  <Typography variant="h6" mb={2}>
    {data.question.text}
  </Typography>
) : (
  <Box mb={2}>
    <Image
      src={data.question.imgUrl || ""}
      alt={`Question ${index + 1}`}
      width={500}
      height={300}
      style={{ maxWidth: "500px", height: "auto", alignSelf:"center",objectFit: "contain" }}
    />
  </Box>
)}

<Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        }}
      >
{data.options.map((option, idx) => (
  <Box
    key={idx}
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      p: 1,
      border: "1px solid #ccc",
      borderRadius: 2,
      cursor: "pointer",
      backgroundColor: selectedOption === idx ? "#e0f7fa" : "transparent",
      transition: "background-color 0.3s",

    }}
    onClick={() => onSelect(idx)}
  >
    <Radio
      checked={selectedOption === idx}
      value={idx}
      onChange={() => onSelect(idx)}
    />
    {data.optionType === "text" ? (
      <Typography>{option.text}</Typography>
    ) : (
      <Image
        src={option.imgUrl || ""}
        alt={`Option ${idx + 1}`}
        width={100}
        height={100}
        style={{ objectFit: "contain", minWidth:"100px", maxWidth:"200px", height:"auto" }}
      />
    )}
  </Box>
))}
</Box>

    </Box>
  );
}
