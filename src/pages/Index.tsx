import { Link } from 'react-router-dom';
import StatsCards from '@/components/StatsCards';
import TideWidget from '@/components/TideWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, AlertTriangle } from 'lucide-react';
import { usePortCalls } from '@/contexts/PortCallStore';
import { quayLine, fmt, currentPlan, occupiedAllocations, isConflict } from '@/data/portCalls';
import { QuayLineVisualization, QuayItem } from '@/components/portcall/QuayLineVisualization';
import { PortCallStatusBadge, EligibilityBadge, SimulatedBadge } from '@/components/portcall/Badges';

export default function Index() {
  const { portCalls, vesselOf } = usePortCalls();
  const berthedNow = occupiedAllocations(portCalls).filter(o => ['ATRACADA', 'EM_OPERACAO', 'PRONTA_PARA_PARTIDA', 'EM_MANOBRA_ATRACACAO', 'EM_MANOBRA_DESATRACACAO'].includes(o.pc.status));
  const items: QuayItem[] = berthedNow.map(o => ({ id: o.pc.id, label: vesselOf(o.pc).name, alloc: o.alloc, kind: 'autorizada' }));
  const upcoming = portCalls.filter(p => ['PLANEJADA', 'EM_ANALISE', 'AUTORIZADA', 'AGUARDANDO_ATRACACAO'].includes(p.status)).sort((a, b) => a.eta.localeCompare(b.eta));

  // Exceções operacionais derivadas do cenário
  const occupied = occupiedAllocations(portCalls);
  const exceptions = [
    ...portCalls.filter(p => p.status === 'EM_ANALISE' && currentPlan(p)?.result === 'NAO_APTO').map(p => {
      const c = occupied.find(o => o.pc.id !== p.id && isConflict(currentPlan(p)!.allocation, o.alloc));
      return { id: p.id, text: `${p.id} — planejamento não apto${c ? `: conflito de alocação com ${c.pc.id}` : ''}` };
    }),
    ...portCalls.filter(p => p.status === 'EM_ANALISE' && currentPlan(p) && currentPlan(p)!.result !== 'NAO_APTO').map(p => ({ id: p.id, text: `${p.id} — planejamento apto aguardando autorização` })),
    ...portCalls.filter(p => p.status === 'AGUARDANDO_ATRACACAO').map(p => ({ id: p.id, text: `${p.id} — aguardando atracação${p.reason ? ` (${p.reason.toLowerCase()})` : ''}` })),
    ...portCalls.filter(p => p.status === 'PLANEJADA').map(p => ({ id: p.id, text: `${p.id} — escala sem planejamento de atracação` })),
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Atraca+</h1>
          <p className="text-muted-foreground">Operação e exceções do porto</p>
        </div>
        <SimulatedBadge />
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>{quayLine.name} — ocupação atual</CardTitle></CardHeader>
          <CardContent><QuayLineVisualization line={quayLine} items={items} /></CardContent>
        </Card>
        <TideWidget />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><ClipboardList className="h-5 w-5" />Próximas Escalas</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {upcoming.map(p => (
              <Link key={p.id} to={`/port-calls/${p.id}`} className="flex items-center justify-between gap-3 p-3 bg-secondary rounded-lg hover:bg-muted">
                <div>
                  <div className="font-medium text-sm">{vesselOf(p).name} <span className="font-mono text-xs text-muted-foreground">{p.id}</span></div>
                  <div className="text-xs text-muted-foreground">ETA {fmt(p.eta)} • calado chegada {p.arrivalDraft} m{p.reason ? ` • ${p.reason}` : ''}</div>
                </div>
                <div className="flex gap-2"><EligibilityBadge result={currentPlan(p)?.result} /><PortCallStatusBadge status={p.status} /></div>
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5" />Alertas operacionais</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {exceptions.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma exceção no momento.</p>}
            {exceptions.map((e, i) => (
              <Link key={i} to={`/port-calls/${e.id}`} className="flex items-start gap-3 p-3 border border-border rounded-lg hover:bg-secondary">
                <AlertTriangle className="h-4 w-4 mt-0.5 text-warning" /><span className="text-sm">{e.text}</span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
