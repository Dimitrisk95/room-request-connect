
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import HotelCodeInput from "./HotelCodeInput";

interface HotelBasicInfoFormProps {
  control: Control<any>;
  onValueChange: (field: string, value: string) => void;
  onGenerateCode: () => void;
  hotelName: string;
}

const HotelBasicInfoForm = ({ control, onValueChange, onGenerateCode, hotelName }: HotelBasicInfoFormProps) => {
  return (
    <div className="grid gap-4">
      <FormField
        control={control}
        name="hotelName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">Hotel Name *</FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., Grand Plaza Hotel" 
                className="h-12"
                {...field} 
                onChange={(e) => {
                  field.onChange(e);
                  onValueChange("hotelName", e.target.value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <HotelCodeInput
        control={control}
        value={control._defaultValues.hotelCode}
        onChange={(value) => onValueChange("hotelCode", value)}
        onGenerate={onGenerateCode}
        disabled={!hotelName}
      />
    </div>
  );
};

export default HotelBasicInfoForm;
