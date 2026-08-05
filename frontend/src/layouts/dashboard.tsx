import { Outlet } from "react-router-dom";
import { Header } from "@/components/dashboard";

export default function DashboardLayout() {
  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
