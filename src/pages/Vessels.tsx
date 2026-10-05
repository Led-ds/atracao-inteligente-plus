import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePortCalls } from '@/contexts/PortCallStore';
import { VesselFormDialog } from '@/components/portcall/VesselFormDialog';
import { SimulatedBadge } from '@/components/portcall/Badges';

export default function Vessels() {
  const { vessels, portCalls } = usePortCalls();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Embarcações</h1><p className="text-muted-foreground">Cadastro mestre — dados da visita ficam na Escala</p></div>
        <div className="flex gap-3 items-center"><SimulatedBadge /><VesselFormDialog trigger={<Button><Plus className="h-4 w-4 mr-1" />Cadastrar nova embarcação</Button>} /></div>
      </div>
      <Card><CardContent className="pt-6">
        <Table>
          <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>IMO</TableHead><TableHead>Tipo</TableHead><TableHead>LOA</TableHead><TableHead>Boca</TableHead><TableHead>Escalas</TableHead><TableHead>Status cadastral</TableHead></TableRow></TableHeader>
          <TableBody>
            {vessels.map(v => (
              <TableRow key={v.id}>
                <TableCell className="font-medium">{v.name}</TableCell><TableCell>{v.imo}</TableCell><TableCell>{v.type}</TableCell>
                <TableCell>{v.loa} m</TableCell><TableCell>{v.beam} m</TableCell>
                <TableCell>{portCalls.filter(p => p.vesselId === v.id).length}</TableCell>
                <TableCell><Badge variant="outline">{v.registryStatus === 'ATIVO' ? 'Ativo' : 'Inativo'}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
