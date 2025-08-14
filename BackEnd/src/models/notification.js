import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  title: String,
  body: String,
  entityType: { type: String, enum: ["Ticket","Activity","Contract","Lead","Client","Report"] },
  entityId: mongoose.Schema.Types.ObjectId,
  actionUrl: String,
  importance: { type: String, enum: ["low","normal","high"], default: "normal" },
  channels: [{ type: String, enum: ["inapp","email","webpush"] }],
  readAt: Date,
  seenAt: Date,
  expiresAt: Date,
  dedupeKey: { type: String, index: true }
}, { timestamps: true });

NotificationSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Notification", NotificationSchema);
