
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Users, Shield, AlertTriangle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Agreement to Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                By accessing and using Roomlix, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, 
                please do not use this service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Roomlix is a cloud-based hotel management platform that provides:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Room management and status tracking</li>
                <li>Guest request management</li>
                <li>Staff coordination tools</li>
                <li>Reservation and calendar management</li>
                <li>Access code generation for guests</li>
                <li>Analytics and reporting features</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                User Accounts and Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Account Security</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>You are responsible for maintaining the confidentiality of your account</li>
                  <li>You must notify us immediately of any unauthorized access</li>
                  <li>You are responsible for all activities under your account</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Acceptable Use</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Use the service only for lawful purposes</li>
                  <li>Do not attempt to gain unauthorized access to our systems</li>
                  <li>Do not interfere with other users' use of the service</li>
                  <li>Do not use the service to transmit harmful or malicious content</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Subscription and Payment Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Free Tier</h3>
                  <p className="text-muted-foreground">
                    We offer a free tier with basic functionality for small hotels. 
                    Free accounts may have usage limitations and reduced features.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Premium Plans</h3>
                  <p className="text-muted-foreground">
                    Premium subscriptions unlock advanced features, increased limits, 
                    and priority support. Billing is monthly or annually as selected.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Cancellation</h3>
                  <p className="text-muted-foreground">
                    You may cancel your subscription at any time. Service will continue 
                    until the end of your current billing period.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Data and Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your data belongs to you. We provide tools to export your data and 
                will delete your information upon account closure as required by law. 
                See our Privacy Policy for detailed information about data handling.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service. 
                We may perform maintenance that temporarily affects availability, with advance 
                notice when possible.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Roomlix shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages resulting from your use of or 
                inability to use the service. Our total liability shall not exceed 
                the amount paid by you in the 12 months prior to the claim.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may modify these terms at any time. We will notify users of significant 
                changes via email or platform notifications. Continued use after changes 
                constitutes acceptance of the new terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                For questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 space-y-2">
                <p className="font-medium">Email: legal@roomlix.com</p>
                <p className="font-medium">Support: support@roomlix.com</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
