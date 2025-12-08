"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "./spinner";

function formatDateBR(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function Datepicker({
  selected,
  isLoading = false,
  onSelect,
}: {
  selected?: Date;
  isLoading?: boolean;
  onSelect: (date: Date | undefined) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  React.useEffect(() => {
    if (selected) {
      setDate(selected);
    }
  }, [selected]);

  return (
    <div className="flex flex-col gap-3 mt-1">
      <Label htmlFor="date" className="px-1">
        Date
      </Label>
      {isLoading ? (
        <div className="flex items-center gap-2 px-3 py-2 rounded-md w-full text-slate-400 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50">
          <Spinner className="size-4" />
          <span className="text-slate-400">Loading...</span>
        </div>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" id="date" className="w-full justify-between font-normal cursor-pointer">
              {date ? formatDateBR(date) : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              endMonth={new Date(new Date().getFullYear() + 1, 11)} // Dezembro do próximo ano
              onSelect={(date) => {
                setDate(date);
                setOpen(false);
                onSelect(date);
              }}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
