import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Wifi, Server, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Zap } from "lucide-react";

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkTraffic: {
    inbound: number;
    outbound: number;
  };
  uptime: string;
  status: "healthy" | "warning" | "critical";
}

interface NetworkMetrics {
  totalBandwidth: number;
  usedBandwidth: number;
  activeConnections: number;
  packetLoss: number;
  latency: number;
}

export default function Monitoring() {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpuUsage: 45,
    memoryUsage: 67,
    diskUsage: 34,
    networkTraffic: { inbound: 1234, outbound: 567 },
    uptime: "127 days, 14 hours",
    status: "healthy"
  });

  const [networkMetrics, setNetworkMetrics] = useState<NetworkMetrics>({
    totalBandwidth: 10000,
    usedBandwidth: 6500,
    activeConnections: 2847,
    packetLoss: 0.02,
    latency: 12
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "text-green-600";
      case "warning": return "text-yellow-600";
      case "critical": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getProgressColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return "bg-red-500";
    if (value >= thresholds.warning) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">System Monitoring</h2>
            <p className="text-muted-foreground">Real-time monitoring of network infrastructure and performance</p>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-green-600">All Systems Operational</span>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor(systemMetrics.status)}`}>
                {systemMetrics.status.charAt(0).toUpperCase() + systemMetrics.status.slice(1)}
              </div>
              <p className="text-xs text-muted-foreground">Uptime: {systemMetrics.uptime}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Network Load</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((networkMetrics.usedBandwidth / networkMetrics.totalBandwidth) * 100)}%
              </div>
              <Progress 
                value={(networkMetrics.usedBandwidth / networkMetrics.totalBandwidth) * 100} 
                className="mt-2" 
              />
              <p className="text-xs text-muted-foreground mt-1">
                {networkMetrics.usedBandwidth / 1000} / {networkMetrics.totalBandwidth / 1000} Gbps
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{networkMetrics.activeConnections.toLocaleString()}</div>
              <div className="flex items-center space-x-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>+5.2% from last hour</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Network Quality</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Excellent</div>
              <p className="text-xs text-muted-foreground">
                Latency: {networkMetrics.latency}ms • Loss: {networkMetrics.packetLoss}%
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="system" className="space-y-4">
          <TabsList>
            <TabsTrigger value="system">System Metrics</TabsTrigger>
            <TabsTrigger value="network">Network Performance</TabsTrigger>
            <TabsTrigger value="alerts">Alerts & Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="system" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">CPU Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Current</span>
                      <span className="text-sm">{systemMetrics.cpuUsage}%</span>
                    </div>
                    <Progress 
                      value={systemMetrics.cpuUsage} 
                      className={getProgressColor(systemMetrics.cpuUsage, { warning: 70, critical: 85 })}
                    />
                    <div className="text-xs text-muted-foreground">
                      8 cores • 3.2 GHz base frequency
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Memory Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Current</span>
                      <span className="text-sm">{systemMetrics.memoryUsage}%</span>
                    </div>
                    <Progress 
                      value={systemMetrics.memoryUsage} 
                      className={getProgressColor(systemMetrics.memoryUsage, { warning: 80, critical: 90 })}
                    />
                    <div className="text-xs text-muted-foreground">
                      21.5 GB / 32 GB used
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Disk Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Current</span>
                      <span className="text-sm">{systemMetrics.diskUsage}%</span>
                    </div>
                    <Progress 
                      value={systemMetrics.diskUsage} 
                      className={getProgressColor(systemMetrics.diskUsage, { warning: 80, critical: 90 })}
                    />
                    <div className="text-xs text-muted-foreground">
                      340 GB / 1 TB used
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Real-time Performance</CardTitle>
                  <CardDescription>System performance over the last hour</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg border-2 border-dashed">
                    <div className="text-center">
                      <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Real-time performance charts would be implemented here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Network Traffic</CardTitle>
                  <CardDescription>Inbound and outbound traffic monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Inbound</span>
                      </div>
                      <span className="text-sm font-medium">{systemMetrics.networkTraffic.inbound} Mbps</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Outbound</span>
                      </div>
                      <span className="text-sm font-medium">{systemMetrics.networkTraffic.outbound} Mbps</span>
                    </div>
                    <div className="flex items-center justify-center h-32 bg-muted/50 rounded-lg border-2 border-dashed mt-4">
                      <p className="text-xs text-muted-foreground">Traffic visualization chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="network" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Bandwidth Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round((networkMetrics.usedBandwidth / networkMetrics.totalBandwidth) * 100)}%</div>
                  <Progress value={(networkMetrics.usedBandwidth / networkMetrics.totalBandwidth) * 100} className="mt-2" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Packet Loss</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{networkMetrics.packetLoss}%</div>
                  <p className="text-xs text-muted-foreground">Excellent quality</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Average Latency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{networkMetrics.latency}ms</div>
                  <p className="text-xs text-muted-foreground">Low latency</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Jitter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">2.1ms</div>
                  <p className="text-xs text-muted-foreground">Stable connection</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Network Performance Trends</CardTitle>
                  <CardDescription>24-hour performance overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg border-2 border-dashed">
                    <div className="text-center">
                      <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Network performance trend charts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Top Bandwidth Consumers</CardTitle>
                  <CardDescription>Devices using most bandwidth</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Core Router CR-01</span>
                      <Badge variant="outline">2.3 Gbps</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tower Alpha-01</span>
                      <Badge variant="outline">1.8 Gbps</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tower Beta-02</span>
                      <Badge variant="outline">1.2 Gbps</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Core Switch CS-01</span>
                      <Badge variant="outline">0.9 Gbps</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Alerts</CardTitle>
                  <CardDescription>System alerts and notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">High bandwidth usage detected</p>
                        <p className="text-xs text-muted-foreground">Tower Alpha-01 - 5 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">System backup completed successfully</p>
                        <p className="text-xs text-muted-foreground">All systems - 2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Activity className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">New device connected</p>
                        <p className="text-xs text-muted-foreground">Access Point AP-C20 - 4 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>System Logs</CardTitle>
                  <CardDescription>Recent system activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">2024-01-15 14:32:15</span>
                      <span>INFO: Backup process initiated</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">2024-01-15 14:28:42</span>
                      <span>WARN: High CPU usage on CR-01</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">2024-01-15 14:15:33</span>
                      <span>INFO: Device AP-C20 came online</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">2024-01-15 13:45:22</span>
                      <span>INFO: Scheduled maintenance completed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}