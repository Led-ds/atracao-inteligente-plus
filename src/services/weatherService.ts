import { apiClient } from './api';
import { WeatherData } from '@/types';

export interface WeatherForecast {
  date: string;
  weather: WeatherData;
}

export interface WeatherAlert {
  id: string;
  type: 'storm' | 'high-waves' | 'strong-winds' | 'fog' | 'low-visibility';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  startTime: string;
  endTime?: string;
  isActive: boolean;
}

export const weatherService = {
  // GET /weather/current - Clima atual
  async getCurrentWeather(): Promise<WeatherData> {
    return apiClient.get<WeatherData>('/weather/current');
  },

  // GET /weather/forecast - Previsão do tempo
  async getWeatherForecast(days: number = 7): Promise<WeatherForecast[]> {
    return apiClient.get<WeatherForecast[]>(`/weather/forecast?days=${days}`);
  },

  // GET /weather/alerts - Alertas meteorológicos
  async getWeatherAlerts(): Promise<WeatherAlert[]> {
    return apiClient.get<WeatherAlert[]>('/weather/alerts');
  },

  // GET /weather/alerts/active - Alertas ativos
  async getActiveWeatherAlerts(): Promise<WeatherAlert[]> {
    return apiClient.get<WeatherAlert[]>('/weather/alerts/active');
  },

  // POST /weather/alerts/:id/acknowledge - Reconhece alerta
  async acknowledgeWeatherAlert(id: string): Promise<void> {
    return apiClient.post<void>(`/weather/alerts/${id}/acknowledge`, {});
  },

  // GET /weather/conditions - Condições para navegação
  async getNavigationConditions(): Promise<{
    suitable: boolean;
    conditions: WeatherData;
    warnings: string[];
    recommendations: string[];
  }> {
    return apiClient.get('/weather/conditions');
  },
};