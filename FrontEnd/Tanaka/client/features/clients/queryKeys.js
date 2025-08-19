// Query keys centralization
export const qk = {
  // Keep params second so we can invalidate by prefix ["clients"]
  clients: (params) => ["clients", params],
};
