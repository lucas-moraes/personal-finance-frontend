import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <>
    <div>
      <Link to="/"></Link>
      <Link to="/home">Home</Link>
      <Link to="/metrics">Metrics</Link>
    </div>
    <Outlet />
  </>
);

export const Route = createRootRoute({component: RootLayout});
