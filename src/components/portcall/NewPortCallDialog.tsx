import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { operationTypes, terminals } from '@/data/portCalls';
import { usePortCalls } from '@/contexts/PortCallStore';
import { VesselFormDialog } from './VesselFormDialog';

/** Nova Escala: 1) seleciona Embarcação cadastrada; 2) informa dados da visita. */
export function NewPortCallDialog() {
  const { vessels, createPortCall } = usePortCalls();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const empty = { vesselId: '', terminal: terminals[0], operationType: operationTypes[0], eta: '', etb: '', etd: '', arrivalDraft: '', departureDraft: '' };
  const [f, setF] = useState(empty);
  const v = vessels.find(x => x.id === f.vesselId);
  const ok = v && f.eta && f.etd && f.etd > f.eta && +f.arrivalDraft > 0 && +f.departureDraft > 0;

  return (
    <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) setF(empty); }}>
      <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" />Nova Escala</Button></DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Nova Escala</DialogTitle><DialogDescription>Uma escala é uma visita específica de uma embarcação ao porto.</DialogDescription></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>1. Embarcação</Label>
            <div className="flex gap-2">
              <Select value={f.vesselId} onValueChange={vesselId => setF({ ...f, vesselId })}>
                <SelectTrigger className="flex-1"><SelectValue placeholder="Selecione uma embarcação cadastrada" /></SelectTrigger>
                <SelectContent>{vessels.map(x => <SelectItem key={x.id} value={x.id}>{x.name} {x.imo !== '—' && `• IMO ${x.imo}`}</SelectItem>)}</SelectContent>
              </Select>
              <VesselFormDialog trigger={<Button variant="outline">Cadastrar nova embarcação</Button>} onCreated={nv => setF(s => ({ ...s, vesselId: nv.id }))} />
            </div>
            {v && (
              <div className="grid grid-cols-5 gap-2 rounded-lg bg-secondary p-3 text-sm">
                {[['Nome', v.name], ['IMO', v.imo], ['Tipo', v.type], ['LOA', `${v.loa} m`], ['Boca', `${v.beam} m`]].map(([k, val]) =>
                  <div key={k}><div className="text-xs text-muted-foreground">{k}</div><div className="font-medium">{val}</div></div>)}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>2. Dados da visita</Label>
            <div className="grid grid-cols-3 gap-3">
              <div><Label className="text-xs">ETA</Label><Input type="datetime-local" value={f.eta} onChange={e => setF({ ...f, eta: e.target.value })} /></div>
              <div><Label className="text-xs">ETB</Label><Input type="datetime-local" value={f.etb} onChange={e => setF({ ...f, etb: e.target.value })} /></div>
              <div><Label className="text-xs">ETD</Label><Input type="datetime-local" value={f.etd} onChange={e => setF({ ...f, etd: e.target.value })} /></div>
              <div><Label className="text-xs">Calado de chegada (m)</Label><Input type="number" step="0.1" value={f.arrivalDraft} onChange={e => setF({ ...f, arrivalDraft: e.target.value })} /></div>
              <div><Label className="text-xs">Calado de saída (m)</Label><Input type="number" step="0.1" value={f.departureDraft} onChange={e => setF({ ...f, departureDraft: e.target.value })} /></div>
              <div><Label className="text-xs">Terminal</Label>
                <Select value={f.terminal} onValueChange={terminal => setF({ ...f, terminal })}><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{terminals.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
              <div className="col-span-3"><Label className="text-xs">Tipo de operação</Label>
                <Select value={f.operationType} onValueChange={operationType => setF({ ...f, operationType })}><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{operationTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button disabled={!ok} onClick={() => {
            const id = createPortCall({ ...f, etb: f.etb || f.eta, arrivalDraft: +f.arrivalDraft, departureDraft: +f.departureDraft });
            setOpen(false); setF(empty); nav(`/port-calls/${id}`);
          }}>Criar escala</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
