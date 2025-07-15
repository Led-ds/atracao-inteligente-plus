
import { Waves, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function TideWidget() {
  // Mock data - in real app this would come from an API
  const currentTide = {
    height: 2.3,
    type: 'rising' as const,
    nextChange: '14:30',
    nextHeight: 3.1
  };

  const forecast = [
    { time: '12:00', height: 1.8, type: 'low' as const },
    { time: '18:15', height: 3.2, type: 'high' as const },
    { time: '00:45', height: 1.5, type: 'low' as const },
  ];

  return (
    <Card className="bg-gradient-to-br from-ocean-50 to-ocean-100 border-ocean-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-ocean-700">
          <Waves className="h-5 w-5" />
          Maré Atual
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current tide */}
          <div className="text-center">
            <div className="text-3xl font-bold text-ocean-800">
              {currentTide.height}m
            </div>
            <div className="flex items-center justify-center gap-1 text-sm text-ocean-600">
              {currentTide.type === 'rising' ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {currentTide.type === 'rising' ? 'Enchente' : 'Vazante'}
            </div>
            <div className="text-xs text-ocean-500 mt-1">
              Próxima mudança: {currentTide.nextChange} ({currentTide.nextHeight}m)
            </div>
          </div>

          {/* Forecast */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-ocean-700">Próximas 24h</h4>
            {forecast.map((tide, index) => (
              <div key={index} className="flex justify-between items-center text-xs">
                <span className="text-ocean-600">{tide.time}</span>
                <span className="text-ocean-800 font-medium">{tide.height}m</span>
                <span className={cn(
                  "px-2 py-0.5 rounded text-xs",
                  tide.type === 'high' 
                    ? "bg-ocean-200 text-ocean-700" 
                    : "bg-port-200 text-port-700"
                )}>
                  {tide.type === 'high' ? 'Preamar' : 'Baixamar'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
