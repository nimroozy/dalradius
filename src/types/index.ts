export type UserRole = 'admin' | 'sales' | 'technical_manager' | 'technician' | 'finance';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type LeadStatus = 'initiated' | 'agreed' | 'not_agreed';

export interface Lead {
  id: string;
  customerName: string;
  mobileNumber: string;
  package: string;
  cp: string;
  router: string;
  cable: string;
  pole: string;
  cpPrice: number;
  routerPrice: number;
  cablePrice: number;
  polePrice: number;
  packagePrice: number;
  totalPrice: number;
  status: LeadStatus;
  salesAgent: string;
  createdAt: string;
  updatedAt: string;
  reasonIfNotAgreed?: string;
}

export type TaskStatus = 'pending_los' | 'los_confirmed' | 'los_rejected' | 'assigned' | 'in_progress' | 'installed' | 'not_installed';

export interface Task {
  id: string;
  leadId: string;
  lead: Lead;
  status: TaskStatus;
  assignedTechnicianId?: string;
  technicalManagerId?: string;
  installationDate?: string;
  createdAt: string;
  updatedAt: string;
  reasonIfNotInstalled?: string;
}

export type InvoiceStatus = 'pending' | 'paid' | 'overdue';

export interface Invoice {
  id: string;
  taskId: string;
  task: Task;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  paidDate?: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'cp' | 'router' | 'cable' | 'pole';
  quantity: number;
  price: number;
  updatedAt: string;
}

export interface DashboardSummary {
  totalLeads: number;
  agreedLeads: number;
  installationCompleted: number;
  installationPending: number;
  totalRevenue: number;
  inventoryAlerts: InventoryItem[];
}