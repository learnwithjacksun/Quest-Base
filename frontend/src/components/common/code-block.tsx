import { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";

type CodeBlockProps = {
  code: string;
  language?: string;
  title?: string;
};

export default function CodeBlock({
  code,
  language = "tsx",
  title,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const trimmed = code.replace(/^\n/, "").replace(/\n$/, "");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(trimmed);
      setCopied(true);
      toast.success("Copied");
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Could not copy");
    }
  }

  return (
    <div className="rounded-lg border border-line overflow-hidden bg-[#0d0f0e]">
      <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-white/10 bg-secondary/90">
        <p className="text-[11px] font-medium tracking-wide uppercase text-muted truncate">
          {title || language}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="btn bg-background border border-line min-h-7 px-2.5 text-xs text-main gap-1 shrink-0"
        >
          <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} size={13} />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <Highlight theme={themes.nightOwl} code={trimmed} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} overflow-x-auto p-4 text-[12.5px] leading-relaxed m-0`}
            style={{
              ...style,
              background: "transparent",
              margin: 0,
            }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
