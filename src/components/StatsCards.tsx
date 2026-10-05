import { ClipboardList, Anchor, Ship, TrendingUp, LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePortCalls } from '@/contexts/PortCallStore';
import { quayLine, occupiedAllocations } from '@/data/portCalls';

const TODAY = '2026-10-05'; // data de referência do cenário simulado

export default function StatsCards() {
  const { portCalls } = usePortCalls();
  const today = portCalls.filter(p => p.eta.slice(0, 10) <= TODAY && p.etd.slice(0, 10) >= TODAY && p.status !== 'CANCELADA');
  const planning = portCalls.filter(p => p.status === 'PLANEJADA' || p.status === 'EM_ANALISE');
  const waiting = portCalls.filter(p => p.status === 'AGUARDANDO_ATRACACAO');
  const berthed = portCalls.filter(p => ['ATRACADA', 'EM_OPERACAO', 'PRONTA_PARA_PARTIDA'].includes(p.status));
  const occupied = occupiedAllocations(portCalls).filter(o => ['ATRACADA', 'EM_OPERACAO', 'PRONTA_PARA_PARTIDA'].includes(o.pc.status))
    .reduce((s, o) => s + (o.alloc.end - o.alloc.start), 0);

  const stats: { title: string; value: string; change: string; icon: LucideIcon }[] = [
    { title: 'Escalas Hoje', value: String(today.length), change: `${planning.length} em planejamento`, icon: ClipboardList },
    { title: 'Aguardando Atracação', value: String(waiting.length), change: waiting.map(w => w.reason).filter(Boolean).join(', ') || 'sem motivo registrado', icon: Anchor },
    { title: 'Atracadas / Em Operação', value: String(berthed.length), change: `${berthed.filter(b => b.status === 'EM_OPERACAO').length} em operação`, icon: Ship },
    { title: 'Ocupação da Linha de Cais', value: `${Math.round((occupied / quayLine.length) * 100)}%`, change: `${occupied} de ${quayLine.length} m ocupados agora`, icon: TrendingUp },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={stat.title} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
