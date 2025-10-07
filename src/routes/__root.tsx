import { IconHome } from "@/components/icons/icon-home";
import { IconMetrics } from "@/components/icons/icon-metrics";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <div className="flex flex-row min-h-screen">
    <div className="min-h-screen w-20 bg-gray-800 flex flex-col justify-center items-center space-y-6 text-white">
      <Link to="/"></Link>

      <Tooltip>
        <TooltipTrigger asChild>
          <Link to="/home" className="flex flex-col items-center space-y-2">
            <IconHome />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-sm">
          <p>Home</p>
        </TooltipContent>
      </Tooltip>

        <Tooltip>
        <TooltipTrigger asChild>
          <Link to="/metrics" className="flex flex-col items-center space-y-2">
            <IconMetrics />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-sm bg">
          <p>Metrics</p>
        </TooltipContent>
      </Tooltip>
    </div>
    <main className="max-w-5xl mx-auto">
      <Outlet />
    </main>
  </div>
);

export const Route = createRootRoute({ component: RootLayout });
