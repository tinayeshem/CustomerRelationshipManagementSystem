import mongoose from "mongoose";

const TeamMemberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["Owner","Manager","Member"], default: "Member" }
}, { _id: false });

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  members: [TeamMemberSchema],
  defaultPermissions: {
    activities: { read: {type:Boolean, default:true}, write: {type:Boolean, default:true} },
    clients:    { read: {type:Boolean, default:true}, write: {type:Boolean, default:false} },
    contracts:  { read: {type:Boolean, default:true}, write: {type:Boolean, default:false} },
    finance:    { read: {type:Boolean, default:false}, write: {type:Boolean, default:false} }
  }
}, { timestamps: true });



export default mongoose.model("Team", TeamSchema);
