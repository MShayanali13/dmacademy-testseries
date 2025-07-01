import mongoose from "mongoose";

const QuestionStructureSchema = new mongoose.Schema({
  course: String,
  level: String,
    level_olds: String,
  subject: String,
  chapter: String,
});

export default mongoose.models.QuestionStructure ||
  mongoose.model("QuestionStructure", QuestionStructureSchema);
