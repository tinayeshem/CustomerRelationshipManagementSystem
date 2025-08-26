import mongoose from "mongoose";
import { AttachmentSchema as __Attachment } from "./common.js";

const ActivityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: String,           // Created | Updated | Completed | Commented
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

export const ActivitySchema = new mongoose.Schema({
  kind: { type: String, enum: ["Task","Ticket"], required: true },
  title: { type: String, required: true, trim: true },
  description: String,
  when: { type: Date, required: true },
  dueDate: Date,
  nextStep: String,
  nextStepDueAt: Date,

  // 🔧 make it optional w/ default: Tickets => Support, else Sales
  category: { type: String, enum: ["Sales","Support"], default: function() {
    return this.kind === "Ticket" ? "Support" : "Sales";
  }},

  // 🔧 accept your seed values
  activityType: {
    type: String,
    enum: ["Call","Email","Online Meeting","In-person Meeting","Onsite Meeting","Demo","Follow-up","Work","Other"],
    required: true
  },

  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
  contractId: { type: mongoose.Schema.Types.ObjectId, ref: "Contract" },
  responsibleUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assigneeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  // 🔧 allow P1/P2/P3 for tickets
  status: { type: String, enum: ["To Do","In Progress","Done","Blocked","Cancelled"], default: "To Do" },
  priority: { type: String, enum: ["Low","Medium","High","Urgent","P1","P2","P3"], default: "Medium" },

  // 🔧 accept Incident/Request
  ticketCategory: { type: String, enum: ["Bug","Question","User Support","Feature","Incident","Request","Other"], default: "Other" },

  slaDueAt: Date,
  cost: { type: mongoose.Schema.Types.Decimal128 },
  attachments: [ __Attachment],
}, { timestamps: true });



//indexing for faster querying 
ActivitySchema.index({ notes: "text" });
ActivitySchema.index({ linkedClient: 1, responsible: 1, when: -1, status: 1 });

export const Activity =  mongoose.model("Activity", ActivitySchema);