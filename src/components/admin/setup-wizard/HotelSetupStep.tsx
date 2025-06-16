import { useState, useEffect } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Hotel, ArrowRight, Info, RefreshCw } from "lucide-react";
import { SetupData } from "../SetupWizard";
import { generateHotelCode } from "@/utils/codeGenerator";

const formSchema = z.object({
  hotelName: z.string().min(1, "Hotel name is required"),
  hotelCode: z.string()
    .min(3, "Hotel code must be at least 3 characters")
    .max(20, "Hotel code cannot exceed 20 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Hotel code can only contain letters and numbers (no spaces or special characters)"),
  address: z.string().optional(),
  contactEmail: z.string().email("Enter a valid email").optional().or(z.string().length(0)),
  contactPhone: z.string().optional(),
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
      hotelCode: hotelData.hotelCode || "",
      address: hotelData.address || "",
      contactEmail: hotelData.contactEmail || "",
      contactPhone: hotelData.contactPhone || "",
    },
    mode: "onChange"
  });

  // Auto-generate hotel code when hotel name changes
  useEffect(() => {
    const hotelName = form.watch("hotelName");
    if (hotelName && !form.getValues("hotelCode")) {
      const generatedCode = generateHotelCode(hotelName);
      form.setValue("hotelCode", generatedCode);
      updateHotelData({ hotelCode: generatedCode });
    }
  }, [form.watch("hotelName")]);

  // Handle real-time updates of the form data
  const handleValueChange = (field: keyof FormValues, value: string) => {
    if (field === "hotelName") {
      updateHotelData({ name: value });
    } else if (field === "hotelCode") {
      updateHotelData({ hotelCode: value });
    } else if (field === "address") {
      updateHotelData({ address: value });
    } else if (field === "contactEmail") {
      updateHotelData({ contactEmail: value });
    } else if (field === "contactPhone") {
      updateHotelData({ contactPhone: value });
    }
  };

  const handleGenerateNewCode = () => {
    const hotelName = form.getValues("hotelName");
    if (hotelName) {
      const newCode = generateHotelCode(hotelName);
      form.setValue("hotelCode", newCode);
      updateHotelData({ hotelCode: newCode });
    }
  };

  const handleFormSubmit = (values: FormValues) => {
    console.log("Form values validated:", values);
    setFormSubmitted(true);
    updateHotelData({
      name: values.hotelName,
      hotelCode: values.hotelCode,
      address: values.address || "",
      contactEmail: values.contactEmail || "",
      contactPhone: values.contactPhone || "",
    });
    
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 text-primary mb-4">
          <Hotel className="h-8 w-8" />
          <h2 className="text-2xl font-semibold">Create Your Hotel</h2>
        </div>
        <p className="text-muted-foreground">
          Let's start with the basic information about your hotel. You can always update this later.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid gap-4">
            <FormField
              control={form.control}
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
                          handleValueChange("hotelCode", e.target.value);
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-12 w-12"
                        onClick={handleGenerateNewCode}
                        disabled={!form.getValues("hotelName")}
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
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Contact Information (Optional)</h3>
            <div className="grid gap-4">
              <FormField
                control={form.control}
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
                          handleValueChange("address", e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
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
                          placeholder="+1 (555) 123-4567"
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
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Button 
              type="submit" 
              className="w-full h-12 text-base" 
              disabled={isLoading}
            >
              Continue to Review
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </form>
      </Form>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          * Required fields
        </p>
      </div>
    </div>
  );
};

export default HotelSetupStep;
