import type React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export const InputSelect: React.FC<{
  className?: string;
  placeholder: string;
  value?: string;
  options: Array<{ value: string; label: string }>;
  onSelect: (opt: string) => void;
}> = ({ className, placeholder, options, value, onSelect }) => {
  return (
    <Select value={value} onValueChange={onSelect}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
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
