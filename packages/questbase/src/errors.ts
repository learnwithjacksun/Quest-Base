export class QuestbaseError extends Error {
  status?: number;
  code?: string;
  details?: unknown;

  constructor(
    message: string,
    options?: { status?: number; code?: string; details?: unknown },
  ) {
    super(message);
    this.name = "QuestbaseError";
    this.status = options?.status;
    this.code = options?.code;
    this.details = options?.details;
  }
}

export function notImplemented(feature: string): never {
  throw new QuestbaseError(
    `${feature} is coming soon in the Quest Base SDK. Use the dashboard API in the meantime.`,
    { code: "NOT_IMPLEMENTED" },
  );
}
