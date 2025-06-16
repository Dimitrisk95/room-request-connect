
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface HotelContactInfoFormProps {
  control: Control<any>;
  onValueChange: (field: string, value: string) => void;
}

const HotelContactInfoForm = ({ control, onValueChange }: HotelContactInfoFormProps) => {
  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-medium mb-4">Contact Information (Optional)</h3>
      <div className="grid gap-4">
        <FormField
          control={control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hotel Address</FormLabel>
              <FormControl>
                <Input 
                  placeholder="123 Main Street, City, State" 
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    onValueChange("address", e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="contact@hotel.com" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      onValueChange("contactEmail", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Phone</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="+1 (555) 123-4567"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      onValueChange("contactPhone", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default HotelContactInfoForm;
