export declare class QuestbaseError extends Error {
    status?: number;
    code?: string;
    details?: unknown;
    constructor(message: string, options?: {
        status?: number;
        code?: string;
        details?: unknown;
    });
}
export declare function notImplemented(feature: string): never;
//# sourceMappingURL=errors.d.ts.map