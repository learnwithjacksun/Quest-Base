import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { FormField } from "@/components/auth";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/schemas";
import { forgotPassword } from "@/api/auth";
import { getErrorMessage } from "@/lib/api";

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(values: ForgotPasswordValues) {
    try {
      await forgotPassword(values.email);
      toast.success("If an account exists, a reset link has been sent");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to send reset link"));
    }
  }

  return (
    <div className="w-full max-w-90 mx-auto space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-main">Forgot password</h1>
        <p className="text-sm text-muted">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary btn w-full min-h-10 text-sm font-medium"
        >
          {isSubmitting ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <p className="text-center text-sm text-muted">
        Remembered your password?{" "}
        <Link to="/login" className="text-main underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </div>
  );
}
