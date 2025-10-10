import { Link } from "@tanstack/react-router";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { IconHome } from "../icons/icon-home";
import { IconMetrics } from "../icons/icon-metrics";
import { GlassCard } from "@developer-hub/liquid-glass";

export const Navbar = () => {
  return (
    <GlassCard
      displacementScale={100}
      blurAmount={0.01}
      shadowMode={true}
      className="max-w-md mx-auto border-white/20 shadow-none"
    >
      <div
        className="min-h-screen w-20 flex flex-col justify-center items-center space-y-6 text-white  border-white/20 shadow-none">
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
    </GlassCard>
  );
};
