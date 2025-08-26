// models/organization.model.js
import mongoose from "mongoose";
import { AddressSchema, ContactSchema, leanJSON } from "./common.js";

const OrganizationSchema = new mongoose.Schema(
  {
    // company/club/city name
    name: { type: String, required: true, trim: true },

    // "unit type" like Municipality/City/County/Club/Association/Company/Craftsman/Institution
    unitType: {
      type: String,
      enum: ["Municipality", "City", "County", "Club", "Association", "Company", "Craftsman", "Institution", "Other"],
      required: true,
    },

    // LRSU or not (spec treats LRSU & Client record as same)
    isLRSU: { type: Boolean, default: false },

    // status buckets from spec (Client, Former Client, Rejected, Potential Client, Negotiation, Not Contacted)
    status: {
      type: String,
      enum: ["Client", "Former Client", "Rejected", "Potential Client", "Negotiation in Progress", "Not Contacted"],
      default: "Not Contacted",
    },

    // sales pipeline hint (your file had Phase / Next Phase)
    phase: { type: String },
    nextPhase: { type: String },

    // address and ways to reach them
    address: AddressSchema,
    phone: String,
    fax: String,
    email: { type: String, lowercase: true, trim: true },
    website: String,

    // many contact people with roles
    contacts: [ContactSchema],

    // internal type tag if you need another grouping
    type: String,

    // owning team (quick filtering)
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },

    // who’s the account manager (spec: link KAM)
    keyAccountManagerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // free notes
    notes: String,
  },
  { timestamps: true }
);

leanJSON(OrganizationSchema);

OrganizationSchema.index({ name: "text", "address.city": 1, status: 1 });

export const Organization = mongoose.model("Organization", OrganizationSchema);
