import { createRootRoute, Outlet } from "@tanstack/react-router";
import DarkVeil from "@/components/ui/dark-veil";
//import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <div className="relative min-h-screen">
    <DarkVeil />
    <>
      <Outlet />
    </>
  </div>
);

export const Route = createRootRoute({ component: RootLayout });
