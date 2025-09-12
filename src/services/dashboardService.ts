import { apiClient } from './api';

export interface DashboardStats {
  vesselsToday: {
    count: number;
    change: string;
  };
  activeSchedules: {
    count: number;
    waitingTide: number;
  };
  averageDockTime: {
    hours: number;
    change: string;
  };
  occupancyRate: {
    percentage: number;
    change: string;
  };
}

export interface Alert {
  id: string;
  type: 'warning' | 'info' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  source: 'weather' | 'vessel' | 'dock' | 'system';
}

export interface OperationalSummary {
  totalVessels: number;
  dockedVessels: number;
  scheduledArrivals: number;
  scheduledDepartures: number;
  maintenanceSlots: number;
  weatherAlerts: number;
  systemAlerts: number;
}

export const dashboardService = {
  // GET /dashboard/stats - Estatísticas do dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    return apiClient.get<DashboardStats>('/dashboard/stats');
  },

  // GET /dashboard/alerts - Alertas do sistema
  async getAlerts(): Promise<Alert[]> {
    return apiClient.get<Alert[]>('/dashboard/alerts');
  },

  // GET /dashboard/alerts/unread - Alertas não lidos
  async getUnreadAlerts(): Promise<Alert[]> {
    return apiClient.get<Alert[]>('/dashboard/alerts/unread');
  },

  // POST /dashboard/alerts/:id/read - Marca alerta como lido
  async markAlertAsRead(id: string): Promise<void> {
    return apiClient.post<void>(`/dashboard/alerts/${id}/read`, {});
  },

  // POST /dashboard/alerts/read-all - Marca todos como lidos
  async markAllAlertsAsRead(): Promise<void> {
    return apiClient.post<void>('/dashboard/alerts/read-all', {});
  },

  // GET /dashboard/summary - Resumo operacional
  async getOperationalSummary(): Promise<OperationalSummary> {
    return apiClient.get<OperationalSummary>('/dashboard/summary');
  },

  // GET /dashboard/recent-activity - Atividades recentes
  async getRecentActivity(): Promise<{
    id: string;
    type: 'arrival' | 'departure' | 'dock' | 'maintenance' | 'alert';
    description: string;
    timestamp: string;
    vesselName?: string;
    location?: string;
  }[]> {
    return apiClient.get('/dashboard/recent-activity');
  },
};