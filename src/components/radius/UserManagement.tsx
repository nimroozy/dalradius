import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Shield, 
  Clock, 
  Wifi,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";

interface RadiusUser {
  id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  group: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin: string;
  sessionTime: number;
  dataUsage: number;
  bandwidthLimit: number;
  attributes: Record<string, string>;
}

const mockUsers: RadiusUser[] = [
  {
    id: '1',
    username: 'john.doe',
    password: 'encrypted_password',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-0123',
    address: '123 Main St, City, State',
    group: 'premium',
    status: 'active',
    createdAt: '2024-01-15',
    lastLogin: '2024-01-20 14:30',
    sessionTime: 3600,
    dataUsage: 1024000,
    bandwidthLimit: 100000000,
    attributes: {
      'Framed-Protocol': 'PPP',
      'Service-Type': 'Framed-User',
      'Framed-IP-Address': '192.168.1.100'
    }
  },
  {
    id: '2',
    username: 'jane.smith',
    password: 'encrypted_password',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+1-555-0124',
    address: '456 Oak Ave, City, State',
    group: 'standard',
    status: 'active',
    createdAt: '2024-01-10',
    lastLogin: '2024-01-20 09:15',
    sessionTime: 7200,
    dataUsage: 512000,
    bandwidthLimit: 50000000,
    attributes: {
      'Framed-Protocol': 'PPP',
      'Service-Type': 'Framed-User',
      'Framed-IP-Address': '192.168.1.101'
    }
  },
  {
    id: '3',
    username: 'mike.johnson',
    password: 'encrypted_password',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@example.com',
    phone: '+1-555-0125',
    address: '789 Pine St, City, State',
    group: 'basic',
    status: 'suspended',
    createdAt: '2024-01-05',
    lastLogin: '2024-01-18 16:45',
    sessionTime: 0,
    dataUsage: 256000,
    bandwidthLimit: 25000000,
    attributes: {
      'Framed-Protocol': 'PPP',
      'Service-Type': 'Framed-User',
      'Framed-IP-Address': '192.168.1.102'
    }
  }
];

const userGroups = [
  { value: 'basic', label: 'Basic', description: 'Basic internet access' },
  { value: 'standard', label: 'Standard', description: 'Standard internet with higher speeds' },
  { value: 'premium', label: 'Premium', description: 'Premium internet with unlimited data' },
  { value: 'business', label: 'Business', description: 'Business-grade internet service' },
  { value: 'admin', label: 'Admin', description: 'Administrative access' }
];

export function UserManagement() {
  const [users, setUsers] = useState<RadiusUser[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<RadiusUser | null>(null);
  const [newUser, setNewUser] = useState<Partial<RadiusUser>>({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    group: 'basic',
    status: 'active',
    attributes: {}
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroup === 'all' || user.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Inactive</Badge>;
      case 'suspended':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getGroupBadge = (group: string) => {
    const groupInfo = userGroups.find(g => g.value === group);
    return (
      <Badge variant="outline" className="capitalize">
        {groupInfo?.label || group}
      </Badge>
    );
  };

  const handleCreateUser = () => {
    if (newUser.username && newUser.password) {
      const user: RadiusUser = {
        id: Date.now().toString(),
        username: newUser.username,
        password: newUser.password,
        firstName: newUser.firstName || '',
        lastName: newUser.lastName || '',
        email: newUser.email || '',
        phone: newUser.phone || '',
        address: newUser.address || '',
        group: newUser.group || 'basic',
        status: newUser.status || 'active',
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: '',
        sessionTime: 0,
        dataUsage: 0,
        bandwidthLimit: 25000000,
        attributes: newUser.attributes || {}
      };
      setUsers([...users, user]);
      setNewUser({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        group: 'basic',
        status: 'active',
        attributes: {}
      });
      setIsCreateDialogOpen(false);
    }
  };

  const handleEditUser = (user: RadiusUser) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleUpdateUser = () => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id ? editingUser : user
      ));
      setIsEditDialogOpen(false);
      setEditingUser(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">RADIUS User Management</h2>
          <p className="text-muted-foreground">
            Manage RADIUS users, groups, and authentication settings
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New RADIUS User</DialogTitle>
              <DialogDescription>
                Add a new user to the RADIUS server with authentication credentials and attributes.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    placeholder="Enter username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    placeholder="Enter password"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="Enter email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newUser.address}
                  onChange={(e) => setNewUser({...newUser, address: e.target.value})}
                  placeholder="Enter address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="group">User Group</Label>
                  <Select value={newUser.group} onValueChange={(value) => setNewUser({...newUser, group: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent>
                      {userGroups.map((group) => (
                        <SelectItem key={group.value} value={group.value}>
                          {group.label} - {group.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={newUser.status} onValueChange={(value: any) => setNewUser({...newUser, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateUser}>
                Create User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                {userGroups.map((group) => (
                  <SelectItem key={group.value} value={group.value}>
                    {group.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>RADIUS Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Manage authentication credentials and user attributes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Data Usage</TableHead>
                <TableHead>Session Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getGroupBadge(user.group)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(user.status)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {user.lastLogin || 'Never'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {(user.dataUsage / 1024 / 1024).toFixed(2)} MB
                    </div>
                    <div className="text-xs text-muted-foreground">
                      of {(user.bandwidthLimit / 1024 / 1024).toFixed(0)} MB
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {user.sessionTime > 0 ? `${Math.floor(user.sessionTime / 3600)}h ${Math.floor((user.sessionTime % 3600) / 60)}m` : 'Not connected'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit RADIUS User</DialogTitle>
            <DialogDescription>
              Update user information and RADIUS attributes.
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-username">Username</Label>
                  <Input
                    id="edit-username"
                    value={editingUser.username}
                    onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-password">Password</Label>
                  <Input
                    id="edit-password"
                    type="password"
                    value={editingUser.password}
                    onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-group">User Group</Label>
                  <Select value={editingUser.group} onValueChange={(value) => setEditingUser({...editingUser, group: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {userGroups.map((group) => (
                        <SelectItem key={group.value} value={group.value}>
                          {group.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={editingUser.status} onValueChange={(value: any) => setEditingUser({...editingUser, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>RADIUS Attributes</Label>
                <Textarea
                  placeholder="Enter RADIUS attributes (one per line, format: Attribute-Name: value)"
                  value={Object.entries(editingUser.attributes).map(([key, value]) => `${key}: ${value}`).join('\n')}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n');
                    const attributes: Record<string, string> = {};
                    lines.forEach(line => {
                      const [key, value] = line.split(': ');
                      if (key && value) {
                        attributes[key.trim()] = value.trim();
                      }
                    });
                    setEditingUser({...editingUser, attributes});
                  }}
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>
              Update User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
