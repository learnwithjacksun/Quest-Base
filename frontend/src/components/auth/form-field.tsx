import { useState, type ComponentProps } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";

type FormFieldProps = ComponentProps<"input"> & {
  label: string;
  error?: string;
};

export default function FormField({
  label,
  error,
  id,
  type,
  className,
  ...inputProps
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputId = id ?? inputProps.name;

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-xs font-medium text-main">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={isPassword && showPassword ? "text" : type}
          className={`w-full min-h-10 rounded-sm border bg-secondary px-3 text-sm text-main placeholder:text-muted transition-colors focus:border-accent/50 ${
            error ? "border-red-500/60" : "border-line"
          } ${isPassword ? "pr-10" : ""} ${className ?? ""}`}
          {...inputProps}
        />
        {isPassword && (
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-main transition-colors"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            <HugeiconsIcon icon={showPassword ? ViewOffIcon : ViewIcon} size={17} />
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
