import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { FormField } from "@/components/auth";
import { resetPasswordSchema, type ResetPasswordValues } from "@/schemas";
import { resetPassword } from "@/api/auth";
import { getErrorMessage } from "@/lib/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: ResetPasswordValues) {
    if (!token) {
      toast.error("Reset token is missing or invalid");
      return;
    }
    try {
      await resetPassword({ token, password: values.password });
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to reset password"));
    }
  }

  return (
    <div className="w-full max-w-90 mx-auto space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-main">Reset password</h1>
        <p className="text-sm text-muted">Choose a new password for your account.</p>
      </div>

      {!token ? (
        <p className="text-sm text-red-500">
          This reset link is invalid. Request a new one from the{" "}
          <Link to="/forgot-password" className="underline underline-offset-2">
            forgot password
          </Link>{" "}
          page.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField
            label="New password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <FormField
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary btn w-full min-h-10 text-sm font-medium"
          >
            {isSubmitting ? "Saving…" : "Reset password"}
          </button>
        </form>
      )}

      <p className="text-center text-sm text-muted">
        <Link to="/login" className="text-main underline underline-offset-2">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
