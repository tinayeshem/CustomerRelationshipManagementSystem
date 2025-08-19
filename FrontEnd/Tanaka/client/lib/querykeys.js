// FrontEnd/src/lib/queryKeys.js
export const qk = {
  clients: (params) => ["clients", params],
  client: (id) => ["client", id],
  activities: (params) => ["activities", params],
  activity: (id) => ["activity", id],
};
