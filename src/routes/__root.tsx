import { createRootRoute, Outlet } from "@tanstack/react-router";
import DarkVeil from "@/components/ui/dark-veil";
import { Navbar } from "@/components/team/navbar";
//import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <div className="relative flex flex-row min-h-screen">
    <DarkVeil />
    <Navbar />
    <main className="m-10">
      <Outlet />
    </main>
  </div>
);

export const Route = createRootRoute({ component: RootLayout });
