
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Database, Users, Mail, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const PrivacyPolicy = () => {
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
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Our Commitment to Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                At Roomlix, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our hotel management platform.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Personal Information</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Name and email address</li>
                  <li>Hotel information (name, address, contact details)</li>
                  <li>Staff information for user management</li>
                  <li>Guest information for room management</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Usage Information</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Log data and analytics</li>
                  <li>Device information and IP addresses</li>
                  <li>Usage patterns and feature interactions</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Provide and maintain our hotel management services</li>
                <li>Process transactions and manage user accounts</li>
                <li>Send important notifications and updates</li>
                <li>Improve our platform and develop new features</li>
                <li>Ensure security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Data Sharing and Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We do not sell, trade, or rent your personal information to third parties. 
                We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>With your explicit consent</li>
                <li>To comply with legal requirements</li>
                <li>To protect our rights and prevent fraud</li>
                <li>With trusted service providers who assist our operations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">GDPR Rights (EU Users)</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Right to access your personal data</li>
                    <li>Right to rectification of inaccurate data</li>
                    <li>Right to erasure ("right to be forgotten")</li>
                    <li>Right to restrict processing</li>
                    <li>Right to data portability</li>
                    <li>Right to object to processing</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">CCPA Rights (California Users)</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Right to know what personal information is collected</li>
                    <li>Right to delete personal information</li>
                    <li>Right to opt-out of sale of personal information</li>
                    <li>Right to non-discrimination for exercising privacy rights</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cookie className="mr-2 h-5 w-5" />
                Cookies and Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We use essential cookies to provide our services and improve your experience. 
                These include authentication cookies, session management, and basic analytics. 
                You can control cookie settings through your browser preferences.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational security measures to protect 
                your personal information against unauthorized access, alteration, disclosure, or 
                destruction. This includes encryption, secure data transmission, and regular security audits.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy or wish to exercise your rights, 
                please contact us at:
              </p>
              <div className="mt-4 space-y-2">
                <p className="font-medium">Email: privacy@roomlix.com</p>
                <p className="font-medium">Data Protection Officer: dpo@roomlix.com</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
