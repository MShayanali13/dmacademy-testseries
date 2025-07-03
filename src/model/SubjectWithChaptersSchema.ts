// models/Subject.ts
import mongoose from "mongoose";

const SubjectWithChapters = new mongoose.Schema({
 course:{
type:String,
required:true,
 },
  subject: {
    type: String,
    required: true,
  },
  chapter: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.SubjectWithChapters || mongoose.model("SubjectWithChapters", SubjectWithChapters);
