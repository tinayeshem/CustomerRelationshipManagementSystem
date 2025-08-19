// Data access (axios). UI never talks to axios directly.
import { api } from "@/lib/api";

export const clientsService = {
  async list(params) {
    const { data } = await api.get("/clients", { params });
    return data; // { items, total, ... }
  },
  async create(payload) {
    const { data } = await api.post("/clients", payload);
    return data;
  },
  async update(id, payload) {
    const { data } = await api.put(`/clients/${id}`, payload);
    return data;
  },
  async remove(id) {
    const { data } = await api.delete(`/clients/${id}`);
    return data;
  },
};

