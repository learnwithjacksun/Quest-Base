import type { QuestbaseConfig } from "./config.js";
import { resolveBaseUrl } from "./config.js";
import { QuestbaseError } from "./errors.js";

export type FormSubmitResult = {
  id: string;
  status: string;
};

export type FormFieldValue = string | number | boolean | Blob | File | null | undefined;

export type FormSubmitData = Record<string, FormFieldValue>;

type SubmitOptions = {
  signal?: AbortSignal;
};

function hasFileFields(data: FormSubmitData): boolean {
  return Object.values(data).some(
    (value) =>
      (typeof Blob !== "undefined" && value instanceof Blob) ||
      (typeof File !== "undefined" && value instanceof File),
  );
}

function buildHeaders(config: QuestbaseConfig, isJson: boolean): HeadersInit {
  const headers: Record<string, string> = {
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

function toBody(data: FormSubmitData): BodyInit {
  if (hasFileFields(data)) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined || value === null) continue;
      if (typeof File !== "undefined" && value instanceof File) {
        formData.append(key, value);
      } else if (typeof Blob !== "undefined" && value instanceof Blob) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
    return formData;
  }

  const json: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      json[key] = value;
    } else {
      json[key] = String(value);
    }
  }
  return JSON.stringify(json);
}

export function createFormsApi(config: QuestbaseConfig) {
  const baseUrl = resolveBaseUrl(config.baseUrl);

  return {
    /**
     * Submit data to a public form endpoint.
     * POST {baseUrl}/f/{formId}
     */
    async submit(
      formId: string,
      data: FormSubmitData,
      options?: SubmitOptions,
    ): Promise<FormSubmitResult> {
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

      let payload: {
        success?: boolean;
        message?: string;
        data?: { id?: string; status?: string };
        error?: { code?: string; details?: unknown };
      } = {};

      try {
        payload = (await response.json()) as typeof payload;
      } catch {
        // non-JSON body
      }

      if (!response.ok) {
        throw new QuestbaseError(
          payload.message || `Form submission failed (${response.status})`,
          {
            status: response.status,
            code: payload.error?.code || "SUBMIT_FAILED",
            details: payload.error?.details,
          },
        );
      }

      return {
        id: payload.data?.id || "",
        status: payload.data?.status || "received",
      };
    },
  };
}

export type FormsApi = ReturnType<typeof createFormsApi>;
