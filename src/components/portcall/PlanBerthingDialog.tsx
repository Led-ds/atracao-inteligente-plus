import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Allocation, PortCall, quayLine, currentPlan, occupiedAllocations } from '@/data/portCalls';
import { usePortCalls } from '@/contexts/PortCallStore';
import { EligibilitySummary } from './EligibilitySummary';
import { QuayLineVisualization, AllocationConflict, QuayItem } from './QuayLineVisualization';

/** Planejar Atracação: define Alocação (linha, berço opcional, metros e janela) e mostra a elegibilidade antes de salvar. */
export function PlanBerthingDialog({ pc, trigger }: { pc: PortCall; trigger: React.ReactNode }) {
  const { preview, planBerthing, vesselOf, portCalls } = usePortCalls();
  const v = vesselOf(pc);
  const base = currentPlan(pc)?.allocation;
  const init = (): Allocation => base ?? { quayLineId: quayLine.id, start: 0, end: v.loa, from: pc.etb || pc.eta, to: pc.etd };
  const [open, setOpen] = useState(false);
  const [a, setA] = useState<Allocation>(init);
  const [reason, setReason] = useState('');
  const set = (k: keyof Allocation, val: string | number | undefined) => setA(x => ({ ...x, [k]: val }));
  const ev = preview(pc, a);

  const items: QuayItem[] = [
    ...occupiedAllocations(portCalls, pc.id).map(o => ({ id: o.pc.id, label: vesselOf(o.pc).name, alloc: o.alloc, kind: 'autorizada' as const })),
    { id: pc.id, label: `${v.name} (proposta)`, alloc: a, kind: 'rascunho' },
  ];
  const visible = items.filter(i => i.id === pc.id || (+new Date(i.alloc.to) > +new Date(a.from) - 864e5 * 2 && +new Date(i.alloc.from) < +new Date(a.to) + 864e5 * 2));

  return (
    <Dialog open={open} onOpenChange={o => { setOpen(o); if (o) { setA(init()); setReason(''); } }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Planejar Atracação — {pc.id}</DialogTitle>
          <DialogDescription>{v.name} • LOA {v.loa} m • Boca {v.beam} m • Calado chegada {pc.arrivalDraft} m / saída {pc.departureDraft} m. Será criada a versão v{pc.plans.length + 1}.</DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-[1fr_260px] gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Linha de Cais</Label>
                <Select value={a.quayLineId} onValueChange={x => set('quayLineId', x)}><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value={quayLine.id}>{quayLine.name} (0–{quayLine.length} m)</SelectItem></SelectContent></Select></div>
              <div><Label>Berço (opcional)</Label>
                <Select value={a.berthId ?? 'none'} onValueChange={x => {
                  const b = quayLine.berths.find(y => y.id === x);
                  setA(s => ({ ...s, berthId: b?.id, ...(b ? { start: b.start, end: Math.min(b.end, b.start + Math.max(v.loa, 1)) } : {}) }));
                }}><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="none">Sem berço — posição contínua</SelectItem>
                    {quayLine.berths.map(b => <SelectItem key={b.id} value={b.id}>{b.name} ({b.start}–{b.end} m)</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Posição inicial (m)</Label><Input type="number" value={a.start} onChange={e => set('start', +e.target.value)} /></div>
              <div><Label>Posição final (m)</Label><Input type="number" value={a.end} onChange={e => set('end', +e.target.value)} /></div>
              <div><Label>Início previsto</Label><Input type="datetime-local" value={a.from} onChange={e => set('from', e.target.value)} /></div>
              <div><Label>Fim previsto</Label><Input type="datetime-local" value={a.to} onChange={e => set('to', e.target.value)} /></div>
              <div className="col-span-2"><Label>Motivo da versão (opcional)</Label><Input value={reason} onChange={e => setReason(e.target.value)} placeholder="Ex.: ETA alterado, nova posição" /></div>
            </div>
            <QuayLineVisualization line={quayLine} items={visible} mode="time" />
            <AllocationConflict items={visible} />
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-sm">Elegibilidade (prévia)</div>
            <EligibilitySummary checks={ev.checks} result={ev.result} />
            {ev.checks.filter(c => c.result !== 'APTO').map(c => <p key={c.pillar} className="text-xs text-muted-foreground">{c.explanation}</p>)}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={() => { planBerthing(pc.id, a, reason || undefined); setOpen(false); }}>Salvar planejamento v{pc.plans.length + 1}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
