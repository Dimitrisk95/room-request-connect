
import React, { useState } from "react";
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
        <DialogHeader className="text-center sm:text-left">
          <DialogTitle>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <div className="p-2 rounded-full bg-primary/10">
                <Hotel className="h-6 w-6 text-primary" />
              </div>
              <span>Hotel Admin Portal</span>
            </div>
          </DialogTitle>
          <DialogDescription>
            Register as a hotel administrator or login to your existing account.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4 rounded-lg p-1 bg-muted/60">
            <TabsTrigger 
              value="register" 
              className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              Register Admin
            </TabsTrigger>
            <TabsTrigger 
              value="login" 
              className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              Admin Login
            </TabsTrigger>
          </TabsList>
          <div className="p-1 mt-2">
            <TabsContent value="register" className="mt-0 space-y-4 animate-in fade-in-50 duration-200">
              <AdminRegistrationForm
                onRegistered={() => {
                  setTab("login");
                }}
                onCancel={() => setOpen(false)}
              />
            </TabsContent>
            <TabsContent value="login" className="mt-0 space-y-4 animate-in fade-in-50 duration-200">
              <AdminLoginForm
                onSuccess={() => setOpen(false)}
              />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default HotelRegisterDialog;
