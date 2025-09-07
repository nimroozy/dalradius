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
import { Package, Router, Wifi, AlertTriangle, Plus, Search, Edit, Trash2, Eye } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  category: "router" | "modem" | "switch" | "cable" | "cpe" | "accessory";
  model: string;
  serialNumber: string;
  quantity: number;
  minStockLevel: number;
  location: string;
  status: "in_stock" | "low_stock" | "out_of_stock" | "reserved";
  unitPrice: number;
  supplier: string;
  lastUpdated: string;
  notes?: string;
}

export default function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);

  useEffect(() => {
    loadInventoryData();
  }, []);

  useEffect(() => {
    filterInventory();
  }, [inventory, searchTerm, categoryFilter, statusFilter]);

  const loadInventoryData = () => {
    const mockInventory: InventoryItem[] = [
      {
        id: "INV-001",
        name: "Cisco ISR 4321",
        category: "router",
        model: "ISR4321/K9",
        serialNumber: "FDO24140QBY",
        quantity: 15,
        minStockLevel: 5,
        location: "Warehouse A",
        status: "in_stock",
        unitPrice: 2500.00,
        supplier: "Cisco Systems",
        lastUpdated: "2024-01-15T10:30:00Z",
      },
      {
        id: "INV-002",
        name: "Ubiquiti EdgeRouter X",
        category: "router",
        model: "ER-X",
        serialNumber: "74E2F5123456",
        quantity: 3,
        minStockLevel: 10,
        location: "Warehouse A",
        status: "low_stock",
        unitPrice: 60.00,
        supplier: "Ubiquiti Networks",
        lastUpdated: "2024-01-14T14:20:00Z",
      },
      {
        id: "INV-003",
        name: "ARRIS SurfBoard",
        category: "modem",
        model: "SB8200",
        serialNumber: "002608A12345",
        quantity: 45,
        minStockLevel: 20,
        location: "Warehouse B",
        status: "in_stock",
        unitPrice: 180.00,
        supplier: "CommScope",
        lastUpdated: "2024-01-13T09:15:00Z",
      },
      {
        id: "INV-004",
        name: "TP-Link Switch",
        category: "switch",
        model: "TL-SG1024",
        serialNumber: "2192L1234567",
        quantity: 0,
        minStockLevel: 8,
        location: "Warehouse A",
        status: "out_of_stock",
        unitPrice: 120.00,
        supplier: "TP-Link",
        lastUpdated: "2024-01-12T16:45:00Z",
      },
      {
        id: "INV-005",
        name: "Ethernet Cable Cat6",
        category: "cable",
        model: "CAT6-305M",
        serialNumber: "ETH305M2024",
        quantity: 25,
        minStockLevel: 10,
        location: "Warehouse C",
        status: "in_stock",
        unitPrice: 85.00,
        supplier: "Panduit",
        lastUpdated: "2024-01-10T11:30:00Z",
      },
      {
        id: "INV-006",
        name: "Mikrotik hAP ac²",
        category: "cpe",
        model: "RBD52G-5HacD2HnD",
        serialNumber: "6C3B1A789012",
        quantity: 8,
        minStockLevel: 15,
        location: "Warehouse B",
        status: "low_stock",
        unitPrice: 75.00,
        supplier: "MikroTik",
        lastUpdated: "2024-01-11T13:20:00Z",
      },
    ];

    setInventory(mockInventory);
  };

  const filterInventory = () => {
    let filtered = inventory;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    setFilteredInventory(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_stock":
        return "bg-green-100 text-green-800";
      case "low_stock":
        return "bg-yellow-100 text-yellow-800";
      case "out_of_stock":
        return "bg-red-100 text-red-800";
      case "reserved":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "router":
        return <Router className="h-4 w-4" />;
      case "modem":
        return <Wifi className="h-4 w-4" />;
      case "switch":
        return <Package className="h-4 w-4" />;
      case "cable":
        return <Package className="h-4 w-4" />;
      case "cpe":
        return <Wifi className="h-4 w-4" />;
      case "accessory":
        return <Package className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const inventoryStats = {
    totalItems: inventory.reduce((sum, item) => sum + item.quantity, 0),
    totalValue: inventory.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
    lowStockItems: inventory.filter(item => item.status === "low_stock" || item.status === "out_of_stock").length,
    categories: inventory.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.quantity;
      return acc;
    }, {} as Record<string, number>),
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
            <p className="text-muted-foreground">Track and manage your network equipment inventory</p>
          </div>
          <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Inventory Item</DialogTitle>
                <DialogDescription>Add a new item to your inventory</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Item Name *</Label>
                    <Input id="name" placeholder="e.g., Cisco ISR 4321" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="router">Router</SelectItem>
                        <SelectItem value="modem">Modem</SelectItem>
                        <SelectItem value="switch">Switch</SelectItem>
                        <SelectItem value="cable">Cable</SelectItem>
                        <SelectItem value="cpe">CPE</SelectItem>
                        <SelectItem value="accessory">Accessory</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input id="model" placeholder="e.g., ISR4321/K9" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serial">Serial Number</Label>
                    <Input id="serial" placeholder="e.g., FDO24140QBY" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input id="quantity" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minStock">Min Stock Level</Label>
                    <Input id="minStock" type="number" placeholder="5" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unitPrice">Unit Price</Label>
                    <Input id="unitPrice" type="number" placeholder="0.00" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="e.g., Warehouse A" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier</Label>
                    <Input id="supplier" placeholder="e.g., Cisco Systems" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddItemOpen(false)}>
                  Cancel
                </Button>
                <Button>Add Item</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Inventory Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventoryStats.totalItems}</div>
              <p className="text-xs text-muted-foreground">
                Across {Object.keys(inventoryStats.categories).length} categories
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(inventoryStats.totalValue)}</div>
              <p className="text-xs text-muted-foreground">Inventory worth</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{inventoryStats.lowStockItems}</div>
              <p className="text-xs text-muted-foreground">Items need restocking</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SKUs</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventory.length}</div>
              <p className="text-xs text-muted-foreground">Unique products</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inventory" className="space-y-4">
          <TabsList>
            <TabsTrigger value="inventory">Inventory Items</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, model, serial number, or supplier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="router">Router</SelectItem>
                    <SelectItem value="modem">Modem</SelectItem>
                    <SelectItem value="switch">Switch</SelectItem>
                    <SelectItem value="cable">Cable</SelectItem>
                    <SelectItem value="cpe">CPE</SelectItem>
                    <SelectItem value="accessory">Accessory</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="low_stock">Low Stock</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Inventory Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Serial Number</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {getCategoryIcon(item.category)}
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">ID: {item.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.model}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.serialNumber}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{item.quantity}</span>
                            <span className="text-xs text-muted-foreground">
                              Min: {item.minStockLevel}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status.replace("_", " ").toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(item.unitPrice)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {item.location}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedItem(item);
                                setIsItemModalOpen(true);
                              }}
                            >
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

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Reports</CardTitle>
                <CardDescription>Generate reports for inventory analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg border-2 border-dashed">
                  <div className="text-center">
                    <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Inventory reports would be implemented here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Item Details Modal */}
        <Dialog open={isItemModalOpen} onOpenChange={setIsItemModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Item Details</DialogTitle>
              <DialogDescription>Complete inventory item information</DialogDescription>
            </DialogHeader>
            {selectedItem && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Item Name</Label>
                    <p className="text-sm font-medium">{selectedItem.name}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(selectedItem.category)}
                      <span>{selectedItem.category.charAt(0).toUpperCase() + selectedItem.category.slice(1)}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <p className="text-sm font-mono">{selectedItem.model}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Serial Number</Label>
                    <p className="text-sm font-mono">{selectedItem.serialNumber}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <p className="text-sm font-medium">{selectedItem.quantity}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Min Stock Level</Label>
                    <p className="text-sm">{selectedItem.minStockLevel}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Unit Price</Label>
                    <p className="text-sm font-medium">{formatCurrency(selectedItem.unitPrice)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <p className="text-sm">{selectedItem.location}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Supplier</Label>
                    <p className="text-sm">{selectedItem.supplier}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Badge className={getStatusColor(selectedItem.status)}>
                      {selectedItem.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label>Last Updated</Label>
                    <p className="text-sm">{formatDate(selectedItem.lastUpdated)}</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsItemModalOpen(false)}>
                Close
              </Button>
              <Button>Edit Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}