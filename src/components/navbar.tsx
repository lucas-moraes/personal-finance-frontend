import { Link } from "@tanstack/react-router";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { IconHome } from "./icons/icon-home";
import { IconMetrics } from "./icons/icon-metrics";

export const Navbar = () => {
  return (
    <div
      className="
    absolute min-h-screen w-20 flex flex-col justify-center items-center space-y-6
    text-white backdrop-blur-xl
    bg-gradient-to-b from-white/10 via-white/5 to-white/10
    border-r border-white/10 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.2)]
      "
    >
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
  );
};
