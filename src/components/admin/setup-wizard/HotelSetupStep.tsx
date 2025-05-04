
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Hotel, ArrowRight, Info } from "lucide-react";
import { SetupData } from "../SetupWizard";
import NavigationButtons from "./NavigationButtons";

const formSchema = z.object({
  hotelName: z.string().min(1, "Hotel name is required"),
  address: z.string().optional(),
  contactEmail: z.string().email("Enter a valid email").optional().or(z.string().length(0)),
  contactPhone: z.string().optional(),
  hotelCode: z.string()
    .min(3, "Hotel code must be at least 3 characters")
    .max(20, "Hotel code cannot exceed 20 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Hotel code can only contain letters and numbers (no spaces or special characters)")
});

type FormValues = z.infer<typeof formSchema>;

interface HotelSetupStepProps {
  hotelData: SetupData["hotel"];
  updateHotelData: (data: Partial<SetupData["hotel"]>) => void;
  onNext: () => void;
  isLoading: boolean;
  hotelCreated: boolean;
}

const HotelSetupStep: React.FC<HotelSetupStepProps> = ({
  hotelData,
  updateHotelData,
  onNext,
  isLoading,
  hotelCreated
}) => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hotelName: hotelData.name || "",
      address: hotelData.address || "",
      contactEmail: hotelData.contactEmail || "",
      contactPhone: hotelData.contactPhone || "",
      hotelCode: hotelData.hotelCode || ""
    },
    mode: "onChange"
  });

  // Handle real-time updates of the form data
  const handleValueChange = (field: keyof FormValues, value: string) => {
    if (field === "hotelName") {
      updateHotelData({ name: value });
    } else if (field === "address") {
      updateHotelData({ address: value });
    } else if (field === "contactEmail") {
      updateHotelData({ contactEmail: value });
    } else if (field === "contactPhone") {
      updateHotelData({ contactPhone: value });
    } else if (field === "hotelCode") {
      updateHotelData({ hotelCode: value });
    }
  };

  const handleFormSubmit = (values: FormValues) => {
    console.log("Form values validated:", values);
    setFormSubmitted(true);
    updateHotelData({
      name: values.hotelName,
      address: values.address || "",
      contactEmail: values.contactEmail || "",
      contactPhone: values.contactPhone || "",
      hotelCode: values.hotelCode
    });
    
    onNext(); // Go to next step instead of creating the hotel immediately
  };

  console.log("Current form state:", { 
    values: form.getValues(),
    errors: form.formState.errors,
    isDirty: form.formState.isDirty,
    isValid: form.formState.isValid
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 text-primary">
        <Hotel className="h-6 w-6" />
        <h2 className="text-xl font-semibold">Hotel Information</h2>
      </div>
      
      <p className="text-muted-foreground">
        Let's get started by setting up your hotel. Please provide the basic information below.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="hotelName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hotel Name*</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your hotel name" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      handleValueChange("hotelName", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Hotel address (optional)" 
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleValueChange("address", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="contact@example.com (optional)" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      handleValueChange("contactEmail", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Phone</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Phone number (optional)"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleValueChange("contactPhone", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hotelCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hotel Connection Code*</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="ParadiseHotel123" 
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleValueChange("hotelCode", e.target.value);
                    }}
                  />
                </FormControl>
                <FormDescription className="flex items-start space-x-2 text-xs">
                  <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span>
                    This unique code will be used by guests to connect to your hotel. 
                    Use only letters and numbers without spaces (e.g., ParadiseHotel, GrandResort123).
                  </span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full flex items-center justify-center gap-2" 
              disabled={isLoading}
            >
              Next Step
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          {formSubmitted && form.formState.errors.hotelName && (
            <p className="text-sm font-medium text-destructive mt-2">
              Please fill in the hotel name field to continue.
            </p>
          )}
        </form>
      </Form>

      <div className="text-xs text-muted-foreground text-center">
        * Required field
      </div>
    </div>
  );
};

export default HotelSetupStep;
