import mongoose from "mongoose";
import { AttachmentSchema as _Attachment, ContactPersonSchema as _Contact, AddressSchema as _Address } from "./common.js";

export const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  type: String,                 // LRSU | Club | Company | Association
  clientType: String,           // Municipality | City | SME | ...
  address: _Address,// this is embedded 
  county: String,

  // Contract / finance
  contractType: String,         // Tender | Justification | Direct
  contractValue: Number,
  vatAmount: Number,
  contractStart: Date,
  contractEnd: Date,
  paymentMethod: String,
  paymentDeadline: String,

  revenue: { type: Number, default: 0 },
  costs:   { type: Number, default: 0 },
  profitability: { type: Number, default: 0 }, // %

  status: { type: String, default: "Active" }, // Active | Expired | Potential
  priority: { type: String, enum: ["Low","Medium","High","Urgent"], default: "Medium" },

  kam: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // key account manager
  contactPersons: [_Contact],
  relatedContacts: [String],

  lastContact: Date,
  nextPayment: Date,
  contractRenewal: Date,

  notes: String,
  attachments: [_Attachment]
}, { timestamps: true });

ClientSchema.index({ name: "text", notes: "text" });
ClientSchema.index({ county: 1, status: 1, priority: 1 });

ClientSchema.pre("save", function(next) {
  if (this.isModified("revenue") || this.isModified("costs")) {
    const rev = this.revenue || 0;
    const profit = rev - (this.costs || 0);
    this.profitability = rev > 0 ? Math.round((profit / rev) * 1000) / 10 : 0; // 1 decimal
  }
  next();
});

export default mongoose.model("Client", ClientSchema);