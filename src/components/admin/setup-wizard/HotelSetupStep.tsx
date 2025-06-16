
import { useState, useEffect } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Hotel, ArrowRight } from "lucide-react";
import { SetupData } from "../SetupWizard";
import { generateHotelCode } from "@/utils/codeGenerator";
import HotelBasicInfoForm from "./components/HotelBasicInfoForm";
import HotelContactInfoForm from "./components/HotelContactInfoForm";

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
          <HotelBasicInfoForm
            control={form.control}
            onValueChange={handleValueChange}
            onGenerateCode={handleGenerateNewCode}
            hotelName={form.getValues("hotelName")}
          />

          <HotelContactInfoForm
            control={form.control}
            onValueChange={handleValueChange}
          />

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
