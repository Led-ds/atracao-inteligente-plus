import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { quayLine, occupyingStatuses, fmt } from '@/data/portCalls';
import { usePortCalls } from '@/contexts/PortCallStore';
import { QuayLineVisualization, AllocationConflict, QuayItem } from '@/components/portcall/QuayLineVisualization';
import { EligibilityBadge, PlanStatusBadge, PortCallStatusBadge, SimulatedBadge } from '@/components/portcall/Badges';

/** Visão consolidada dos Planejamentos de Atracação na Linha de Cais (posição × tempo). */
export default function Planning() {
  const { portCalls, vesselOf } = usePortCalls();
  const rows = portCalls.flatMap(pc => {
    const auth = pc.plans.find(p => p.status === 'AUTORIZADO');
    const proposed = [...pc.plans].reverse().find(p => p.status === 'PROPOSTO');
    const plan = occupyingStatuses.includes(pc.status) ? auth : pc.status === 'EM_ANALISE' ? proposed : undefined;
    return plan ? [{ pc, plan }] : [];
  });
  const items: QuayItem[] = rows.map(({ pc, plan }) => ({ id: pc.id, label: vesselOf(pc).name, alloc: plan.allocation, kind: plan.status === 'AUTORIZADO' ? 'autorizada' : 'proposta' }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Planejamento de Atracação</h1>
          <p className="text-muted-foreground">Alocações na {quayLine.name} — espaço (metros) × tempo</p></div>
        <SimulatedBadge />
      </div>
      <Card><CardHeader><CardTitle>Ocupação espaço-temporal</CardTitle></CardHeader>
        <CardContent className="space-y-4"><QuayLineVisualization line={quayLine} items={items} mode="time" /><AllocationConflict items={items} /></CardContent></Card>
      <Card><CardHeader><CardTitle>Alocações vigentes e propostas</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Escala</TableHead><TableHead>Embarcação</TableHead><TableHead>Versão</TableHead><TableHead>Berço</TableHead>
              <TableHead>Posição</TableHead><TableHead>Janela</TableHead><TableHead>Elegibilidade</TableHead><TableHead>Estado</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map(({ pc, plan }) => (
                <TableRow key={pc.id}>
                  <TableCell className="font-mono"><Link className="underline" to={`/port-calls/${pc.id}`}>{pc.id}</Link></TableCell>
                  <TableCell>{vesselOf(pc).name}</TableCell>
                  <TableCell><span className="font-mono mr-2">v{plan.version}</span><PlanStatusBadge status={plan.status} /></TableCell>
                  <TableCell>{plan.allocation.berthId ?? '—'}</TableCell>
                  <TableCell>{plan.allocation.start}–{plan.allocation.end} m</TableCell>
                  <TableCell>{fmt(plan.allocation.from)} → {fmt(plan.allocation.to)}</TableCell>
                  <TableCell><EligibilityBadge result={plan.result} /></TableCell>
                  <TableCell><PortCallStatusBadge status={pc.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-xs text-muted-foreground mt-3">Para criar ou alterar um planejamento, abra a escala e use "Planejar Atracação".</p>
        </CardContent></Card>
    </div>
  );
}
