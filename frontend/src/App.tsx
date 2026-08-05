import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/landing";
import { Toaster } from "sonner";
import { ScrollToTop } from "./components/common";
import { LandingLayout } from "./layouts";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Toaster richColors theme="dark" />
      <Routes>
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </>
  );
}
