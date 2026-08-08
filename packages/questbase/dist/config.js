export const DEFAULT_BASE_URL = "https://api.questbase.io";
export function resolveBaseUrl(baseUrl) {
    return (baseUrl || DEFAULT_BASE_URL).replace(/\/$/, "");
}
