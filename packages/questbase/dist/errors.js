export class QuestbaseError extends Error {
    constructor(message, options) {
        super(message);
        this.name = "QuestbaseError";
        this.status = options?.status;
        this.code = options?.code;
        this.details = options?.details;
    }
}
export function notImplemented(feature) {
    throw new QuestbaseError(`${feature} is coming soon in the Quest Base SDK. Use the dashboard API in the meantime.`, { code: "NOT_IMPLEMENTED" });
}
