import mongoose from "mongoose";

const CollegeSchema = new mongoose.Schema({
  name: String,
  email: String,
  subscribedTill: Date,
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  college: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});


export default mongoose.models.College || mongoose.model("College", CollegeSchema);