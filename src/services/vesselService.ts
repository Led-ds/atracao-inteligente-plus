import { apiClient } from './api';
import { Vessel } from '@/types';

export interface CreateVesselRequest {
  name: string;
  type: 'cargo' | 'tourism' | 'fishing' | 'military' | 'service';
  length: number;
  width: number;
  draft: number;
  arrivalTime: string;
  departureTime: string;
  captain: string;
  company: string;
}

export interface UpdateVesselRequest extends Partial<CreateVesselRequest> {
  status?: 'scheduled' | 'docked' | 'departed' | 'waiting';
  position?: number;
}

export interface VesselSearchParams {
  status?: string;
  type?: string;
  company?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export const vesselService = {
  // GET /vessels - Lista todas as embarcações
  async getVessels(params?: VesselSearchParams): Promise<Vessel[]> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/vessels${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<Vessel[]>(endpoint);
  },

  // GET /vessels/:id - Busca embarcação por ID
  async getVesselById(id: string): Promise<Vessel> {
    return apiClient.get<Vessel>(`/vessels/${id}`);
  },

  // POST /vessels - Cria nova embarcação
  async createVessel(vessel: CreateVesselRequest): Promise<Vessel> {
    return apiClient.post<Vessel>('/vessels', vessel);
  },

  // PUT /vessels/:id - Atualiza embarcação
  async updateVessel(id: string, vessel: UpdateVesselRequest): Promise<Vessel> {
    return apiClient.put<Vessel>(`/vessels/${id}`, vessel);
  },

  // DELETE /vessels/:id - Remove embarcação
  async deleteVessel(id: string): Promise<void> {
    return apiClient.delete<void>(`/vessels/${id}`);
  },

  // POST /vessels/:id/dock - Atraca embarcação
  async dockVessel(id: string, position: number): Promise<Vessel> {
    return apiClient.post<Vessel>(`/vessels/${id}/dock`, { position });
  },

  // POST /vessels/:id/depart - Libera embarcação
  async departVessel(id: string): Promise<Vessel> {
    return apiClient.post<Vessel>(`/vessels/${id}/depart`, {});
  },
};