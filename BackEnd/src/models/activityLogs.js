// models/activityLog.model.js
import mongoose from "mongoose";
import { leanJSON } from "./common.js";

const ActivityLogSchema = new mongoose.Schema(
  {
    // what we changed (dynamic types supported)
    entityType: {
      type: String,
      enum: ["Organization", "Activity", "Contract", "User", "Team", "Notification", "FinancialEntry", "Project"],
      required: true,
    },
    // id of that thing
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true },

    // what did we do
    action: {
      type: String,
      enum: ["created", "updated", "deleted", "status_changed", "stage_changed", "commented", "assigned"],
      required: true,
    },

    // who did it
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // when it happened
    at: { type: Date, default: Date.now },

    // before and after snapshots (flexible JSON)
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed,

    // human-friendly sentence (“Ana changed status to Active”)
    message: String,
  },
  { timestamps: true }
);

leanJSON(ActivityLogSchema);

ActivityLogSchema.index({ entityType: 1, entityId: 1, at: -1 });

export const ActivityLog = mongoose.model("ActivityLog", ActivityLogSchema);
