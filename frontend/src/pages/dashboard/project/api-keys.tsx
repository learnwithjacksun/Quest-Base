import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import {
  createApiKey,
  fetchApiKeys,
  revokeApiKey,
} from "@/api/api-keys";
import { getErrorMessage } from "@/lib/api";
import { EmptyPanel, FeaturePage, useProject } from "./_shared";

export default function ProjectApiKeys() {
  const { project } = useProject();
  const queryClient = useQueryClient();
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  const { data: apiKeys = [], isLoading } = useQuery({
    queryKey: ["api-keys", project.id],
    queryFn: () => fetchApiKeys(project.id),
  });

  const createMutation = useMutation({
    mutationFn: () => createApiKey(project.id, "Default key"),
    onSuccess: (apiKey) => {
      queryClient.invalidateQueries({ queryKey: ["api-keys", project.id] });
      setCreatedKey(apiKey.key || null);
      toast.success("API key created");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not create API key"));
    },
  });

  const revokeMutation = useMutation({
    mutationFn: (keyId: string) => revokeApiKey(project.id, keyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys", project.id] });
      toast.success("API key revoked");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not revoke API key"));
    },
  });

  async function copyKey(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Could not copy");
    }
  }

  return (
    <FeaturePage
      title="API Keys"
      description={`Authenticate requests to the Quest Base API for ${project.name}.`}
      action={
        <button
          type="button"
          onClick={() => createMutation.mutate()}
          disabled={createMutation.isPending}
          className="btn-primary btn min-h-9 px-4 text-sm"
        >
          {createMutation.isPending ? "Generating…" : "Generate key"}
        </button>
      }
    >
      {createdKey && (
        <div className="rounded-lg border border-accent/40 bg-secondary p-4 space-y-2 max-w-2xl">
          <p className="text-sm font-medium text-main">
            Copy your new API key now. You won&apos;t see it again.
          </p>
          <div className="flex items-stretch gap-2">
            <code className="flex-1 min-h-10 rounded-sm border border-line bg-background px-3 text-xs font-mono text-main break-all flex items-center">
              {createdKey}
            </code>
            <button
              type="button"
              onClick={() => copyKey(createdKey)}
              className="btn bg-background border border-line min-h-10 px-3 text-sm"
            >
              <HugeiconsIcon icon={Copy01Icon} size={15} />
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-muted">Loading keys…</p>
      ) : apiKeys.length === 0 ? (
        <EmptyPanel
          title="No API keys"
          description="Generate a secret key to call forms, OTP, and waitlist endpoints from your backend."
          action={
            <button
              type="button"
              onClick={() => createMutation.mutate()}
              className="btn-primary btn min-h-9 px-4 text-sm mx-auto"
            >
              Generate key
            </button>
          }
        />
      ) : (
        <div className="rounded-lg border border-line bg-secondary divide-y divide-line max-w-2xl">
          {apiKeys.map((key) => (
            <div
              key={key.id}
              className="p-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-medium text-main">{key.name}</p>
                <p className="text-xs font-mono text-muted">
                  {key.keyPrefix}… · created{" "}
                  {new Date(key.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                type="button"
                aria-label="Revoke key"
                onClick={() => revokeMutation.mutate(key.id)}
                className="size-9 rounded-sm border border-line bg-background center text-muted hover:text-main"
              >
                <HugeiconsIcon icon={Delete02Icon} size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </FeaturePage>
  );
}
