
export const handleSuccessfulRedirect = (hotelId: string): void => {
  localStorage.setItem("pendingHotelId", hotelId);
  
  setTimeout(() => {
    console.log("[Hotel Setup] Redirecting to admin dashboard with page reload");
    window.location.href = "/admin-dashboard";
  }, 1500);
};
