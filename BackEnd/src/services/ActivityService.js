
import { ActivityRepository } from "../repositories/ActivityRepo.js";
import { toUi } from "../mappers/toUi.js";

export class ActivityService {
  constructor(repo = new ActivityRepository()) { this.repo = repo; }
  async list(params) {
    const res = await this.repo.list(params);
    return { ...res, items: res.items.map(toUi) };
  }
  async get(id) { return toUi(await this.repo.findById(id)); }
  async create(payload) { return toUi(await this.repo.create(payload)); }
  async update(id, payload) { return toUi(await this.repo.update(id, payload)); }
  async remove(id) { await this.repo.remove(id); return { ok: true }; }
}
