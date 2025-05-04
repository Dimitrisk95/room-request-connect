
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Hotel, Loader2, Info, ArrowRight } from "lucide-react";
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
  onSubmit: () => void;
  onNext: () => void;
  isLoading: boolean;
  hotelCreated: boolean;
}

const HotelSetupStep: React.FC<HotelSetupStepProps> = ({
  hotelData,
  updateHotelData,
  onSubmit,
  onNext,
  isLoading,
  hotelCreated
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hotelName: hotelData.name || "",
      address: hotelData.address || "",
      contactEmail: hotelData.contactEmail || "",
      contactPhone: hotelData.contactPhone || "",
      hotelCode: hotelData.hotelCode || ""
    },
  });

  const handleSubmit = (values: FormValues) => {
    updateHotelData({
      name: values.hotelName,
      address: values.address || "",
      contactEmail: values.contactEmail || "",
      contactPhone: values.contactPhone || "",
      hotelCode: values.hotelCode
    });
    
    onSubmit();
  };

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
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="hotelName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hotel Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your hotel name" {...field} />
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
                  <Input placeholder="Hotel address (optional)" {...field} />
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
            {!hotelCreated ? (
              <Button 
                type="submit" 
                className="w-full flex items-center justify-center gap-2" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Hotel...
                  </>
                ) : (
                  <>
                    Create Hotel
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            ) : (
              <Button 
                type="button" 
                className="w-full" 
                onClick={onNext}
              >
                Continue to Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="text-xs text-muted-foreground text-center">
        * Required field
      </div>
    </div>
  );
};

export default HotelSetupStep;
