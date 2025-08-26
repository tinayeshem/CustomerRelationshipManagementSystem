// models/notification.model.js
import mongoose from "mongoose";
import { leanJSON } from "./common.js";

const NotificationSchema = new mongoose.Schema(
  {
    // who gets the bell
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // what kind of bell it is
    type: { type: String, enum: ["Reminder", "ContractRenewal", "ActivityAssigned", "TicketOverdue", "System"], required: true },

    // short title
    title: { type: String, required: true },

    // message body
    body: { type: String },

    // deep link to open the right page (your note)
    link: { type: String },

    // when we should ping
    dueAt: { type: Date },

    // when user read it
    readAt: { type: Date },
  },
  { timestamps: true }
);

leanJSON(NotificationSchema);

NotificationSchema.index({ userId: 1, readAt: 1 });
NotificationSchema.index({ dueAt: 1 });

export const Notification = mongoose.model("Notification", NotificationSchema);
