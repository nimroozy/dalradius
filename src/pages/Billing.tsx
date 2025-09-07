import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { CreditCard, DollarSign, FileText, Calendar, AlertCircle, CheckCircle, Clock, Search, Filter, Plus } from "lucide-react";

interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "overdue" | "cancelled";
  dueDate: string;
  issueDate: string;
  services: string[];
  paymentMethod?: string;
  paidDate?: string;
}

interface Payment {
  id: string;
  invoiceId: string;
  customerId: string;
  customerName: string;
  amount: number;
  currency: string;
  method: "credit_card" | "bank_transfer" | "cash" | "check";
  status: "completed" | "pending" | "failed";
  date: string;
  transactionId?: string;
}

interface BillingStats {
  totalRevenue: number;
  pendingAmount: number;
  overdueAmount: number;
  collectionRate: number;
  avgPaymentTime: number;
}

export default function Billing() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  useEffect(() => {
    loadBillingData();
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [invoices, searchTerm, statusFilter]);

  const loadBillingData = () => {
    // Mock invoices data
    const mockInvoices: Invoice[] = [
      {
        id: "INV-2024-001",
        customerId: "cust-001",
        customerName: "Ahmad Khan",
        amount: 59.99,
        currency: "USD",
        status: "paid",
        dueDate: "2024-02-15",
        issueDate: "2024-01-15",
        services: ["Premium Internet 100Mbps"],
        paymentMethod: "credit_card",
        paidDate: "2024-01-20",
      },
      {
        id: "INV-2024-002",
        customerId: "cust-002",
        customerName: "Fatima Ahmadi",
        amount: 29.99,
        currency: "USD",
        status: "pending",
        dueDate: "2024-02-20",
        issueDate: "2024-01-20",
        services: ["Basic Internet 25Mbps"],
      },
      {
        id: "INV-2024-003",
        customerId: "cust-003",
        customerName: "Mohammad Rezai",
        amount: 149.99,
        currency: "USD",
        status: "overdue",
        dueDate: "2024-01-25",
        issueDate: "2023-12-25",
        services: ["Business Pro 500Mbps", "Static IP"],
      },
      {
        id: "INV-2024-004",
        customerId: "cust-004",
        customerName: "Zahra Karimi",
        amount: 19.99,
        currency: "USD",
        status: "paid",
        dueDate: "2024-02-10",
        issueDate: "2024-01-10",
        services: ["Voice Service"],
        paymentMethod: "bank_transfer",
        paidDate: "2024-01-15",
      },
      {
        id: "INV-2024-005",
        customerId: "cust-005",
        customerName: "Ali Hashemi",
        amount: 89.99,
        currency: "USD",
        status: "pending",
        dueDate: "2024-02-25",
        issueDate: "2024-01-25",
        services: ["Premium Internet 100Mbps", "Voice Service"],
      },
    ];

    const mockPayments: Payment[] = [
      {
        id: "PAY-001",
        invoiceId: "INV-2024-001",
        customerId: "cust-001",
        customerName: "Ahmad Khan",
        amount: 59.99,
        currency: "USD",
        method: "credit_card",
        status: "completed",
        date: "2024-01-20",
        transactionId: "TXN-CC-001",
      },
      {
        id: "PAY-002",
        invoiceId: "INV-2024-004",
        customerId: "cust-004",
        customerName: "Zahra Karimi",
        amount: 19.99,
        currency: "USD",
        method: "bank_transfer",
        status: "completed",
        date: "2024-01-15",
        transactionId: "TXN-BT-002",
      },
    ];

    setInvoices(mockInvoices);
    setPayments(mockPayments);
  };

  const filterInvoices = () => {
    let filtered = invoices;

    if (searchTerm) {
      filtered = filtered.filter(
        (invoice) =>
          invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((invoice) => invoice.status === statusFilter);
    }

    setFilteredInvoices(filtered);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate billing statistics
  const billingStats: BillingStats = {
    totalRevenue: invoices.filter(inv => inv.status === "paid").reduce((sum, inv) => sum + inv.amount, 0),
    pendingAmount: invoices.filter(inv => inv.status === "pending").reduce((sum, inv) => sum + inv.amount, 0),
    overdueAmount: invoices.filter(inv => inv.status === "overdue").reduce((sum, inv) => sum + inv.amount, 0),
    collectionRate: (invoices.filter(inv => inv.status === "paid").length / invoices.length) * 100,
    avgPaymentTime: 5.2, // Mock average payment time in days
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Billing & Payments</h2>
            <p className="text-muted-foreground">Manage invoices, payments, and billing operations</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Generate Invoice
          </Button>
        </div>

        {/* Billing Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(billingStats.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">Current month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {formatCurrency(billingStats.pendingAmount)}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting payment</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(billingStats.overdueAmount)}
              </div>
              <p className="text-xs text-muted-foreground">Past due date</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(billingStats.collectionRate)}%</div>
              <Progress value={billingStats.collectionRate} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Payment success rate</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="invoices" className="space-y-4">
          <TabsList>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices by customer, ID, or service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Invoices Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Services</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-mono text-sm">
                          {invoice.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{invoice.customerName}</p>
                            <p className="text-xs text-muted-foreground">ID: {invoice.customerId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {invoice.services.map((service, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(invoice.amount, invoice.currency)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(invoice.issueDate)}
                        </TableCell>
                        <TableCell className="text-sm">
                          <span className={`${invoice.status === "overdue" ? "text-red-600 font-medium" : ""}`}>
                            {formatDate(invoice.dueDate)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(invoice.status)}
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClasses(invoice.status)}`}>
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setIsInvoiceModalOpen(true);
                            }}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>Latest payment transactions</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-mono text-sm">
                          {payment.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{payment.customerName}</p>
                            <p className="text-xs text-muted-foreground">ID: {payment.customerId}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {payment.invoiceId}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(payment.amount, payment.currency)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {payment.method.replace("_", " ").toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(payment.date)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-800">
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                  <CardDescription>Monthly revenue trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg border-2 border-dashed">
                    <div className="text-center">
                      <DollarSign className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Revenue charts would be implemented here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Payment method distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg border-2 border-dashed">
                    <div className="text-center">
                      <CreditCard className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Payment method analytics would be implemented here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Invoice Details Modal */}
        <Dialog open={isInvoiceModalOpen} onOpenChange={setIsInvoiceModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Invoice Details</DialogTitle>
              <DialogDescription>
                Complete invoice information and payment status
              </DialogDescription>
            </DialogHeader>
            {selectedInvoice && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Invoice ID</Label>
                    <p className="text-sm font-mono">{selectedInvoice.id}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedInvoice.status)}
                      <span>{selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Customer</Label>
                    <p className="text-sm font-medium">{selectedInvoice.customerName}</p>
                    <p className="text-xs text-muted-foreground">ID: {selectedInvoice.customerId}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <p className="text-sm font-medium">{formatCurrency(selectedInvoice.amount, selectedInvoice.currency)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Issue Date</Label>
                    <p className="text-sm">{formatDate(selectedInvoice.issueDate)}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <p className="text-sm">{formatDate(selectedInvoice.dueDate)}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Services</Label>
                  <div className="space-y-1">
                    {selectedInvoice.services.map((service, index) => (
                      <Badge key={index} variant="outline">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
                {selectedInvoice.paymentMethod && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <p className="text-sm">{selectedInvoice.paymentMethod.replace("_", " ").toUpperCase()}</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Paid Date</Label>
                      <p className="text-sm">{selectedInvoice.paidDate ? formatDate(selectedInvoice.paidDate) : "N/A"}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInvoiceModalOpen(false)}>
                Close
              </Button>
              <Button>Download PDF</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}