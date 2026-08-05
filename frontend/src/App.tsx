import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/landing";
import { Login, Register, VerifyEmail } from "./pages/auth";
import { Toaster } from "sonner";
import { ScrollToTop } from "./components/common";
import { AuthLayout, LandingLayout } from "./layouts";

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
      </Routes>
    </>
  );
}
