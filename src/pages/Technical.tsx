import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, CheckCircle, XCircle, AlertTriangle, Clock } from "lucide-react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Task, TaskStatus, Lead } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Mock data for technicians
const technicians = [
  { id: "tech1", name: "Alex Johnson" },
  { id: "tech2", name: "Sarah Williams" },
  { id: "tech3", name: "Michael Brown" },
];

// Mock leads data (previously agreed leads)
const mockAgreedLeads: Lead[] = [
  {
    id: "1",
    customerName: "John Smith",
    mobileNumber: "+1234567890",
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
    createdAt: "2023-08-01T12:00:00Z",
    updatedAt: "2023-08-01T14:30:00Z",
  },
  {
    id: "2",
    customerName: "Alice Johnson",
    mobileNumber: "+1222333444",
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
    createdAt: "2023-08-02T09:15:00Z",
    updatedAt: "2023-08-02T09:15:00Z",
  },
];

// Mock tasks data
const mockTasks: Task[] = [
  {
    id: "task1",
    leadId: "1",
    lead: mockAgreedLeads[0],
    status: "pending_los",
    technicalManagerId: "3",
    createdAt: "2023-08-01T15:00:00Z",
    updatedAt: "2023-08-01T15:00:00Z",
  },
  {
    id: "task2",
    leadId: "2",
    lead: mockAgreedLeads[1],
    status: "los_confirmed",
    technicalManagerId: "3",
    createdAt: "2023-08-02T10:00:00Z",
    updatedAt: "2023-08-02T14:30:00Z",
  },
];

export default function Technical() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("pending");
  
  // Dialog states
  const [losDialogOpen, setLosDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<string>("");
  const [installationDate, setInstallationDate] = useState<string>("");
  const [losResult, setLosResult] = useState<"confirmed" | "rejected">("confirmed");
  const [losNotes, setLosNotes] = useState<string>("");
  const [losRejectionReason, setLosRejectionReason] = useState<string>("");
  
  const selectedTask = selectedTaskId ? tasks.find(task => task.id === selectedTaskId) : null;

  const handleLosCheck = (taskId: string) => {
    setSelectedTaskId(taskId);
    setLosDialogOpen(true);
  };

  const handleAssignTechnician = (taskId: string) => {
    setSelectedTaskId(taskId);
    setAssignDialogOpen(true);
  };

  const submitLosCheck = () => {
    if (!selectedTaskId) return;
    
    setTasks(tasks.map(task => {
      if (task.id === selectedTaskId) {
        return {
          ...task,
          status: losResult === "confirmed" ? "los_confirmed" : "los_rejected",
          updatedAt: new Date().toISOString(),
          reasonIfNotInstalled: losResult === "rejected" ? losRejectionReason : undefined,
        };
      }
      return task;
    }));
    
    setLosDialogOpen(false);
    setLosNotes("");
    setLosRejectionReason("");
    setLosResult("confirmed");
  };

  const submitAssignment = () => {
    if (!selectedTaskId || !selectedTechnician || !installationDate) return;
    
    setTasks(tasks.map(task => {
      if (task.id === selectedTaskId) {
        return {
          ...task,
          status: "assigned",
          assignedTechnicianId: selectedTechnician,
          installationDate,
          updatedAt: new Date().toISOString(),
        };
      }
      return task;
    }));
    
    setAssignDialogOpen(false);
    setSelectedTechnician("");
    setInstallationDate("");
  };

  // Filter tasks based on active tab and search query
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      searchQuery === "" || 
      task.lead.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.lead.mobileNumber.includes(searchQuery);
    
    if (activeTab === "pending") {
      return (task.status === "pending_los" || task.status === "los_confirmed") && matchesSearch;
    } else if (activeTab === "assigned") {
      return (task.status === "assigned" || task.status === "in_progress") && matchesSearch;
    } else if (activeTab === "completed") {
      return (task.status === "installed" || task.status === "not_installed") && matchesSearch;
    }
    
    return matchesSearch;
  });

  // Helper function to get status display
  const getStatusDisplay = (status: TaskStatus) => {
    const statusConfig = {
      pending_los: { label: "Pending LOS", color: "bg-yellow-50 text-yellow-700", icon: <Clock className="mr-1 h-3 w-3" /> },
      los_confirmed: { label: "LOS Confirmed", color: "bg-green-50 text-green-700", icon: <CheckCircle className="mr-1 h-3 w-3" /> },
      los_rejected: { label: "LOS Rejected", color: "bg-red-50 text-red-700", icon: <XCircle className="mr-1 h-3 w-3" /> },
      assigned: { label: "Assigned", color: "bg-blue-50 text-blue-700", icon: null },
      in_progress: { label: "In Progress", color: "bg-indigo-50 text-indigo-700", icon: null },
      installed: { label: "Installed", color: "bg-green-50 text-green-700", icon: <CheckCircle className="mr-1 h-3 w-3" /> },
      not_installed: { label: "Not Installed", color: "bg-red-50 text-red-700", icon: <XCircle className="mr-1 h-3 w-3" /> },
    };
    
    const config = statusConfig[status];
    return (
      <Badge variant="outline" className={`${config.color}`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Technical Operations</h1>
          <p className="text-muted-foreground">
            Manage LOS checks, technician assignments and installations
          </p>
        </div>
        
        {/* Search and filters */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search customers..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Tabs for different task statuses */}
        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="assigned">Assigned</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="pending" className="mt-4">
            <TasksTable 
              tasks={filteredTasks}
              onLosCheck={handleLosCheck}
              onAssignTechnician={handleAssignTechnician}
              getStatusDisplay={getStatusDisplay}
            />
          </TabsContent>
          <TabsContent value="assigned" className="mt-4">
            <TasksTable 
              tasks={filteredTasks}
              onLosCheck={handleLosCheck}
              onAssignTechnician={handleAssignTechnician}
              getStatusDisplay={getStatusDisplay}
            />
          </TabsContent>
          <TabsContent value="completed" className="mt-4">
            <TasksTable 
              tasks={filteredTasks}
              onLosCheck={handleLosCheck}
              onAssignTechnician={handleAssignTechnician}
              getStatusDisplay={getStatusDisplay}
            />
          </TabsContent>
        </Tabs>

        {/* Technical team overview */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Team Overview</CardTitle>
            <CardDescription>Current technician workload and schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="text-sm font-medium">Alex Johnson</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                  Available
                </div>
                <div className="text-xs text-muted-foreground">3 pending installations</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Sarah Williams</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2" />
                  On Site
                </div>
                <div className="text-xs text-muted-foreground">1 pending installation</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Michael Brown</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                  Unavailable
                </div>
                <div className="text-xs text-muted-foreground">Off duty</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* LOS Check Dialog */}
      <Dialog open={losDialogOpen} onOpenChange={setLosDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Line of Sight (LOS) Check</DialogTitle>
            <DialogDescription>
              {selectedTask && (
                <span>Customer: {selectedTask.lead.customerName} ({selectedTask.lead.mobileNumber})</span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>LOS Check Result</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="los-confirmed"
                    name="los-result"
                    checked={losResult === "confirmed"}
                    onChange={() => setLosResult("confirmed")}
                    className="h-4 w-4 rounded-full"
                  />
                  <Label htmlFor="los-confirmed" className="cursor-pointer">Confirmed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="los-rejected"
                    name="los-result"
                    checked={losResult === "rejected"}
                    onChange={() => setLosResult("rejected")}
                    className="h-4 w-4 rounded-full"
                  />
                  <Label htmlFor="los-rejected" className="cursor-pointer">Rejected</Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="los-notes">Notes</Label>
              <Textarea
                id="los-notes"
                placeholder="Additional information about the LOS check..."
                value={losNotes}
                onChange={(e) => setLosNotes(e.target.value)}
              />
            </div>
            
            {losResult === "rejected" && (
              <div className="space-y-2">
                <Label htmlFor="rejection-reason" className="text-destructive">Rejection Reason</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Why is the LOS check rejected?"
                  value={losRejectionReason}
                  onChange={(e) => setLosRejectionReason(e.target.value)}
                  className="border-destructive"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLosDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitLosCheck}>
              Submit LOS Check
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Technician Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Assign Technician</DialogTitle>
            <DialogDescription>
              {selectedTask && (
                <span>Customer: {selectedTask.lead.customerName} ({selectedTask.lead.mobileNumber})</span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="technician">Technician</Label>
              <Select
                value={selectedTechnician}
                onValueChange={setSelectedTechnician}
              >
                <SelectTrigger id="technician">
                  <SelectValue placeholder="Select technician" />
                </SelectTrigger>
                <SelectContent>
                  {technicians.map((tech) => (
                    <SelectItem key={tech.id} value={tech.id}>
                      {tech.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="installation-date">Installation Date</Label>
              <Input
                id="installation-date"
                type="datetime-local"
                value={installationDate}
                onChange={(e) => setInstallationDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={submitAssignment}
              disabled={!selectedTechnician || !installationDate}
            >
              Assign Technician
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

interface TasksTableProps {
  tasks: Task[];
  onLosCheck: (taskId: string) => void;
  onAssignTechnician: (taskId: string) => void;
  getStatusDisplay: (status: TaskStatus) => React.ReactNode;
}

function TasksTable({ tasks, onLosCheck, onAssignTechnician, getStatusDisplay }: TasksTableProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3">
          <CheckCircle className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No tasks</h3>
        <p className="text-sm text-muted-foreground">
          There are no tasks that match your current filters.
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
              <TableHead>Package</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">
                  {task.lead.customerName}
                  <div className="text-xs text-muted-foreground">{task.lead.mobileNumber}</div>
                </TableCell>
                <TableCell>{task.lead.package}</TableCell>
                <TableCell>
                  {getStatusDisplay(task.status)}
                </TableCell>
                <TableCell>
                  {task.installationDate ? (
                    <span>
                      {new Date(task.installationDate).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs">Not scheduled</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {task.status === "pending_los" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={() => onLosCheck(task.id)}
                      >
                        LOS Check
                      </Button>
                    )}
                    {task.status === "los_confirmed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={() => onAssignTechnician(task.id)}
                      >
                        Assign Technician
                      </Button>
                    )}
                    {(task.status === "assigned" || task.status === "in_progress") && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                      >
                        View Details
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