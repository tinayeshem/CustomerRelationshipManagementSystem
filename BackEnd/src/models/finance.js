import mongoose from "mongoose";
import { ContactPersonSchema, AttachmentSchema } from "./common.js";

const FinanceSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  contract: { type: mongoose.Schema.Types.ObjectId, ref: "Contract" },

  kind: { type: String, enum: ["invoice","payment","expense","refund","creditNote"], required: true },
  number: String,                  // invoice or doc number
  description: String,

  currency: { type: String, default: "EUR" },
  netAmount: { type: Number, default: 0 },     // without VAT
  vatRate: { type: Number, default: 25 },      // % (Croatia default 25%)
  grossAmount: { type: Number, default: 0 },   // computed if not provided

  status: { type: String, enum: ["draft","pending","paid","overdue","void"], default: "pending" },
  issueDate: { type: Date, default: Date.now },
  dueDate: Date,
  paidDate: Date,

  tags: [String],
  attachments: [AttachmentSchema]
}, { timestamps: true });

FinanceSchema.pre("save", function(next) {
  if (this.isModified("netAmount") || this.isModified("vatRate")) {
    const net = this.netAmount || 0;
    const vat = (this.vatRate || 0) / 100;
    if (!this.grossAmount || this.isModified("grossAmount") === false) {
      this.grossAmount = Math.round((net * (1 + vat)) * 100) / 100;
    }
  }
  next();
});

FinanceSchema.index({ client: 1, kind: 1, status: 1, dueDate: 1 });

export default mongoose.model("Finance", FinanceSchema);
