import { makeService } from "./baseService.js";
import { NotificationRepo } from "../repositories/notificatonRepo.js";
export const NotificationService = makeService(NotificationRepo);
