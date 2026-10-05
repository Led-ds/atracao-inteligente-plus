import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Vessel, vesselTypes } from '@/data/portCalls';
import { usePortCalls } from '@/contexts/PortCallStore';

/** Cadastro mestre da Embarcação — sem dados de visita (ETA, calado da viagem). */
export function VesselFormDialog({ trigger, onCreated }: { trigger: React.ReactNode; onCreated?: (v: Vessel) => void }) {
  const { addVessel } = usePortCalls();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: '', imo: '', type: vesselTypes[0], loa: '', beam: '' });
  const ok = f.name.trim() && +f.loa > 0 && +f.beam > 0;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Cadastrar nova embarcação</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><Label>Nome</Label><Input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></div>
          <div><Label>IMO</Label><Input value={f.imo} onChange={e => setF({ ...f, imo: e.target.value })} placeholder="—" /></div>
          <div><Label>Tipo</Label>
            <Select value={f.type} onValueChange={type => setF({ ...f, type })}><SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{vesselTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>LOA / comprimento (m)</Label><Input type="number" value={f.loa} onChange={e => setF({ ...f, loa: e.target.value })} /></div>
          <div><Label>Boca / largura (m)</Label><Input type="number" value={f.beam} onChange={e => setF({ ...f, beam: e.target.value })} /></div>
        </div>
        <DialogFooter>
          <Button disabled={!ok} onClick={() => {
            const v = addVessel({ name: f.name.trim(), imo: f.imo || '—', type: f.type, loa: +f.loa, beam: +f.beam });
            onCreated?.(v); setOpen(false); setF({ name: '', imo: '', type: vesselTypes[0], loa: '', beam: '' });
          }}>Cadastrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
