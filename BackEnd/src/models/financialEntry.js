// models/financialEntry.model.js
import mongoose from "mongoose";
import { AttachmentSchema, Money, leanJSON } from "./common.js";

const FinancialEntrySchema = new mongoose.Schema(
  {
    // who this money belongs to
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },

    // often linked to a contract or an activity cost
    contractId: { type: mongoose.Schema.Types.ObjectId, ref: "Contract" },
    activityId: { type: mongoose.Schema.Types.ObjectId, ref: "Activity" },

    // revenue puts money in, cost takes money out
    kind: { type: String, enum: ["Revenue", "Cost"], required: true },

    // how much (precise)
    amount: Money,

    // EUR default (you can extend)
    currency: { type: String, default: "EUR" },

    // when it happened
    date: { type: Date, required: true },

    // categorize for reports
    category: { type: String, enum: ["Invoice", "Payment", "Travel", "Training", "Upgrade", "License", "Other"], default: "Other" },

    // extra notes
    notes: String,

    // proof of cost/invoice
    attachments: [AttachmentSchema],

    // who added it
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

leanJSON(FinancialEntrySchema);

FinancialEntrySchema.index({ organizationId: 1, date: -1 });
FinancialEntrySchema.index({ kind: 1, category: 1 });

export const FinancialEntry = mongoose.model("FinancialEntry", FinancialEntrySchema);
