import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { portCalls, statusStyle, fmt, PortCallStatus } from '@/data/portCalls';

const statuses: PortCallStatus[] = ['PLANEJADA', 'EM_ANALISE', 'AUTORIZADA', 'AGUARDANDO', 'ATRACADA', 'DESATRACADA', 'ENCERRADA', 'CANCELADA'];

export default function PortCalls() {
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');

  const rows = portCalls.filter(p =>
    (status === 'all' || p.status === status) &&
    `${p.id} ${p.vesselName} ${p.agent} ${p.berth}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Escalas</h1>
          <p className="text-muted-foreground">Cada visita de embarcação ao porto</p>
        </div>
        <Badge variant="outline">DADOS SIMULADOS</Badge>
      </div>
      <Card>
        <CardHeader className="flex flex-row gap-3 items-center space-y-0">
          <CardTitle className="flex-1">Lista de escalas</CardTitle>
          <Input placeholder="Buscar escala, navio, agência..." value={q} onChange={e => setQ(e.target.value)} className="max-w-xs" />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os estados</SelectItem>
              {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Escala</TableHead><TableHead>Embarcação</TableHead><TableHead>Tipo</TableHead>
                <TableHead>Berço</TableHead><TableHead>ETA</TableHead><TableHead>ETD</TableHead>
                <TableHead>Estado</TableHead><TableHead>Motivo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(p => (
                <TableRow key={p.id} className="cursor-pointer" onClick={() => nav(`/port-calls/${p.id}`)}>
                  <TableCell className="font-mono font-medium">{p.id}</TableCell>
                  <TableCell>{p.vesselName}<div className="text-xs text-muted-foreground">LOA {p.loa}m • Calado {p.draft}m</div></TableCell>
                  <TableCell>{p.vesselType}</TableCell>
                  <TableCell>{p.berth}</TableCell>
                  <TableCell>{fmt(p.eta)}</TableCell>
                  <TableCell>{fmt(p.etd)}</TableCell>
                  <TableCell><Badge className={statusStyle[p.status]}>{p.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{p.reason ?? '—'}</TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground">Nenhuma escala encontrada</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
