import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { allStatuses, statusLabel, fmt, currentPlan, terminals, resultLabel, EligibilityResult } from '@/data/portCalls';
import { usePortCalls } from '@/contexts/PortCallStore';
import { PortCallStatusBadge, EligibilityBadge, SimulatedBadge, PlanStatusBadge } from '@/components/portcall/Badges';
import { NewPortCallDialog } from '@/components/portcall/NewPortCallDialog';

export default function PortCalls() {
  const nav = useNavigate();
  const { portCalls, vesselOf } = usePortCalls();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [terminal, setTerminal] = useState('all');
  const [elig, setElig] = useState('all');

  const rows = portCalls.map(pc => ({ pc, v: vesselOf(pc), plan: currentPlan(pc) })).filter(({ pc, v, plan }) =>
    (status === 'all' || pc.status === status) && (terminal === 'all' || pc.terminal === terminal) &&
    (elig === 'all' || (elig === 'none' ? !plan : plan?.result === elig)) &&
    `${pc.id} ${v.name} ${v.imo}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Escalas</h1>
          <p className="text-muted-foreground">Cada visita de uma embarcação ao porto</p>
        </div>
        <div className="flex items-center gap-3"><SimulatedBadge /><NewPortCallDialog /></div>
      </div>
      <Card>
        <CardHeader className="flex flex-row flex-wrap gap-3 items-center space-y-0">
          <CardTitle className="flex-1">Lista de escalas</CardTitle>
          <Input placeholder="Buscar por escala, embarcação ou IMO" value={q} onChange={e => setQ(e.target.value)} className="max-w-xs" />
          <Select value={status} onValueChange={setStatus}><SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">Todos os estados</SelectItem>{allStatuses.map(s => <SelectItem key={s} value={s}>{statusLabel[s]}</SelectItem>)}</SelectContent></Select>
          <Select value={terminal} onValueChange={setTerminal}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">Todos terminais</SelectItem>{terminals.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
          <Select value={elig} onValueChange={setElig}><SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">Toda elegibilidade</SelectItem>
              {(Object.keys(resultLabel) as EligibilityResult[]).map(r => <SelectItem key={r} value={r}>{resultLabel[r]}</SelectItem>)}
              <SelectItem value="none">Não avaliada</SelectItem></SelectContent></Select>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Escala</TableHead><TableHead>Embarcação</TableHead><TableHead>Tipo</TableHead><TableHead>Terminal</TableHead>
              <TableHead>ETA</TableHead><TableHead>ETD</TableHead><TableHead>Planejamento vigente</TableHead>
              <TableHead>Estado</TableHead><TableHead>Motivo / condição</TableHead><TableHead>Elegibilidade</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {rows.map(({ pc, v, plan }) => (
                <TableRow key={pc.id} className="cursor-pointer" onClick={() => nav(`/port-calls/${pc.id}`)}>
                  <TableCell className="font-mono font-medium">{pc.id}</TableCell>
                  <TableCell>{v.name}<div className="text-xs text-muted-foreground">IMO {v.imo} • LOA {v.loa} m</div></TableCell>
                  <TableCell>{v.type}</TableCell>
                  <TableCell>{pc.terminal}</TableCell>
                  <TableCell>{fmt(pc.eta)}</TableCell>
                  <TableCell>{fmt(pc.etd)}</TableCell>
                  <TableCell>{plan ? <div className="flex items-center gap-2"><span className="font-mono">v{plan.version}</span><PlanStatusBadge status={plan.status} /></div> : <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell><PortCallStatusBadge status={pc.status} /></TableCell>
                  <TableCell className="text-muted-foreground">{pc.reason ?? '—'}</TableCell>
                  <TableCell><EligibilityBadge result={plan?.result} /></TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && <TableRow><TableCell colSpan={10} className="text-center text-muted-foreground">Nenhuma escala encontrada</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
