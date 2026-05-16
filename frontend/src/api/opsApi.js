import axios from "axios";

const OPS_API_BASE = "http://localhost:3000";

function getAuthHeaders() {
  const token = localStorage.getItem("swms_access_token");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export async function opsGet(path) {
  const response = await axios.get(`${OPS_API_BASE}${path}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  return response.data;
}

export async function opsPost(path, payload) {
  const response = await axios.post(`${OPS_API_BASE}${path}`, payload, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  return response.data;
}

export async function opsPut(path, payload) {
  const response = await axios.put(`${OPS_API_BASE}${path}`, payload, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  return response.data;
}
