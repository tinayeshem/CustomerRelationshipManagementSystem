import {makeRepo} from "./BaseRepository.js";
import {Notification} from "../models/notification.js";
export const NotificationRepo = makeRepo(Notification);