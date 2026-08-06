import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { OtpInput } from "@/components/auth";
import { otpSchema } from "@/schemas";
import { resendVerification, verifyEmail } from "@/api/auth";
import { getErrorMessage } from "@/lib/api";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email;

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const result = otpSchema.safeParse({ code });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    if (!email) {
      setError("Missing email. Please register again.");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await verifyEmail({ email, code: result.data.code });
      toast.success("Email verified successfully");
      navigate("/login");
    } catch (err) {
      setError(getErrorMessage(err, "Invalid verification code"));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    if (!email) {
      toast.error("Missing email. Please register again.");
      return;
    }
    setResending(true);
    try {
      await resendVerification(email);
      toast.success("A new code has been sent");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not resend code"));
    } finally {
      setResending(false);
    }
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
          disabled={code.length !== 6 || submitting}
          className="btn-primary btn w-full min-h-10 text-sm font-medium"
        >
          {submitting ? "Verifying…" : "Verify email"}
        </button>
      </form>

      <p className="text-center text-sm text-muted">
        Didn't receive a code?{" "}
        <button
          type="button"
          disabled={resending}
          className="text-main underline underline-offset-2 disabled:opacity-50"
          onClick={handleResend}
        >
          {resending ? "Sending…" : "Resend"}
        </button>
      </p>
    </div>
  );
}
