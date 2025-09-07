import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, PlusCircle, Search, MapPin, Phone, Mail, FileEdit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Customer type definition
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  status: "active" | "inactive" | "pending";
  notes?: string;
  createdAt: string;
  packageName: string;
  monthlyBill: number;
  dueDate: number; // Day of month when bill is due
}

// Mock data for customers
const mockCustomers: Customer[] = [
  {
    id: "cust-001",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1234567890",
    address: "123 Main St, City, State",
    coordinates: {
      lat: 34.0522,
      lng: -118.2437,
    },
    status: "active",
    notes: "Premium customer, always pays on time",
    createdAt: "2023-06-15T10:00:00Z",
    packageName: "Premium 100Mbps",
    monthlyBill: 50,
    dueDate: 15,
  },
  {
    id: "cust-002",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+1987654321",
    address: "456 Oak Ave, Town, State",
    status: "active",
    createdAt: "2023-07-20T14:30:00Z",
    packageName: "Basic 50Mbps",
    monthlyBill: 30,
    dueDate: 20,
  },
  {
    id: "cust-003",
    name: "Robert Johnson",
    email: "robert.j@example.com",
    phone: "+1567891234",
    address: "789 Pine Rd, Village, State",
    status: "inactive",
    notes: "Service suspended due to payment issues",
    createdAt: "2023-05-10T09:15:00Z",
    packageName: "Standard 75Mbps",
    monthlyBill: 40,
    dueDate: 10,
  },
  {
    id: "cust-004",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    phone: "+1456789012",
    address: "321 Elm St, City, State",
    status: "pending",
    notes: "Installation scheduled",
    createdAt: "2023-08-05T16:45:00Z",
    packageName: "Ultra 200Mbps",
    monthlyBill: 75,
    dueDate: 5,
  },
];

export default function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // New customer form state
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    packageName: "",
    monthlyBill: 0,
    dueDate: 1,
  });

  // Edit customer form state
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);

  // Filter customers based on active tab and search query
  const filteredCustomers = customers.filter((customer) => {
    const matchesStatus = activeTab === "all" || customer.status === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (isEditCustomerOpen && editCustomer) {
      setEditCustomer({
        ...editCustomer,
        [name]: name === "monthlyBill" || name === "dueDate" ? Number(value) : value,
      });
    } else {
      setNewCustomer({
        ...newCustomer,
        [name]: name === "monthlyBill" || name === "dueDate" ? Number(value) : value,
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (isEditCustomerOpen && editCustomer) {
      setEditCustomer({
        ...editCustomer,
        [name]: value,
      });
    } else {
      setNewCustomer({
        ...newCustomer,
        [name]: value,
      });
    }
  };

  const handleAddCustomer = () => {
    // Create new customer object
    const customerObj: Customer = {
      id: `cust-${Date.now()}`,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      address: newCustomer.address,
      status: "active",
      notes: newCustomer.notes,
      createdAt: new Date().toISOString(),
      packageName: newCustomer.packageName,
      monthlyBill: newCustomer.monthlyBill,
      dueDate: newCustomer.dueDate,
    };

    // Add to customers list
    setCustomers([customerObj, ...customers]);

    // Reset form and close dialog
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
      packageName: "",
      monthlyBill: 0,
      dueDate: 1,
    });
    setIsAddCustomerOpen(false);
  };

  const handleEditCustomer = () => {
    if (editCustomer) {
      setCustomers(
        customers.map((customer) => {
          if (customer.id === editCustomer.id) {
            return {
              ...editCustomer,
            };
          }
          return customer;
        })
      );
      setIsEditCustomerOpen(false);
      setEditCustomer(null);
    }
  };

  const startEditCustomer = (customer: Customer) => {
    setEditCustomer({ ...customer });
    setIsEditCustomerOpen(true);
  };

  const handleDeleteCustomer = (id: string) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setCustomers(customers.filter((customer) => customer.id !== id));
    }
  };

  const updateCustomerStatus = (customerId: string, status: "active" | "inactive" | "pending") => {
    setCustomers(
      customers.map((customer) => {
        if (customer.id === customerId) {
          return {
            ...customer,
            status,
          };
        }
        return customer;
      })
    );
  };

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700";
      case "inactive":
        return "bg-red-50 text-red-700";
      case "pending":
        return "bg-yellow-50 text-yellow-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>
          <Button onClick={() => setIsAddCustomerOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Customer
          </Button>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, email, phone or address..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Customers</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <CustomerTable
              customers={filteredCustomers}
              onEdit={startEditCustomer}
              onDelete={handleDeleteCustomer}
              onStatusChange={updateCustomerStatus}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
              getStatusBadgeClasses={getStatusBadgeClasses}
            />
          </TabsContent>
          <TabsContent value="active" className="mt-4">
            <CustomerTable
              customers={filteredCustomers}
              onEdit={startEditCustomer}
              onDelete={handleDeleteCustomer}
              onStatusChange={updateCustomerStatus}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
              getStatusBadgeClasses={getStatusBadgeClasses}
            />
          </TabsContent>
          <TabsContent value="inactive" className="mt-4">
            <CustomerTable
              customers={filteredCustomers}
              onEdit={startEditCustomer}
              onDelete={handleDeleteCustomer}
              onStatusChange={updateCustomerStatus}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
              getStatusBadgeClasses={getStatusBadgeClasses}
            />
          </TabsContent>
          <TabsContent value="pending" className="mt-4">
            <CustomerTable
              customers={filteredCustomers}
              onEdit={startEditCustomer}
              onDelete={handleDeleteCustomer}
              onStatusChange={updateCustomerStatus}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
              getStatusBadgeClasses={getStatusBadgeClasses}
            />
          </TabsContent>
        </Tabs>

        {/* Add New Customer Dialog */}
        <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>
                Enter the customer details and service information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Customer Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newCustomer.name}
                    onChange={handleInputChange}
                    placeholder="John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newCustomer.email}
                    onChange={handleInputChange}
                    placeholder="john.smith@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={newCustomer.phone}
                    onChange={handleInputChange}
                    placeholder="+1234567890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={newCustomer.address}
                    onChange={handleInputChange}
                    placeholder="123 Main St, City, State"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="packageName">Internet Package</Label>
                  <Input
                    id="packageName"
                    name="packageName"
                    value={newCustomer.packageName}
                    onChange={handleInputChange}
                    placeholder="Premium 100Mbps"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyBill">Monthly Bill (USD)</Label>
                  <Input
                    id="monthlyBill"
                    name="monthlyBill"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newCustomer.monthlyBill || ""}
                    onChange={handleInputChange}
                    placeholder="50.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Payment Due Day</Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="number"
                    min="1"
                    max="31"
                    value={newCustomer.dueDate || 1}
                    onChange={handleInputChange}
                    placeholder="15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={newCustomer.notes}
                    onChange={handleInputChange}
                    placeholder="Additional information about this customer..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddCustomerOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCustomer}>Add Customer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Customer Dialog */}
        <Dialog open={isEditCustomerOpen} onOpenChange={setIsEditCustomerOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
              <DialogDescription>
                Update the customer details and service information.
              </DialogDescription>
            </DialogHeader>
            {editCustomer && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Customer Name</Label>
                    <Input
                      id="edit-name"
                      name="name"
                      value={editCustomer.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      name="email"
                      type="email"
                      value={editCustomer.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Phone Number</Label>
                    <Input
                      id="edit-phone"
                      name="phone"
                      value={editCustomer.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-address">Address</Label>
                    <Input
                      id="edit-address"
                      name="address"
                      value={editCustomer.address}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-packageName">Internet Package</Label>
                    <Input
                      id="edit-packageName"
                      name="packageName"
                      value={editCustomer.packageName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-monthlyBill">Monthly Bill (USD)</Label>
                    <Input
                      id="edit-monthlyBill"
                      name="monthlyBill"
                      type="number"
                      min="0"
                      step="0.01"
                      value={editCustomer.monthlyBill || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-dueDate">Payment Due Day</Label>
                    <Input
                      id="edit-dueDate"
                      name="dueDate"
                      type="number"
                      min="1"
                      max="31"
                      value={editCustomer.dueDate || 1}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      name="status"
                      value={editCustomer.status}
                      onValueChange={(value) => handleSelectChange("status", value)}
                    >
                      <SelectTrigger id="edit-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-notes">Notes</Label>
                    <Textarea
                      id="edit-notes"
                      name="notes"
                      value={editCustomer.notes || ""}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditCustomerOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditCustomer}>Update Customer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: "active" | "inactive" | "pending") => void;
  formatDate: (dateString: string) => string;
  formatCurrency: (amount: number) => string;
  getStatusBadgeClasses: (status: string) => string;
}

function CustomerTable({
  customers,
  onEdit,
  onDelete,
  onStatusChange,
  formatDate,
  formatCurrency,
  getStatusBadgeClasses,
}: CustomerTableProps) {
  if (customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No customers found</h3>
        <p className="text-sm text-muted-foreground">
          No customers match your current filters or search criteria.
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Monthly Bill</TableHead>
              <TableHead>Since</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-1 h-3 w-3" />
                      <span className="truncate max-w-[150px]">{customer.address}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="flex items-center text-sm">
                      <Phone className="mr-1 h-3 w-3" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="mr-1 h-3 w-3" />
                      <span className="truncate max-w-[150px]">{customer.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{customer.packageName}</TableCell>
                <TableCell>
                  <div>
                    <p>{formatCurrency(customer.monthlyBill)}</p>
                    <p className="text-xs text-muted-foreground">Due: Day {customer.dueDate}</p>
                  </div>
                </TableCell>
                <TableCell>{formatDate(customer.createdAt)}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClasses(
                      customer.status
                    )}`}
                  >
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => onEdit(customer)}
                    >
                      <FileEdit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => onDelete(customer.id)}
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
  );
}