// BackEnd/src/controllers/activities.controller.js
import { ActivityService } from "../services/ActivityService.js";
const service = new ActivityService();

export async function list(req, res) { res.json(await service.list(req.query)); }
export async function getOne(req, res) {
  const doc = await service.get(req.params.id);
  if (!doc) return res.status(404).json({ message: "Activity not found" });
  res.json(doc);
}
export async function create(req, res) {
  const doc = await service.create(req.body);
  res.status(201).json(doc);
}
export async function update(req, res) {
  const doc = await service.update(req.params.id, req.body);
  if (!doc) return res.status(404).json({ message: "Activity not found" });
  res.json(doc);
}
export async function remove(req, res) {
  await service.remove(req.params.id);
  res.json({ ok: true });
}
