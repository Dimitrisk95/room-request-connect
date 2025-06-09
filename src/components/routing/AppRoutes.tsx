
import React from "react";
import { Routes, Route } from "react-router-dom";
import { PublicRoutes } from "./PublicRoutes";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { AdminRoutes } from "./AdminRoutes";
import { GuestRoutes } from "./GuestRoutes";
import NotFound from "@/pages/NotFound";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <PublicRoutes />
      <ProtectedRoutes />
      <AdminRoutes />
      <GuestRoutes />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
