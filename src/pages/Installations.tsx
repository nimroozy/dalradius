import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import { Task, TaskStatus } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { CalendarDays, CheckCircle, MapPin, Package, XCircle } from "lucide-react";

// Mock data for installations
const mockInstallations: Task[] = [
  {
    id: "task3",
    leadId: "3",
    lead: {
      id: "3",
      customerName: "Emily Davis",
      mobileNumber: "+1345678901",
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
      createdAt: "2023-08-01",
      updatedAt: "2023-08-01",
    },
    status: "assigned",
    assignedTechnicianId: "4",
    technicalManagerId: "3",
    installationDate: "2023-09-15T10:00:00Z",
    createdAt: "2023-08-05",
    updatedAt: "2023-08-10",
  },
  {
    id: "task4",
    leadId: "4",
    lead: {
      id: "4",
      customerName: "Michael Wilson",
      mobileNumber: "+1456789012",
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
      createdAt: "2023-08-02",
      updatedAt: "2023-08-02",
    },
    status: "in_progress",
    assignedTechnicianId: "4",
    technicalManagerId: "3",
    installationDate: "2023-09-12T14:00:00Z",
    createdAt: "2023-08-06",
    updatedAt: "2023-08-12",
  },
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

export default function Installations() {
  const { user } = useAuth();
  const [installations, setInstallations] = useState<Task[]>(mockInstallations);
  const [activeTab, setActiveTab] = useState<string>("upcoming");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [updateStatusDialog, setUpdateStatusDialog] = useState(false);
  const [statusNotes, setStatusNotes] = useState("");
  const [newStatus, setNewStatus] = useState<TaskStatus>("in_progress");
  const [notInstalledReason, setNotInstalledReason] = useState("");

  // Filter installations based on the active tab
  const filteredInstallations = installations.filter(task => {
    if (activeTab === "upcoming") {
      return task.status === "assigned";
    } else if (activeTab === "in_progress") {
      return task.status === "in_progress";
    } else if (activeTab === "completed") {
      return task.status === "installed" || task.status === "not_installed";
    }
    return true;
  });

  const openUpdateDialog = (task: Task, status: TaskStatus) => {
    setSelectedTask(task);
    setNewStatus(status);
    setUpdateStatusDialog(true);
  };

  const updateInstallationStatus = () => {
    if (!selectedTask) return;

    const updatedTasks = installations.map(task => {
      if (task.id === selectedTask.id) {
        return {
          ...task,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          reasonIfNotInstalled: newStatus === "not_installed" ? notInstalledReason : undefined,
        };
      }
      return task;
    });

    setInstallations(updatedTasks);
    setUpdateStatusDialog(false);
    setStatusNotes("");
    setNotInstalledReason("");
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case "assigned":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Assigned</Badge>;
      case "in_progress":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">In Progress</Badge>;
      case "installed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Installed</Badge>;
      case "not_installed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Not Installed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Installations</h1>
          <p className="text-muted-foreground">
            Manage your assigned installation tasks
          </p>
        </div>

        {/* Tabs for filtering installations */}
        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          {/* Tab content */}
          {["upcoming", "in_progress", "completed"].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-4">
              {filteredInstallations.length === 0 ? (
                <Card className="flex flex-col items-center justify-center p-12 text-center">
                  <div className="rounded-full bg-muted p-3">
                    <CheckCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">No installations</h3>
                  <p className="text-muted-foreground">
                    {tab === "upcoming" 
                      ? "You don't have any upcoming installations." 
                      : tab === "in_progress" 
                      ? "You don't have any installations in progress." 
                      : "You don't have any completed installations."}
                  </p>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {filteredInstallations.map((installation) => (
                    <InstallationCard
                      key={installation.id}
                      installation={installation}
                      onUpdateStatus={openUpdateDialog}
                      getStatusBadge={getStatusBadge}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Today's schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your installations for today</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>09:00 AM</TableCell>
                  <TableCell>Sophia Brown</TableCell>
                  <TableCell>123 Main St</TableCell>
                  <TableCell>{getStatusBadge("installed")}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>02:00 PM</TableCell>
                  <TableCell>Michael Wilson</TableCell>
                  <TableCell>456 Oak Ave</TableCell>
                  <TableCell>{getStatusBadge("in_progress")}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>04:30 PM</TableCell>
                  <TableCell>Emily Davis</TableCell>
                  <TableCell>789 Pine Rd</TableCell>
                  <TableCell>{getStatusBadge("assigned")}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Update Status Dialog */}
      <Dialog open={updateStatusDialog} onOpenChange={setUpdateStatusDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Installation Status</DialogTitle>
            <DialogDescription>
              {selectedTask && (
                <span>Customer: {selectedTask.lead.customerName} ({selectedTask.lead.mobileNumber})</span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>New Status</Label>
              <div className="flex gap-4">
                {newStatus === "in_progress" && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-amber-500" />
                    <span>In Progress</span>
                  </div>
                )}
                {newStatus === "installed" && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Installed</span>
                  </div>
                )}
                {newStatus === "not_installed" && (
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span>Not Installed</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status-notes">Notes</Label>
              <Textarea
                id="status-notes"
                placeholder="Add any notes about the installation..."
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
              />
            </div>
            
            {newStatus === "not_installed" && (
              <div className="space-y-2">
                <Label htmlFor="not-installed-reason" className="text-destructive">
                  Reason Not Installed
                </Label>
                <Textarea
                  id="not-installed-reason"
                  placeholder="Please explain why the installation couldn't be completed..."
                  value={notInstalledReason}
                  onChange={(e) => setNotInstalledReason(e.target.value)}
                  className="border-destructive"
                  required
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateStatusDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={updateInstallationStatus}
              disabled={newStatus === "not_installed" && !notInstalledReason}
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

interface InstallationCardProps {
  installation: Task;
  onUpdateStatus: (task: Task, status: TaskStatus) => void;
  getStatusBadge: (status: TaskStatus) => React.ReactNode;
}

function InstallationCard({ installation, onUpdateStatus, getStatusBadge }: InstallationCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  const isUpcoming = installation.status === "assigned";
  const isInProgress = installation.status === "in_progress";
  const isCompleted = installation.status === "installed" || installation.status === "not_installed";

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{installation.lead.customerName}</h3>
              {getStatusBadge(installation.status)}
            </div>
            <div className="text-sm text-muted-foreground">{installation.lead.mobileNumber}</div>
            <div className="flex items-center text-sm text-muted-foreground gap-1">
              <MapPin className="h-4 w-4" /> 
              <span>123 Sample Street, City</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground gap-1">
              <CalendarDays className="h-4 w-4" /> 
              <span>{installation.installationDate ? formatDate(installation.installationDate) : 'Not scheduled'}</span>
            </div>
            <div className="flex items-center text-sm font-medium gap-1 mt-1">
              <Package className="h-4 w-4" /> 
              <span>{installation.lead.package}</span>
            </div>
          </div>
          
          <div className="flex flex-col justify-between gap-2">
            <div className="text-sm">
              <div className="font-medium">Equipment</div>
              <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                <li>• {installation.lead.cp}</li>
                <li>• {installation.lead.router}</li>
                <li>• {installation.lead.cable}</li>
                {installation.lead.pole !== "None" && <li>• {installation.lead.pole}</li>}
              </ul>
            </div>
            
            <div className="flex gap-2 mt-4">
              {isUpcoming && (
                <Button 
                  variant="outline" 
                  onClick={() => onUpdateStatus(installation, "in_progress")}
                >
                  Start Installation
                </Button>
              )}
              {isInProgress && (
                <>
                  <Button 
                    variant="outline" 
                    className="bg-green-50 text-green-700 hover:bg-green-100"
                    onClick={() => onUpdateStatus(installation, "installed")}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark Installed
                  </Button>
                  <Button 
                    variant="outline" 
                    className="bg-red-50 text-red-700 hover:bg-red-100"
                    onClick={() => onUpdateStatus(installation, "not_installed")}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Not Installed
                  </Button>
                </>
              )}
              {isCompleted && (
                <Button variant="outline">View Details</Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}