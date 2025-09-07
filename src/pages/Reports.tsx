import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ChevronDown, Download, BarChart2, PieChart as PieChartIcon, LineChart as LineChartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Report data types
type TimeRange = "week" | "month" | "quarter" | "year";

// Mock data for reports
const salesData = {
  week: [
    { name: "Mon", value: 3 },
    { name: "Tue", value: 2 },
    { name: "Wed", value: 5 },
    { name: "Thu", value: 4 },
    { name: "Fri", value: 6 },
    { name: "Sat", value: 2 },
    { name: "Sun", value: 1 },
  ],
  month: [
    { name: "Week 1", value: 12 },
    { name: "Week 2", value: 15 },
    { name: "Week 3", value: 18 },
    { name: "Week 4", value: 14 },
  ],
  quarter: [
    { name: "Jan", value: 35 },
    { name: "Feb", value: 42 },
    { name: "Mar", value: 49 },
  ],
  year: [
    { name: "Q1", value: 120 },
    { name: "Q2", value: 145 },
    { name: "Q3", value: 168 },
    { name: "Q4", value: 183 },
  ],
};

const revenueData = {
  week: [
    { name: "Mon", value: 450 },
    { name: "Tue", value: 320 },
    { name: "Wed", value: 780 },
    { name: "Thu", value: 590 },
    { name: "Fri", value: 890 },
    { name: "Sat", value: 350 },
    { name: "Sun", value: 120 },
  ],
  month: [
    { name: "Week 1", value: 1800 },
    { name: "Week 2", value: 2450 },
    { name: "Week 3", value: 2910 },
    { name: "Week 4", value: 2340 },
  ],
  quarter: [
    { name: "Jan", value: 5600 },
    { name: "Feb", value: 6700 },
    { name: "Mar", value: 7800 },
  ],
  year: [
    { name: "Q1", value: 18500 },
    { name: "Q2", value: 22400 },
    { name: "Q3", value: 25900 },
    { name: "Q4", value: 29300 },
  ],
};

const packageDistribution = [
  { name: "Basic 50Mbps", value: 35 },
  { name: "Standard 75Mbps", value: 25 },
  { name: "Premium 100Mbps", value: 30 },
  { name: "Ultra 200Mbps", value: 10 },
];

const customerGrowthData = {
  week: [
    { name: "Mon", customers: 120 },
    { name: "Tue", customers: 122 },
    { name: "Wed", customers: 125 },
    { name: "Thu", customers: 127 },
    { name: "Fri", customers: 132 },
    { name: "Sat", customers: 134 },
    { name: "Sun", customers: 135 },
  ],
  month: [
    { name: "Week 1", customers: 110 },
    { name: "Week 2", customers: 122 },
    { name: "Week 3", customers: 128 },
    { name: "Week 4", customers: 135 },
  ],
  quarter: [
    { name: "Jan", customers: 95 },
    { name: "Feb", customers: 115 },
    { name: "Mar", customers: 135 },
  ],
  year: [
    { name: "Q1", customers: 85 },
    { name: "Q2", customers: 105 },
    { name: "Q3", customers: 125 },
    { name: "Q4", customers: 135 },
  ],
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

const salesConversionData = [
  { name: "Converted", value: 65 },
  { name: "Not Converted", value: 35 },
];

export default function Reports() {
  const [salesTimeRange, setSalesTimeRange] = useState<TimeRange>("week");
  const [revenueTimeRange, setRevenueTimeRange] = useState<TimeRange>("week");
  const [customerTimeRange, setCustomerTimeRange] = useState<TimeRange>("week");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>

        <Tabs defaultValue="performance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="installations">Installations</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                  <BarChart2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">583</div>
                  <p className="text-xs text-muted-foreground">
                    +12.5% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                  <LineChartIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">135</div>
                  <p className="text-xs text-muted-foreground">
                    +5.2% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">65%</div>
                  <p className="text-xs text-muted-foreground">
                    +3.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <BarChart2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(96500)}</div>
                  <p className="text-xs text-muted-foreground">
                    +15.3% from last month
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Sales Overview</CardTitle>
                    <CardDescription>Number of leads converted to customers</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="sales-time-range" className="text-sm">
                      Time Range:
                    </Label>
                    <Select
                      value={salesTimeRange}
                      onValueChange={(value) => setSalesTimeRange(value as TimeRange)}
                    >
                      <SelectTrigger id="sales-time-range" className="w-[120px] h-8">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">Week</SelectItem>
                        <SelectItem value="month">Month</SelectItem>
                        <SelectItem value="quarter">Quarter</SelectItem>
                        <SelectItem value="year">Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={salesData[salesTimeRange]}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} sales`, ""]} />
                        <Legend />
                        <Bar dataKey="value" name="Sales" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Revenue Trends</CardTitle>
                    <CardDescription>Revenue generated from new sales</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="revenue-time-range" className="text-sm">
                      Time Range:
                    </Label>
                    <Select
                      value={revenueTimeRange}
                      onValueChange={(value) => setRevenueTimeRange(value as TimeRange)}
                    >
                      <SelectTrigger id="revenue-time-range" className="w-[120px] h-8">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">Week</SelectItem>
                        <SelectItem value="month">Month</SelectItem>
                        <SelectItem value="quarter">Quarter</SelectItem>
                        <SelectItem value="year">Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={revenueData[revenueTimeRange]}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [formatCurrency(value as number), "Revenue"]} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          name="Revenue"
                          stroke="#82ca9d"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Package Distribution</CardTitle>
                  <CardDescription>Distribution of internet packages among customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={packageDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {packageDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} customers`, ""]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Sales Conversion</CardTitle>
                  <CardDescription>Percentage of leads converted to customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={salesConversionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell key="cell-0" fill="#82ca9d" />
                          <Cell key="cell-1" fill="#ff8042" />
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, ""]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Customer Growth</CardTitle>
                  <CardDescription>Total number of active customers over time</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="customer-time-range" className="text-sm">
                    Time Range:
                  </Label>
                  <Select
                    value={customerTimeRange}
                    onValueChange={(value) => setCustomerTimeRange(value as TimeRange)}
                  >
                    <SelectTrigger id="customer-time-range" className="w-[120px] h-8">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="quarter">Quarter</SelectItem>
                      <SelectItem value="year">Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={customerGrowthData[customerTimeRange]}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} customers`, ""]} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="customers"
                        name="Customers"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Satisfaction</CardTitle>
                  <CardDescription>Average customer satisfaction rating</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-green-600">4.7/5</div>
                    <p className="text-sm text-muted-foreground mt-2">Based on 89 reviews</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Customer Retention</CardTitle>
                  <CardDescription>Percentage of customers retained</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-blue-600">94%</div>
                    <p className="text-sm text-muted-foreground mt-2">+2% from last quarter</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Average Revenue Per User</CardTitle>
                  <CardDescription>Monthly average revenue per customer</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold">{formatCurrency(48)}</div>
                    <p className="text-sm text-muted-foreground mt-2">+$3 from last quarter</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="installations" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Installations Completed</CardTitle>
                  <CardDescription>Total installations this month</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold">32</div>
                    <p className="text-sm text-muted-foreground mt-2">95% success rate</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Average Installation Time</CardTitle>
                  <CardDescription>Time from purchase to installation</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold">3.2</div>
                    <p className="text-sm text-muted-foreground mt-2">Days (avg.)</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>LOS Checks Success Rate</CardTitle>
                  <CardDescription>Percentage of successful LOS checks</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-green-600">78%</div>
                    <p className="text-sm text-muted-foreground mt-2">+5% from last quarter</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Installation Issues</CardTitle>
                <CardDescription>Common issues reported during installations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={[
                        { name: "Signal Obstruction", value: 12 },
                        { name: "Equipment Failure", value: 5 },
                        { name: "Weather Delays", value: 8 },
                        { name: "Customer Location Issues", value: 15 },
                        { name: "Permission Problems", value: 7 },
                      ]}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 100,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip formatter={(value) => [`${value} occurrences`, ""]} />
                      <Bar dataKey="value" name="Occurrences" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
                  <LineChartIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(6480)}</div>
                  <p className="text-xs text-muted-foreground">
                    +8.2% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Equipment Revenue</CardTitle>
                  <BarChart2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(12450)}</div>
                  <p className="text-xs text-muted-foreground">
                    +15.6% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                  <BarChart2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(8950)}</div>
                  <p className="text-xs text-muted-foreground">
                    +5.3% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                  <BarChart2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(9980)}</div>
                  <p className="text-xs text-muted-foreground">
                    +11.8% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Profit & Loss Summary</CardTitle>
                <CardDescription>Financial performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Jan", revenue: 15400, expenses: 9200, profit: 6200 },
                        { name: "Feb", revenue: 17200, expenses: 9800, profit: 7400 },
                        { name: "Mar", revenue: 18900, expenses: 10300, profit: 8600 },
                        { name: "Apr", revenue: 19500, expenses: 10100, profit: 9400 },
                        { name: "May", revenue: 21200, expenses: 11400, profit: 9800 },
                        { name: "Jun", revenue: 22400, expenses: 12200, profit: 10200 },
                      ]}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(value as number), ""]}
                        labelFormatter={(label) => `Month: ${label}`}
                      />
                      <Legend />
                      <Bar dataKey="revenue" name="Revenue" stackId="a" fill="#8884d8" />
                      <Bar dataKey="expenses" name="Expenses" stackId="a" fill="#ff8042" />
                      <Bar dataKey="profit" name="Net Profit" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}