
import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/SimpleAuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, UserPlus, Mail, Shield, User, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  can_manage_rooms: boolean;
  can_manage_staff: boolean;
  created_at: string;
}

const StaffManagementPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [newStaffData, setNewStaffData] = useState({
    name: '',
    email: '',
    can_manage_rooms: false,
    can_manage_staff: false
  });

  useEffect(() => {
    fetchStaffMembers();
  }, [user?.hotelId]);

  const fetchStaffMembers = async () => {
    if (!user?.hotelId) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('hotel_id', user.hotelId)
        .eq('role', 'staff')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStaffMembers(data || []);
    } catch (error) {
      console.error('Error fetching staff members:', error);
    } finally {
      setLoading(false);
    }
  };

  const inviteStaffMember = async () => {
    if (!user?.hotelId || !newStaffData.name || !newStaffData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // Generate a temporary password
      const tempPassword = Math.random().toString(36).slice(-8);
      
      const { data, error } = await supabase
        .from('users')
        .insert({
          name: newStaffData.name,
          email: newStaffData.email,
          password_hash: tempPassword, // In real app, this should be properly hashed
          role: 'staff',
          hotel_id: user.hotelId,
          can_manage_rooms: newStaffData.can_manage_rooms,
          can_manage_staff: newStaffData.can_manage_staff,
          needs_password_setup: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Staff member invited successfully. Temporary password: ${tempPassword}`,
      });

      setNewStaffData({
        name: '',
        email: '',
        can_manage_rooms: false,
        can_manage_staff: false
      });
      setShowInviteDialog(false);
      fetchStaffMembers();
    } catch (error: any) {
      console.error('Error inviting staff member:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to invite staff member",
        variant: "destructive"
      });
    }
  };

  const deleteStaffMember = async (staffId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', staffId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Staff member removed successfully",
      });

      fetchStaffMembers();
    } catch (error: any) {
      console.error('Error deleting staff member:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove staff member",
        variant: "destructive"
      });
    }
  };

  const updatePermissions = async (staffId: string, permissions: { can_manage_rooms?: boolean; can_manage_staff?: boolean }) => {
    try {
      const { error } = await supabase
        .from('users')
        .update(permissions)
        .eq('id', staffId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Permissions updated successfully",
      });

      fetchStaffMembers();
    } catch (error: any) {
      console.error('Error updating permissions:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update permissions",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600">Manage your hotel staff and their permissions</p>
        </div>
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Staff
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Invite New Staff Member</DialogTitle>
              <DialogDescription>
                Add a new staff member to your hotel team.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newStaffData.name}
                  onChange={(e) => setNewStaffData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newStaffData.email}
                  onChange={(e) => setNewStaffData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manage-rooms"
                    checked={newStaffData.can_manage_rooms}
                    onCheckedChange={(checked) => 
                      setNewStaffData(prev => ({ ...prev, can_manage_rooms: checked as boolean }))
                    }
                  />
                  <Label htmlFor="manage-rooms">Can manage rooms</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manage-staff"
                    checked={newStaffData.can_manage_staff}
                    onCheckedChange={(checked) => 
                      setNewStaffData(prev => ({ ...prev, can_manage_staff: checked as boolean }))
                    }
                  />
                  <Label htmlFor="manage-staff">Can manage staff</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                Cancel
              </Button>
              <Button onClick={inviteStaffMember}>
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold">{staffMembers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Room Managers</p>
                <p className="text-2xl font-bold">{staffMembers.filter(s => s.can_manage_rooms).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Staff Managers</p>
                <p className="text-2xl font-bold">{staffMembers.filter(s => s.can_manage_staff).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff List */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Members</CardTitle>
          <CardDescription>
            Manage your team members and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {staffMembers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members</h3>
              <p className="text-gray-600 mb-4">Start building your team by inviting staff members.</p>
              <Button onClick={() => setShowInviteDialog(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite First Staff Member
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {staffMembers.map((staff) => (
                <div key={staff.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{staff.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          {staff.email}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      {staff.can_manage_rooms && (
                        <Badge variant="outline">Room Manager</Badge>
                      )}
                      {staff.can_manage_staff && (
                        <Badge variant="outline">Staff Manager</Badge>
                      )}
                      {!staff.can_manage_rooms && !staff.can_manage_staff && (
                        <Badge variant="secondary">Basic Staff</Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updatePermissions(staff.id, { 
                          can_manage_rooms: !staff.can_manage_rooms 
                        })}
                      >
                        {staff.can_manage_rooms ? 'Remove Room Access' : 'Grant Room Access'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updatePermissions(staff.id, { 
                          can_manage_staff: !staff.can_manage_staff 
                        })}
                      >
                        {staff.can_manage_staff ? 'Remove Staff Access' : 'Grant Staff Access'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteStaffMember(staff.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffManagementPage;
