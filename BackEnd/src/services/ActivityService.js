

import { toUi } from "../mappers/toUi.js";
import { makeService } from "./baseService.js";
import { ActivityRepo } from "../repositories/ActivityRepo.js";
export const ActivityService = makeService(ActivityRepo);









// export const ActivityService = {
//   ...makeService(ActivityRepo), // bring create/get/list/update/remove

//   // add specialty methods:
//   listTickets: (opts = {}) => ActivityRepo.list({ isTicket: true }, opts),

//   listByAssignee: (userId, opts = {}) =>
//     ActivityRepo.list({ responsibleUserId: userId }, opts),

//   // override list to support query strings like ?isTicket=true
//   list: (q = {}) => {
//     const f = {};
//     if (q.isTicket === "true")  f.isTicket = true;
//     if (q.isTicket === "false") f.isTicket = false;
//     if (q.status) f.status = q.status;
//     return ActivityRepo.list(f, { limit: Number(q.limit ?? 100) });
//   },
// };