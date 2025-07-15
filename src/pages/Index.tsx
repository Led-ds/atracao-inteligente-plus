
import Layout from '@/components/Layout';
import StatsCards from '@/components/StatsCards';
import DockVisualization from '@/components/DockVisualization';
import TideWidget from '@/components/TideWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, AlertTriangle, Ship } from 'lucide-react';

export default function Index() {
  // Mock data for upcoming schedules
  const upcomingSchedules = [
    {
      id: '1',
      vessel: 'Turismo Mar Azul',
      time: '09:30',
      type: 'tourism',
      draft: 2.1,
      status: 'confirmed'
    },
    {
      id: '2',
      vessel: 'Cargueiro Santos',
      time: '11:00',
      type: 'cargo',
      draft: 4.2,
      status: 'waiting-tide'
    },
    {
      id: '3',
      vessel: 'Pesqueiro Oceano',
      time: '14:15',
      type: 'fishing',
      draft: 3.8,
      status: 'confirmed'
    }
  ];

  const alerts = [
    {
      id: '1',
      type: 'warning',
      message: 'Maré baixa prevista para 15:30 - 2 embarcações aguardando',
      time: '10 min atrás'
    },
    {
      id: '2',
      type: 'info',
      message: 'Vento forte previsto para esta tarde - verificar agendamentos',
      time: '25 min atrás'
    }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard Atraca+
          </h1>
          <p className="text-muted-foreground">
            Visão geral das operações portuárias em tempo real
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Dock Visualization - spans 2 columns */}
          <div className="lg:col-span-2">
            <DockVisualization />
          </div>

          {/* Tide Widget */}
          <div>
            <TideWidget />
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Schedules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Próximos Agendamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingSchedules.map((schedule) => (
                  <div key={schedule.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Ship className="h-4 w-4 text-ocean-600" />
                      <div>
                        <div className="font-medium text-sm">{schedule.vessel}</div>
                        <div className="text-xs text-muted-foreground">
                          Calado: {schedule.draft}m • {schedule.time}
                        </div>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      schedule.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {schedule.status === 'confirmed' ? 'Confirmado' : 'Aguardando'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alertas e Notificações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-3 border border-border rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                        alert.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                      <div className="flex-1">
                        <div className="text-sm">{alert.message}</div>
                        <div className="text-xs text-muted-foreground mt-1">{alert.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
