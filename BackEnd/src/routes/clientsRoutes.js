// BackEnd/src/routes/clients.routes.js
import { Router } from "express";
import { list, getOne, create, update, remove } from "../controllers/clients.controller.js";
const r = Router();
r.get("/", list);           // ?q=&county=&status=&priority=&page=&limit=&sort=
r.get("/:id", getOne);
r.post("/", create);
r.put("/:id", update);
r.delete("/:id", remove);
export default r;
