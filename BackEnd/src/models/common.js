// models/common.js
import mongoose from "mongoose";

// 💡 Helper to keep money precise (no float errors)
export const Money = { type: mongoose.Schema.Types.Decimal128, required: true };

// 🧩 A tiny file card we can reuse for uploads
export const AttachmentSchema = new mongoose.Schema(
  {
    // "name" is what we call the file
    name: { type: String, required: true },           // e.g., "contract_2026.pdf"
    // "url" tells us where the file lives
    url: { type: String, required: true },            // e.g., "/uploads/123.pdf" or S3 URL
    // what kind of file it is
    contentType: { type: String },                    // e.g., "application/pdf"
    // how big it is
    size: { type: Number },                           // bytes
  },
  { _id: false }                                      // we don't need an id for each attachment
);

// 🏠 Standard postal info
export const AddressSchema = new mongoose.Schema(
  {
    street: String,                                   // "Ulica 1"
    city: String,                                     // "Zagreb"
    county: String,                                   // "Zagrebačka"
    postalCode: String,                               // "10000"
    country: { type: String, default: "Croatia" },    // default
    mapLink: String,                                  // quick Google Maps link (spec mentions this)
  },
  { _id: false }
);

// 👤 A contact person on a client/LRSU
export const ContactSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },       // "Ivan Horvat"
    role: String,                                     // "IT Manager"
    email: { type: String, lowercase: true, trim: true },
    phone: String,
    notes: String,
  },
  { _id: false }
);

// ✍️ A tiny plugin so every doc returns { id } and hides __v neatly
export function leanJSON(schema) {
  schema.set("toJSON", {
    virtuals: true,
    transform: (_, ret) => {
      ret.id = ret._id.toString();                    // give a friendly "id"
      delete ret._id;                                 // hide Mongo's _id
      delete ret.__v;                                 // hide version
      // convert Decimal128 -> number string (frontend can Number() it)
      Object.keys(ret).forEach(k => {
        if (ret[k] && ret[k]._bsontype === "Decimal128") ret[k] = ret[k].toString();
      });
      return ret;
    },
  });
}
