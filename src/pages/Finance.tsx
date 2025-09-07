import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { Invoice, InvoiceStatus, Task } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { 
  Search, 
  CreditCard, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  FileText, 
  XCircle,
  Printer,
  Download,
  AlertTriangle
} from "lucide-react";

// Mock data for installations that are completed but not invoiced
const mockCompletedTasks: Task[] = [
  {
    id: "task5",
    leadId: "5",
    lead: {
      id: "5",
      customerName: "Sophia Brown",
      mobileNumber: "+1567890123",
      package: "Basic 50Mbps",
      cp: "Ubiquiti NanoBeam",
      router: "TP-Link Archer C6",
      cable: "CAT6 30m",
      pole: "None",
      cpPrice: 75,
      routerPrice: 45,
      cablePrice: 15,
      polePrice: 0,
      packagePrice: 30,
      totalPrice: 165,
      status: "agreed",
      salesAgent: "1",
      createdAt: "2023-08-03",
      updatedAt: "2023-08-03",
    },
    status: "installed",
    assignedTechnicianId: "4",
    technicalManagerId: "3",
    installationDate: "2023-09-10T09:00:00Z",
    createdAt: "2023-08-07",
    updatedAt: "2023-09-10",
  },
];

// Mock data for invoices
const mockInvoices: Invoice[] = [
  {
    id: "inv1",
    taskId: "task6",
    task: {
      id: "task6",
      leadId: "6",
      lead: {
        id: "6",
        customerName: "James Wilson",
        mobileNumber: "+1678901234",
        package: "Premium 100Mbps",
        cp: "Ubiquiti LiteBeam",
        router: "TP-Link Archer C7",
        cable: "CAT6 50m",
        pole: "Standard 3m",
        cpPrice: 85,
        routerPrice: 65,
        cablePrice: 25,
        polePrice: 35,
        packagePrice: 50,
        totalPrice: 260,
        status: "agreed",
        salesAgent: "1",
        createdAt: "2023-08-04",
        updatedAt: "2023-08-04",
      },
      status: "installed",
      assignedTechnicianId: "4",
      technicalManagerId: "3",
      installationDate: "2023-09-08T10:00:00Z",
      createdAt: "2023-08-08",
      updatedAt: "2023-09-08",
    },
    amount: 260,
    status: "pending",
    dueDate: "2023-10-08T00:00:00Z",
    createdAt: "2023-09-08T12:00:00Z",
  },
  {
    id: "inv2",
    taskId: "task7",
    task: {
      id: "task7",
      leadId: "7",
      lead: {
        id: "7",
        customerName: "Emma Taylor",
        mobileNumber: "+1789012345",
        package: "Standard 75Mbps",
        cp: "Ubiquiti NanoBeam",
        router: "TP-Link Archer C8",
        cable: "CAT6 40m",
        pole: "Standard 2m",
        cpPrice: 75,
        routerPrice: 55,
        cablePrice: 20,
        polePrice: 25,
        packagePrice: 40,
        totalPrice: 215,
        status: "agreed",
        salesAgent: "1",
        createdAt: "2023-08-05",
        updatedAt: "2023-08-05",
      },
      status: "installed",
      assignedTechnicianId: "4",
      technicalManagerId: "3",
      installationDate: "2023-09-05T14:00:00Z",
      createdAt: "2023-08-09",
      updatedAt: "2023-09-05",
    },
    amount: 215,
    status: "paid",
    dueDate: "2023-10-05T00:00:00Z",
    paidDate: "2023-09-20T10:15:00Z",
    createdAt: "2023-09-05T16:00:00Z",
  },
  {
    id: "inv3",
    taskId: "task8",
    task: {
      id: "task8",
      leadId: "8",
      lead: {
        id: "8",
        customerName: "Daniel Martinez",
        mobileNumber: "+1890123456",
        package: "Ultra 200Mbps",
        cp: "Ubiquiti PowerBeam",
        router: "TP-Link Archer C7",
        cable: "CAT6 50m",
        pole: "Standard 3m",
        cpPrice: 95,
        routerPrice: 65,
        cablePrice: 25,
        polePrice: 35,
        packagePrice: 75,
        totalPrice: 295,
        status: "agreed",
        salesAgent: "1",
        createdAt: "2023-08-06",
        updatedAt: "2023-08-06",
      },
      status: "installed",
      assignedTechnicianId: "4",
      technicalManagerId: "3",
      installationDate: "2023-09-03T11:00:00Z",
      createdAt: "2023-08-10",
      updatedAt: "2023-09-03",
    },
    amount: 295,
    status: "overdue",
    dueDate: "2023-10-03T00:00:00Z",
    createdAt: "2023-09-03T13:00:00Z",
  },
];

// Mock inventory data
const mockInventory = [
  { id: "1", name: "Ubiquiti LiteBeam", type: "cp", quantity: 25, price: 85, updatedAt: "2023-09-01" },
  { id: "2", name: "Ubiquiti NanoBeam", type: "cp", quantity: 15, price: 75, updatedAt: "2023-09-01" },
  { id: "3", name: "Ubiquiti PowerBeam", type: "cp", quantity: 8, price: 95, updatedAt: "2023-09-01" },
  { id: "4", name: "TP-Link Archer C6", type: "router", quantity: 12, price: 45, updatedAt: "2023-09-01" },
  { id: "5", name: "TP-Link Archer C7", type: "router", quantity: 20, price: 65, updatedAt: "2023-09-01" },
  { id: "6", name: "TP-Link Archer C8", type: "router", quantity: 10, price: 55, updatedAt: "2023-09-01" },
  { id: "7", name: "CAT6 30m", type: "cable", quantity: 30, price: 15, updatedAt: "2023-09-01" },
  { id: "8", name: "CAT6 40m", type: "cable", quantity: 25, price: 20, updatedAt: "2023-09-01" },
  { id: "9", name: "CAT6 50m", type: "cable", quantity: 18, price: 25, updatedAt: "2023-09-01" },
  { id: "10", name: "Standard 2m", type: "pole", quantity: 14, price: 25, updatedAt: "2023-09-01" },
  { id: "11", name: "Standard 3m", type: "pole", quantity: 10, price: 35, updatedAt: "2023-09-01" },
];

export default function Finance() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [completedTasks, setCompletedTasks] = useState<Task[]>(mockCompletedTasks);
  const [inventory, setInventory] = useState(mockInventory);
  const [activeTab, setActiveTab] = useState<string>("invoices");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [generateInvoiceDialog, setGenerateInvoiceDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Filter invoices based on search query
  const filteredInvoices = invoices.filter(invoice => {
    return searchQuery === "" || 
           invoice.task.lead.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           invoice.task.lead.mobileNumber.includes(searchQuery);
  });

  // Filter inventory based on search query
  const filteredInventory = inventory.filter(item => {
    return searchQuery === "" || 
           item.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const openGenerateInvoiceDialog = (task: Task) => {
    setSelectedTask(task);
    setGenerateInvoiceDialog(true);
  };

  const generateInvoice = () => {
    if (!selectedTask) return;

    // Create a new invoice
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      taskId: selectedTask.id,
      task: selectedTask,
      amount: selectedTask.lead.totalPrice,
      status: "pending",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      createdAt: new Date().toISOString(),
    };

    // Add to invoices list
    setInvoices([newInvoice, ...invoices]);
    
    // Remove from completed tasks
    setCompletedTasks(completedTasks.filter(task => task.id !== selectedTask.id));
    
    // Update inventory
    updateInventory(selectedTask);
    
    setGenerateInvoiceDialog(false);
  };

  const updateInventory = (task: Task) => {
    // Reduce inventory based on the equipment used in the installation
    setInventory(inventory.map(item => {
      if (item.name === task.lead.cp) {
        return { ...item, quantity: item.quantity - 1 };
      } else if (item.name === task.lead.router) {
        return { ...item, quantity: item.quantity - 1 };
      } else if (item.name === task.lead.cable) {
        return { ...item, quantity: item.quantity - 1 };
      } else if (item.name === task.lead.pole && task.lead.pole !== "None") {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    }));
  };

  const markAsPaid = (invoiceId: string) => {
    setInvoices(invoices.map(invoice => {
      if (invoice.id === invoiceId) {
        return {
          ...invoice,
          status: "paid",
          paidDate: new Date().toISOString()
        };
      }
      return invoice;
    }));
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance</h1>
          <p className="text-muted-foreground">
            Manage invoices, payments, and inventory
          </p>
        </div>
        
        {/* Search */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by customer name or phone..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Finance Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                From {invoices.filter(i => i.status === "paid").length} paid invoices
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${invoices.filter(i => i.status === "pending" || i.status === "overdue").reduce((sum, i) => sum + i.amount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                From {invoices.filter(i => i.status === "pending" || i.status === "overdue").length} unpaid invoices
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${inventory.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {inventory.reduce((sum, item) => sum + item.quantity, 0)} items in stock
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs for Invoices and Inventory */}
        <Tabs defaultValue="invoices" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="pending">Pending Invoices</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>
          
          {/* Invoices Tab */}
          <TabsContent value="invoices" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>Manage customer invoices and payments</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No invoices found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.id}</TableCell>
                          <TableCell>
                            {invoice.task.lead.customerName}
                            <div className="text-xs text-muted-foreground">{invoice.task.lead.mobileNumber}</div>
                          </TableCell>
                          <TableCell>${invoice.amount}</TableCell>
                          <TableCell>
                            <div>
                              {new Date(invoice.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Due: {new Date(invoice.dueDate).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8"
                              >
                                <FileText className="mr-1 h-4 w-4" />
                                View
                              </Button>
                              {invoice.status !== "paid" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8"
                                  onClick={() => markAsPaid(invoice.id)}
                                >
                                  <DollarSign className="mr-1 h-4 w-4" />
                                  Mark Paid
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8"
                              >
                                <Printer className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Pending Invoices Tab - completed installations waiting to be invoiced */}
          <TabsContent value="pending" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Installations</CardTitle>
                <CardDescription>
                  Successfully completed installations waiting for invoice generation
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Installation Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedTasks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No pending installations for invoice generation.
                        </TableCell>
                      </TableRow>
                    ) : (
                      completedTasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell className="font-medium">
                            {task.lead.customerName}
                            <div className="text-xs text-muted-foreground">{task.lead.mobileNumber}</div>
                          </TableCell>
                          <TableCell>{task.lead.package}</TableCell>
                          <TableCell>{new Date(task.installationDate || "").toLocaleDateString()}</TableCell>
                          <TableCell>${task.lead.totalPrice}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8"
                              onClick={() => openGenerateInvoiceDialog(task)}
                            >
                              <FileText className="mr-1 h-4 w-4" />
                              Generate Invoice
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Inventory Tab */}
          <TabsContent value="inventory" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventory</CardTitle>
                <CardDescription>Track equipment stock levels</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="capitalize">{item.type}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${item.price}</TableCell>
                        <TableCell>${item.quantity * item.price}</TableCell>
                        <TableCell>
                          {item.quantity <= 5 ? (
                            <div className="flex items-center">
                              <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                              <span className="text-amber-500 text-sm">Low Stock</span>
                            </div>
                          ) : item.quantity <= 10 ? (
                            <div className="flex items-center">
                              <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className="text-yellow-500 text-sm">Medium Stock</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                              <span className="text-green-500 text-sm">In Stock</span>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="border-t p-4">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Inventory
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Generate Invoice Dialog */}
      <Dialog open={generateInvoiceDialog} onOpenChange={setGenerateInvoiceDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate Invoice</DialogTitle>
            <DialogDescription>
              {selectedTask && (
                <span>Customer: {selectedTask.lead.customerName} ({selectedTask.lead.mobileNumber})</span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedTask && (
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Package:</span>
                    <span>{selectedTask.lead.package}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">CP:</span>
                    <span>{selectedTask.lead.cp}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Router:</span>
                    <span>{selectedTask.lead.router}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Cable:</span>
                    <span>{selectedTask.lead.cable}</span>
                  </div>
                  {selectedTask.lead.pole !== "None" && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Pole:</span>
                      <span>{selectedTask.lead.pole}</span>
                    </div>
                  )}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center font-bold">
                      <span>Total:</span>
                      <span>${selectedTask.lead.totalPrice}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGenerateInvoiceDialog(false)}>
              Cancel
            </Button>
            <Button onClick={generateInvoice}>
              Generate Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}