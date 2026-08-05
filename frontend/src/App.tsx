import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/landing";
import { Login, Register, VerifyEmail } from "./pages/auth";
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

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Toaster richColors theme="dark" />
      <Routes>
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Route>
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
      </Routes>
    </>
  );
}
