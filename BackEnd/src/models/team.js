// models/team.model.js
import mongoose from "mongoose";
import { leanJSON } from "./common.js";

const TeamSchema = new mongoose.Schema(
  {
    // the team’s name
    name: { type: String, required: true, trim: true },

    // who is in this team (users)
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],

    // optional: limit team to certain clients (spec says teams link to clients)
    organizationIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Organization" }],
  },
  { timestamps: true }
);

leanJSON(TeamSchema);

TeamSchema.index({ name: 1 });

export const Team = mongoose.model("Team", TeamSchema);
