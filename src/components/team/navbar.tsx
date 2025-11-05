import { Link } from "@tanstack/react-router";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { GlassCard } from "@developer-hub/liquid-glass";
import { AlignEndHorizontal, CirclePower, House } from "lucide-react";
import { useApi } from "@/service/api";

export const Navbar = () => {
  const { useLogout } = useApi();
  return (
    <GlassCard displacementScale={100} blurAmount={0.01} shadowMode={true} cornerRadius={0}>
      <div className="min-h-screen w-20 flex flex-col relative justify-center items-center space-y-6 text-white shadow-none border-r border-purple-400/10">
        <Link to="/"></Link>
        <CirclePower
          size={20}
          className="absolute top-4 text-red-800 hover:text-red-500 duration-100 cursor-pointer"
          onClick={() => useLogout()}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to="/app/home" className="flex flex-col items-center text-violet-500 ">
              <House size={40} />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-sm">
            <p>Home</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to="/app/metrics" className="flex flex-col items-center text-violet-500">
              <AlignEndHorizontal size={40} />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-sm">
            <p>Metrics</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </GlassCard>
  );
};
