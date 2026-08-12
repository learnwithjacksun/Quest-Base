import type { QuestbaseConfig } from "./config.js";
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
export declare function createOtpApi(config: QuestbaseConfig): {
    /**
     * Send an OTP over email or SMS.
     * POST {baseUrl}/o/{otpId}/send
     */
    send(otpId: string, input: OtpSendInput, options?: RequestOptions): Promise<OtpSendResult>;
    /**
     * Verify an OTP code for a destination.
     * POST {baseUrl}/o/{otpId}/verify
     */
    verify(otpId: string, input: OtpVerifyInput, options?: RequestOptions): Promise<OtpVerifyResult>;
};
export type OtpApi = ReturnType<typeof createOtpApi>;
export {};
//# sourceMappingURL=otp.d.ts.map