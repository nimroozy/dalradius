import { useAuth } from "@/hooks/use-auth";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, CheckCircle, Clock, Settings, ShoppingBag, UserCheck, Users, XCircle } from "lucide-react";

const mockDashboardData = {
  totalLeads: 125,
  agreedLeads: 87,
  notAgreedLeads: 38,
  losConfirmed: 75,
  losRejected: 12,
  installationCompleted: 62,
  installationPending: 13,
  installationFailed: 5,
  totalRevenue: 18760,
  thisMonthRevenue: 4250,
  inventoryAlerts: 3,
};

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  // Filter cards based on user role
  const showCards = {
    leads: ['admin', 'sales'].includes(user.role),
    technical: ['admin', 'technical_manager', 'technician'].includes(user.role),
    finance: ['admin', 'finance'].includes(user.role),
    admin: ['admin'].includes(user.role),
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ISP Operations Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}! Monitor your ISP business performance and network operations.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Sales cards */}
          {showCards.leads && (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Leads
                  </CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockDashboardData.totalLeads}</div>
                  <p className="text-xs text-muted-foreground">
                    +12 from last week
                  </p>
                  <div className="mt-4 flex justify-between text-xs">
                    <div className="flex flex-col items-center">
                      <span className="text-green-500 font-bold">{mockDashboardData.agreedLeads}</span>
                      <span className="text-muted-foreground">Agreed</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-red-500 font-bold">{mockDashboardData.notAgreedLeads}</span>
                      <span className="text-muted-foreground">Not Agreed</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="font-bold">{Math.round((mockDashboardData.agreedLeads / mockDashboardData.totalLeads) * 100)}%</span>
                      <span className="text-muted-foreground">Conversion</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Technical cards */}
          {showCards.technical && (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    LOS Checks
                  </CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockDashboardData.losConfirmed + mockDashboardData.losRejected}</div>
                  <div className="mt-4 flex justify-between text-xs">
                    <div className="flex flex-col items-center">
                      <span className="text-green-500 font-bold">{mockDashboardData.losConfirmed}</span>
                      <span className="text-muted-foreground">Confirmed</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-red-500 font-bold">{mockDashboardData.losRejected}</span>
                      <span className="text-muted-foreground">Rejected</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="font-bold">{Math.round((mockDashboardData.losConfirmed / (mockDashboardData.losConfirmed + mockDashboardData.losRejected)) * 100)}%</span>
                      <span className="text-muted-foreground">Success Rate</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Installations
                  </CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <div className="text-2xl font-bold">{mockDashboardData.installationCompleted + mockDashboardData.installationPending + mockDashboardData.installationFailed}</div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <span className="text-xs font-bold text-amber-500">
                        {mockDashboardData.installationPending} pending
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between text-xs">
                    <div className="flex flex-col items-center">
                      <span className="text-green-500 font-bold">{mockDashboardData.installationCompleted}</span>
                      <span className="text-muted-foreground">Completed</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-amber-500 font-bold">{mockDashboardData.installationPending}</span>
                      <span className="text-muted-foreground">Pending</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-red-500 font-bold">{mockDashboardData.installationFailed}</span>
                      <span className="text-muted-foreground">Failed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Finance cards */}
          {showCards.finance && (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Revenue
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${mockDashboardData.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    ${mockDashboardData.thisMonthRevenue.toLocaleString()} this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Inventory Alerts
                  </CardTitle>
                  <XCircle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockDashboardData.inventoryAlerts}</div>
                  <p className="text-xs text-muted-foreground">
                    Items below threshold
                  </p>
                </CardContent>
              </Card>
            </>
          )}

          {/* Admin cards */}
          {showCards.admin && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  Across 5 departments
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Activity feed or recent items based on role */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                {user.role === 'sales' && "Your latest leads and customer interactions"}
                {user.role === 'technical_manager' && "Recent LOS checks and assignments"}
                {user.role === 'technician' && "Your assigned installations"}
                {user.role === 'finance' && "Recent invoices and transactions"}
                {user.role === 'admin' && "System-wide recent activities"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between rounded-md p-2 hover:bg-accent">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Installation completed for John Doe</span>
                </div>
                <span className="text-xs text-muted-foreground">2h ago</span>
              </div>
              <div className="flex items-center justify-between rounded-md p-2 hover:bg-accent">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">New lead from Sarah Smith</span>
                </div>
                <span className="text-xs text-muted-foreground">3h ago</span>
              </div>
              <div className="flex items-center justify-between rounded-md p-2 hover:bg-accent">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">LOS check scheduled for Mike Johnson</span>
                </div>
                <span className="text-xs text-muted-foreground">5h ago</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}