import { Footer, Header } from "@/components/landing";
import { Outlet } from "react-router-dom";

export default function LandingLayout() {
  return (
    <>
      <Header />
      <main className="min-h-dvh main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
