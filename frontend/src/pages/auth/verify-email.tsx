import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { OtpInput } from "@/components/auth";
import { otpSchema } from "@/schemas";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email;

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const result = otpSchema.safeParse({ code });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setError(null);
    toast.success("Email verified successfully");
    navigate("/login");
  }

  function handleChange(value: string) {
    setCode(value);
    if (error) setError(null);
  }

  return (
    <div className="w-full max-w-90 mx-auto space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-main">Verify your email</h1>
        <p className="text-sm text-muted">
          Enter the 6-digit code we sent to{" "}
          {email ? (
            <span className="text-main">{email}</span>
          ) : (
            "your email address"
          )}
          .
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="space-y-2">
          <OtpInput value={code} onChange={handleChange} />
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={code.length !== 6}
          className="btn-primary btn w-full min-h-10 text-sm font-medium"
        >
          Verify email
        </button>
      </form>

      <p className="text-center text-sm text-muted">
        Didn't receive a code?{" "}
        <button
          type="button"
          className="text-main underline underline-offset-2"
          onClick={() => toast.success("A new code has been sent")}
        >
          Resend
        </button>
      </p>
    </div>
  );
}
