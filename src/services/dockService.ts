import { apiClient } from './api';
import { DockSlot } from '@/types';

export interface UpdateDockSlotRequest {
  status: 'free' | 'occupied' | 'waiting-tide' | 'maintenance';
  vesselId?: string;
}

export interface DockOccupancyData {
  totalSlots: number;
  occupiedSlots: number;
  freeSlots: number;
  maintenanceSlots: number;
  waitingTideSlots: number;
  occupancyRate: number;
}

export const dockService = {
  // GET /dock/slots - Lista todos os slots do cais
  async getDockSlots(): Promise<DockSlot[]> {
    return apiClient.get<DockSlot[]>('/dock/slots');
  },

  // GET /dock/slots/:id - Busca slot específico
  async getDockSlotById(id: string): Promise<DockSlot> {
    return apiClient.get<DockSlot>(`/dock/slots/${id}`);
  },

  // PUT /dock/slots/:id - Atualiza status do slot
  async updateDockSlot(id: string, data: UpdateDockSlotRequest): Promise<DockSlot> {
    return apiClient.put<DockSlot>(`/dock/slots/${id}`, data);
  },

  // GET /dock/occupancy - Dados de ocupação do cais
  async getDockOccupancy(): Promise<DockOccupancyData> {
    return apiClient.get<DockOccupancyData>('/dock/occupancy');
  },

  // GET /dock/visualization - Dados para visualização do cais
  async getDockVisualization(): Promise<DockSlot[]> {
    return apiClient.get<DockSlot[]>('/dock/visualization');
  },

  // POST /dock/maintenance/:id - Marca slot para manutenção
  async setSlotMaintenance(id: string, maintenanceEnd?: string): Promise<DockSlot> {
    return apiClient.post<DockSlot>(`/dock/maintenance/${id}`, { maintenanceEnd });
  },

  // DELETE /dock/maintenance/:id - Remove manutenção do slot
  async clearSlotMaintenance(id: string): Promise<DockSlot> {
    return apiClient.delete<DockSlot>(`/dock/maintenance/${id}`);
  },
};