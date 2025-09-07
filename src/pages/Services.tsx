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
import { Textarea } from "@/components/ui/textarea";
import { Globe, Wifi, Smartphone, Tv, Shield, Plus, Search, Edit, Trash2, Eye } from "lucide-react";

interface ServicePlan {
  id: string;
  name: string;
  type: "internet" | "voice" | "tv" | "bundle";
  speed: {
    download: number;
    upload: number;
  };
  price: number;
  currency: "USD" | "AFN";
  billingCycle: "monthly" | "quarterly" | "yearly";
  features: string[];
  dataLimit?: number; // in GB, null for unlimited
  description: string;
  isActive: boolean;
  subscriberCount: number;
  createdAt: string;
}

export default function Services() {
  const [services, setServices] = useState<ServicePlan[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServicePlan[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServicePlan | null>(null);
  const [editService, setEditService] = useState<Partial<ServicePlan>>({});

  const [newService, setNewService] = useState<Partial<ServicePlan>>({
    name: "",
    type: "internet",
    speed: { download: 0, upload: 0 },
    price: 0,
    currency: "USD",
    billingCycle: "monthly",
    features: [],
    dataLimit: undefined,
    description: "",
    isActive: true,
  });

  useEffect(() => {
    loadServicesData();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm, typeFilter, statusFilter]);

  const loadServicesData = () => {
    // Mock data for demonstration
    const mockServices: ServicePlan[] = [
      {
        id: "1",
        name: "Basic Internet",
        type: "internet",
        speed: { download: 25, upload: 5 },
        price: 29.99,
        currency: "USD",
        billingCycle: "monthly",
        features: ["25 Mbps Download", "5 Mbps Upload", "Unlimited Data", "24/7 Support"],
        description: "Perfect for basic browsing and email",
        isActive: true,
        subscriberCount: 1247,
        createdAt: new Date("2024-01-15").toISOString(),
      },
      {
        id: "2",
        name: "Premium Internet",
        type: "internet",
        speed: { download: 100, upload: 20 },
        price: 59.99,
        currency: "USD",
        billingCycle: "monthly",
        features: ["100 Mbps Download", "20 Mbps Upload", "Unlimited Data", "Priority Support", "Free Installation"],
        description: "Ideal for streaming, gaming, and home office",
        isActive: true,
        subscriberCount: 856,
        createdAt: new Date("2024-01-15").toISOString(),
      },
      {
        id: "3",
        name: "Business Pro",
        type: "internet",
        speed: { download: 500, upload: 100 },
        price: 149.99,
        currency: "USD",
        billingCycle: "monthly",
        features: ["500 Mbps Download", "100 Mbps Upload", "Static IP", "SLA Guarantee", "24/7 Business Support"],
        description: "Enterprise-grade connectivity for businesses",
        isActive: true,
        subscriberCount: 234,
        createdAt: new Date("2024-01-15").toISOString(),
      },
      {
        id: "4",
        name: "Voice Service",
        type: "voice",
        speed: { download: 0, upload: 0 },
        price: 19.99,
        currency: "USD",
        billingCycle: "monthly",
        features: ["Unlimited Local Calls", "International Minutes Included", "Voicemail", "Call Forwarding"],
        description: "Complete voice solution for homes and businesses",
        isActive: true,
        subscriberCount: 432,
        createdAt: new Date("2024-01-15").toISOString(),
      },
      {
        id: "5",
        name: "TV Package",
        type: "tv",
        speed: { download: 0, upload: 0 },
        price: 39.99,
        currency: "USD",
        billingCycle: "monthly",
        features: ["200+ Channels", "HD Quality", "DVR Service", "Premium Channels"],
        description: "Entertainment package with premium channels",
        isActive: true,
        subscriberCount: 567,
        createdAt: new Date("2024-01-15").toISOString(),
      },
    ];

    setServices(mockServices);
  };

  const filterServices = () => {
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((service) => service.type === typeFilter);
    }

    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filtered = filtered.filter((service) => service.isActive === isActive);
    }

    setFilteredServices(filtered);
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "internet":
        return <Globe className="h-4 w-4" />;
      case "voice":
        return <Smartphone className="h-4 w-4" />;
      case "tv":
        return <Tv className="h-4 w-4" />;
      case "bundle":
        return <Shield className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case "internet":
        return "bg-blue-100 text-blue-800";
      case "voice":
        return "bg-green-100 text-green-800";
      case "tv":
        return "bg-purple-100 text-purple-800";
      case "bundle":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const serviceStats = {
    totalServices: services.length,
    activeServices: services.filter(s => s.isActive).length,
    totalSubscribers: services.reduce((sum, s) => sum + s.subscriberCount, 0),
    totalRevenue: services.reduce((sum, s) => sum + (s.subscriberCount * s.price), 0),
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Service Plans & Packages</h2>
            <p className="text-muted-foreground">Manage your ISP service offerings and pricing plans</p>
          </div>
          <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Service Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Service Plan</DialogTitle>
                <DialogDescription>Define a new service offering for your customers</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Service Name *</Label>
                    <Input id="name" placeholder="e.g., Premium Internet" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Service Type *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internet">Internet</SelectItem>
                        <SelectItem value="voice">Voice</SelectItem>
                        <SelectItem value="tv">TV</SelectItem>
                        <SelectItem value="bundle">Bundle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="download">Download Speed (Mbps)</Label>
                    <Input id="download" type="number" placeholder="100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="upload">Upload Speed (Mbps)</Label>
                    <Input id="upload" type="number" placeholder="20" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input id="price" type="number" placeholder="59.99" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="USD" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="AFN">AFN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billing">Billing Cycle</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Monthly" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Service description..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddServiceOpen(false)}>
                  Cancel
                </Button>
                <Button>Create Service</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Service Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Services</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{serviceStats.totalServices}</div>
              <p className="text-xs text-muted-foreground">
                {serviceStats.activeServices} active plans
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{serviceStats.totalSubscribers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Active subscriptions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(serviceStats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">From service plans</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Revenue per User</CardTitle>
              <Smartphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(serviceStats.totalRevenue / serviceStats.totalSubscribers)}
              </div>
              <p className="text-xs text-muted-foreground">ARPU</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="services" className="space-y-4">
          <TabsList>
            <TabsTrigger value="services">Service Plans</TabsTrigger>
            <TabsTrigger value="pricing">Pricing Matrix</TabsTrigger>
            <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search services by name, description, or features..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="internet">Internet</SelectItem>
                    <SelectItem value="voice">Voice</SelectItem>
                    <SelectItem value="tv">TV</SelectItem>
                    <SelectItem value="bundle">Bundle</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Services Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Speed</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Subscribers</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServices.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {getServiceIcon(service.type)}
                            <div>
                              <p className="font-medium">{service.name}</p>
                              <p className="text-xs text-muted-foreground">{service.description}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getServiceTypeColor(service.type)}>
                            {service.type.charAt(0).toUpperCase() + service.type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {service.type === "internet" ? (
                            <div className="text-sm">
                              <div>{service.speed.download} Mbps ↓</div>
                              <div className="text-muted-foreground">{service.speed.upload} Mbps ↑</div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(service.price, service.currency)}
                          <div className="text-xs text-muted-foreground">
                            /{service.billingCycle.replace("ly", "")}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-medium">{service.subscriberCount.toLocaleString()}</span>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(service.subscriberCount * service.price, service.currency)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={service.isActive ? "default" : "secondary"}>
                            {service.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
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
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Matrix</CardTitle>
                <CardDescription>Compare service plans and pricing structure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg border-2 border-dashed">
                  <div className="text-center">
                    <Shield className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Pricing comparison matrix would be implemented here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Service Performance</CardTitle>
                  <CardDescription>Subscriber growth and revenue trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg border-2 border-dashed">
                    <div className="text-center">
                      <Wifi className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Service performance analytics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Popular Services</CardTitle>
                  <CardDescription>Most subscribed service plans</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {services
                      .sort((a, b) => b.subscriberCount - a.subscriberCount)
                      .slice(0, 5)
                      .map((service, index) => (
                        <div key={service.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">#{index + 1}</span>
                            {getServiceIcon(service.type)}
                            <span className="text-sm">{service.name}</span>
                          </div>
                          <Badge variant="outline">{service.subscriberCount.toLocaleString()}</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}