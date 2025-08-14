import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: String,
  role: { type: String, enum: ["Admin","Manager","KAM","Support","Sales","Agent"], default: "Agent" },
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
  timezone: { type: String, default: "Europe/Zagreb" },
  isActive: { type: Boolean, default: true },
  avatarUrl: String,
  // auth (optional)
  passwordHash: String,
  lastLoginAt: Date
}, { timestamps: true });

UserSchema.index({ role: 1, isActive: 1 });

export default mongoose.model("User", UserSchema);