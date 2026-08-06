export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:9000";

export const API_V1 = `${API_BASE_URL}/api/v1`;
