import mongoose, { Schema, model, models } from "mongoose";

const QuestionPaperSchema = new Schema({
  title: { type: String, required: true },
  course: { type: String, required: true },
  subject: { type: String, required: true },
  chapter: { type: String, required: true },
  level: { type: String, required: true },
  questionIds: [{ type: Schema.Types.ObjectId, ref: "Question", required: true }],
  totalMarks: { type: Number, required: true },
  duration: { type: Number, required: true },
  
  testType: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export const QuestionPaper = models.QuestionPaper || model("QuestionPaper", QuestionPaperSchema);
