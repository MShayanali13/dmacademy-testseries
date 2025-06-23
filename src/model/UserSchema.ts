import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: String,
  name: String,
  // imageUrl: String,
  createdAt: { type: Date, default: Date.now },
//   // For future features
//   role: { type: String, default: "user" }, 
//   subscriptionActive: { type: Boolean, default: false },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
