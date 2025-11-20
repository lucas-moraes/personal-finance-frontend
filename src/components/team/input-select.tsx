import type React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Spinner } from "../ui/spinner";

export const InputSelect: React.FC<{
  className?: string;
  placeholder: string;
  value?: string;
  options: Array<{ value: string; label: string }>;
  onSelect: (opt: string) => void;
  isLoading?: boolean;
}> = ({ className, placeholder, options, value, onSelect, isLoading = false }) => {
  return (
    <Select value={value} onValueChange={onSelect} disabled={isLoading}>
      <SelectTrigger className={className}>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Spinner className="size-4" />
            <span className="text-muted-foreground">Loading...</span>
          </div>
        ) : (
          <SelectValue placeholder={placeholder} />
        )}
      </SelectTrigger>
      <SelectContent>
        {options.length > 0 &&
          options.map((opt: { value: string; label: string }) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};
