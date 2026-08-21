function resolveApiBaseUrl() {
  const fromEnv = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  // Safety net if a production static build was shipped without VITE_API_BASE_URL.
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "questbase.orzn.app" || host.endsWith(".questbase.orzn.app")) {
      return "https://questbase-server.orzn.app";
    }
  }

  return "http://localhost:9000";
}

export const API_BASE_URL = resolveApiBaseUrl();

export const API_V1 = `${API_BASE_URL}/api/v1`;
