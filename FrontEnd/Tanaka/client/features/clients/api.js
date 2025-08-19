// FrontEnd/src/features/clients/api.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { qk } from "../../lib/querykeys";

export function useClients(params) {
  return useQuery({
    queryKey: qk.clients(params),
    queryFn: async () => {
      const { data } = await api.get("/clients", { params });
      return data; // { items, total, page, limit } with each item having `id`
    }
  });
}

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => (await api.post("/clients", payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] })
  });
}

export function useUpdateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }) => (await api.put(`/clients/${id}`, payload)).data,
    onMutate: async ({ id, payload }) => {
      // optimistic update example
      await qc.cancelQueries({ queryKey: ["clients"] });
      const prev = qc.getQueriesData({ queryKey: ["clients"] });
      prev.forEach(([key, data]) => {
        if (!data?.items) return;
        qc.setQueryData(key, {
          ...data,
          items: data.items.map(it => it.id === id ? { ...it, ...payload } : it)
        });
      });
      return { prev };
    },
    onError: (_e, _vars, ctx) => ctx?.prev?.forEach(([key, data]) => qc.setQueryData(key, data)),
    onSettled: () => qc.invalidateQueries({ queryKey: ["clients"] })
  });
}

export function useDeleteClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => (await api.delete(`/clients/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] })
  });
}
