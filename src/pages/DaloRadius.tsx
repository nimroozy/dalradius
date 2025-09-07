import { useAuth } from "@/hooks/use-auth";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  Server, 
  Users, 
  Shield, 
  Activity, 
  Settings, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  RefreshCw,
  Save,
  TestTube
} from "lucide-react";
import { useState } from "react";
import { UserManagement } from "@/components/radius/UserManagement";
import { RadiusMonitoring } from "@/components/radius/RadiusMonitoring";
import { NasManagement } from "@/components/radius/NasManagement";

interface RadiusConfig {
  dbEngine: string;
  dbHost: string;
  dbPort: string;
  dbUser: string;
  dbPass: string;
  dbName: string;
  radiusSecret: string;
  radiusPort: string;
  radiusAuthPort: string;
  radiusAcctPort: string;
  nasSecret: string;
  enableAccounting: boolean;
  enableBilling: boolean;
  logLevel: string;
}

const defaultConfig: RadiusConfig = {
  dbEngine: 'mysqli',
  dbHost: 'localhost',
  dbPort: '3306',
  dbUser: 'radius',
  dbPass: '',
  dbName: 'radiusdb',
  radiusSecret: 'testing123',
  radiusPort: '1812',
  radiusAuthPort: '1812',
  radiusAcctPort: '1813',
  nasSecret: 'testing123',
  enableAccounting: true,
  enableBilling: true,
  logLevel: 'info'
};

export default function DaloRadius() {
  const { user } = useAuth();
  const [config, setConfig] = useState<RadiusConfig>(defaultConfig);
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<{status: 'success' | 'error' | 'warning', message: string} | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return null;

  const handleConfigChange = (key: keyof RadiusConfig, value: string | boolean) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const testConnection = async () => {
    setIsTesting(true);
    setTestResults(null);
    
    // Simulate connection test
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo
      setTestResults({
        status: success ? 'success' : 'error',
        message: success 
          ? 'Database connection successful' 
          : 'Failed to connect to database. Please check your credentials.'
      });
      setIsTesting(false);
    }, 2000);
  };

  const saveConfiguration = async () => {
    setIsSaving(true);
    
    // Simulate save operation
    setTimeout(() => {
      setTestResults({
        status: 'success',
        message: 'Configuration saved successfully'
      });
      setIsSaving(false);
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">daloRADIUS Configuration</h1>
          <p className="text-muted-foreground">
            Configure and manage your FreeRADIUS server with daloRADIUS web interface.
          </p>
        </div>

        <Tabs defaultValue="configuration" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="status">Server Status</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="nas">NAS Devices</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="configuration" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Database Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Database Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure the database connection for daloRADIUS
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dbEngine">Database Engine</Label>
                      <Input
                        id="dbEngine"
                        value={config.dbEngine}
                        onChange={(e) => handleConfigChange('dbEngine', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dbHost">Host</Label>
                      <Input
                        id="dbHost"
                        value={config.dbHost}
                        onChange={(e) => handleConfigChange('dbHost', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dbPort">Port</Label>
                      <Input
                        id="dbPort"
                        value={config.dbPort}
                        onChange={(e) => handleConfigChange('dbPort', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dbName">Database Name</Label>
                      <Input
                        id="dbName"
                        value={config.dbName}
                        onChange={(e) => handleConfigChange('dbName', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dbUser">Username</Label>
                      <Input
                        id="dbUser"
                        value={config.dbUser}
                        onChange={(e) => handleConfigChange('dbUser', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dbPass">Password</Label>
                      <Input
                        id="dbPass"
                        type="password"
                        value={config.dbPass}
                        onChange={(e) => handleConfigChange('dbPass', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={testConnection} 
                      disabled={isTesting}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      {isTesting ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <TestTube className="h-4 w-4" />
                      )}
                      {isTesting ? 'Testing...' : 'Test Connection'}
                    </Button>
                    <Button 
                      onClick={saveConfiguration} 
                      disabled={isSaving}
                      className="flex items-center gap-2"
                    >
                      {isSaving ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {isSaving ? 'Saving...' : 'Save Configuration'}
                    </Button>
                  </div>
                  {testResults && (
                    <div className={`flex items-center gap-2 p-3 rounded-md ${
                      testResults.status === 'success' ? 'bg-green-50 text-green-700' :
                      testResults.status === 'error' ? 'bg-red-50 text-red-700' :
                      'bg-yellow-50 text-yellow-700'
                    }`}>
                      {getStatusIcon(testResults.status)}
                      <span className="text-sm">{testResults.message}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* RADIUS Server Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    RADIUS Server Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure RADIUS server settings and ports
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="radiusSecret">RADIUS Secret</Label>
                    <Input
                      id="radiusSecret"
                      type="password"
                      value={config.radiusSecret}
                      onChange={(e) => handleConfigChange('radiusSecret', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="radiusPort">RADIUS Port</Label>
                      <Input
                        id="radiusPort"
                        value={config.radiusPort}
                        onChange={(e) => handleConfigChange('radiusPort', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="radiusAuthPort">Auth Port</Label>
                      <Input
                        id="radiusAuthPort"
                        value={config.radiusAuthPort}
                        onChange={(e) => handleConfigChange('radiusAuthPort', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="radiusAcctPort">Accounting Port</Label>
                      <Input
                        id="radiusAcctPort"
                        value={config.radiusAcctPort}
                        onChange={(e) => handleConfigChange('radiusAcctPort', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nasSecret">NAS Secret</Label>
                    <Input
                      id="nasSecret"
                      type="password"
                      value={config.nasSecret}
                      onChange={(e) => handleConfigChange('nasSecret', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logLevel">Log Level</Label>
                    <Input
                      id="logLevel"
                      value={config.logLevel}
                      onChange={(e) => handleConfigChange('logLevel', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Feature Toggles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Feature Configuration
                </CardTitle>
                <CardDescription>
                  Enable or disable daloRADIUS features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableAccounting">Enable Accounting</Label>
                    <p className="text-sm text-muted-foreground">
                      Track user sessions and data usage
                    </p>
                  </div>
                  <Switch
                    id="enableAccounting"
                    checked={config.enableAccounting}
                    onCheckedChange={(checked) => handleConfigChange('enableAccounting', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableBilling">Enable Billing</Label>
                    <p className="text-sm text-muted-foreground">
                      Generate bills based on usage data
                    </p>
                  </div>
                  <Switch
                    id="enableBilling"
                    checked={config.enableBilling}
                    onCheckedChange={(checked) => handleConfigChange('enableBilling', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">RADIUS Server</CardTitle>
                  <Server className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Running
                    </Badge>
                    <span className="text-sm text-muted-foreground">Port 1812</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Uptime: 15 days, 3 hours
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Database</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                    <span className="text-sm text-muted-foreground">MySQL</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Response time: 2ms
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">247</div>
                  <p className="text-xs text-muted-foreground">
                    +12 from yesterday
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent RADIUS Activity</CardTitle>
                <CardDescription>
                  Latest authentication and accounting events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between rounded-md p-2 hover:bg-accent">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">User john.doe authenticated successfully</span>
                  </div>
                  <span className="text-xs text-muted-foreground">2m ago</span>
                </div>
                <div className="flex items-center justify-between rounded-md p-2 hover:bg-accent">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">Authentication failed for user test.user</span>
                  </div>
                  <span className="text-xs text-muted-foreground">5m ago</span>
                </div>
                <div className="flex items-center justify-between rounded-md p-2 hover:bg-accent">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Accounting update for user mike.smith</span>
                  </div>
                  <span className="text-xs text-muted-foreground">8m ago</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="nas" className="space-y-6">
            <NasManagement />
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <RadiusMonitoring />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
