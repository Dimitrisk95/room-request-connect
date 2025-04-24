
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AdminRegistrationForm from "./AdminRegistrationForm";
import AdminLoginForm from "./AdminLoginForm";
import { Hotel } from "lucide-react";
import { Button } from "@/components/ui/button";

const HotelRegisterDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"register" | "login">("register");

  // This function handles the type conversion for tab changing
  const handleTabChange = (value: string) => {
    // Only set the tab state if the value is one of our allowed values
    if (value === "register" || value === "login") {
      setTab(value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10"
        >
          <Hotel className="mr-2 h-5 w-5" />
          Hotel Register
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <Hotel className="h-6 w-6 text-primary" />
              <span>Hotel Admin Portal</span>
            </div>
          </DialogTitle>
          <DialogDescription>
            Register as a hotel administrator or login to your existing account.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="register" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Register Admin
            </TabsTrigger>
            <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Admin Login
            </TabsTrigger>
          </TabsList>
          <TabsContent value="register" className="mt-4 space-y-4">
            <AdminRegistrationForm
              onRegistered={() => {
                setTab("login");
              }}
              onCancel={() => setOpen(false)}
            />
          </TabsContent>
          <TabsContent value="login" className="mt-4 space-y-4">
            <AdminLoginForm
              onSuccess={() => setOpen(false)}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default HotelRegisterDialog;
