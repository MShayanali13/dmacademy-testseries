// models/QuestionBank.ts
import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema({
  text: { type: String },         // option text
  imgUrl: { type: String },       // option image URL
}, { _id: false });

const QuestionBankSchema = new mongoose.Schema({
  questionType: {
    type: String,
    enum: ['text', 'image'],
    required: true,
  },
  optionType: {
    type: String,
    enum: ['text', 'image'],
    required: true,
  },
  question: {
    text: { type: String },
    imgUrl: { type: String },
  },
  options: {
    type: [OptionSchema],
    validate: (val: any[]) => val.length === 4,
    required: true,
  },
  answer: {
    type: String, // 'A', 'B', 'C', 'D'
    enum: ['A', 'B', 'C', 'D'],
    required: true,
  },
  level: {
    type: String,
    enum: ['Easy', 'Medium', 'Difficult'],
    required: true,
  },
  course: {
    type: String,
    
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  chapter: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: String,
    required: true,
  },
    hintType: {
    type: String,
    enum: ['text', 'image'],
    required: true,
  },
  hint: {
    text: { type: String },
    imgUrl: { type: String },
  },
}, { timestamps: true });

export default mongoose.models.QuestionBank || mongoose.model("QuestionBank", QuestionBankSchema);
