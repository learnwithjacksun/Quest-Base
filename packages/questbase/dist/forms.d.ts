import type { QuestbaseConfig } from "./config.js";
export type FormSubmitResult = {
    id: string;
    status: string;
};
export type FormFieldValue = string | number | boolean | Blob | File | null | undefined;
export type FormSubmitData = Record<string, FormFieldValue>;
type SubmitOptions = {
    signal?: AbortSignal;
};
export declare function createFormsApi(config: QuestbaseConfig): {
    /**
     * Submit data to a public form endpoint.
     * POST {baseUrl}/f/{formId}
     */
    submit(formId: string, data: FormSubmitData, options?: SubmitOptions): Promise<FormSubmitResult>;
};
export type FormsApi = ReturnType<typeof createFormsApi>;
export {};
//# sourceMappingURL=forms.d.ts.map