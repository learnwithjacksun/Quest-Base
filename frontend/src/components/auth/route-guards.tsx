import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/auth-store";
import { refreshSession } from "@/api/auth";

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const bootstrapped = useAuthStore((s) => s.bootstrapped);
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);
  const setBootstrapped = useAuthStore((s) => s.setBootstrapped);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const data = await refreshSession();
        if (!cancelled) {
          setSession(data.accessToken, data.user);
        }
      } catch {
        if (!cancelled) clearSession();
      } finally {
        if (!cancelled) setBootstrapped(true);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [setSession, clearSession, setBootstrapped]);

  if (!bootstrapped) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background text-muted text-sm">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}

export function ProtectedRoute() {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export function GuestRoute() {
  const user = useAuthStore((s) => s.user);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
