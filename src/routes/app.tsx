import { Navbar } from "@/components/team/navbar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="relative flex flex-row min-h-screen">
      <Navbar />
      <main className="m-10 justify-center flex flex-1">
        <Outlet />
      </main>
    </div>
  );
}

