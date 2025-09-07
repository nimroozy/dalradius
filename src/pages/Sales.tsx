import React, { useState, useEffect, createContext, useContext } from "react";
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
import { Lead, LeadStatus } from "@/types";
import { BarChart3, CheckCircle, Filter, PlusCircle, Search, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data
const mockLeads: Lead[] = [
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
    customerName: "Jane Doe",
    mobileNumber: "+1987654321",
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
    status: "initiated",
    salesAgent: "1",
    createdAt: "2023-08-02T09:15:00Z",
    updatedAt: "2023-08-02T09:15:00Z",
  },
  {
    id: "3",
    customerName: "Robert Johnson",
    mobileNumber: "+1567891234",
    package: "Standard 75Mbps",
    cp: "Ubiquiti LiteBeam",
    router: "TP-Link Archer C8",
    cable: "CAT6 40m",
    pole: "Standard 2m",
    cpPrice: 85,
    routerPrice: 55,
    cablePrice: 20,
    polePrice: 25,
    packagePrice: 40,
    totalPrice: 225,
    status: "not_agreed",
    salesAgent: "1",
    createdAt: "2023-08-03T11:30:00Z",
    updatedAt: "2023-08-03T16:45:00Z",
    reasonIfNotAgreed: "Customer found cheaper alternative",
  },
];

// Mock packages and equipment options
const packages = [
  { id: "basic", name: "Basic 50Mbps", price: 30 },
  { id: "standard", name: "Standard 75Mbps", price: 40 },
  { id: "premium", name: "Premium 100Mbps", price: 50 },
  { id: "ultra", name: "Ultra 200Mbps", price: 75 },
];

const cpOptions = [
  { id: "litebeam", name: "Ubiquiti LiteBeam", price: 85 },
  { id: "nanobeam", name: "Ubiquiti NanoBeam", price: 75 },
  { id: "powerbeam", name: "Ubiquiti PowerBeam", price: 95 },
];

const routerOptions = [
  { id: "tplink6", name: "TP-Link Archer C6", price: 45 },
  { id: "tplink7", name: "TP-Link Archer C7", price: 65 },
  { id: "tplink8", name: "TP-Link Archer C8", price: 55 },
];

const cableOptions = [
  { id: "cat6-30", name: "CAT6 30m", price: 15 },
  { id: "cat6-40", name: "CAT6 40m", price: 20 },
  { id: "cat6-50", name: "CAT6 50m", price: 25 },
];

const poleOptions = [
  { id: "none", name: "None", price: 0 },
  { id: "pole-2m", name: "Standard 2m", price: 25 },
  { id: "pole-3m", name: "Standard 3m", price: 35 },
];

// Currency conversion rates
const conversionRates = {
  USD: 1,
  AFN: 78.5, // Example conversion rate: 1 USD = 78.5 AFN
};

// Create a context to share the formatPrice function with child components
interface CurrencyContextType {
  formatPrice: (price: number) => string;
  currency: "USD" | "AFN";
}

const CurrencyContext = createContext<CurrencyContextType>({
  formatPrice: () => "",
  currency: "USD"
});

export default function Sales() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [currency, setCurrency] = useState<"USD" | "AFN">("USD");
  
  // New lead form state
  const [newLead, setNewLead] = useState({
    customerName: "",
    mobileNumber: "",
    package: "",
    cp: "",
    router: "",
    cable: "",
    pole: "",
  });
  
  // Current prices based on selections (always stored in USD)
  const [prices, setPrices] = useState({
    package: 0,
    cp: 0,
    router: 0,
    cable: 0,
    pole: 0,
    total: 0,
  });

  // Format price based on selected currency
  const formatPrice = (price: number) => {
    const convertedPrice = price * conversionRates[currency];
    return `${currency === "USD" ? "$" : "؋"}${convertedPrice.toFixed(2)}`;
  };

  // Update prices when selections change
  const updatePrice = (type: string, value: string) => {
    const newPrices = { ...prices };
    
    switch (type) {
      case "package": {
        const selectedPackage = packages.find((p) => p.id === value);
        newPrices.package = selectedPackage ? selectedPackage.price : 0;
        break;
      }
      case "cp": {
        const selectedCp = cpOptions.find((cp) => cp.id === value);
        newPrices.cp = selectedCp ? selectedCp.price : 0;
        break;
      }
      case "router": {
        const selectedRouter = routerOptions.find((r) => r.id === value);
        newPrices.router = selectedRouter ? selectedRouter.price : 0;
        break;
      }
      case "cable": {
        const selectedCable = cableOptions.find((c) => c.id === value);
        newPrices.cable = selectedCable ? selectedCable.price : 0;
        break;
      }
      case "pole": {
        const selectedPole = poleOptions.find((p) => p.id === value);
        newPrices.pole = selectedPole ? selectedPole.price : 0;
        break;
      }
    }
    
    updateTotalPrice();
  };

  // Update total price based on all individual prices
  const updateTotalPrice = () => {
    const newPrices = { ...prices };
    newPrices.total = newPrices.package + newPrices.cp + newPrices.router + newPrices.cable + newPrices.pole;
    setPrices(newPrices);
  };

  // Handle price input changes
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Convert from current currency to USD for storage
    const priceValue = (parseFloat(value) || 0) / conversionRates[currency];
    
    setPrices({
      ...prices,
      [name]: priceValue,
      // We'll update total in the useEffect
    });
  };

  // Update total price whenever individual prices change
  useEffect(() => {
    updateTotalPrice();
  }, [prices.package, prices.cp, prices.router, prices.cable, prices.pole]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewLead({
      ...newLead,
      [name]: value,
    });
    
    // For select inputs, update the price
    if (["package", "cp", "router", "cable", "pole"].includes(name)) {
      updatePrice(name, value);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewLead({
      ...newLead,
      [name]: value,
    });
    updatePrice(name, value);
  };

  const handleAddLead = () => {
    // Generate a new lead object
    const newLeadObj: Lead = {
      id: `lead-${Date.now()}`,
      customerName: newLead.customerName,
      mobileNumber: newLead.mobileNumber,
      package: packages.find((p) => p.id === newLead.package)?.name || "",
      cp: cpOptions.find((cp) => cp.id === newLead.cp)?.name || "",
      router: routerOptions.find((r) => r.id === newLead.router)?.name || "",
      cable: cableOptions.find((c) => c.id === newLead.cable)?.name || "",
      pole: poleOptions.find((p) => p.id === newLead.pole)?.name || "",
      cpPrice: prices.cp,
      routerPrice: prices.router,
      cablePrice: prices.cable,
      polePrice: prices.pole,
      packagePrice: prices.package,
      totalPrice: prices.total,
      status: "initiated",
      salesAgent: "1", // In a real app, this would be the current user's ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Add to leads list
    setLeads([newLeadObj, ...leads]);
    
    // Reset form and close dialog
    setNewLead({
      customerName: "",
      mobileNumber: "",
      package: "",
      cp: "",
      router: "",
      cable: "",
      pole: "",
    });
    setPrices({
      package: 0,
      cp: 0,
      router: 0,
      cable: 0,
      pole: 0,
      total: 0,
    });
    setIsAddLeadOpen(false);
  };

  const updateLeadStatus = (leadId: string, status: LeadStatus, reason?: string) => {
    setLeads(
      leads.map((lead) => {
        if (lead.id === leadId) {
          return {
            ...lead,
            status,
            updatedAt: new Date().toISOString(),
            reasonIfNotAgreed: status === "not_agreed" ? reason : undefined,
          };
        }
        return lead;
      })
    );
  };

  // Filter leads based on active tab and search query
  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = activeTab === "all" || lead.status === activeTab;
    const matchesSearch = 
      searchQuery === "" || 
      lead.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.mobileNumber.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  // Create currency context value
  const currencyContextValue = {
    formatPrice,
    currency
  };

  return (
    <CurrencyContext.Provider value={currencyContextValue}>
      <DashboardLayout>
        <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
          <Button onClick={() => setIsAddLeadOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Lead
          </Button>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name or phone number..."
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
            <TabsTrigger value="all">All Leads</TabsTrigger>
            <TabsTrigger value="initiated">Initiated</TabsTrigger>
            <TabsTrigger value="agreed">Agreed</TabsTrigger>
            <TabsTrigger value="not_agreed">Not Agreed</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <LeadTable 
              leads={filteredLeads} 
              updateLeadStatus={updateLeadStatus}
            />
          </TabsContent>
          <TabsContent value="initiated" className="mt-4">
            <LeadTable 
              leads={filteredLeads} 
              updateLeadStatus={updateLeadStatus}
            />
          </TabsContent>
          <TabsContent value="agreed" className="mt-4">
            <LeadTable 
              leads={filteredLeads} 
              updateLeadStatus={updateLeadStatus}
            />
          </TabsContent>
          <TabsContent value="not_agreed" className="mt-4">
            <LeadTable 
              leads={filteredLeads} 
              updateLeadStatus={updateLeadStatus}
            />
          </TabsContent>
        </Tabs>

        {/* Sales Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sales Summary</CardTitle>
            <CardDescription>Overview of your sales performance</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Total Leads</span>
              <span className="text-2xl font-bold">{leads.length}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Conversion Rate</span>
              <span className="text-2xl font-bold">
                {leads.length > 0
                  ? Math.round((leads.filter(l => l.status === "agreed").length / leads.length) * 100)
                  : 0}%
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Potential Revenue</span>
              <span className="text-2xl font-bold">
                {formatPrice(leads.filter(l => l.status === "agreed").reduce((sum, lead) => sum + lead.totalPrice, 0))}
              </span>
            </div>
            <div className="flex items-center justify-end">
              <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/reports")}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Full Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Lead Dialog */}
      <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
            <DialogDescription>
              Enter the customer details and package information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  name="customerName"
                  value={newLead.customerName}
                  onChange={handleInputChange}
                  placeholder="John Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  name="mobileNumber"
                  value={newLead.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="+1234567890"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="package">Internet Package</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("package", value)}
                  value={newLead.package}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select package" />
                  </SelectTrigger>
                  <SelectContent>
                    {packages.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        {pkg.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="packagePrice">Package Price ({currency})</Label>
                <Input
                  id="packagePrice"
                  name="package"
                  type="number"
                  min="0"
                  step="0.01"
                  value={(prices.package * conversionRates[currency]) || ""}
                  onChange={handlePriceChange}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="cp">Client Premise Equipment (CP)</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("cp", value)}
                  value={newLead.cp}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select CP" />
                  </SelectTrigger>
                  <SelectContent>
                    {cpOptions.map((cp) => (
                      <SelectItem key={cp.id} value={cp.id}>
                        {cp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpPrice">CP Price ({currency})</Label>
                <Input
                  id="cpPrice"
                  name="cp"
                  type="number"
                  min="0"
                  step="0.01"
                  value={(prices.cp * conversionRates[currency]) || ""}
                  onChange={handlePriceChange}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="router">Router</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("router", value)}
                  value={newLead.router}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select router" />
                  </SelectTrigger>
                  <SelectContent>
                    {routerOptions.map((router) => (
                      <SelectItem key={router.id} value={router.id}>
                        {router.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="routerPrice">Router Price ({currency})</Label>
                <Input
                  id="routerPrice"
                  name="router"
                  type="number"
                  min="0"
                  step="0.01"
                  value={(prices.router * conversionRates[currency]) || ""}
                  onChange={handlePriceChange}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="cable">Network Cable</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("cable", value)}
                  value={newLead.cable}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cable" />
                  </SelectTrigger>
                  <SelectContent>
                    {cableOptions.map((cable) => (
                      <SelectItem key={cable.id} value={cable.id}>
                        {cable.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cablePrice">Cable Price ({currency})</Label>
                <Input
                  id="cablePrice"
                  name="cable"
                  type="number"
                  min="0"
                  step="0.01"
                  value={(prices.cable * conversionRates[currency]) || ""}
                  onChange={handlePriceChange}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="pole">Pole</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("pole", value)}
                  value={newLead.pole}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pole" />
                  </SelectTrigger>
                  <SelectContent>
                    {poleOptions.map((pole) => (
                      <SelectItem key={pole.id} value={pole.id}>
                        {pole.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="polePrice">Pole Price ({currency})</Label>
                <Input
                  id="polePrice"
                  name="pole"
                  type="number"
                  min="0"
                  step="0.01"
                  value={(prices.pole * conversionRates[currency]) || ""}
                  onChange={handlePriceChange}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 items-end">
              <div className="space-y-2 col-span-1">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  onValueChange={(value) => setCurrency(value as "USD" | "AFN")}
                  value={currency}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="AFN">AFN (؋)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Card className="w-full col-span-2">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold">Total Price</div>
                    <div className="text-2xl font-bold">{formatPrice(prices.total)}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddLeadOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLead}>Add Lead</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </DashboardLayout>
    </CurrencyContext.Provider>
  );
}

interface LeadTableProps {
  leads: Lead[];
  updateLeadStatus: (leadId: string, status: LeadStatus, reason?: string) => void;
}

function LeadTable({ leads, updateLeadStatus }: LeadTableProps) {
  const [reasonInput, setReasonInput] = useState<string>("");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [showReasonDialog, setShowReasonDialog] = useState<boolean>(false);
  
  // Import the currency context from the parent component
  const { formatPrice } = React.useContext(CurrencyContext);

  const handleStatusChange = (leadId: string, status: LeadStatus) => {
    if (status === "not_agreed") {
      setSelectedLeadId(leadId);
      setShowReasonDialog(true);
    } else {
      updateLeadStatus(leadId, status);
    }
  };

  const submitReason = () => {
    if (selectedLeadId) {
      updateLeadStatus(selectedLeadId, "not_agreed", reasonInput);
      setReasonInput("");
      setSelectedLeadId(null);
      setShowReasonDialog(false);
    }
  };

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No leads found</h3>
        <p className="text-sm text-muted-foreground">
          No leads match your current filters or search criteria.
        </p>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Package</TableHead>
                <TableHead className="text-right">Total Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.customerName}</TableCell>
                  <TableCell>{lead.mobileNumber}</TableCell>
                  <TableCell>{lead.package}</TableCell>
                  <TableCell className="text-right">{formatPrice(lead.totalPrice)}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        lead.status === "agreed"
                          ? "bg-green-50 text-green-700"
                          : lead.status === "not_agreed"
                          ? "bg-red-50 text-red-700"
                          : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {lead.status === "agreed" && (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      )}
                      {lead.status === "not_agreed" && (
                        <XCircle className="mr-1 h-3 w-3" />
                      )}
                      {lead.status === "initiated" ? "Initiated" : lead.status === "agreed" ? "Agreed" : "Not Agreed"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {lead.status === "initiated" && (
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                          onClick={() => handleStatusChange(lead.id, "agreed")}
                        >
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Agreed
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
                          onClick={() => handleStatusChange(lead.id, "not_agreed")}
                        >
                          <XCircle className="mr-1 h-3 w-3" />
                          Not Agreed
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reason Dialog for Not Agreed */}
      <Dialog open={showReasonDialog} onOpenChange={setShowReasonDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Provide Reason</DialogTitle>
            <DialogDescription>
              Please specify why the customer didn't agree to the package.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              placeholder="Customer's reason for not agreeing..."
              value={reasonInput}
              onChange={(e) => setReasonInput(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReasonDialog(false)}>
              Cancel
            </Button>
            <Button onClick={submitReason}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}