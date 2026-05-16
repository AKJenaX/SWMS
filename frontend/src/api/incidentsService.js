import { opsGet, opsPost, opsPut } from "./opsApi";

export const incidentsService = {
  getAll: () => opsGet("/incidents"),
  getDispatchQueue: () => opsGet("/incidents/dispatch/queue"),
  create: (payload) => opsPost("/incidents", payload),
  updateState: (id, status) => opsPut(`/incidents/${id}/state`, { status }),
  assign: (id, payload) => opsPost(`/incidents/${id}/assign`, payload),
};
