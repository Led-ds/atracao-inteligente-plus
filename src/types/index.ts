
export interface Vessel {
  id: string;
  name: string;
  type: 'cargo' | 'tourism' | 'fishing' | 'military' | 'service';
  length: number;
  width: number;
  draft: number; // calado
  arrivalTime: string;
  departureTime: string;
  status: 'scheduled' | 'docked' | 'departed' | 'waiting';
  captain: string;
  company: string;
  position?: number; // position on the dock (0-90m)
}

export interface DockSlot {
  id: string;
  start: number; // position start in meters
  end: number; // position end in meters
  status: 'free' | 'occupied' | 'waiting-tide' | 'maintenance';
  vessel?: Vessel;
}

export interface TideData {
  time: string;
  height: number; // in meters
  type: 'high' | 'low';
}

export interface WeatherData {
  temperature: number;
  windSpeed: number;
  windDirection: string;
  waves: number;
  visibility: number;
  description: string;
}
