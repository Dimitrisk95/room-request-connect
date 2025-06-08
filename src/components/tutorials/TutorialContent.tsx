
import React from "react";

export const getTutorialSteps = (section: string) => {
  const tutorials = {
    rooms: [
      {
        target: '[data-tutorial="add-reservation"]',
        title: "Add Reservation",
        description: "Click here to add a new reservation for any room. You can select dates, guest information, and room preferences.",
        position: "bottom" as const,
      },
      {
        target: '[data-tutorial="search-rooms"]',
        title: "Search Rooms",
        description: "Use this search bar to quickly find specific rooms by room number or other details.",
        position: "bottom" as const,
      },
      {
        target: '[data-tutorial="room-tabs"]',
        title: "Room Status",
        description: "These tabs help you filter rooms by their current status - vacant, occupied, maintenance, or cleaning.",
        position: "bottom" as const,
      },
    ],
    dashboard: [
      {
        target: '[data-tutorial="dashboard-stats"]',
        title: "Dashboard Overview",
        description: "Here you can see key metrics about your hotel including occupancy rates, total rooms, and revenue.",
        position: "bottom" as const,
      },
      {
        target: '[data-tutorial="recent-requests"]',
        title: "Recent Requests",
        description: "Monitor the latest guest requests that need your attention or have been recently completed.",
        position: "top" as const,
      },
    ],
    calendar: [
      {
        target: '[data-tutorial="calendar-view"]',
        title: "Calendar Navigation",
        description: "Use the calendar to navigate between dates and see reservations for specific days.",
        position: "right" as const,
      },
      {
        target: '[data-tutorial="add-reservation"]',
        title: "Quick Add",
        description: "Quickly add new reservations directly from the calendar view.",
        position: "bottom" as const,
      },
    ],
    requests: [
      {
        target: '[data-tutorial="requests-table"]',
        title: "Manage Requests",
        description: "View and manage all guest requests. You can update status, assign to staff, and respond to guests.",
        position: "top" as const,
      },
    ],
    staff: [
      {
        target: '[data-tutorial="staff-list"]',
        title: "Staff Overview",
        description: "See your team members, their roles, and current task assignments.",
        position: "top" as const,
      },
    ],
    "access-codes": [
      {
        target: '[data-tutorial="access-codes-table"]',
        title: "Room Access Codes",
        description: "Generate and manage secure access codes for each room. Share these codes with guests.",
        position: "top" as const,
      },
    ],
    settings: [
      {
        target: '[data-tutorial="profile-settings"]',
        title: "Profile Settings",
        description: "Update your personal information, password, and account preferences here.",
        position: "right" as const,
      },
    ],
  };

  return tutorials[section as keyof typeof tutorials] || [];
};
