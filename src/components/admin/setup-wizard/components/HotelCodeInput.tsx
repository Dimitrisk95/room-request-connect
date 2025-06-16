
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw, Info } from "lucide-react";
import { Control } from "react-hook-form";

interface HotelCodeInputProps {
  control: Control<any>;
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  disabled?: boolean;
}

const HotelCodeInput = ({ control, value, onChange, onGenerate, disabled }: HotelCodeInputProps) => {
  return (
    <FormField
      control={control}
      name="hotelCode"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base font-medium">Hotel Connection Code *</FormLabel>
          <FormControl>
            <div className="flex gap-2">
              <Input 
                placeholder="e.g., GrandPlaza2024" 
                className="h-12 font-mono flex-1"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  onChange(e.target.value);
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-12 w-12"
                onClick={onGenerate}
                disabled={disabled}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </FormControl>
          <FormDescription className="flex items-start space-x-2 text-sm">
            <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <span>
              This unique code allows guests to connect to your hotel. Use only letters and numbers (no spaces). If the code is already taken, we'll generate a unique one automatically.
            </span>
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default HotelCodeInput;
