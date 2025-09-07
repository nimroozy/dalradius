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
import { Headphones, MessageCircle, AlertTriangle, CheckCircle, Clock, User, Plus, Search } from "lucide-react";

interface SupportTicket {
  id: string;
  customerId: string;
  customerName: string;
  subject: string;
  description: string;
  category: "technical" | "billing" | "service" | "complaint" | "general";
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "pending_customer" | "resolved" | "closed";
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  customerSatisfaction?: number;
}

export default function Support() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  useEffect(() => {
    loadSupportData();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, searchTerm, statusFilter, priorityFilter]);

  const loadSupportData = () => {
    const mockTickets: SupportTicket[] = [
      {
        id: "TCK-2024-001",
        customerId: "cust-001",
        customerName: "Ahmad Khan",
        subject: "Internet connection issues",
        description: "Customer experiencing intermittent connectivity issues during peak hours",
        category: "technical",
        priority: "high",
        status: "in_progress",
        assignedTo: "Tech Team A",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T14:22:00Z",
      },
      {
        id: "TCK-2024-002",
        customerId: "cust-002",
        customerName: "Fatima Ahmadi",
        subject: "Billing inquiry - incorrect charges",
        description: "Customer disputes charges on recent invoice",
        category: "billing",
        priority: "medium",
        status: "pending_customer",
        assignedTo: "Billing Team",
        createdAt: "2024-01-14T09:15:00Z",
        updatedAt: "2024-01-14T16:45:00Z",
      },
      {
        id: "TCK-2024-003",
        customerId: "cust-003",
        customerName: "Mohammad Rezai",
        subject: "Service upgrade request",
        description: "Customer wants to upgrade from 100Mbps to 500Mbps plan",
        category: "service",
        priority: "low",
        status: "open",
        createdAt: "2024-01-13T14:20:00Z",
        updatedAt: "2024-01-13T14:20:00Z",
      },
      {
        id: "TCK-2024-004",
        customerId: "cust-004",
        customerName: "Zahra Karimi",
        subject: "Installation completed successfully",
        description: "Customer confirms successful installation and service activation",
        category: "general",
        priority: "low",
        status: "resolved",
        assignedTo: "Installation Team",
        createdAt: "2024-01-12T11:00:00Z",
        updatedAt: "2024-01-12T15:30:00Z",
        resolvedAt: "2024-01-12T15:30:00Z",
        customerSatisfaction: 5,
      },
      {
        id: "TCK-2024-005",
        customerId: "cust-005",
        customerName: "Ali Hashemi",
        subject: "Complaint about service quality",
        description: "Customer reports poor service quality and frequent outages",
        category: "complaint",
        priority: "critical",
        status: "open",
        createdAt: "2024-01-15T16:45:00Z",
        updatedAt: "2024-01-15T16:45:00Z",
      },
    ];

    setTickets(mockTickets);
  };

  const filterTickets = () => {
    let filtered = tickets;

    if (searchTerm) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((ticket) => ticket.priority === priorityFilter);
    }

    setFilteredTickets(filtered);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "pending_customer":
        return <User className="h-4 w-4 text-blue-500" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "closed":
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "technical":
        return "bg-blue-100 text-blue-800";
      case "billing":
        return "bg-purple-100 text-purple-800";
      case "service":
        return "bg-green-100 text-green-800";
      case "complaint":
        return "bg-red-100 text-red-800";
      case "general":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const ticketStats = {
    totalTickets: tickets.length,
    openTickets: tickets.filter(t => t.status === "open").length,
    inProgressTickets: tickets.filter(t => t.status === "in_progress").length,
    resolvedTickets: tickets.filter(t => t.status === "resolved").length,
    avgResolutionTime: "2.3 days",
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Customer Support</h2>
            <p className="text-muted-foreground">Manage customer support tickets and inquiries</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Ticket
          </Button>
        </div>

        {/* Support Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
              <Headphones className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ticketStats.totalTickets}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{ticketStats.openTickets}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{ticketStats.inProgressTickets}</div>
              <p className="text-xs text-muted-foreground">Being worked on</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{ticketStats.resolvedTickets}</div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Resolution</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ticketStats.avgResolutionTime}</div>
              <p className="text-xs text-muted-foreground">Response time</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tickets" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets by customer, subject, or ID..."
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
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="pending_customer">Pending Customer</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tickets Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-mono text-sm">
                          {ticket.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{ticket.customerName}</p>
                            <p className="text-xs text-muted-foreground">ID: {ticket.customerId}</p>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <p className="font-medium truncate">{ticket.subject}</p>
                          <p className="text-xs text-muted-foreground truncate">{ticket.description}</p>
                        </TableCell>
                        <TableCell>
                          <Badge className={getCategoryColor(ticket.category)}>
                            {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(ticket.status)}
                            <span className="text-sm">{ticket.status.replace("_", " ").toUpperCase()}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {ticket.assignedTo || "Unassigned"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(ticket.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setIsTicketModalOpen(true);
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

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Support Analytics</CardTitle>
                <CardDescription>Ticket volume and resolution trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg border-2 border-dashed">
                  <div className="text-center">
                    <MessageCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Support analytics charts would be implemented here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Ticket Details Modal */}
        <Dialog open={isTicketModalOpen} onOpenChange={setIsTicketModalOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Ticket Details</DialogTitle>
              <DialogDescription>Complete ticket information</DialogDescription>
            </DialogHeader>
            {selectedTicket && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ticket ID</Label>
                    <p className="text-sm font-mono">{selectedTicket.id}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedTicket.status)}
                      <span>{selectedTicket.status.replace("_", " ").toUpperCase()}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Customer</Label>
                    <p className="text-sm font-medium">{selectedTicket.customerName}</p>
                    <p className="text-xs text-muted-foreground">ID: {selectedTicket.customerId}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Assigned To</Label>
                    <p className="text-sm">{selectedTicket.assignedTo || "Unassigned"}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <p className="text-sm font-medium">{selectedTicket.subject}</p>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <p className="text-sm">{selectedTicket.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Badge className={getCategoryColor(selectedTicket.category)}>
                      {selectedTicket.category.charAt(0).toUpperCase() + selectedTicket.category.slice(1)}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Badge className={getPriorityColor(selectedTicket.priority)}>
                      {selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label>Created</Label>
                    <p className="text-sm">{formatDate(selectedTicket.createdAt)}</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsTicketModalOpen(false)}>
                Close
              </Button>
              <Button>Update Ticket</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}