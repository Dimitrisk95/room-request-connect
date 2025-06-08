
import React from "react";
import { Building, Bed, Users, Calendar, MessageSquare, Key, BarChart3, Settings } from "lucide-react";

export const getTutorialContent = (section: string) => {
  const tutorials = {
    dashboard: {
      title: "Welcome to Your Dashboard",
      description: "Your central hub for managing your hotel",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Building className="h-8 w-8 text-primary" />
            <div>
              <h4 className="font-medium">Dashboard Overview</h4>
              <p className="text-sm text-muted-foreground">Monitor occupancy, requests, and daily activities at a glance.</p>
            </div>
          </div>
          <p className="text-sm">This dashboard shows you real-time statistics about your hotel, including room occupancy, pending requests, and today's check-ins/check-outs.</p>
        </div>
      ),
    },
    rooms: {
      title: "Room Management",
      description: "Manage your hotel rooms and availability",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Bed className="h-8 w-8 text-primary" />
            <div>
              <h4 className="font-medium">Room Operations</h4>
              <p className="text-sm text-muted-foreground">Add, edit, and manage room availability and details.</p>
            </div>
          </div>
          <ul className="text-sm space-y-2">
            <li>• Add new rooms with details like room number, type, and amenities</li>
            <li>• Update room status (available, occupied, maintenance)</li>
            <li>• View and manage room reservations</li>
            <li>• Generate QR codes for guest access</li>
          </ul>
        </div>
      ),
    },
    calendar: {
      title: "Calendar & Reservations",
      description: "View and manage bookings and schedules",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Calendar className="h-8 w-8 text-primary" />
            <div>
              <h4 className="font-medium">Booking Management</h4>
              <p className="text-sm text-muted-foreground">Track check-ins, check-outs, and room availability.</p>
            </div>
          </div>
          <ul className="text-sm space-y-2">
            <li>• View monthly calendar of all reservations</li>
            <li>• Add new reservations directly</li>
            <li>• Track check-in and check-out dates</li>
            <li>• Monitor room availability</li>
          </ul>
        </div>
      ),
    },
    requests: {
      title: "Guest Requests",
      description: "Manage and respond to guest service requests",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <MessageSquare className="h-8 w-8 text-primary" />
            <div>
              <h4 className="font-medium">Service Management</h4>
              <p className="text-sm text-muted-foreground">Handle guest requests efficiently.</p>
            </div>
          </div>
          <ul className="text-sm space-y-2">
            <li>• View all pending and completed requests</li>
            <li>• Assign requests to staff members</li>
            <li>• Update request status and priority</li>
            <li>• Communicate with guests about their requests</li>
          </ul>
        </div>
      ),
    },
    staff: {
      title: "Staff Management",
      description: "Manage your team and their responsibilities",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <h4 className="font-medium">Team Operations</h4>
              <p className="text-sm text-muted-foreground">Organize your hotel staff and their tasks.</p>
            </div>
          </div>
          <ul className="text-sm space-y-2">
            <li>• Add and manage staff accounts</li>
            <li>• Set staff roles and permissions</li>
            <li>• Assign tasks and monitor progress</li>
            <li>• View staff schedules and availability</li>
          </ul>
        </div>
      ),
    },
    "access-codes": {
      title: "Access Codes",
      description: "Manage room access codes and security",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Key className="h-8 w-8 text-primary" />
            <div>
              <h4 className="font-medium">Security Management</h4>
              <p className="text-sm text-muted-foreground">Control room access with secure codes.</p>
            </div>
          </div>
          <ul className="text-sm space-y-2">
            <li>• Generate unique access codes for each room</li>
            <li>• Share codes securely with guests</li>
            <li>• Monitor code usage and expiration</li>
            <li>• Reset codes when needed</li>
          </ul>
        </div>
      ),
    },
    analytics: {
      title: "Analytics & Reports",
      description: "Track performance and generate insights",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <BarChart3 className="h-8 w-8 text-primary" />
            <div>
              <h4 className="font-medium">Business Intelligence</h4>
              <p className="text-sm text-muted-foreground">Make data-driven decisions for your hotel.</p>
            </div>
          </div>
          <ul className="text-sm space-y-2">
            <li>• View occupancy rates and trends</li>
            <li>• Analyze revenue and performance metrics</li>
            <li>• Generate custom reports</li>
            <li>• Export data for external analysis</li>
          </ul>
        </div>
      ),
    },
    settings: {
      title: "Settings & Configuration",
      description: "Customize your hotel management system",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Settings className="h-8 w-8 text-primary" />
            <div>
              <h4 className="font-medium">System Configuration</h4>
              <p className="text-sm text-muted-foreground">Personalize your hotel management experience.</p>
            </div>
          </div>
          <ul className="text-sm space-y-2">
            <li>• Update hotel information and contact details</li>
            <li>• Configure user preferences and notifications</li>
            <li>• Manage account security settings</li>
            <li>• Customize system behavior</li>
          </ul>
        </div>
      ),
    },
  };

  return tutorials[section as keyof typeof tutorials] || null;
};
