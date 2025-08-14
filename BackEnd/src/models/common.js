import mongoose from "mongoose";

export const AttachmentSchema = new mongoose.Schema({
  name: String,
  url: String,                    // S3/R2 link or CDN URL
  mimeType: String,
  size: Number,                   // bytes
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

export const ContactPersonSchema = new mongoose.Schema({
  name: String,
  role: String,
  phone: String,
  email: String
}, { _id: false });

export const AddressSchema = new mongoose.Schema({
  line1: String,
  line2: String,
  city: String,
  county: String,
  postalCode: String,
  country: { type: String, default: "Croatia" }
}, { _id: false });