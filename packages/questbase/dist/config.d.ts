export type QuestbaseConfig = {
    /** Project API key (qb_...). Optional for public form/OTP calls from allowed origins. */
    apiKey?: string;
    /** API origin, e.g. https://api.questbase.io or http://localhost:9000 */
    baseUrl?: string;
};
export declare const DEFAULT_BASE_URL = "https://api.questbase.io";
export declare function resolveBaseUrl(baseUrl?: string): string;
//# sourceMappingURL=config.d.ts.map