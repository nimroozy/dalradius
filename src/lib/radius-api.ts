// RADIUS API Integration Layer for daloRADIUS
// This module provides API functions to interact with daloRADIUS backend

export interface RadiusUser {
  id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  group: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin: string;
  sessionTime: number;
  dataUsage: number;
  bandwidthLimit: number;
  attributes: Record<string, string>;
}

export interface NasDevice {
  id: string;
  nasname: string;
  shortname: string;
  type: string;
  ports: number;
  secret: string;
  server: string;
  community: string;
  description: string;
  status: 'active' | 'inactive' | 'maintenance';
  lastSeen: string;
  location: string;
  contact: string;
  clients: number;
  maxClients: number;
}

export interface RadiusConfig {
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

export interface RadiusStats {
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

export interface RadiusLog {
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  user?: string;
  ip?: string;
  type: 'auth' | 'acct' | 'system';
}

// API Configuration
const API_BASE_URL = process.env.VITE_RADIUS_API_URL || 'http://localhost:3001/api/radius';
const API_TIMEOUT = 10000;

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}

// Configuration API
export const configApi = {
  // Get current RADIUS configuration
  getConfig: (): Promise<RadiusConfig> => {
    return apiRequest<RadiusConfig>('/config');
  },

  // Update RADIUS configuration
  updateConfig: (config: Partial<RadiusConfig>): Promise<RadiusConfig> => {
    return apiRequest<RadiusConfig>('/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  },

  // Test database connection
  testConnection: (config: Partial<RadiusConfig>): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>('/config/test-connection', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  },

  // Save configuration
  saveConfig: (config: RadiusConfig): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>('/config/save', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  },
};

// User Management API
export const userApi = {
  // Get all RADIUS users
  getUsers: (params?: { search?: string; group?: string; status?: string }): Promise<RadiusUser[]> => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.group) queryParams.append('group', params.group);
    if (params?.status) queryParams.append('status', params.status);
    
    const queryString = queryParams.toString();
    return apiRequest<RadiusUser[]>(`/users${queryString ? `?${queryString}` : ''}`);
  },

  // Get user by ID
  getUser: (id: string): Promise<RadiusUser> => {
    return apiRequest<RadiusUser>(`/users/${id}`);
  },

  // Create new user
  createUser: (user: Omit<RadiusUser, 'id' | 'createdAt' | 'lastLogin' | 'sessionTime' | 'dataUsage'>): Promise<RadiusUser> => {
    return apiRequest<RadiusUser>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  },

  // Update user
  updateUser: (id: string, user: Partial<RadiusUser>): Promise<RadiusUser> => {
    return apiRequest<RadiusUser>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  },

  // Delete user
  deleteUser: (id: string): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>(`/users/${id}`, {
      method: 'DELETE',
    });
  },

  // Get user groups
  getUserGroups: (): Promise<Array<{ value: string; label: string; description: string }>> => {
    return apiRequest<Array<{ value: string; label: string; description: string }>>('/users/groups');
  },

  // Reset user password
  resetPassword: (id: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>(`/users/${id}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ password: newPassword }),
    });
  },

  // Suspend/activate user
  toggleUserStatus: (id: string, status: 'active' | 'inactive' | 'suspended'): Promise<RadiusUser> => {
    return apiRequest<RadiusUser>(`/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// NAS Management API
export const nasApi = {
  // Get all NAS devices
  getNasDevices: (params?: { search?: string; type?: string; status?: string }): Promise<NasDevice[]> => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.status) queryParams.append('status', params.status);
    
    const queryString = queryParams.toString();
    return apiRequest<NasDevice[]>(`/nas${queryString ? `?${queryString}` : ''}`);
  },

  // Get NAS device by ID
  getNasDevice: (id: string): Promise<NasDevice> => {
    return apiRequest<NasDevice>(`/nas/${id}`);
  },

  // Create new NAS device
  createNasDevice: (nas: Omit<NasDevice, 'id' | 'lastSeen' | 'clients'>): Promise<NasDevice> => {
    return apiRequest<NasDevice>('/nas', {
      method: 'POST',
      body: JSON.stringify(nas),
    });
  },

  // Update NAS device
  updateNasDevice: (id: string, nas: Partial<NasDevice>): Promise<NasDevice> => {
    return apiRequest<NasDevice>(`/nas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(nas),
    });
  },

  // Delete NAS device
  deleteNasDevice: (id: string): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>(`/nas/${id}`, {
      method: 'DELETE',
    });
  },

  // Get NAS types
  getNasTypes: (): Promise<Array<{ value: string; label: string; description: string }>> => {
    return apiRequest<Array<{ value: string; label: string; description: string }>>('/nas/types');
  },

  // Test NAS connectivity
  testNasConnection: (id: string): Promise<{ success: boolean; message: string; responseTime?: number }> => {
    return apiRequest<{ success: boolean; message: string; responseTime?: number }>(`/nas/${id}/test`, {
      method: 'POST',
    });
  },
};

// Monitoring API
export const monitoringApi = {
  // Get RADIUS server statistics
  getStats: (): Promise<RadiusStats> => {
    return apiRequest<RadiusStats>('/monitoring/stats');
  },

  // Get server status
  getServerStatus: (): Promise<{
    status: 'running' | 'stopped' | 'error';
    uptime: string;
    version: string;
    lastRestart: string;
  }> => {
    return apiRequest<{
      status: 'running' | 'stopped' | 'error';
      uptime: string;
      version: string;
      lastRestart: string;
    }>('/monitoring/status');
  },

  // Get server logs
  getLogs: (params?: {
    level?: 'info' | 'warning' | 'error';
    type?: 'auth' | 'acct' | 'system';
    limit?: number;
    offset?: number;
  }): Promise<{ logs: RadiusLog[]; total: number }> => {
    const queryParams = new URLSearchParams();
    if (params?.level) queryParams.append('level', params.level);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    const queryString = queryParams.toString();
    return apiRequest<{ logs: RadiusLog[]; total: number }>(`/monitoring/logs${queryString ? `?${queryString}` : ''}`);
  },

  // Get real-time metrics
  getRealtimeMetrics: (): Promise<{
    activeSessions: number;
    requestsPerSecond: number;
    avgResponseTime: number;
    errorRate: number;
    memoryUsage: number;
    cpuUsage: number;
  }> => {
    return apiRequest<{
      activeSessions: number;
      requestsPerSecond: number;
      avgResponseTime: number;
      errorRate: number;
      memoryUsage: number;
      cpuUsage: number;
    }>('/monitoring/realtime');
  },

  // Restart RADIUS server
  restartServer: (): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>('/monitoring/restart', {
      method: 'POST',
    });
  },

  // Get authentication statistics
  getAuthStats: (timeRange?: '1h' | '24h' | '7d' | '30d'): Promise<{
    successRate: number;
    totalRequests: number;
    successCount: number;
    failureCount: number;
    topFailedUsers: Array<{ username: string; failures: number }>;
  }> => {
    const queryParams = timeRange ? `?range=${timeRange}` : '';
    return apiRequest<{
      successRate: number;
      totalRequests: number;
      successCount: number;
      failureCount: number;
      topFailedUsers: Array<{ username: string; failures: number }>;
    }>(`/monitoring/auth-stats${queryParams}`);
  },

  // Get accounting statistics
  getAccountingStats: (timeRange?: '1h' | '24h' | '7d' | '30d'): Promise<{
    activeSessions: number;
    sessionsStarted: number;
    sessionsStopped: number;
    dataTransferred: number;
    avgSessionDuration: number;
  }> => {
    const queryParams = timeRange ? `?range=${timeRange}` : '';
    return apiRequest<{
      activeSessions: number;
      sessionsStarted: number;
      sessionsStopped: number;
      dataTransferred: number;
      avgSessionDuration: number;
    }>(`/monitoring/accounting-stats${queryParams}`);
  },
};

// Group Management API
export const groupApi = {
  // Get all user groups
  getGroups: (): Promise<Array<{
    id: string;
    name: string;
    description: string;
    attributes: Record<string, string>;
    userCount: number;
  }>> => {
    return apiRequest<Array<{
      id: string;
      name: string;
      description: string;
      attributes: Record<string, string>;
      userCount: number;
    }>>('/groups');
  },

  // Create new group
  createGroup: (group: {
    name: string;
    description: string;
    attributes: Record<string, string>;
  }): Promise<{ id: string; name: string; description: string; attributes: Record<string, string>; userCount: number }> => {
    return apiRequest<{ id: string; name: string; description: string; attributes: Record<string, string>; userCount: number }>('/groups', {
      method: 'POST',
      body: JSON.stringify(group),
    });
  },

  // Update group
  updateGroup: (id: string, group: {
    name?: string;
    description?: string;
    attributes?: Record<string, string>;
  }): Promise<{ id: string; name: string; description: string; attributes: Record<string, string>; userCount: number }> => {
    return apiRequest<{ id: string; name: string; description: string; attributes: Record<string, string>; userCount: number }>(`/groups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(group),
    });
  },

  // Delete group
  deleteGroup: (id: string): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>(`/groups/${id}`, {
      method: 'DELETE',
    });
  },
};

// Billing API
export const billingApi = {
  // Get billing configuration
  getBillingConfig: (): Promise<{
    enabled: boolean;
    currency: string;
    taxRate: number;
    billingCycle: 'monthly' | 'quarterly' | 'yearly';
    gracePeriod: number;
  }> => {
    return apiRequest<{
      enabled: boolean;
      currency: string;
      taxRate: number;
      billingCycle: 'monthly' | 'quarterly' | 'yearly';
      gracePeriod: number;
    }>('/billing/config');
  },

  // Update billing configuration
  updateBillingConfig: (config: {
    enabled?: boolean;
    currency?: string;
    taxRate?: number;
    billingCycle?: 'monthly' | 'quarterly' | 'yearly';
    gracePeriod?: number;
  }): Promise<{
    enabled: boolean;
    currency: string;
    taxRate: number;
    billingCycle: 'monthly' | 'quarterly' | 'yearly';
    gracePeriod: number;
  }> => {
    return apiRequest<{
      enabled: boolean;
      currency: string;
      taxRate: number;
      billingCycle: 'monthly' | 'quarterly' | 'yearly';
      gracePeriod: number;
    }>('/billing/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  },

  // Generate bills
  generateBills: (params: {
    userId?: string;
    groupId?: string;
    period: string;
  }): Promise<{ success: boolean; message: string; billCount: number }> => {
    return apiRequest<{ success: boolean; message: string; billCount: number }>('/billing/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  // Get user bills
  getUserBills: (userId: string, params?: {
    status?: 'pending' | 'paid' | 'overdue';
    limit?: number;
    offset?: number;
  }): Promise<{
    bills: Array<{
      id: string;
      userId: string;
      amount: number;
      status: 'pending' | 'paid' | 'overdue';
      dueDate: string;
      period: string;
      dataUsage: number;
      bandwidthUsage: number;
    }>;
    total: number;
  }> => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    const queryString = queryParams.toString();
    return apiRequest<{
      bills: Array<{
        id: string;
        userId: string;
        amount: number;
        status: 'pending' | 'paid' | 'overdue';
        dueDate: string;
        period: string;
        dataUsage: number;
        bandwidthUsage: number;
      }>;
      total: number;
    }>(`/billing/users/${userId}/bills${queryString ? `?${queryString}` : ''}`);
  },
};

// Export all APIs
export const radiusApi = {
  config: configApi,
  users: userApi,
  nas: nasApi,
  monitoring: monitoringApi,
  groups: groupApi,
  billing: billingApi,
};

export default radiusApi;
