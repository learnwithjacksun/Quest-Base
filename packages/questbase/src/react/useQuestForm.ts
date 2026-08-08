import { useCallback, useState } from "react";
import { questbase } from "../client.js";
import type { QuestbaseConfig } from "../config.js";
import type { FormSubmitData, FormSubmitResult } from "../forms.js";
import { QuestbaseError } from "../errors.js";

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
export function useQuestForm(options: UseQuestFormOptions): UseQuestFormReturn {
  const { formId, apiKey, baseUrl } = options;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = useCallback(
    async (data: FormSubmitData) => {
      setSubmitting(true);
      setError(null);
      try {
        const config: QuestbaseConfig = { apiKey, baseUrl };
        const qb = questbase(config);
        return await qb.forms.submit(formId, data);
      } catch (err) {
        const next =
          err instanceof Error
            ? err
            : new QuestbaseError("Form submission failed", {
                code: "SUBMIT_FAILED",
                details: err,
              });
        setError(next);
        throw next;
      } finally {
        setSubmitting(false);
      }
    },
    [formId, apiKey, baseUrl],
  );

  const resetError = useCallback(() => setError(null), []);

  return { submit, submitting, error, resetError };
}
