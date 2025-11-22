import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";

export const InputCurrency: React.FC<{
  currency: string;
  isLoading?: boolean;
  placeholder: string;
  value: string;
  onChange: (e: HTMLInputElement) => void;
}> = ({ currency, isLoading, placeholder, value, onChange }) => {
  return (
    <InputGroup>
      {isLoading ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-md w-full text-slate-400 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50">
            <Spinner className="size-4" />
            <span className="text-slate-400">Loading...</span>
          </div>
      ) : (
        <>
          <InputGroupAddon>
            <InputGroupText>{currency}</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            className="pb-1"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target as HTMLInputElement)}
          />
        </>
      )}
    </InputGroup>
  );
};
