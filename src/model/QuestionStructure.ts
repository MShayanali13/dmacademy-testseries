import mongoose from "mongoose";

const QuestionStructureSchema = new mongoose.Schema({
  course: String,
  level: String,
    level_olds:{type:String,require:false},
  subject: String,
  chapter: String,
});

export default mongoose.models.QuestionStructure ||
  mongoose.model("QuestionStructure", QuestionStructureSchema);
