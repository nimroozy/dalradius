import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/use-auth';

// Pages
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Network from './pages/Network';
import Services from './pages/Services';
import Billing from './pages/Billing';
import Support from './pages/Support';
import Inventory from './pages/Inventory';
import Monitoring from './pages/Monitoring';
import Finance from './pages/Finance';
import Reports from './pages/Reports';
import DaloRadius from './pages/DaloRadius';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected dashboard routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/customers" element={<Customers />} />
              <Route path="/dashboard/network" element={<Network />} />
              <Route path="/dashboard/services" element={<Services />} />
              <Route path="/dashboard/billing" element={<Billing />} />
              <Route path="/dashboard/support" element={<Support />} />
              <Route path="/dashboard/inventory" element={<Inventory />} />
              <Route path="/dashboard/monitoring" element={<Monitoring />} />
              <Route path="/dashboard/finance" element={<Finance />} />
              <Route path="/dashboard/reports" element={<Reports />} />
              <Route path="/dashboard/daloradius" element={<DaloRadius />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;