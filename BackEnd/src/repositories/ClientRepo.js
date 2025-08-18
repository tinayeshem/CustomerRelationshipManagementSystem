// BackEnd/src/repositories/ClientRepository.js
import { BaseRepository } from "./BaseRepository.js";
import Client from "../models/client.js";

export class ClientRepository extends BaseRepository {
  constructor() { super(Client); }

  async list({ q="", county, status, priority, page=1, limit=20, sort="-createdAt" }) {
    const filter = {};
    if (q) filter.$text = { $search: q };              // uses text index
    if (county) filter.county = county;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;          // has compound index
    const skip = (page-1) * limit;
    const [items, total] = await Promise.all([
      Client.find(filter).sort(sort).skip(skip).limit(limit),
      Client.countDocuments(filter)
    ]);
    return { items, total, page, limit };
  }
}
