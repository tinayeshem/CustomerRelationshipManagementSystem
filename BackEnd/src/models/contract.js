// models/contract.model.js
import mongoose from "mongoose";
import { AttachmentSchema, Money, leanJSON } from "./common.js";

const ContractSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },

    // short name like "SOM Support 2025"
    title: { type: String, required: true, trim: true },

    // tenders, justifications, etc. (spec)
    contractType: { type: String, enum: ["Tender", "Justification", "Service", "Other"], required: true },

    // net value and VAT
    valueNet: Money,                                   // precise money
    vatRate: { type: Number, default: 25 },            // 25% default in HR

    // time window
    start: { type: Date, required: true },
    end: { type: Date, required: true },

    // how they pay
    paymentSchedule: { type: String, enum: ["OneTime", "Monthly", "Quarterly", "SemiAnnual", "Annual", "Custom"], required: true },

    // when to nudge the KAM to renew (spec reminder)
    renewalDate: { type: Date },

    // active? expired? pending?
    status: { type: String, enum: ["Active", "Pending", "Expired", "Terminated"], default: "Pending" },

    // upload PDFs, POs, etc. (spec)
    attachments: [AttachmentSchema],

    notes: String,
  },
  { timestamps: true }
);

leanJSON(ContractSchema);

// 👉 a friendly computed field: gross = net + VAT
ContractSchema.virtual("valueGross").get(function () {
  if (!this.valueNet) return null;
  const net = Number(this.valueNet.toString());
  return (net * (1 + (this.vatRate || 0) / 100)).toFixed(2);
});

ContractSchema.index({ organizationId: 1, status: 1, end: 1 });

export const Contract = mongoose.model("Contract", ContractSchema);
