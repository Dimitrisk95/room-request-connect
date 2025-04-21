
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, LogIn, User, Info, Menu } from "lucide-react";

export default function DrawerNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  // Identify which link is active by path
  const links = [
    {
      label: "Home",
      icon: <Home className="mr-2" />,
      route: "/",
      active: location.pathname === "/"
    },
    {
      label: "Guest Access",
      icon: <User className="mr-2" />,
      route: "/login?mode=guest",
      active: location.pathname === "/login" && location.search.includes("mode=guest")
    },
    {
      label: "Staff Login",
      icon: <LogIn className="mr-2" />,
      route: "/login?mode=staff",
      active: location.pathname === "/login" && location.search.includes("mode=staff")
    },
    {
      label: "Hotel Info",
      icon: <Info className="mr-2" />,
      route: "#", // Placeholder, functionality will come later
      active: false
    }
  ];

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="fixed left-4 top-4 z-50 md:hidden"
          size="icon"
          aria-label="Open navigation menu"
        >
          <Menu />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="flex flex-col gap-0 w-64 max-w-full md:w-80">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <span className="text-lg font-bold">Room Request Connect</span>
          </DrawerTitle>
          <DrawerDescription className="text-muted-foreground">
            Navigate
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-1 px-3 pb-4">
          {links.map((link) => (
            <Button
              key={link.label}
              variant={link.active ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                if (link.route !== "#") navigate(link.route);
              }}
              disabled={link.route === "#"}
              aria-current={link.active ? "page" : undefined}
            >
              {link.icon}
              {link.label}
            </Button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
