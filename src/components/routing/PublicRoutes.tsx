
import React from "react";
import { Route } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import GuestConnect from "@/pages/GuestConnect";
import AdminSetup from "@/pages/AdminSetup";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";

export const PublicRoutes: React.FC = () => {
  return (
    <>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/guest-connect" element={<GuestConnect />} />
      <Route path="/setup" element={<AdminSetup />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
    </>
  );
};
