import mongoose from "mongoose";
import { ContactPersonSchema, AddressSchema, AttachmentSchema } from "./common.js";



const LrsuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  taxId: String,
  address: AddressSchema,
  county: String,
  
  mayor: String,
  budgetSize: Number,


  contactPersons: [ContactPersonSchema],//this is embedded
  institutions: [String],

  status: { type: String, default: "Potential Client" }, // Client | Former Client | Potential Client
  type: { type: String, enum: ["Municipality","City","County","Other"], default: "Municipality" },

  coordinates: { lat: Number, lng: Number },
  lastContact: Date,
  nextFollowUp: Date,
  priority: { type: String, enum: ["Low","Medium","High","Urgent"], default: "Medium" },

  contractExpiry: Date,
  notes: String,
  attachments: [AttachmentSchema]
}, { timestamps: true });

//faster queries we add indexing for caching 

LrsuSchema.index({ name: "text"});
LrsuSchema.index({ county: 1, type: 1, status: 1 });

export default mongoose.model("LRSU", LrsuSchema);