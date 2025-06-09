
import React from "react";
import { Route } from "react-router-dom";
import GuestView from "@/pages/GuestView";

export const GuestRoutes: React.FC = () => {
  return (
    <>
      <Route path="/guest/:roomCode" element={<GuestView />} />
    </>
  );
};
