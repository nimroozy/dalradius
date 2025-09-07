import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Wifi, 
  Server, 
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Activity
} from "lucide-react";

interface NasDevice {
  id: string;
  nasname: string;
  shortname: string;
  type: string;
  ports: number;
  secret: string;
  server: string;
  community: string;
  description: string;
  status: 'active' | 'inactive' | 'maintenance';
  lastSeen: string;
  location: string;
  contact: string;
  clients: number;
  maxClients: number;
}

const mockNasDevices: NasDevice[] = [
  {
    id: '1',
    nasname: '192.168.1.1',
    shortname: 'main-router',
    type: 'cisco',
    ports: 24,
    secret: 'encrypted_secret',
    server: 'radius-server-1',
    community: 'public',
    description: 'Main office router - Cisco 2960',
    status: 'active',
    lastSeen: '2024-01-20 14:30:15',
    location: 'Main Office - Floor 1',
    contact: 'admin@company.com',
    clients: 45,
    maxClients: 100
  },
  {
    id: '2',
    nasname: '192.168.2.1',
    shortname: 'branch-switch',
    type: 'hp',
    ports: 48,
    secret: 'encrypted_secret',
    server: 'radius-server-1',
    community: 'public',
    description: 'Branch office switch - HP ProCurve',
    status: 'active',
    lastSeen: '2024-01-20 14:28:42',
    location: 'Branch Office - Remote',
    contact: 'support@company.com',
    clients: 23,
    maxClients: 50
  },
  {
    id: '3',
    nasname: '10.0.1.1',
    shortname: 'wifi-controller',
    type: 'aruba',
    ports: 0,
    secret: 'encrypted_secret',
    server: 'radius-server-1',
    community: 'public',
    description: 'WiFi Controller - Aruba 7200',
    status: 'maintenance',
    lastSeen: '2024-01-20 10:15:30',
    location: 'Data Center - Rack 2',
    contact: 'network@company.com',
    clients: 0,
    maxClients: 200
  }
];

const nasTypes = [
  { value: 'cisco', label: 'Cisco', description: 'Cisco routers and switches' },
  { value: 'hp', label: 'HP', description: 'HP ProCurve switches' },
  { value: 'aruba', label: 'Aruba', description: 'Aruba wireless controllers' },
  { value: 'juniper', label: 'Juniper', description: 'Juniper network devices' },
  { value: 'fortinet', label: 'Fortinet', description: 'Fortinet security appliances' },
  { value: 'other', label: 'Other', description: 'Other network devices' }
];

export function NasManagement() {
  const [nasDevices, setNasDevices] = useState<NasDevice[]>(mockNasDevices);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingNas, setEditingNas] = useState<NasDevice | null>(null);
  const [newNas, setNewNas] = useState<Partial<NasDevice>>({
    nasname: '',
    shortname: '',
    type: 'cisco',
    ports: 24,
    secret: '',
    server: 'radius-server-1',
    community: 'public',
    description: '',
    status: 'active',
    location: '',
    contact: '',
    maxClients: 100
  });

  const filteredNasDevices = nasDevices.filter(device => {
    const matchesSearch = device.nasname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.shortname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || device.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary"><XCircle className="h-3 w-3 mr-1" />Inactive</Badge>;
      case 'maintenance':
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Maintenance</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const typeInfo = nasTypes.find(t => t.value === type);
    return (
      <Badge variant="outline" className="capitalize">
        {typeInfo?.label || type}
      </Badge>
    );
  };

  const getClientStatus = (clients: number, maxClients: number) => {
    const percentage = (clients / maxClients) * 100;
    if (percentage >= 90) {
      return <Badge variant="destructive">{clients}/{maxClients}</Badge>;
    } else if (percentage >= 70) {
      return <Badge variant="outline" className="text-yellow-600">{clients}/{maxClients}</Badge>;
    } else {
      return <Badge variant="outline" className="text-green-600">{clients}/{maxClients}</Badge>;
    }
  };

  const handleCreateNas = () => {
    if (newNas.nasname && newNas.shortname && newNas.secret) {
      const nas: NasDevice = {
        id: Date.now().toString(),
        nasname: newNas.nasname,
        shortname: newNas.shortname,
        type: newNas.type || 'cisco',
        ports: newNas.ports || 24,
        secret: newNas.secret,
        server: newNas.server || 'radius-server-1',
        community: newNas.community || 'public',
        description: newNas.description || '',
        status: newNas.status || 'active',
        lastSeen: new Date().toISOString().slice(0, 19).replace('T', ' '),
        location: newNas.location || '',
        contact: newNas.contact || '',
        clients: 0,
        maxClients: newNas.maxClients || 100
      };
      setNasDevices([...nasDevices, nas]);
      setNewNas({
        nasname: '',
        shortname: '',
        type: 'cisco',
        ports: 24,
        secret: '',
        server: 'radius-server-1',
        community: 'public',
        description: '',
        status: 'active',
        location: '',
        contact: '',
        maxClients: 100
      });
      setIsCreateDialogOpen(false);
    }
  };

  const handleEditNas = (nas: NasDevice) => {
    setEditingNas(nas);
    setIsEditDialogOpen(true);
  };

  const handleDeleteNas = (nasId: string) => {
    setNasDevices(nasDevices.filter(nas => nas.id !== nasId));
  };

  const handleUpdateNas = () => {
    if (editingNas) {
      setNasDevices(nasDevices.map(nas => 
        nas.id === editingNas.id ? editingNas : nas
      ));
      setIsEditDialogOpen(false);
      setEditingNas(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">NAS Device Management</h2>
          <p className="text-muted-foreground">
            Manage Network Access Servers and their RADIUS configuration
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add NAS Device
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New NAS Device</DialogTitle>
              <DialogDescription>
                Register a new Network Access Server with the RADIUS server.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nasname">NAS IP Address *</Label>
                  <Input
                    id="nasname"
                    value={newNas.nasname}
                    onChange={(e) => setNewNas({...newNas, nasname: e.target.value})}
                    placeholder="192.168.1.1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shortname">Short Name *</Label>
                  <Input
                    id="shortname"
                    value={newNas.shortname}
                    onChange={(e) => setNewNas({...newNas, shortname: e.target.value})}
                    placeholder="main-router"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Device Type</Label>
                  <select
                    id="type"
                    value={newNas.type}
                    onChange={(e) => setNewNas({...newNas, type: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {nasTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label} - {type.description}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ports">Ports</Label>
                  <Input
                    id="ports"
                    type="number"
                    value={newNas.ports}
                    onChange={(e) => setNewNas({...newNas, ports: parseInt(e.target.value)})}
                    placeholder="24"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secret">RADIUS Secret *</Label>
                <Input
                  id="secret"
                  type="password"
                  value={newNas.secret}
                  onChange={(e) => setNewNas({...newNas, secret: e.target.value})}
                  placeholder="Enter RADIUS secret"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="server">RADIUS Server</Label>
                  <Input
                    id="server"
                    value={newNas.server}
                    onChange={(e) => setNewNas({...newNas, server: e.target.value})}
                    placeholder="radius-server-1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="community">SNMP Community</Label>
                  <Input
                    id="community"
                    value={newNas.community}
                    onChange={(e) => setNewNas({...newNas, community: e.target.value})}
                    placeholder="public"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newNas.description}
                  onChange={(e) => setNewNas({...newNas, description: e.target.value})}
                  placeholder="Device description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newNas.location}
                    onChange={(e) => setNewNas({...newNas, location: e.target.value})}
                    placeholder="Device location"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact</Label>
                  <Input
                    id="contact"
                    value={newNas.contact}
                    onChange={(e) => setNewNas({...newNas, contact: e.target.value})}
                    placeholder="admin@company.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxClients">Max Clients</Label>
                <Input
                  id="maxClients"
                  type="number"
                  value={newNas.maxClients}
                  onChange={(e) => setNewNas({...newNas, maxClients: parseInt(e.target.value)})}
                  placeholder="100"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateNas}>
                Add NAS Device
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
                  placeholder="Search NAS devices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="flex h-10 w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">All Types</option>
              {nasTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* NAS Devices Table */}
      <Card>
        <CardHeader>
          <CardTitle>NAS Devices ({filteredNasDevices.length})</CardTitle>
          <CardDescription>
            Manage Network Access Servers and their RADIUS configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Clients</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNasDevices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{device.nasname}</div>
                      <div className="text-sm text-muted-foreground">
                        {device.shortname}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {device.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getTypeBadge(device.type)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(device.status)}
                  </TableCell>
                  <TableCell>
                    {getClientStatus(device.clients, device.maxClients)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {device.lastSeen}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {device.location}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {device.contact}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditNas(device)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNas(device.id)}
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

      {/* Edit NAS Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit NAS Device</DialogTitle>
            <DialogDescription>
              Update NAS device configuration and settings.
            </DialogDescription>
          </DialogHeader>
          {editingNas && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-nasname">NAS IP Address</Label>
                  <Input
                    id="edit-nasname"
                    value={editingNas.nasname}
                    onChange={(e) => setEditingNas({...editingNas, nasname: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-shortname">Short Name</Label>
                  <Input
                    id="edit-shortname"
                    value={editingNas.shortname}
                    onChange={(e) => setEditingNas({...editingNas, shortname: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Device Type</Label>
                  <select
                    id="edit-type"
                    value={editingNas.type}
                    onChange={(e) => setEditingNas({...editingNas, type: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {nasTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-ports">Ports</Label>
                  <Input
                    id="edit-ports"
                    type="number"
                    value={editingNas.ports}
                    onChange={(e) => setEditingNas({...editingNas, ports: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-secret">RADIUS Secret</Label>
                <Input
                  id="edit-secret"
                  type="password"
                  value={editingNas.secret}
                  onChange={(e) => setEditingNas({...editingNas, secret: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editingNas.description}
                  onChange={(e) => setEditingNas({...editingNas, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    value={editingNas.location}
                    onChange={(e) => setEditingNas({...editingNas, location: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-contact">Contact</Label>
                  <Input
                    id="edit-contact"
                    value={editingNas.contact}
                    onChange={(e) => setEditingNas({...editingNas, contact: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateNas}>
              Update NAS Device
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
