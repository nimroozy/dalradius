import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Users, 
  Settings, 
  Home,
  Wrench,
  CreditCard,
  Package,
  Wifi,
  Globe,
  Headphones,
  Activity,
  Shield,
  Database,
  Bell,
  TrendingUp,
  Server
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isActive?: boolean;
}

function SidebarLink({ href, icon, title, isActive = false }: SidebarLinkProps) {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-secondary text-secondary-foreground"
          : "hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {icon}
      {title}
    </Link>
  );
}

export function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  // Define navigation links for ISP management system
  const getNavLinks = () => {
    const ispLinks = [
      {
        href: "/dashboard",
        icon: <Home className="h-4 w-4" />,
        title: "Dashboard",
        roles: ["admin", "sales", "technical_manager", "technician", "finance"],
      },
      {
        href: "/dashboard/customers",
        icon: <Users className="h-4 w-4" />,
        title: "Customers",
        roles: ["admin", "sales", "technical_manager"],
      },
      {
        href: "/dashboard/network",
        icon: <Wifi className="h-4 w-4" />,
        title: "Network",
        roles: ["admin", "technical_manager", "technician"],
      },
      {
        href: "/dashboard/services",
        icon: <Globe className="h-4 w-4" />,
        title: "Services & Plans",
        roles: ["admin", "sales", "technical_manager"],
      },
      {
        href: "/dashboard/billing",
        icon: <CreditCard className="h-4 w-4" />,
        title: "Billing",
        roles: ["admin", "finance", "sales"],
      },
      {
        href: "/dashboard/support",
        icon: <Headphones className="h-4 w-4" />,
        title: "Support Tickets",
        roles: ["admin", "technical_manager", "technician"],
      },
      {
        href: "/dashboard/inventory",
        icon: <Package className="h-4 w-4" />,
        title: "Inventory",
        roles: ["admin", "finance", "technical_manager"],
      },
      {
        href: "/dashboard/monitoring",
        icon: <Activity className="h-4 w-4" />,
        title: "Monitoring",
        roles: ["admin", "technical_manager"],
      },
      {
        href: "/dashboard/finance",
        icon: <TrendingUp className="h-4 w-4" />,
        title: "Finance",
        roles: ["admin", "finance"],
      },
      {
        href: "/dashboard/reports",
        icon: <BarChart3 className="h-4 w-4" />,
        title: "Reports",
        roles: ["admin", "finance", "technical_manager"],
      },
      {
        href: "/dashboard/daloradius",
        icon: <Server className="h-4 w-4" />,
        title: "daloRADIUS",
        roles: ["admin", "technical_manager"],
      },
      {
        href: "/dashboard/settings",
        icon: <Settings className="h-4 w-4" />,
        title: "Settings",
        roles: ["admin"],
      },
    ];

    return ispLinks.filter(link => 
      user && link.roles.includes(user.role)
    );
  };

  const navLinks = getNavLinks();

  return (
    <aside className="hidden border-r bg-background lg:block lg:w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center border-b px-6">
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v6m0 6v6" />
              <path d="m15.5 3.5-1.5 1.5" />
              <path d="m4.5 15.5 1.5-1.5" />
              <path d="m8.5 8.5 7 7" />
              <path d="M1 12h6m6 0h6" />
            </svg>
            <span>Haroon Net Admin</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            {navLinks.map((link) => (
              <SidebarLink
                key={link.href}
                href={link.href}
                icon={link.icon}
                title={link.title}
                isActive={isActive(link.href)}
              />
            ))}
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <span>Haroon Net Admin v2.0</span>
              <div className="text-xs mt-1">Professional ISP Management</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}