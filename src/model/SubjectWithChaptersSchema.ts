// models/Subject.ts
import mongoose from "mongoose";

const SubjectWithChapters = new mongoose.Schema({
 
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
