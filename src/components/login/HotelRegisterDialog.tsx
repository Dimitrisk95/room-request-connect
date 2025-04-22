
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AdminRegistrationForm from "./AdminRegistrationForm";
import AdminLoginForm from "./AdminLoginForm";
import { Hotel, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const HotelRegisterDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"register" | "login">("register");

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
              <span>Hotel Admin</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="register">Register Admin</TabsTrigger>
            <TabsTrigger value="login">Admin Login</TabsTrigger>
          </TabsList>
          <TabsContent value="register">
            <AdminRegistrationForm
              onRegistered={() => {
                setTab("login");
              }}
              onCancel={() => setOpen(false)}
            />
          </TabsContent>
          <TabsContent value="login">
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
