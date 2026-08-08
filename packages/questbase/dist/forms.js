import { resolveBaseUrl } from "./config.js";
import { QuestbaseError } from "./errors.js";
function hasFileFields(data) {
    return Object.values(data).some((value) => (typeof Blob !== "undefined" && value instanceof Blob) ||
        (typeof File !== "undefined" && value instanceof File));
}
function buildHeaders(config, isJson) {
    const headers = {
        Accept: "application/json",
    };
    if (isJson) {
        headers["Content-Type"] = "application/json";
    }
    if (config.apiKey) {
        headers["x-api-key"] = config.apiKey;
    }
    return headers;
}
function toBody(data) {
    if (hasFileFields(data)) {
        const formData = new FormData();
        for (const [key, value] of Object.entries(data)) {
            if (value === undefined || value === null)
                continue;
            if (typeof File !== "undefined" && value instanceof File) {
                formData.append(key, value);
            }
            else if (typeof Blob !== "undefined" && value instanceof Blob) {
                formData.append(key, value);
            }
            else {
                formData.append(key, String(value));
            }
        }
        return formData;
    }
    const json = {};
    for (const [key, value] of Object.entries(data)) {
        if (value === undefined || value === null)
            continue;
        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
            json[key] = value;
        }
        else {
            json[key] = String(value);
        }
    }
    return JSON.stringify(json);
}
export function createFormsApi(config) {
    const baseUrl = resolveBaseUrl(config.baseUrl);
    return {
        /**
         * Submit data to a public form endpoint.
         * POST {baseUrl}/f/{formId}
         */
        async submit(formId, data, options) {
            if (!formId?.trim()) {
                throw new QuestbaseError("formId is required", { code: "INVALID_FORM_ID" });
            }
            const isJson = !hasFileFields(data);
            const response = await fetch(`${baseUrl}/f/${formId}`, {
                method: "POST",
                headers: buildHeaders(config, isJson),
                body: toBody(data),
                signal: options?.signal,
            });
            let payload = {};
            try {
                payload = (await response.json());
            }
            catch {
                // non-JSON body
            }
            if (!response.ok) {
                throw new QuestbaseError(payload.message || `Form submission failed (${response.status})`, {
                    status: response.status,
                    code: payload.error?.code || "SUBMIT_FAILED",
                    details: payload.error?.details,
                });
            }
            return {
                id: payload.data?.id || "",
                status: payload.data?.status || "received",
            };
        },
    };
}
