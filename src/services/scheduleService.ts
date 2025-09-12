import { apiClient } from './api';

export interface Schedule {
  id: string;
  vesselId: string;
  vesselName: string;
  type: 'arrival' | 'departure';
  scheduledTime: string;
  estimatedTime?: string;
  actualTime?: string;
  status: 'scheduled' | 'confirmed' | 'delayed' | 'cancelled' | 'completed';
  notes?: string;
  dockSlotId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface CreateScheduleRequest {
  vesselId: string;
  type: 'arrival' | 'departure';
  scheduledTime: string;
  notes?: string;
  dockSlotId?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface UpdateScheduleRequest extends Partial<CreateScheduleRequest> {
  estimatedTime?: string;
  actualTime?: string;
  status?: 'scheduled' | 'confirmed' | 'delayed' | 'cancelled' | 'completed';
}

export interface ScheduleSearchParams {
  vesselId?: string;
  type?: 'arrival' | 'departure';
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  priority?: string;
  page?: number;
  limit?: number;
}

export const scheduleService = {
  // GET /schedules - Lista agendamentos
  async getSchedules(params?: ScheduleSearchParams): Promise<Schedule[]> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/schedules${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<Schedule[]>(endpoint);
  },

  // GET /schedules/:id - Busca agendamento por ID
  async getScheduleById(id: string): Promise<Schedule> {
    return apiClient.get<Schedule>(`/schedules/${id}`);
  },

  // POST /schedules - Cria novo agendamento
  async createSchedule(schedule: CreateScheduleRequest): Promise<Schedule> {
    return apiClient.post<Schedule>('/schedules', schedule);
  },

  // PUT /schedules/:id - Atualiza agendamento
  async updateSchedule(id: string, schedule: UpdateScheduleRequest): Promise<Schedule> {
    return apiClient.put<Schedule>(`/schedules/${id}`, schedule);
  },

  // DELETE /schedules/:id - Remove agendamento
  async deleteSchedule(id: string): Promise<void> {
    return apiClient.delete<void>(`/schedules/${id}`);
  },

  // GET /schedules/today - Agendamentos de hoje
  async getTodaySchedules(): Promise<Schedule[]> {
    return apiClient.get<Schedule[]>('/schedules/today');
  },

  // GET /schedules/upcoming - Próximos agendamentos
  async getUpcomingSchedules(hours: number = 24): Promise<Schedule[]> {
    return apiClient.get<Schedule[]>(`/schedules/upcoming?hours=${hours}`);
  },

  // POST /schedules/:id/confirm - Confirma agendamento
  async confirmSchedule(id: string): Promise<Schedule> {
    return apiClient.post<Schedule>(`/schedules/${id}/confirm`, {});
  },

  // POST /schedules/:id/delay - Marca agendamento como atrasado
  async delaySchedule(id: string, newEstimatedTime: string, reason?: string): Promise<Schedule> {
    return apiClient.post<Schedule>(`/schedules/${id}/delay`, { 
      newEstimatedTime, 
      reason 
    });
  },

  // POST /schedules/:id/complete - Marca agendamento como concluído
  async completeSchedule(id: string, actualTime?: string): Promise<Schedule> {
    return apiClient.post<Schedule>(`/schedules/${id}/complete`, { actualTime });
  },
};