
import { Ship, Calendar, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StatsCards() {
  const stats = [
    {
      title: 'Embarcações Hoje',
      value: '8',
      change: '+2 desde ontem',
      icon: Ship,
      color: 'text-ocean-600'
    },
    {
      title: 'Agendamentos Ativos',
      value: '12',
      change: '3 aguardando maré',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      title: 'Tempo Médio no Cais',
      value: '4.2h',
      change: '-0.3h vs média',
      icon: Clock,
      color: 'text-green-600'
    },
    {
      title: 'Taxa de Ocupação',
      value: '67%',
      change: '+5% esta semana',
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
