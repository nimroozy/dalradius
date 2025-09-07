import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Wifi, Router, Globe, Activity, AlertTriangle, CheckCircle, XCircle, Plus, Search, Filter } from "lucide-react";

interface NetworkDevice {
  id: string;
  name: string;
  type: "router" | "switch" | "access_point" | "cpe" | "tower";
  ipAddress: string;
  location: string;
  status: "online" | "offline" | "warning";
  uptime: string;
  bandwidth: {
    download: number;
    upload: number;
    used: number;
  };
  clients: number;
  lastSeen: string;
}

export default function Network() {
  const [devices, setDevices] = useState<NetworkDevice[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<NetworkDevice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);

  useEffect(() => {
    loadNetworkData();
  }, []);

  useEffect(() => {
    filterDevices();
  }, [devices, searchTerm, statusFilter, typeFilter]);

  const loadNetworkData = () => {
    // Mock data for professional ISP network
    const mockDevices: NetworkDevice[] = [
      {
        id: "1",
        name: "Core Router CR-01",
        type: "router",
        ipAddress: "192.168.1.1",
        location: "Main Data Center",
        status: "online",
        uptime: "127 days, 14 hours",
        bandwidth: { download: 10000, upload: 10000, used: 65 },
        clients: 2847,
        lastSeen: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Tower Alpha-01",
        type: "tower",
        ipAddress: "10.0.1.10",
        location: "Sector A - North Hill",
        status: "online",
        uptime: "89 days, 8 hours",
        bandwidth: { download: 1000, upload: 500, used: 78 },
        clients: 234,
        lastSeen: new Date().toISOString(),
      },
      {
        id: "3",
        name: "Access Point AP-B15",
        type: "access_point",
        ipAddress: "10.0.2.15",
        location: "Commercial District",
        status: "warning",
        uptime: "12 days, 4 hours",
        bandwidth: { download: 300, upload: 100, used: 92 },
        clients: 45,
        lastSeen: new Date(Date.now() - 300000).toISOString(),
      },
      {
        id: "4",
        name: "Core Switch CS-01",
        type: "switch",
        ipAddress: "192.168.1.10",
        location: "Main Data Center",
        status: "online",
        uptime: "156 days, 2 hours",
        bandwidth: { download: 20000, upload: 20000, used: 45 },
        clients: 892,
        lastSeen: new Date().toISOString(),
      },
      {
        id: "5",
        name: "Customer CPE-RZ001",
        type: "cpe",
        ipAddress: "10.1.50.100",
        location: "Residential Zone 1",
        status: "offline",
        uptime: "0 days, 0 hours",
        bandwidth: { download: 100, upload: 20, used: 0 },
        clients: 0,
        lastSeen: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "6",
        name: "Tower Beta-02",
        type: "tower",
        ipAddress: "10.0.3.20",
        location: "Sector B - East Valley",
        status: "online",
        uptime: "67 days, 12 hours",
        bandwidth: { download: 1000, upload: 500, used: 67 },
        clients: 189,
        lastSeen: new Date().toISOString(),
      },
    ];

    setDevices(mockDevices);
  };

  const filterDevices = () => {
    let filtered = devices;

    if (searchTerm) {
      filtered = filtered.filter(
        (device) =>
          device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          device.ipAddress.includes(searchTerm) ||
          device.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((device) => device.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((device) => device.type === typeFilter);
    }

    setFilteredDevices(filtered);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "offline":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "offline":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "router":
        return <Router className="h-4 w-4" />;
      case "tower":
        return <Wifi className="h-4 w-4" />;
      case "access_point":
        return <Wifi className="h-4 w-4" />;
      case "switch":
        return <Globe className="h-4 w-4" />;
      case "cpe":
        return <Activity className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const networkStats = {
    totalDevices: devices.length,
    onlineDevices: devices.filter((d) => d.status === "online").length,
    offlineDevices: devices.filter((d) => d.status === "offline").length,
    warningDevices: devices.filter((d) => d.status === "warning").length,
    totalBandwidth: devices.reduce((sum, d) => sum + d.bandwidth.download, 0),
    usedBandwidth: devices.reduce((sum, d) => sum + (d.bandwidth.download * d.bandwidth.used / 100), 0),
    totalClients: devices.reduce((sum, d) => sum + d.clients, 0),
  };

  const bandwidthUtilization = networkStats.totalBandwidth > 0 
    ? (networkStats.usedBandwidth / networkStats.totalBandwidth) * 100 
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Network Infrastructure</h2>
            <p className="text-muted-foreground">Monitor and manage your ISP network devices and infrastructure</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Device
          </Button>
        </div>

        {/* Network Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Network Devices</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{networkStats.totalDevices}</div>
              <p className="text-xs text-muted-foreground">
                {networkStats.onlineDevices} online • {networkStats.offlineDevices} offline
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Network Health</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {Math.round((networkStats.onlineDevices / networkStats.totalDevices) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {networkStats.warningDevices} devices need attention
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bandwidth Usage</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(bandwidthUtilization)}%</div>
              <Progress value={bandwidthUtilization} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(networkStats.usedBandwidth / 1000)} / {Math.round(networkStats.totalBandwidth / 1000)} Gbps
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              <Router className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{networkStats.totalClients.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Connected subscribers</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="devices" className="space-y-4">
          <TabsList>
            <TabsTrigger value="devices">Network Devices</TabsTrigger>
            <TabsTrigger value="topology">Network Map</TabsTrigger>
            <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="devices" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search devices by name, IP, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Device Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="router">Router</SelectItem>
                    <SelectItem value="switch">Switch</SelectItem>
                    <SelectItem value="access_point">Access Point</SelectItem>
                    <SelectItem value="tower">Tower</SelectItem>
                    <SelectItem value="cpe">CPE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Devices Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Device</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Uptime</TableHead>
                      <TableHead>Bandwidth Usage</TableHead>
                      <TableHead>Clients</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDevices.map((device) => (
                      <TableRow key={device.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {getDeviceIcon(device.type)}
                            <span className="font-medium">{device.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {device.type.replace("_", " ").toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {device.ipAddress}
                        </TableCell>
                        <TableCell>{device.location}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(device.status)}
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClasses(device.status)}`}>
                              {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {device.uptime}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>{device.bandwidth.used}%</span>
                              <span>{device.bandwidth.download >= 1000 ? `${device.bandwidth.download/1000}G` : `${device.bandwidth.download}M`}bps</span>
                            </div>
                            <Progress value={device.bandwidth.used} className="h-1" />
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-medium">{device.clients.toLocaleString()}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedDevice(device);
                              setIsDeviceModalOpen(true);
                            }}
                          >
                            Manage
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="topology" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Network Topology Map</CardTitle>
                <CardDescription>Interactive network infrastructure visualization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-96 bg-muted/50 rounded-lg border-2 border-dashed">
                  <div className="text-center">
                    <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">Network Topology Visualization</p>
                    <p className="text-sm text-muted-foreground mt-2">Interactive network map would be implemented here using D3.js or similar</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Real-time Traffic Analytics</CardTitle>
                  <CardDescription>Live network traffic monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg border-2 border-dashed">
                    <div className="text-center">
                      <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Live traffic charts implementation</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>System performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg border-2 border-dashed">
                    <div className="text-center">
                      <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Performance metrics visualization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Device Details Modal */}
        <Dialog open={isDeviceModalOpen} onOpenChange={setIsDeviceModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Device Management</DialogTitle>
              <DialogDescription>
                Configure and monitor network device
              </DialogDescription>
            </DialogHeader>
            {selectedDevice && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Device Name</Label>
                    <p className="text-sm font-medium">{selectedDevice.name}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Device Type</Label>
                    <p className="text-sm">{selectedDevice.type.replace("_", " ").toUpperCase()}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>IP Address</Label>
                    <p className="text-sm font-mono">{selectedDevice.ipAddress}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <p className="text-sm">{selectedDevice.location}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedDevice.status)}
                      <span>{selectedDevice.status.charAt(0).toUpperCase() + selectedDevice.status.slice(1)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Uptime</Label>
                    <p className="text-sm">{selectedDevice.uptime}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Bandwidth Configuration</Label>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Download</p>
                      <p className="font-medium">{selectedDevice.bandwidth.download >= 1000 ? `${selectedDevice.bandwidth.download/1000} Gbps` : `${selectedDevice.bandwidth.download} Mbps`}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Upload</p>
                      <p className="font-medium">{selectedDevice.bandwidth.upload >= 1000 ? `${selectedDevice.bandwidth.upload/1000} Gbps` : `${selectedDevice.bandwidth.upload} Mbps`}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Usage</p>
                      <p className="font-medium">{selectedDevice.bandwidth.used}%</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Connected Clients</Label>
                    <p className="text-sm font-medium">{selectedDevice.clients.toLocaleString()}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Last Seen</Label>
                    <p className="text-sm">{new Date(selectedDevice.lastSeen).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeviceModalOpen(false)}>
                Close
              </Button>
              <Button>Configure Device</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}