import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FormField, GoogleButton } from "@/components/auth";
import { registerSchema, type RegisterValues } from "@/schemas";
import { registerUser } from "@/api/auth";
import { getErrorMessage } from "@/lib/api";

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: RegisterValues) {
    try {
      await registerUser(values);
      toast.success("Account created. Check your email for a code.");
      navigate("/verify-email", { state: { email: values.email } });
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to create account"));
    }
  }

  return (
    <div className="w-full max-w-90 mx-auto space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-main">Get started</h1>
        <p className="text-sm text-muted">Create a new account</p>
      </div>

      <div className="space-y-5">
        <GoogleButton />

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-line" />
          <span className="text-xs text-muted">or</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="First name"
              type="text"
              placeholder="Ada"
              autoComplete="given-name"
              error={errors.firstName?.message}
              {...register("firstName")}
            />
            <FormField
              label="Last name"
              type="text"
              placeholder="Lovelace"
              autoComplete="family-name"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
          </div>

          <FormField
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />

          <FormField
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary btn w-full min-h-10 text-sm font-medium"
          >
            {isSubmitting ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <p className="text-center text-sm text-muted">
          Have an account?{" "}
          <Link to="/login" className="text-main underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>

      <p className="text-center text-xs text-muted leading-relaxed">
        By continuing, you agree to Quest Base's{" "}
        <a href="#" className="underline underline-offset-2">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-2">
          Privacy Policy
        </a>
        , and to receive periodic emails with updates.
      </p>
    </div>
  );
}
