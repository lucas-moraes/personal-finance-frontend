import { Navbar } from "@/components/team/navbar";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useHolidays } from "@/tanstack-queries/holidays";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import type { DayButtonProps } from "react-day-picker";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

const holidayNamesMap: Record<string, string> = {};

function HolidayDayButton({ className, day, modifiers, ...props }: DayButtonProps) {
  const isHoliday = modifiers.holiday;
  const isToday = modifiers.today;
  const isOutside = day.outside;
  const holidayName = isHoliday ? holidayNamesMap[day.date.toDateString()] : undefined;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "hover:bg-purple-500/20 rounded-md aspect-square flex flex-col items-center justify-center text-sm font-medium relative",
            isToday && "bg-purple-600 text-white font-bold",
            isHoliday && "bg-red-600/40 hover:bg-red-600/60 text-red-100 font-medium",
            isOutside && "text-slate-500",
            !isOutside && !isHoliday && !isToday && "text-white",
            className
          )}
          {...props}
        >
          {day.date.getDate()}
          {isHoliday && <span className="absolute inset-0 rounded-md border border-red-500/50" />}
        </Button>
      </TooltipTrigger>
      {isHoliday && holidayName && (
        <TooltipContent className="bg-slate-800 text-white border-slate-700">
          {holidayName}
        </TooltipContent>
      )}
    </Tooltip>
  );
}

function AppLayout() {
  const currentYear = new Date().getFullYear();
  const { data: holidays = [] } = useHolidays(currentYear);

  const holidayDates = holidays.map((h) => {
    const [year, month, day] = h.date.split("-").map(Number);
    return new Date(year, month - 1, day);
  });
  for (const h of holidays) {
    const [year, month, day] = h.date.split("-").map(Number);
    const dateKey = new Date(year, month - 1, day).toDateString();
    holidayNamesMap[dateKey] = h.name;
  }

  return (
    <div className="relative flex flex-row min-h-screen">
      <Navbar />
      <main className="m-10 justify-center flex flex-1 position-relative">
        <div className="flex flex-row gap-4">
          <Calendar
            mode="single"
            selected={new Date()}
            modifiers={{ holiday: holidayDates }}
            weekStartsOn={0}
            className="position-sticky top-10 h-max border border-purple-400/30 rounded-md bg-slate-950/50 p-4"
            classNames={{
              weekday: "text-purple-300 text-xs font-normal",
              day_button: "text-white hover:bg-purple-500/20 rounded-md",
              outside: "text-slate-100 opacity-30",
              today: "rounde-md text-white font-bold",
              caption_label: "text-white font-medium",
              button_previous: "text-purple-300 hover:bg-purple-500/20",
              button_next: "text-purple-300 hover:bg-purple-500/20",
            }}
            components={{
              DayButton: HolidayDayButton,
            }}
          />
          <Outlet />
        </div>
      </main>
    </div>
  );
}

