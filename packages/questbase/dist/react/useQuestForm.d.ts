import type { FormSubmitData, FormSubmitResult } from "../forms.js";
export type UseQuestFormOptions = {
    formId: string;
    apiKey?: string;
    baseUrl?: string;
};
export type UseQuestFormReturn = {
    submit: (data: FormSubmitData) => Promise<FormSubmitResult>;
    submitting: boolean;
    error: Error | null;
    resetError: () => void;
};
/**
 * React hook for submitting Quest Base forms (Formspark-style, simpler object API).
 *
 * @example
 * const { submit, submitting, error } = useQuestForm({ formId: "xxxx" });
 * await submit({ message: "Hello" });
 */
export declare function useQuestForm(options: UseQuestFormOptions): UseQuestFormReturn;
//# sourceMappingURL=useQuestForm.d.ts.map