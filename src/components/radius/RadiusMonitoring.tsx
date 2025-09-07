import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Server, 
  Users, 
  Shield, 
  Clock, 
  Wifi, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Database,
  Globe
} from "lucide-react";

interface RadiusStats {
  totalRequests: number;
  authSuccess: number;
  authFailure: number;
  acctStart: number;
  acctStop: number;
  acctUpdate: number;
  activeSessions: number;
  totalUsers: number;
  serverUptime: string;
  avgResponseTime: number;
  dataTransferred: number;
  peakConcurrent: number;
}

interface RadiusLog {
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  user?: string;
  ip?: string;
  type: 'auth' | 'acct' | 'system';
}

const mockStats: RadiusStats = {
  totalRequests: 15420,
  authSuccess: 12850,
  authFailure: 2570,
  acctStart: 1250,
  acctStop: 1180,
  acctUpdate: 3420,
  activeSessions: 247,
  totalUsers: 1250,
  serverUptime: '15d 3h 42m',
  avgResponseTime: 2.3,
  dataTransferred: 2.4,
  peakConcurrent: 320
};

const mockLogs: RadiusLog[] = [
  {
    timestamp: '2024-01-20 14:30:15',
    level: 'info',
    message: 'User john.doe authenticated successfully',
    user: 'john.doe',
    ip: '192.168.1.100',
    type: 'auth'
  },
  {
    timestamp: '2024-01-20 14:29:42',
    level: 'error',
    message: 'Authentication failed for user test.user - Invalid password',
    user: 'test.user',
    ip: '192.168.1.101',
    type: 'auth'
  },
  {
    timestamp: '2024-01-20 14:28:33',
    level: 'info',
    message: 'Accounting update for user mike.smith - Session time: 3600s',
    user: 'mike.smith',
    ip: '192.168.1.102',
    type: 'acct'
  },
  {
    timestamp: '2024-01-20 14:27:18',
    level: 'warning',
    message: 'High memory usage detected: 85%',
    type: 'system'
  },
  {
    timestamp: '2024-01-20 14:26:55',
    level: 'info',
    message: 'User sarah.wilson session started',
    user: 'sarah.wilson',
    ip: '192.168.1.103',
    type: 'acct'
  },
  {
    timestamp: '2024-01-20 14:25:12',
    level: 'error',
    message: 'Database connection timeout',
    type: 'system'
  }
];

export function RadiusMonitoring() {
  const authSuccessRate = (mockStats.authSuccess / mockStats.totalRequests) * 100;
  const authFailureRate = (mockStats.authFailure / mockStats.totalRequests) * 100;

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'auth':
        return <Shield className="h-4 w-4" />;
      case 'acct':
        return <Activity className="h-4 w-4" />;
      case 'system':
        return <Server className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'info':
        return 'text-blue-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getLogLevelBadge = (level: string) => {
    switch (level) {
      case 'info':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Info</Badge>;
      case 'warning':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Warning</Badge>;
      case 'error':
        return <Badge variant="outline" className="text-red-600 border-red-600">Error</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">RADIUS Server Monitoring</h2>
        <p className="text-muted-foreground">
          Real-time monitoring of RADIUS server performance and activity
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Server Status</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                Running
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Uptime: {mockStats.serverUptime}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.activeSessions}</div>
            <p className="text-xs text-muted-foreground">
              Peak: {mockStats.peakConcurrent}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auth Success Rate</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{authSuccessRate.toFixed(1)}%</div>
            <Progress value={authSuccessRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {mockStats.authSuccess} successful / {mockStats.totalRequests} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.avgResponseTime}ms</div>
            <p className="text-xs text-muted-foreground">
              Average response time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Monitoring */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="accounting">Accounting</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Request Statistics
                </CardTitle>
                <CardDescription>
                  RADIUS request breakdown and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Authentication Success</span>
                    <span className="font-medium">{mockStats.authSuccess.toLocaleString()}</span>
                  </div>
                  <Progress value={authSuccessRate} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Authentication Failure</span>
                    <span className="font-medium">{mockStats.authFailure.toLocaleString()}</span>
                  </div>
                  <Progress value={authFailureRate} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Accounting Start</span>
                    <span className="font-medium">{mockStats.acctStart.toLocaleString()}</span>
                  </div>
                  <Progress value={(mockStats.acctStart / mockStats.totalRequests) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Accounting Stop</span>
                    <span className="font-medium">{mockStats.acctStop.toLocaleString()}</span>
                  </div>
                  <Progress value={(mockStats.acctStop / mockStats.totalRequests) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  System Resources
                </CardTitle>
                <CardDescription>
                  Server resource utilization and health metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CPU Usage</span>
                    <span className="font-medium">23%</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span className="font-medium">67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Disk Usage</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Network I/O</span>
                    <span className="font-medium">12%</span>
                  </div>
                  <Progress value={12} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Data Transfer
              </CardTitle>
              <CardDescription>
                Network data usage and bandwidth statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold">{mockStats.dataTransferred} TB</div>
                  <p className="text-sm text-muted-foreground">Total Transferred</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">1.2 Gbps</div>
                  <p className="text-sm text-muted-foreground">Current Bandwidth</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">5.8 Gbps</div>
                  <p className="text-sm text-muted-foreground">Peak Bandwidth</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authentication" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Authentication Summary</CardTitle>
                <CardDescription>
                  Recent authentication activity and trends
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Success Rate</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="font-medium">{authSuccessRate.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Failure Rate</span>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <span className="font-medium">{authFailureRate.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Requests</span>
                  <span className="font-medium">{mockStats.totalRequests.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Failed Users</CardTitle>
                <CardDescription>
                  Users with most authentication failures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">test.user</span>
                  <Badge variant="destructive">15 failures</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">admin.test</span>
                  <Badge variant="destructive">8 failures</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">demo.user</span>
                  <Badge variant="destructive">5 failures</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">temp.user</span>
                  <Badge variant="destructive">3 failures</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="accounting" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Accounting Statistics</CardTitle>
                <CardDescription>
                  Session accounting and data usage metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Sessions</span>
                  <span className="font-medium">{mockStats.activeSessions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sessions Started</span>
                  <span className="font-medium">{mockStats.acctStart}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sessions Stopped</span>
                  <span className="font-medium">{mockStats.acctStop}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Updates Sent</span>
                  <span className="font-medium">{mockStats.acctUpdate}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Duration</CardTitle>
                <CardDescription>
                  Average session times and patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Duration</span>
                  <span className="font-medium">2h 15m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Longest Session</span>
                  <span className="font-medium">8h 42m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Peak Concurrent</span>
                  <span className="font-medium">{mockStats.peakConcurrent}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>RADIUS Server Logs</CardTitle>
              <CardDescription>
                Real-time server logs and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {mockLogs.map((log, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-md hover:bg-accent">
                    <div className="flex-shrink-0 mt-0.5">
                      {getLogIcon(log.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getLogLevelBadge(log.level)}
                        <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                        {log.user && (
                          <Badge variant="outline" className="text-xs">
                            {log.user}
                          </Badge>
                        )}
                        {log.ip && (
                          <Badge variant="outline" className="text-xs">
                            {log.ip}
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm ${getLogLevelColor(log.level)}`}>
                        {log.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
