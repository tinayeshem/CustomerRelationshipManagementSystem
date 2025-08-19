// BackEnd/src/routes/activities.routes.js
import { Router } from "express";
import { list, getOne, create, update, remove } from "../controllers/activityController.js";
const r = Router();
r.get("/", list); // ?q=&linkedClient=&responsible=&status=&from=&to=&page=&limit=&sort=
r.get("/:id", getOne);
r.post("/", create);
r.put("/:id", update);
r.delete("/:id", remove);
export default r;
