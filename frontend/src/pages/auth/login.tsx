import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FormField, GoogleButton } from "@/components/auth";
import { loginSchema, type LoginValues } from "@/schemas";
import { loginUser } from "@/api/auth";
import { getErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((s) => s.setSession);
  const from =
    (location.state as { from?: string } | null)?.from || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginValues) {
    try {
      const data = await loginUser(values);
      setSession(data.accessToken, data.user);
      toast.success(`Welcome back, ${data.user.firstName}`);
      navigate(from, { replace: true });
    } catch (error) {
      const err = error as {
        response?: { data?: { code?: string } };
      };
      if (err.response?.data?.code === "EMAIL_NOT_VERIFIED") {
        toast.error("Please verify your email first");
        navigate("/verify-email", { state: { email: values.email } });
        return;
      }
      toast.error(getErrorMessage(error, "Unable to sign in"));
    }
  }

  return (
    <div className="w-full max-w-90 mx-auto space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-main">Welcome back</h1>
        <p className="text-sm text-muted">Sign in to your account</p>
      </div>

      <div className="space-y-5">
        <GoogleButton />

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-line" />
          <span className="text-xs text-muted">or</span>
          <span className="h-px flex-1 bg-line" />
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

          <div className="space-y-2">
            <FormField
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register("password")}
            />
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs text-muted hover:text-main underline underline-offset-2"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary btn w-full min-h-10 text-sm font-medium"
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-muted">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-main underline underline-offset-2"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
