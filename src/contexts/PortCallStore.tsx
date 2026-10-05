import { createContext, useContext, useState, ReactNode } from 'react';
import {
  PortCall, Vessel, Allocation, buildSeed, seedVessels, evaluate, nextStep, TimelineEvent, port,
} from '@/data/portCalls';
import { useAuth } from '@/contexts/AuthContext';

/** Estado em memória do protótipo (DADOS SIMULADOS). Substituível futuramente por chamadas à API. */
interface Store {
  portCalls: PortCall[];
  vessels: Vessel[];
  vesselOf: (pc: PortCall) => Vessel;
  addVessel: (v: Omit<Vessel, 'id' | 'registryStatus'>) => Vessel;
  createPortCall: (d: Pick<PortCall, 'vesselId' | 'terminal' | 'operationType' | 'eta' | 'etb' | 'etd' | 'arrivalDraft' | 'departureDraft'>) => string;
  preview: (pc: PortCall, a: Allocation) => ReturnType<typeof evaluate>;
  planBerthing: (id: string, a: Allocation, reason?: string) => void;
  authorize: (id: string) => void;
  advance: (id: string) => void;
  setReason: (id: string, reason?: string) => void;
}

const Ctx = createContext<Store | null>(null);
export const usePortCalls = () => { const c = useContext(Ctx); if (!c) throw new Error('PortCallStoreProvider ausente'); return c; };

const nowIso = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16); };
let seq = 0; const uid = () => `ev-${Date.now()}-${seq++}`;

export function PortCallStoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const actor = user?.email?.split('@')[0] ?? 'operador.demo';
  const [portCalls, setPortCalls] = useState<PortCall[]>(buildSeed);
  const [vessels, setVessels] = useState<Vessel[]>(seedVessels);

  const vesselOf = (pc: PortCall) => vessels.find(v => v.id === pc.vesselId)!;
  const update = (id: string, fn: (pc: PortCall) => PortCall) => setPortCalls(list => list.map(p => (p.id === id ? fn(p) : p)));
  const log = (pc: PortCall, ev: Omit<TimelineEvent, 'id' | 'at' | 'actor'>, action: string, detail: string): PortCall => {
    const at = nowIso();
    return { ...pc, timeline: [...pc.timeline, { ...ev, id: uid(), at, actor }], audit: [...pc.audit, { at, user: actor, action, detail }] };
  };

  const store: Store = {
    portCalls, vessels, vesselOf,
    addVessel: v => { const nv: Vessel = { ...v, id: `V${Date.now()}`, registryStatus: 'ATIVO' }; setVessels(l => [...l, nv]); return nv; },
    createPortCall: d => {
      const n = portCalls.filter(p => p.id.startsWith('ES-')).length + 1;
      const id = `ES-2026-${String(n).padStart(3, '0')}`;
      const pc: PortCall = { ...d, id, port: port.name, status: 'PLANEJADA', plans: [], timeline: [], audit: [] };
      setPortCalls(l => [log(pc, { kind: 'MARCO', title: 'Escala criada' }, 'CRIAR_ESCALA', id), ...l]);
      return id;
    },
    preview: (pc, a) => evaluate(pc, vesselOf(pc), a, portCalls),
    planBerthing: (id, a, reason) => update(id, pc => {
      const e = evaluate(pc, vesselOf(pc), a, portCalls);
      const version = pc.plans.length + 1;
      const prev = pc.plans.find(p => p.status === 'PROPOSTO');
      const plans = pc.plans.map(p => (p.status === 'PROPOSTO' ? { ...p, status: 'SUBSTITUIDO' as const } : p));
      plans.push({ version, status: 'PROPOSTO', allocation: a, reason, createdBy: actor, createdAt: nowIso(), eligibility: e.checks, result: e.result });
      let next = log({ ...pc, plans, status: pc.status === 'PLANEJADA' ? 'EM_ANALISE' : pc.status }, {
        kind: 'ALTERACAO_PLANO',
        title: prev ? `Planejamento v${prev.version} substituído por v${version}` : `Planejamento v${version} criado`,
        description: `Nova posição definida: ${a.start}–${a.end} m${a.berthId ? ` (${a.berthId})` : ''}`,
      }, 'CRIAR_PLANEJAMENTO', `v${version}`);
      if (e.result === 'NAO_APTO') {
        const failed = e.checks.filter(c => c.result === 'NAO_APTO').map(c => c.explanation).join(' ');
        next = log(next, { kind: 'OCORRENCIA', title: `Planejamento v${version} não apto`, description: failed }, 'AVALIAR_ELEGIBILIDADE', `v${version} — não apto`);
      }
      return next;
    }),
    authorize: id => update(id, pc => {
      const p = [...pc.plans].reverse().find(x => x.status === 'PROPOSTO');
      if (!p || p.result === 'NAO_APTO') return pc;
      const at = nowIso();
      return log({ ...pc, status: 'AUTORIZADA', authorization: { version: p.version, by: actor, at }, plans: pc.plans.map(x => (x === p ? { ...x, status: 'AUTORIZADO' } : x)) },
        { kind: 'MARCO', title: `Planejamento v${p.version} autorizado` }, 'AUTORIZAR_PLANEJAMENTO', `v${p.version}`);
    }),
    advance: id => update(id, pc => {
      const s = nextStep[pc.status]; if (!s) return pc;
      return log({ ...pc, status: s.to, reason: undefined }, { kind: 'MARCO', title: s.milestone }, 'ALTERAR_ESTADO', `${pc.status} → ${s.to}`);
    }),
    setReason: (id, reason) => update(id, pc => log({ ...pc, reason }, { kind: 'OCORRENCIA', title: reason ?? 'Motivo removido' }, 'ALTERAR_MOTIVO', reason ?? '—')),
  };
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}
