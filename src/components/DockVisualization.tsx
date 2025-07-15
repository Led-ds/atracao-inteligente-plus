
import { useState } from 'react';
import { Ship, Anchor, AlertTriangle, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { DockSlot, Vessel } from '@/types';

// Mock data
const mockSlots: DockSlot[] = [
  {
    id: '1',
    start: 0,
    end: 25,
    status: 'occupied',
    vessel: {
      id: 'v1',
      name: 'MV Atlântico',
      type: 'cargo',
      length: 24,
      width: 8,
      draft: 3.2,
      arrivalTime: '2024-01-15T08:00',
      departureTime: '2024-01-15T16:00',
      status: 'docked',
      captain: 'João Silva',
      company: 'Transportes Marítimos SA'
    }
  },
  {
    id: '2',
    start: 25,
    end: 40,
    status: 'free'
  },
  {
    id: '3',
    start: 40,
    end: 60,
    status: 'waiting-tide',
    vessel: {
      id: 'v2',
      name: 'Pescador I',
      type: 'fishing',
      length: 18,
      width: 6,
      draft: 4.5,
      arrivalTime: '2024-01-15T14:00',
      departureTime: '2024-01-15T20:00',
      status: 'waiting',
      captain: 'Maria Santos',
      company: 'Cooperativa Pesqueira'
    }
  },
  {
    id: '4',
    start: 60,
    end: 75,
    status: 'maintenance'
  },
  {
    id: '5',
    start: 75,
    end: 90,
    status: 'free'
  }
];

export default function DockVisualization() {
  const [selectedSlot, setSelectedSlot] = useState<DockSlot | null>(null);

  const getSlotColor = (status: DockSlot['status']) => {
    switch (status) {
      case 'occupied':
        return 'bg-red-500 hover:bg-red-600';
      case 'free':
        return 'bg-green-500 hover:bg-green-600';
      case 'waiting-tide':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'maintenance':
        return 'bg-gray-500 hover:bg-gray-600';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusIcon = (status: DockSlot['status']) => {
    switch (status) {
      case 'occupied':
        return <Ship className="h-4 w-4" />;
      case 'free':
        return <Anchor className="h-4 w-4" />;
      case 'waiting-tide':
        return <AlertTriangle className="h-4 w-4" />;
      case 'maintenance':
        return <Wrench className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: DockSlot['status']) => {
    switch (status) {
      case 'occupied':
        return 'Ocupado';
      case 'free':
        return 'Livre';
      case 'waiting-tide':
        return 'Aguardando Maré';
      case 'maintenance':
        return 'Manutenção';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Anchor className="h-5 w-5" />
          Visualização do Cais (90m)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Dock visualization */}
          <div className="relative">
            {/* Dock background */}
            <div className="h-20 bg-port-200 rounded-lg border-2 border-port-300 relative overflow-hidden">
              {/* Water effect */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-ocean-300 to-ocean-400 animate-wave"></div>
              
              {/* Slots */}
              <div className="flex h-full">
                {mockSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={cn(
                      "relative border-r border-port-400 cursor-pointer transition-all duration-200 flex items-center justify-center text-white font-medium text-sm",
                      getSlotColor(slot.status)
                    )}
                    style={{ width: `${((slot.end - slot.start) / 90) * 100}%` }}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    <div className="flex flex-col items-center gap-1">
                      {getStatusIcon(slot.status)}
                      <span className="text-xs">{slot.start}-{slot.end}m</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scale */}
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>0m</span>
              <span>30m</span>
              <span>60m</span>
              <span>90m</span>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { status: 'free' as const, label: 'Livre' },
              { status: 'occupied' as const, label: 'Ocupado' },
              { status: 'waiting-tide' as const, label: 'Aguardando Maré' },
              { status: 'maintenance' as const, label: 'Manutenção' }
            ].map((item) => (
              <div key={item.status} className="flex items-center gap-2">
                <div className={cn("w-3 h-3 rounded", getSlotColor(item.status).split(' ')[0])}></div>
                <span className="text-sm text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Selected slot details */}
          {selectedSlot && (
            <div className="mt-4 p-4 bg-accent/50 rounded-lg border border-border">
              <h4 className="font-medium mb-2">
                Slot {selectedSlot.start}-{selectedSlot.end}m • {getStatusText(selectedSlot.status)}
              </h4>
              
              {selectedSlot.vessel ? (
                <div className="space-y-2 text-sm">
                  <div><strong>Embarcação:</strong> {selectedSlot.vessel.name}</div>
                  <div><strong>Tipo:</strong> {selectedSlot.vessel.type}</div>
                  <div><strong>Dimensões:</strong> {selectedSlot.vessel.length}m x {selectedSlot.vessel.width}m</div>
                  <div><strong>Calado:</strong> {selectedSlot.vessel.draft}m</div>
                  <div><strong>Capitão:</strong> {selectedSlot.vessel.captain}</div>
                  <div><strong>Empresa:</strong> {selectedSlot.vessel.company}</div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {selectedSlot.status === 'free' && 'Slot disponível para agendamento'}
                  {selectedSlot.status === 'maintenance' && 'Slot em manutenção - indisponível'}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
