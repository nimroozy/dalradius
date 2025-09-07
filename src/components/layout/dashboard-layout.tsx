import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { UserNav } from "./user-nav";
import { AlertCircle } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // If loading, show a simple loading spinner
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-lg font-semibold">Authentication Required</h2>
        <p className="text-muted-foreground">You need to sign in to access this page</p>
        <Button onClick={() => navigate("/login")}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-1 flex-col">
        {/* Top navigation bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
          <div className="flex-1" />
          <UserNav />
        </header>

        {/* Main content with padding */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}