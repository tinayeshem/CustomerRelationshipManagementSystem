import mongoose from "mongoose";
import { AttachmentSchema as ___Attachment } from "./common.js";

const ContractVersionSchema = new mongoose.Schema({
  version: Number,
  fileKey: String,             // e.g. contracts/<clientId>/<contractId>/v3.pdf
  size: Number,
  mimeType: { type: String, default: "application/pdf" },
  checksum: String,            // SHA-256
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const ContractSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  title: String,               // e.g. "Support SLA 2025"
  status: { type: String, enum: ["Draft","Active","Expired","Archived"], default: "Active" },
  effectiveDate: Date,
  expiryDate: Date,
  renewalDate: Date,
  signers: [{ name: String, email: String, role: String }],
  tags: [String],

  storageProvider: { type: String, default: "s3" },
  currentVersion: Number,
  versions: [ContractVersionSchema],

  text: String,                // extracted text (optional, for search)
  // embedding: { type: [Number], index: "vector" }, // (optional, Atlas Vector Search)

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  attachments: [___Attachment]
}, { timestamps: true });

ContractSchema.index({ title: "text", tags: "text", text: "text" });
ContractSchema.index({ client: 1, status: 1, expiryDate: 1 });

export default mongoose.model("Contract", ContractSchema);