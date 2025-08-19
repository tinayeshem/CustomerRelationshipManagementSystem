// client/features/clients/api.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// normalize _id → id so UI has a stable key
const normalize = (it) => ({ ...it, id: it.id || it._id });

/** helper: update every cached clients list */
function updateAllClientLists(qc, updater) {
  const queries = qc.getQueriesData({ queryKey: ["clients"] }); // all variants
  for (const [key, data] of queries) {
    if (!data?.items) continue;
    const nextItems = updater(data.items);
    qc.setQueryData(key, { ...data, items: nextItems });
  }
}

/* ------------------ READ ------------------ */
export function useClients(params) {
  return useQuery({
    queryKey: ["clients", params],
    queryFn: async () => {
      const { data } = await api.get("/clients", { params });
      const items = (data.items || []).map(normalize);
      console.log(items)
      return { ...data, items };
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
}

/* ------------------ CREATE (optimistic) ------------------ */
export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post("/clients", payload);
      return normalize(data);
    },

    // optimistic add
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: ["clients"] });
      const temp = normalize({ ...payload, id: "tmp-" + Date.now() });

      const snapshots = qc.getQueriesData({ queryKey: ["clients"] });
      updateAllClientLists(qc, (items) => [temp, ...items]);

      return { snapshots, tempId: temp.id };
    },

    // if server fails → rollback
    onError: (_err, _payload, ctx) => {
      if (!ctx) return;
      for (const [key, data] of ctx.snapshots) {
        qc.setQueryData(key, data);
      }
    },

    // replace temp row with server row
    onSuccess: (serverDoc, _payload, ctx) => {
      updateAllClientLists(qc, (items) =>
        items.map((it) => (it.id === ctx?.tempId ? serverDoc : it))
      );
    },

    // final sync
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

/* ------------------ UPDATE (optimistic) ------------------ */
export function useUpdateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await api.put(`/clients/${id}`, payload);
      return normalize(data);
    },

    onMutate: async ({ id, payload }) => {
      await qc.cancelQueries({ queryKey: ["clients"] });
      const snapshots = qc.getQueriesData({ queryKey: ["clients"] });

      updateAllClientLists(qc, (items) =>
        items.map((it) =>
          it.id === id ? normalize({ ...it, ...payload }) : it
        )
      );

      return { snapshots, id };
    },

    onError: (_err, _vars, ctx) => {
      if (!ctx) return;
      for (const [key, data] of ctx.snapshots) {
        qc.setQueryData(key, data);
      }
    },

    onSuccess: (serverDoc) => {
      updateAllClientLists(qc, (items) =>
        items.map((it) => (it.id === serverDoc.id ? serverDoc : it))
      );
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

/* ------------------ DELETE (optimistic) ------------------ */
export function useDeleteClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      // handle either 200 or 204 from server
      await api.delete(`/clients/${id}`);
      return id;
    },

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["clients"] });
      const snapshots = qc.getQueriesData({ queryKey: ["clients"] });

      updateAllClientLists(qc, (items) => items.filter((it) => it.id !== id));

      return { snapshots, id };
    },

    onError: (_err, _id, ctx) => {
      if (!ctx) return;
      for (const [key, data] of ctx.snapshots) {
        qc.setQueryData(key, data);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}
