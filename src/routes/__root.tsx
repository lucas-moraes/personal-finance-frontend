import { createRootRoute, Outlet } from "@tanstack/react-router";
import DarkVeil from "@/components/dark-veil";
import { Navbar } from "@/components/navbar";
//import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <div className="relative flex flex-row min-h-screen">
    <DarkVeil />
    <Navbar />
    <main className="max-w-5xl mx-auto">
      <Outlet />
    </main>
  </div>
);

export const Route = createRootRoute({ component: RootLayout });
