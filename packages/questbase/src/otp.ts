import type { QuestbaseConfig } from "./config.js";
import { resolveBaseUrl } from "./config.js";
import { QuestbaseError } from "./errors.js";

export type OtpChannel = "email" | "sms";

export type OtpSendInput = {
  channel: OtpChannel;
  to: string;
};

export type OtpVerifyInput = {
  to: string;
  code: string;
};

export type OtpSendResult = {
  success: true;
  channel: OtpChannel;
  to: string;
  expiresIn: number;
};

export type OtpVerifyResult = {
  success: true;
  verified: true;
  channel: OtpChannel;
  to: string;
};

type RequestOptions = {
  signal?: AbortSignal;
};

type ApiPayload = {
  success?: boolean;
  message?: string;
  data?: Record<string, unknown>;
  error?: { code?: string; details?: unknown };
  code?: string;
};

function buildHeaders(config: QuestbaseConfig): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (config.apiKey) {
    headers["x-api-key"] = config.apiKey;
  }
  return headers;
}

async function parseJson(response: Response): Promise<ApiPayload> {
  try {
    return (await response.json()) as ApiPayload;
  } catch {
    return {};
  }
}

export function createOtpApi(config: QuestbaseConfig) {
  const baseUrl = resolveBaseUrl(config.baseUrl);

  return {
    /**
     * Send an OTP over email or SMS.
     * POST {baseUrl}/o/{otpId}/send
     */
    async send(
      otpId: string,
      input: OtpSendInput,
      options?: RequestOptions,
    ): Promise<OtpSendResult> {
      if (!otpId?.trim()) {
        throw new QuestbaseError("otpId is required", { code: "INVALID_OTP_ID" });
      }
      if (!input?.channel || (input.channel !== "email" && input.channel !== "sms")) {
        throw new QuestbaseError("channel must be email or sms", {
          code: "INVALID_CHANNEL",
        });
      }
      if (!input?.to?.trim()) {
        throw new QuestbaseError("to is required", { code: "INVALID_TO" });
      }

      const response = await fetch(`${baseUrl}/o/${otpId}/send`, {
        method: "POST",
        headers: buildHeaders(config),
        body: JSON.stringify({
          channel: input.channel,
          to: input.to.trim(),
        }),
        signal: options?.signal,
      });

      const payload = await parseJson(response);

      if (!response.ok) {
        throw new QuestbaseError(
          payload.message || `OTP send failed (${response.status})`,
          {
            status: response.status,
            code: payload.code || payload.error?.code || "OTP_SEND_FAILED",
            details: payload.error?.details,
          },
        );
      }

      return {
        success: true,
        channel: (payload.data?.channel as OtpChannel) || input.channel,
        to: String(payload.data?.to || input.to),
        expiresIn: Number(payload.data?.expiresIn || 0),
      };
    },

    /**
     * Verify an OTP code for a destination.
     * POST {baseUrl}/o/{otpId}/verify
     */
    async verify(
      otpId: string,
      input: OtpVerifyInput,
      options?: RequestOptions,
    ): Promise<OtpVerifyResult> {
      if (!otpId?.trim()) {
        throw new QuestbaseError("otpId is required", { code: "INVALID_OTP_ID" });
      }
      if (!input?.to?.trim()) {
        throw new QuestbaseError("to is required", { code: "INVALID_TO" });
      }
      if (!input?.code?.trim()) {
        throw new QuestbaseError("code is required", { code: "INVALID_CODE" });
      }

      const response = await fetch(`${baseUrl}/o/${otpId}/verify`, {
        method: "POST",
        headers: buildHeaders(config),
        body: JSON.stringify({
          to: input.to.trim(),
          code: String(input.code).trim(),
        }),
        signal: options?.signal,
      });

      const payload = await parseJson(response);

      if (!response.ok) {
        throw new QuestbaseError(
          payload.message || `OTP verify failed (${response.status})`,
          {
            status: response.status,
            code: payload.code || payload.error?.code || "OTP_VERIFY_FAILED",
            details: payload.error?.details,
          },
        );
      }

      return {
        success: true,
        verified: true,
        channel: (payload.data?.channel as OtpChannel) || "email",
        to: String(payload.data?.to || input.to),
      };
    },
  };
}

export type OtpApi = ReturnType<typeof createOtpApi>;
