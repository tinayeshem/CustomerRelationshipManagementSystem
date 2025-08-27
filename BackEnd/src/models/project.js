import mongoose from "mongoose";
import { leanJSON } from "./common.js";

const ProjectStageSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Meeting", "Call", "Negotiation", "Contract"
  description: String,
  completed: { type: Boolean, default: false },
  completedAt: Date,
  order: { type: Number, required: true } // 1, 2, 3, etc. for stage ordering
}, { _id: true });

const ProjectSchema = new mongoose.Schema(
  {
    // Project name/title
    name: { type: String, required: true, trim: true },
    
    // Project description/goal
    description: String,
    goal: String,

    // Belongs to an organization
    organizationId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Organization", 
      required: true 
    },

    // Project status
    status: {
      type: String,
      enum: ["Planning", "Active", "On Hold", "Completed", "Cancelled"],
      default: "Planning"
    },

    // Current stage of the project
    currentStage: {
      type: String,
      enum: ["Meeting", "Call", "Negotiation", "Contract", "Implementation", "Review", "Completed"],
      default: "Meeting"
    },

    // Project stages with completion tracking
    stages: [ProjectStageSchema],

    // Assigned team members
    assignedMembers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],

    // Project dates
    startDate: Date,
    endDate: Date,
    deadline: Date,

    // Budget/cost information
    estimatedBudget: {
      type: mongoose.Schema.Types.Decimal128,
      get: v => v ? parseFloat(v.toString()) : 0
    },
    actualCost: {
      type: mongoose.Schema.Types.Decimal128,
      get: v => v ? parseFloat(v.toString()) : 0
    },

    // Priority level
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium"
    },

    // Notes and additional information
    notes: String,

    // Track progress percentage
    progressPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  { 
    timestamps: true,
    toJSON: { getters: true }
  }
);

// Apply lean JSON transformation
leanJSON(ProjectSchema);

// Indexes for better query performance
ProjectSchema.index({ organizationId: 1, status: 1 });
ProjectSchema.index({ assignedMembers: 1, status: 1 });
ProjectSchema.index({ name: "text", description: "text" });

// Pre-save middleware to update progress based on completed stages
ProjectSchema.pre('save', function() {
  if (this.stages && this.stages.length > 0) {
    const completedStages = this.stages.filter(stage => stage.completed).length;
    this.progressPercentage = Math.round((completedStages / this.stages.length) * 100);
  }
});

export const Project = mongoose.model("Project", ProjectSchema);
