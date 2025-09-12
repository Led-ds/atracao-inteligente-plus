import { apiClient } from './api';
import { TideData } from '@/types';

export interface TideSearchParams {
  dateFrom?: string;
  dateTo?: string;
  type?: 'high' | 'low';
}

export interface TidePrediction {
  date: string;
  tides: TideData[];
}

export const tideService = {
  // GET /tide/current - Maré atual
  async getCurrentTide(): Promise<TideData> {
    return apiClient.get<TideData>('/tide/current');
  },

  // GET /tide/today - Marés do dia
  async getTodayTides(): Promise<TideData[]> {
    return apiClient.get<TideData[]>('/tide/today');
  },

  // GET /tide/predictions - Previsões de maré
  async getTidePredictions(params?: TideSearchParams): Promise<TidePrediction[]> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/tide/predictions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<TidePrediction[]>(endpoint);
  },

  // GET /tide/next-high - Próxima maré alta
  async getNextHighTide(): Promise<TideData> {
    return apiClient.get<TideData>('/tide/next-high');
  },

  // GET /tide/next-low - Próxima maré baixa
  async getNextLowTide(): Promise<TideData> {
    return apiClient.get<TideData>('/tide/next-low');
  },

  // GET /tide/weekly - Marés da semana
  async getWeeklyTides(): Promise<TidePrediction[]> {
    return apiClient.get<TidePrediction[]>('/tide/weekly');
  },
};