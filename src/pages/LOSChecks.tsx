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
import { 
  Filter, 
  PlusCircle, 
  Search, 
  Calendar, 
  MapPin, 
  Check, 
  X, 
  AlertTriangle,
  UserCheck,
  Radio,
  RadioTower,
  FileCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// LOS Check type definition
interface LOSCheck {
  id: string;
  customerName: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  phone: string;
  status: "scheduled" | "completed" | "not_possible" | "postponed";
  scheduledDate: string;
  assignedTechnician: string;
  losResult?: {
    possible: boolean;
    signalStrength?: "excellent" | "good" | "fair" | "poor";
    obstacles?: string[];
    notes?: string;
  };
  createdAt: string;
  updatedAt: string;
  requestNotes?: string;
}

// Mock data for LOS checks
const mockLOSChecks: LOSCheck[] = [
  {
    id: "los-001",
    customerName: "John Smith",
    address: "123 Main St, City, State",
    coordinates: {
      lat: 34.0522,
      lng: -118.2437,
    },
    phone: "+1234567890",
    status: "scheduled",
    scheduledDate: "2023-08-15T10:00:00Z",
    assignedTechnician: "Mike Peterson",
    createdAt: "2023-08-10T14:30:00Z",
    updatedAt: "2023-08-10T14:30:00Z",
    requestNotes: "Customer has roof access",
  },
  {
    id: "los-002",
    customerName: "Jane Doe",
    address: "456 Oak Ave, Town, State",
    phone: "+1987654321",
    status: "completed",
    scheduledDate: "2023-08-12T13:30:00Z",
    assignedTechnician: "Sarah Johnson",
    losResult: {
      possible: true,
      signalStrength: "excellent",
      obstacles: [],
      notes: "Clear line of sight to tower. Perfect installation spot on roof.",
    },
    createdAt: "2023-08-08T09:15:00Z",
    updatedAt: "2023-08-12T15:45:00Z",
  },
  {
    id: "los-003",
    customerName: "Robert Johnson",
    address: "789 Pine Rd, Village, State",
    phone: "+1567891234",
    status: "not_possible",
    scheduledDate: "2023-08-10T11:00:00Z",
    assignedTechnician: "David Wilson",
    losResult: {
      possible: false,
      obstacles: ["Large trees", "Buildings"],
      notes: "No clear line of sight available. Too many obstacles.",
    },
    createdAt: "2023-08-05T16:30:00Z",
    updatedAt: "2023-08-10T12:15:00Z",
  },
  {
    id: "los-004",
    customerName: "Sarah Williams",
    address: "321 Elm St, City, State",
    phone: "+1456789012",
    status: "postponed",
    scheduledDate: "2023-08-11T09:00:00Z",
    assignedTechnician: "Mike Peterson",
    createdAt: "2023-08-07T10:45:00Z",
    updatedAt: "2023-08-09T08:30:00Z",
    requestNotes: "Customer requested to reschedule, busy on original date",
  },
];

// Mock list of technicians
const technicians = [
  { id: "tech-001", name: "Mike Peterson" },
  { id: "tech-002", name: "Sarah Johnson" },
  { id: "tech-003", name: "David Wilson" },
  { id: "tech-004", name: "Emma Thompson" },
];

export default function LOSChecks() {
  const navigate = useNavigate();
  const [losChecks, setLosChecks] = useState<LOSCheck[]>(mockLOSChecks);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddLosCheckOpen, setIsAddLosCheckOpen] = useState(false);
  const [isUpdateResultOpen, setIsUpdateResultOpen] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState<LOSCheck | null>(null);

  // New LOS check form state
  const [newLosCheck, setNewLosCheck] = useState({
    customerName: "",
    address: "",
    phone: "",
    scheduledDate: "",
    assignedTechnician: "",
    requestNotes: "",
  });

  // Update result form state
  const [losResult, setLosResult] = useState({
    possible: true,
    signalStrength: "good",
    obstacles: "",
    notes: "",
  });

  // Filter LOS checks based on active tab and search query
  const filteredLosChecks = losChecks.filter((check) => {
    const matchesStatus = activeTab === "all" || check.status === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      check.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      check.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      check.phone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewLosCheck({
      ...newLosCheck,
      [name]: value,
    });
  };

  const handleResultInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLosResult({
      ...losResult,
      [name]: name === "possible" ? value === "true" : value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewLosCheck({
      ...newLosCheck,
      [name]: value,
    });
  };

  const handleResultSelectChange = (name: string, value: string) => {
    setLosResult({
      ...losResult,
      [name]: name === "possible" ? value === "true" : value,
    });
  };

  const handleAddLosCheck = () => {
    // Create new LOS check object
    const now = new Date().toISOString();
    const losCheckObj: LOSCheck = {
      id: `los-${Date.now()}`,
      customerName: newLosCheck.customerName,
      address: newLosCheck.address,
      phone: newLosCheck.phone,
      status: "scheduled",
      scheduledDate: newLosCheck.scheduledDate,
      assignedTechnician: newLosCheck.assignedTechnician,
      createdAt: now,
      updatedAt: now,
      requestNotes: newLosCheck.requestNotes,
    };

    // Add to LOS checks list
    setLosChecks([losCheckObj, ...losChecks]);

    // Reset form and close dialog
    setNewLosCheck({
      customerName: "",
      address: "",
      phone: "",
      scheduledDate: "",
      assignedTechnician: "",
      requestNotes: "",
    });
    setIsAddLosCheckOpen(false);
  };

  const openUpdateResult = (check: LOSCheck) => {
    setSelectedCheck(check);
    // Initialize form with existing data if available
    if (check.losResult) {
      setLosResult({
        possible: check.losResult.possible,
        signalStrength: check.losResult.signalStrength || "good",
        obstacles: check.losResult.obstacles?.join(", ") || "",
        notes: check.losResult.notes || "",
      });
    } else {
      setLosResult({
        possible: true,
        signalStrength: "good",
        obstacles: "",
        notes: "",
      });
    }
    setIsUpdateResultOpen(true);
  };

  const handleUpdateResult = () => {
    if (selectedCheck) {
      const updatedChecks = losChecks.map((check) => {
        if (check.id === selectedCheck.id) {
          return {
            ...check,
            status: losResult.possible ? "completed" : "not_possible",
            updatedAt: new Date().toISOString(),
            losResult: {
              possible: losResult.possible,
              signalStrength: losResult.possible ? losResult.signalStrength : undefined,
              obstacles: losResult.obstacles ? losResult.obstacles.split(",").map((o) => o.trim()) : [],
              notes: losResult.notes,
            },
          };
        }
        return check;
      });
      setLosChecks(updatedChecks);
      setIsUpdateResultOpen(false);
      setSelectedCheck(null);
    }
  };

  const updateCheckStatus = (checkId: string, status: "scheduled" | "completed" | "not_possible" | "postponed") => {
    setLosChecks(
      losChecks.map((check) => {
        if (check.id === checkId) {
          return {
            ...check,
            status,
            updatedAt: new Date().toISOString(),
          };
        }
        return check;
      })
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700";
      case "not_possible":
        return "bg-red-50 text-red-700";
      case "postponed":
        return "bg-yellow-50 text-yellow-700";
      case "scheduled":
      default:
        return "bg-blue-50 text-blue-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="h-3 w-3" />;
      case "not_possible":
        return <X className="h-3 w-3" />;
      case "postponed":
        return <AlertTriangle className="h-3 w-3" />;
      case "scheduled":
      default:
        return <Calendar className="h-3 w-3" />;
    }
  };

  const formatStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "not_possible":
        return "Not Possible";
      case "postponed":
        return "Postponed";
      case "scheduled":
      default:
        return "Scheduled";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">LOS Checks</h1>
          <Button onClick={() => setIsAddLosCheckOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Schedule LOS Check
          </Button>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by customer, address or phone..."
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
            <TabsTrigger value="all">All Checks</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="not_possible">Not Possible</TabsTrigger>
            <TabsTrigger value="postponed">Postponed</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <LOSCheckTable
              losChecks={filteredLosChecks}
              onUpdateResult={openUpdateResult}
              onStatusChange={updateCheckStatus}
              formatDate={formatDate}
              getStatusBadgeClasses={getStatusBadgeClasses}
              getStatusIcon={getStatusIcon}
              formatStatusLabel={formatStatusLabel}
            />
          </TabsContent>
          <TabsContent value="scheduled" className="mt-4">
            <LOSCheckTable
              losChecks={filteredLosChecks}
              onUpdateResult={openUpdateResult}
              onStatusChange={updateCheckStatus}
              formatDate={formatDate}
              getStatusBadgeClasses={getStatusBadgeClasses}
              getStatusIcon={getStatusIcon}
              formatStatusLabel={formatStatusLabel}
            />
          </TabsContent>
          <TabsContent value="completed" className="mt-4">
            <LOSCheckTable
              losChecks={filteredLosChecks}
              onUpdateResult={openUpdateResult}
              onStatusChange={updateCheckStatus}
              formatDate={formatDate}
              getStatusBadgeClasses={getStatusBadgeClasses}
              getStatusIcon={getStatusIcon}
              formatStatusLabel={formatStatusLabel}
            />
          </TabsContent>
          <TabsContent value="not_possible" className="mt-4">
            <LOSCheckTable
              losChecks={filteredLosChecks}
              onUpdateResult={openUpdateResult}
              onStatusChange={updateCheckStatus}
              formatDate={formatDate}
              getStatusBadgeClasses={getStatusBadgeClasses}
              getStatusIcon={getStatusIcon}
              formatStatusLabel={formatStatusLabel}
            />
          </TabsContent>
          <TabsContent value="postponed" className="mt-4">
            <LOSCheckTable
              losChecks={filteredLosChecks}
              onUpdateResult={openUpdateResult}
              onStatusChange={updateCheckStatus}
              formatDate={formatDate}
              getStatusBadgeClasses={getStatusBadgeClasses}
              getStatusIcon={getStatusIcon}
              formatStatusLabel={formatStatusLabel}
            />
          </TabsContent>
        </Tabs>

        {/* Schedule LOS Check Dialog */}
        <Dialog open={isAddLosCheckOpen} onOpenChange={setIsAddLosCheckOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Schedule LOS Check</DialogTitle>
              <DialogDescription>
                Schedule a Line of Sight check with a technician.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    name="customerName"
                    value={newLosCheck.customerName}
                    onChange={handleInputChange}
                    placeholder="John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={newLosCheck.phone}
                    onChange={handleInputChange}
                    placeholder="+1234567890"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Installation Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={newLosCheck.address}
                    onChange={handleInputChange}
                    placeholder="123 Main St, City, State"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">Scheduled Date & Time</Label>
                  <Input
                    id="scheduledDate"
                    name="scheduledDate"
                    type="datetime-local"
                    value={newLosCheck.scheduledDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignedTechnician">Assigned Technician</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("assignedTechnician", value)}
                    value={newLosCheck.assignedTechnician}
                  >
                    <SelectTrigger id="assignedTechnician">
                      <SelectValue placeholder="Select technician" />
                    </SelectTrigger>
                    <SelectContent>
                      {technicians.map((tech) => (
                        <SelectItem key={tech.id} value={tech.name}>
                          {tech.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requestNotes">Notes</Label>
                  <Textarea
                    id="requestNotes"
                    name="requestNotes"
                    value={newLosCheck.requestNotes}
                    onChange={handleInputChange}
                    placeholder="Additional information about this LOS check request..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddLosCheckOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddLosCheck}>Schedule Check</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Update LOS Result Dialog */}
        <Dialog open={isUpdateResultOpen} onOpenChange={setIsUpdateResultOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Update LOS Check Result</DialogTitle>
              <DialogDescription>
                Enter the results from the Line of Sight check.
              </DialogDescription>
            </DialogHeader>
            {selectedCheck && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <div className="font-semibold">{selectedCheck.customerName}</div>
                    <div className="text-sm text-muted-foreground">{selectedCheck.address}</div>
                    <div className="text-sm">Check scheduled: {formatDate(selectedCheck.scheduledDate)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="possible">Line of Sight Possible</Label>
                    <Select
                      onValueChange={(value) => handleResultSelectChange("possible", value)}
                      value={losResult.possible ? "true" : "false"}
                    >
                      <SelectTrigger id="possible">
                        <SelectValue placeholder="Select result" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {losResult.possible && (
                    <div className="space-y-2">
                      <Label htmlFor="signalStrength">Signal Strength</Label>
                      <Select
                        onValueChange={(value) => handleResultSelectChange("signalStrength", value)}
                        value={losResult.signalStrength}
                      >
                        <SelectTrigger id="signalStrength">
                          <SelectValue placeholder="Select signal strength" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="obstacles">Obstacles (comma separated)</Label>
                    <Input
                      id="obstacles"
                      name="obstacles"
                      value={losResult.obstacles}
                      onChange={handleResultInputChange}
                      placeholder="Trees, Buildings, etc."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={losResult.notes}
                      onChange={handleResultInputChange}
                      placeholder="Details about the LOS check results..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUpdateResultOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateResult}>Save Results</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

interface LOSCheckTableProps {
  losChecks: LOSCheck[];
  onUpdateResult: (check: LOSCheck) => void;
  onStatusChange: (id: string, status: "scheduled" | "completed" | "not_possible" | "postponed") => void;
  formatDate: (dateString: string) => string;
  getStatusBadgeClasses: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  formatStatusLabel: (status: string) => string;
}

function LOSCheckTable({
  losChecks,
  onUpdateResult,
  onStatusChange,
  formatDate,
  getStatusBadgeClasses,
  getStatusIcon,
  formatStatusLabel,
}: LOSCheckTableProps) {
  if (losChecks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No LOS checks found</h3>
        <p className="text-sm text-muted-foreground">
          No LOS checks match your current filters or search criteria.
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
              <TableHead>Address</TableHead>
              <TableHead>Scheduled For</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {losChecks.map((check) => (
              <TableRow key={check.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{check.customerName}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="mr-1 h-3 w-3" />
                      <span>{check.phone}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span className="truncate max-w-[200px]">{check.address}</span>
                  </div>
                </TableCell>
                <TableCell>{formatDate(check.scheduledDate)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <UserCheck className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span>{check.assignedTechnician}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClasses(
                      check.status
                    )}`}
                  >
                    {getStatusIcon(check.status)}
                    <span className="ml-1">{formatStatusLabel(check.status)}</span>
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {check.status === "scheduled" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateResult(check)}
                          className="h-8"
                        >
                          <FileCheck className="mr-1 h-4 w-4" />
                          Update Result
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onStatusChange(check.id, "postponed")}
                          className="h-8 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                        >
                          <AlertTriangle className="mr-1 h-4 w-4" />
                          Postpone
                        </Button>
                      </>
                    )}
                    {check.status === "postponed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onStatusChange(check.id, "scheduled")}
                        className="h-8 bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        <Calendar className="mr-1 h-4 w-4" />
                        Reschedule
                      </Button>
                    )}
                    {(check.status === "completed" || check.status === "not_possible") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateResult(check)}
                        className="h-8"
                      >
                        <RadioTower className="mr-1 h-4 w-4" />
                        View Result
                      </Button>
                    )}
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