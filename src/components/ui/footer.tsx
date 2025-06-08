
import React from "react";
import { Link } from "react-router-dom";
import { Building, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Building className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Roomlix</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Complete hotel management platform for modern hospitality operations.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/features" className="hover:text-foreground">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
              <li><Link to="/integrations" className="hover:text-foreground">Integrations</Link></li>
              <li><Link to="/api" className="hover:text-foreground">API</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/help" className="hover:text-foreground">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">Contact Us</Link></li>
              <li><Link to="/status" className="hover:text-foreground">System Status</Link></li>
              <li><Link to="/security" className="hover:text-foreground">Security</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-foreground">Cookie Policy</Link></li>
              <li><Link to="/gdpr" className="hover:text-foreground">GDPR</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 mt-8 border-t">
          <p className="text-sm text-muted-foreground">
            © 2024 Roomlix. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>support@roomlix.com</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>1-800-ROOMLIX</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
