import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/landing";
import {
  Login,
  Register,
  VerifyEmail,
  ForgotPassword,
  ResetPassword,
} from "./pages/auth";
import { Projects } from "./pages/dashboard";
import { Toaster } from "sonner";
import { ScrollToTop } from "./components/common";
import {
  AuthLayout,
  DashboardLayout,
  LandingLayout,
  ProjectLayout,
} from "./layouts";
import {
  FormDetails,
  ProjectApiKeys,
  ProjectForms,
  ProjectOtp,
  ProjectOverview,
  ProjectSettings,
  ProjectSubmissions,
  ProjectWaitlist,
  ProjectWebhooks,
} from "./pages/dashboard/project";
import {
  AuthBootstrap,
  GuestRoute,
  ProtectedRoute,
} from "./components/auth/route-guards";

export default function App() {
  return (
    <AuthBootstrap>
      <ScrollToTop />
      <Toaster richColors theme="dark" position="top-center" />
      <Routes>
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route element={<GuestRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Projects />} />
            <Route path="projects/:projectId" element={<ProjectLayout />}>
              <Route index element={<ProjectOverview />} />
              <Route path="forms" element={<ProjectForms />} />
              <Route path="forms/:formId" element={<FormDetails />} />
              <Route path="submissions" element={<ProjectSubmissions />} />
              <Route path="otp" element={<ProjectOtp />} />
              <Route path="waitlist" element={<ProjectWaitlist />} />
              <Route path="webhooks" element={<ProjectWebhooks />} />
              <Route path="api-keys" element={<ProjectApiKeys />} />
              <Route path="settings" element={<ProjectSettings />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </AuthBootstrap>
  );
}
