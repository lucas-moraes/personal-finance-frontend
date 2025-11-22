import * as React from "react";

import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

function Input({ className, type, isLoading, ...props }: React.ComponentProps<"input"> & { isLoading?: boolean }) {
  return (
    <>
      {isLoading ? (
        <div className="flex items-center gap-2 px-3 py-2 rounded-md w-full text-slate-400 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50">
          <Spinner className="size-4" />
          <span className="text-slate-400">Loading...</span>
        </div>
      ) : (
        <input
          type={type}
          data-slot="input"
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            className,
          )}
          {...props}
        />
      )}
    </>
  );
}

export { Input };
