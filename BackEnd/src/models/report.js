import mongoose from "mongoose";

const ReportSnapshotSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  range: { from: Date, to: Date },
  metrics: mongoose.Schema.Types.Mixed,   // computed numbers (e.g., totals, averages)
  rows: [mongoose.Schema.Types.Mixed]     // table rows/series for charts
}, { _id: false });

const ReportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: [
      "timeSpent",          // Activities + Tickets
      "frequentRequests",  // Support categories/types
      "profitByClient",    // Clients revenue-costs
      "salesByRegion",     // Leads expected value
      "financeOverview"    // Finance totals/aging
    ],
    required: true
  },
  filters: mongoose.Schema.Types.Mixed,   // e.g., { region: "Zagreb", timeframe: "month" }
  viz: { type: String, enum: ["table","bar","line","pie","kpi"], default: "table" },
  schedule: { type: String },             // CRON or RRULE text (optional)
  lastRunAt: Date,
  snapshots: [ReportSnapshotSchema],      // keep recent snapshots for quick load/exports
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

ReportSchema.index({ name: 1, type: 1 });

export default mongoose.model("Report", ReportSchema);