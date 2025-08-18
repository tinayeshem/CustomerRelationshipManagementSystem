// BackEnd/src/repositories/ActivityRepository.js
import { BaseRepository } from "./BaseRepository.js";
import Activity from "../models/activity.js";

export class ActivityRepository extends BaseRepository {
  constructor() { super(Activity); }

  async list({ q="", linkedClient, responsible, status, from, to, page=1, limit=20, sort="-when" }) {
    const filter = {};
    if (q) filter.$text = { $search: q };        // notes text index
    if (linkedClient) filter.linkedClient = linkedClient;
    if (responsible) filter.responsible = responsible;
    if (status) filter.status = status;
    if (from || to) filter.when = {};
    if (from) filter.when.$gte = new Date(from);
    if (to)   filter.when.$lte = new Date(to);
    const skip = (page-1) * limit;
    const [items, total] = await Promise.all([
      Activity.find(filter).sort(sort).skip(skip).limit(limit),
      Activity.countDocuments(filter)
    ]);
    return { items, total, page, limit };
  }
}
