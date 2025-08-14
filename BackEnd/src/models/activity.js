import mongoose from "mongoose";
import { AttachmentSchema as __Attachment } from "./common.js";

const ActivityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: String,           // Created | Updated | Completed | Commented
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const ActivitySchema = new mongoose.Schema({
  activityType: { type: String, enum: ["Call","Email","Online Meeting","In-person Meeting"], required: true },
  category: { type: String, enum: ["Sales","Support"], required: true },

  linkedClient: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  clientType: { type: String, enum: ["Client","LRSU"], required: true },

  when: { type: Date, required: true }, // date+time
  responsible: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  status: { type: String, enum: ["To Do","In Progress","Done"], default: "To Do" },
  deadline: Date,
  reminderDate: Date,

  nextStep: String,
  nextStepDate: Date,

  notes: String,
  attachments: [__Attachment],// embedded

  costPerActivity: { type: Number, default: 0 },
  ticketType: { type: String, enum: ["Bug","Question","Feature","Enhancement"] },
  premiumSupport: { type: Boolean, default: false },

  activityLog: [ActivityLogSchema],//embedded
  priority: { type: String, enum: ["Low","Medium","High","Urgent"], default: "Medium" },

  isTicket: { type: Boolean, default: false }
}, { timestamps: true });



//indexing for faster querying 
ActivitySchema.index({ notes: "text" });
ActivitySchema.index({ linkedClient: 1, responsible: 1, when: -1, status: 1 });

export default mongoose.model("Activity", ActivitySchema);