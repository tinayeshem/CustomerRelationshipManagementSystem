// models/user.model.js
import mongoose from "mongoose";
import { leanJSON } from "./common.js";

const UserSchema = new mongoose.Schema(
  {
    // the person's name
    fullName: { type: String, required: true, trim: true },

    // their email (must be unique so we don't duplicate accounts)
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },

    // what they do in the system (spec expects different roles working on sales/support)
    role: {
      type: String,
      enum: ["Admin", "Manager", "KAM", "Sales", "Support"],
      required: true,
    },

    // which team they belong to (optional)
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },

    // extra switches the admin can flip (feature flags)
    permissions: [{ type: String }],

    // can they log in / be assigned?
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true } // auto add createdAt/updatedAt
);

leanJSON(UserSchema);

UserSchema.index({ fullName: "text", email: "text" }); // quick search

export const User = mongoose.model("User", UserSchema);
