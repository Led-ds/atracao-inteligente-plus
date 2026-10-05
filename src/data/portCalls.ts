// DADOS SIMULADOS — cenário de demonstração. Nenhum valor aqui representa norma oficial.

// ---------- Estados da Escala ----------
export type PortCallStatus =
  | 'PLANEJADA' | 'EM_ANALISE' | 'AUTORIZADA' | 'AGUARDANDO_ATRACACAO' | 'EM_MANOBRA_ATRACACAO'
  | 'ATRACADA' | 'EM_OPERACAO' | 'PRONTA_PARA_PARTIDA' | 'EM_MANOBRA_DESATRACACAO' | 'FINALIZADA' | 'CANCELADA';

export const statusLabel: Record<PortCallStatus, string> = {
  PLANEJADA: 'Planejada', EM_ANALISE: 'Em análise', AUTORIZADA: 'Autorizada',
  AGUARDANDO_ATRACACAO: 'Aguardando atracação', EM_MANOBRA_ATRACACAO: 'Em manobra de atracação',
  ATRACADA: 'Atracada', EM_OPERACAO: 'Em operação', PRONTA_PARA_PARTIDA: 'Pronta para partida',
  EM_MANOBRA_DESATRACACAO: 'Em manobra de desatracação', FINALIZADA: 'Finalizada', CANCELADA: 'Cancelada',
};
export const allStatuses = Object.keys(statusLabel) as PortCallStatus[];

/** Fluxo operacional após a autorização: estado → próxima ação (gera um Marco na timeline). */
export const nextStep: Partial<Record<PortCallStatus, { action: string; to: PortCallStatus; milestone: string }>> = {
  AUTORIZADA: { action: 'Liberar para atracação', to: 'AGUARDANDO_ATRACACAO', milestone: 'Chegada registrada' },
  AGUARDANDO_ATRACACAO: { action: 'Iniciar manobra de atracação', to: 'EM_MANOBRA_ATRACACAO', milestone: 'Primeira espia' },
  EM_MANOBRA_ATRACACAO: { action: 'Registrar atracação (All Fast)', to: 'ATRACADA', milestone: 'All Fast — atracação registrada' },
  ATRACADA: { action: 'Iniciar operação', to: 'EM_OPERACAO', milestone: 'Início da operação' },
  EM_OPERACAO: { action: 'Finalizar operação', to: 'PRONTA_PARA_PARTIDA', milestone: 'Fim da operação' },
  PRONTA_PARA_PARTIDA: { action: 'Iniciar desatracação', to: 'EM_MANOBRA_DESATRACACAO', milestone: 'Início da manobra de desatracação' },
  EM_MANOBRA_DESATRACACAO: { action: 'Registrar desatracação e finalizar', to: 'FINALIZADA', milestone: 'Desatracação registrada — escala finalizada' },
};

/** Estados em que a alocação autorizada ainda ocupa a Linha de Cais. */
export const occupyingStatuses: PortCallStatus[] = ['AUTORIZADA', 'AGUARDANDO_ATRACACAO', 'EM_MANOBRA_ATRACACAO', 'ATRACADA', 'EM_OPERACAO', 'PRONTA_PARA_PARTIDA', 'EM_MANOBRA_DESATRACACAO'];

// ---------- Infraestrutura ----------
export interface Berth { id: string; name: string; start: number; end: number; depth: number }
export interface QuayLine { id: string; name: string; length: number; berths: Berth[] }
export interface Terminal { id: string; name: string; quays: { id: string; name: string; lines: QuayLine[] }[] }

export const quayLine: QuayLine = {
  id: 'LC-01', name: 'Linha de Cais 01', length: 600,
  berths: [
    { id: 'B01', name: 'Berço B01', start: 0, end: 200, depth: 6.0 },
    { id: 'B02', name: 'Berço B02', start: 200, end: 450, depth: 11.0 },
    { id: 'B03', name: 'Berço B03', start: 450, end: 600, depth: 9.5 },
  ],
};
export const port = {
  name: 'Porto Demo',
  terminals: [{ id: 'T1', name: 'Terminal Demo', quays: [{ id: 'C1', name: 'Cais Comercial', lines: [quayLine] }] }] as Terminal[],
};
export const terminals = port.terminals.map(t => t.name);

/** Parâmetros SIMULADOS de demonstração (não são normas). */
export const SIM = { ukc: 0.6, tideNow: 1.0, highTide: 2.0, windLimit: 25 };
export const windForecast = (iso: string) => (iso.startsWith('2026-10-05') ? 22 : 12);

// ---------- Embarcação (cadastro mestre) ----------
export interface Vessel { id: string; name: string; imo: string; type: string; loa: number; beam: number; registryStatus: 'ATIVO' | 'INATIVO' }
export const vesselTypes = ['Carga geral', 'Granel', 'Balsa', 'Pesca', 'Turismo', 'Rebocador', 'Militar'];

export const seedVessels: Vessel[] = [
  { id: 'V1', name: 'MV Atlântico Sul', imo: '9876543', type: 'Carga geral', loa: 180, beam: 30, registryStatus: 'ATIVO' },
  { id: 'V2', name: 'Balsa Rio Negro', imo: '—', type: 'Balsa', loa: 80, beam: 18, registryStatus: 'ATIVO' },
  { id: 'V3', name: 'Graneleiro Vitória', imo: '9456123', type: 'Granel', loa: 190, beam: 32, registryStatus: 'ATIVO' },
  { id: 'V4', name: 'Pesqueiro Boa Sorte', imo: '—', type: 'Pesca', loa: 25, beam: 7, registryStatus: 'ATIVO' },
  { id: 'V5', name: 'Iate Esmeralda', imo: '—', type: 'Turismo', loa: 40, beam: 9, registryStatus: 'ATIVO' },
  { id: 'V6', name: 'Rebocador Tupã', imo: '9112233', type: 'Rebocador', loa: 30, beam: 10, registryStatus: 'ATIVO' },
  { id: 'V7', name: 'Cargueiro Santos', imo: '9334455', type: 'Carga geral', loa: 120, beam: 22, registryStatus: 'ATIVO' },
];

// ---------- Planejamento / Alocação / Elegibilidade ----------
export type EligibilityResult = 'APTO' | 'APTO_COM_RESTRICAO' | 'NAO_APTO';
export const resultLabel: Record<EligibilityResult, string> = { APTO: 'Apto', APTO_COM_RESTRICAO: 'Apto com restrição', NAO_APTO: 'Não apto' };
export type Pillar = 'NAUTICA' | 'ESPACIAL' | 'TEMPORAL' | 'OPERACIONAL';
export const pillars: Pillar[] = ['NAUTICA', 'ESPACIAL', 'TEMPORAL', 'OPERACIONAL'];
export const pillarName: Record<Pillar, string> = { NAUTICA: 'Náutica', ESPACIAL: 'Espacial', TEMPORAL: 'Temporal', OPERACIONAL: 'Operacional' };

export interface EligibilityCheck { pillar: Pillar; rule: string; result: EligibilityResult; explanation: string; source: string }
export interface Allocation { quayLineId: string; berthId?: string; start: number; end: number; from: string; to: string }
export type PlanStatus = 'PROPOSTO' | 'SUBSTITUIDO' | 'REJEITADO' | 'AUTORIZADO';
export const planStatusLabel: Record<PlanStatus, string> = { PROPOSTO: 'Proposto', SUBSTITUIDO: 'Substituído', REJEITADO: 'Rejeitado', AUTORIZADO: 'Autorizado' };

export interface PlanVersion {
  version: number; status: PlanStatus; allocation: Allocation; reason?: string;
  createdBy: string; createdAt: string; eligibility: EligibilityCheck[]; result: EligibilityResult;
}
export interface Authorization { version: number; by: string; at: string }

export type TimelineKind = 'MARCO' | 'OCORRENCIA' | 'ALTERACAO_PLANO';
export interface TimelineEvent { id: string; kind: TimelineKind; at: string; title: string; description?: string; actor: string }
export interface AuditEntry { at: string; user: string; action: string; detail: string }

export interface PortCall {
  id: string; vesselId: string; port: string; terminal: string; operationType: string;
  eta: string; etb: string; etd: string; arrivalDraft: number; departureDraft: number;
  status: PortCallStatus; reason?: string;
  plans: PlanVersion[]; authorization?: Authorization;
  timeline: TimelineEvent[]; audit: AuditEntry[];
}

export const operationTypes = ['Carga', 'Descarga', 'Carga e descarga', 'Embarque de passageiros', 'Abastecimento', 'Apoio'];
export const reasons = ['Aguardando maré', 'Aguardando berço', 'Aguardando vento', 'Aguardando documentação'];

const overlap = (a1: number, a2: number, b1: number, b2: number) => a1 < b2 && b1 < a2;
export const spaceOverlap = (a: Allocation, b: Allocation) => a.quayLineId === b.quayLineId && overlap(a.start, a.end, b.start, b.end);
export const timeOverlap = (a: Allocation, b: Allocation) => overlap(+new Date(a.from), +new Date(a.to), +new Date(b.from), +new Date(b.to));
export const isConflict = (a: Allocation, b: Allocation) => spaceOverlap(a, b) && timeOverlap(a, b);

export const currentPlan = (pc: PortCall) =>
  pc.plans.find(p => p.status === 'AUTORIZADO') ?? [...pc.plans].reverse().find(p => p.status === 'PROPOSTO');

/** Alocações que ocupam a linha de cais (planos autorizados de escalas ativas). */
export const occupiedAllocations = (all: PortCall[], exceptId?: string) =>
  all.filter(pc => pc.id !== exceptId && occupyingStatuses.includes(pc.status))
    .flatMap(pc => { const p = pc.plans.find(x => x.status === 'AUTORIZADO'); return p ? [{ pc, alloc: p.allocation }] : []; });

const worst = (rs: EligibilityResult[]): EligibilityResult =>
  rs.includes('NAO_APTO') ? 'NAO_APTO' : rs.includes('APTO_COM_RESTRICAO') ? 'APTO_COM_RESTRICAO' : 'APTO';

/** Avaliação simulada de elegibilidade em 4 dimensões. Resultado técnico — não é autorização. */
export function evaluate(pc: PortCall, vessel: Vessel, a: Allocation, all: PortCall[]): { checks: EligibilityCheck[]; result: EligibilityResult } {
  const berths = a.berthId ? quayLine.berths.filter(b => b.id === a.berthId) : quayLine.berths.filter(b => overlap(a.start, a.end, b.start, b.end));
  const depth = berths.length ? Math.min(...berths.map(b => b.depth)) : 0;
  const draft = Math.max(pc.arrivalDraft, pc.departureDraft);
  const required = +(draft + SIM.ukc).toFixed(2);
  const nowAvail = +(depth + SIM.tideNow).toFixed(2);
  const highAvail = +(depth + SIM.highTide).toFixed(2);
  const nautical: EligibilityCheck = {
    pillar: 'NAUTICA', rule: 'Calado operacional + UKC requerido ≤ profundidade disponível',
    result: required <= nowAvail ? 'APTO' : required <= highAvail ? 'APTO_COM_RESTRICAO' : 'NAO_APTO',
    explanation: `Calado ${draft.toFixed(1)} m + UKC ${SIM.ukc} m = ${required} m. Disponível: ${nowAvail} m (maré atual) / ${highAvail} m (preamar).` +
      (required > nowAvail && required <= highAvail ? ' Condicionado à preamar.' : ''),
    source: 'Profundidade, maré e UKC SIMULADOS',
  };

  const len = a.end - a.start;
  const inBounds = a.start >= 0 && a.end <= quayLine.length && len > 0;
  const spatial: EligibilityCheck = {
    pillar: 'ESPACIAL', rule: 'LOA cabe no trecho alocado da Linha de Cais',
    result: inBounds && len >= vessel.loa ? 'APTO' : 'NAO_APTO',
    explanation: !inBounds ? `Trecho ${a.start}–${a.end} m fora da linha (0–${quayLine.length} m).` : `Trecho de ${len} m para LOA de ${vessel.loa} m.`,
    source: 'Cadastro da embarcação + plano',
  };

  const conflicts = occupiedAllocations(all, pc.id).filter(o => isConflict(a, o.alloc));
  const validWindow = +new Date(a.to) > +new Date(a.from);
  const temporal: EligibilityCheck = {
    pillar: 'TEMPORAL', rule: 'Sem conflito espaço-temporal com alocações autorizadas',
    result: validWindow && conflicts.length === 0 ? 'APTO' : 'NAO_APTO',
    explanation: !validWindow ? 'Fim previsto anterior ao início.' : conflicts.length
      ? `CONFLITO DE ALOCAÇÃO com ${conflicts.map(c => `${c.pc.id} (${c.alloc.start}–${c.alloc.end} m, ${fmt(c.alloc.from)}→${fmt(c.alloc.to)})`).join('; ')}.`
      : 'Nenhuma alocação autorizada sobreposta no espaço e no tempo.',
    source: 'Alocações autorizadas',
  };

  const wind = windForecast(a.from);
  const operational: EligibilityCheck = {
    pillar: 'OPERACIONAL', rule: 'Vento previsto abaixo do limite configurado',
    result: wind >= SIM.windLimit ? 'NAO_APTO' : wind >= SIM.windLimit * 0.8 ? 'APTO_COM_RESTRICAO' : 'APTO',
    explanation: `Rajadas previstas de ${wind} nós; limite configurado ${SIM.windLimit} nós.`,
    source: 'Limite SIMULADO de demonstração — não é norma',
  };
  const checks = [nautical, spatial, temporal, operational];
  return { checks, result: worst(checks.map(c => c.result)) };
}

export const fmt = (iso: string) =>
  iso ? new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—';

// ---------- Cenário simulado ----------
type Seed = Omit<PortCall, 'plans'> & { plans: Omit<PlanVersion, 'eligibility' | 'result'>[] };
const al = (start: number, end: number, from: string, to: string, berthId?: string): Allocation => ({ quayLineId: quayLine.id, berthId, start, end, from, to });

const seeds: Seed[] = [
  {
    id: 'DEMO-ES-002', vesselId: 'V2', port: port.name, terminal: 'Terminal Demo', operationType: 'Descarga',
    eta: '2026-10-04T07:00', etb: '2026-10-04T08:00', etd: '2026-10-05T20:00', arrivalDraft: 3.5, departureDraft: 3.0, status: 'ATRACADA',
    plans: [{ version: 1, status: 'AUTORIZADO', allocation: al(20, 110, '2026-10-04T08:00', '2026-10-05T20:00', 'B01'), createdBy: 'operador.demo', createdAt: '2026-10-03T09:00' }],
    authorization: { version: 1, by: 'admin.demo', at: '2026-10-03T10:00' },
    timeline: [
      { id: 'a1', kind: 'MARCO', at: '2026-10-03T10:00', title: 'Planejamento v1 autorizado', actor: 'admin.demo' },
      { id: 'a2', kind: 'MARCO', at: '2026-10-04T07:10', title: 'Chegada registrada', actor: 'operador.demo' },
      { id: 'a3', kind: 'MARCO', at: '2026-10-04T08:10', title: 'All Fast — atracação registrada', actor: 'operador.demo' },
    ],
    audit: [{ at: '2026-10-03T10:00', user: 'admin.demo', action: 'AUTORIZAR_PLANEJAMENTO', detail: 'v1' }],
  },
  {
    id: 'DEMO-ES-003', vesselId: 'V3', port: port.name, terminal: 'Terminal Demo', operationType: 'Carga',
    eta: '2026-10-05T01:00', etb: '2026-10-05T02:00', etd: '2026-10-06T14:00', arrivalDraft: 9.8, departureDraft: 10.4, status: 'EM_OPERACAO',
    plans: [{ version: 1, status: 'AUTORIZADO', allocation: al(230, 430, '2026-10-05T02:00', '2026-10-06T14:00', 'B02'), createdBy: 'operador.demo', createdAt: '2026-10-03T16:00' }],
    authorization: { version: 1, by: 'admin.demo', at: '2026-10-03T17:00' },
    timeline: [
      { id: 'b1', kind: 'MARCO', at: '2026-10-05T02:20', title: 'All Fast — atracação registrada', actor: 'operador.demo' },
      { id: 'b2', kind: 'MARCO', at: '2026-10-05T04:00', title: 'Início da operação', actor: 'operador.demo' },
      { id: 'b3', kind: 'OCORRENCIA', at: '2026-10-05T09:30', title: 'Equipamento indisponível', description: 'Guindaste 2 parado por 40 min (simulado)', actor: 'operador.demo' },
    ],
    audit: [],
  },
  {
    id: 'DEMO-ES-001', vesselId: 'V1', port: port.name, terminal: 'Terminal Demo', operationType: 'Carga e descarga',
    eta: '2026-10-06T14:00', etb: '2026-10-06T16:00', etd: '2026-10-07T20:00', arrivalDraft: 10.2, departureDraft: 9.6,
    status: 'AGUARDANDO_ATRACACAO', reason: 'Aguardando maré',
    plans: [
      { version: 1, status: 'REJEITADO', allocation: al(60, 240, '2026-10-05T06:00', '2026-10-06T18:00'), reason: 'Proposta inicial', createdBy: 'operador.demo', createdAt: '2026-10-03T10:00' },
      { version: 2, status: 'SUBSTITUIDO', allocation: al(240, 420, '2026-10-06T15:00', '2026-10-07T18:00', 'B02'), reason: 'Nova posição após conflito', createdBy: 'operador.demo', createdAt: '2026-10-03T14:30' },
      { version: 3, status: 'AUTORIZADO', allocation: al(240, 420, '2026-10-06T16:00', '2026-10-07T20:00', 'B02'), reason: 'ETA alterado pela agência', createdBy: 'operador.demo', createdAt: '2026-10-04T09:00' },
    ],
    authorization: { version: 3, by: 'admin.demo', at: '2026-10-04T10:00' },
    timeline: [
      { id: 't1', kind: 'MARCO', at: '2026-10-03T09:00', title: 'Escala criada', description: 'ETA informado pela agência', actor: 'operador.demo' },
      { id: 't2', kind: 'ALTERACAO_PLANO', at: '2026-10-03T10:00', title: 'Planejamento v1 criado', description: '60–240 m', actor: 'operador.demo' },
      { id: 't3', kind: 'OCORRENCIA', at: '2026-10-03T10:01', title: 'Conflito de alocação', description: 'v1 sobrepõe DEMO-ES-002 e DEMO-ES-003 no espaço e no tempo', actor: 'Sistema' },
      { id: 't4', kind: 'ALTERACAO_PLANO', at: '2026-10-03T14:30', title: 'Planejamento v1 substituído por v2', description: 'Nova posição definida: 240–420 m (B02)', actor: 'operador.demo' },
      { id: 't5', kind: 'ALTERACAO_PLANO', at: '2026-10-04T09:00', title: 'ETA alterado — v2 substituído por v3', actor: 'operador.demo' },
      { id: 't6', kind: 'MARCO', at: '2026-10-04T10:00', title: 'Planejamento v3 autorizado', actor: 'admin.demo' },
      { id: 't7', kind: 'OCORRENCIA', at: '2026-10-05T18:00', title: 'Aguardando maré', description: 'Calado condicionado à preamar (simulado)', actor: 'operador.demo' },
    ],
    audit: [
      { at: '2026-10-03T09:00', user: 'operador.demo', action: 'CRIAR_ESCALA', detail: 'DEMO-ES-001' },
      { at: '2026-10-03T10:00', user: 'operador.demo', action: 'CRIAR_PLANEJAMENTO', detail: 'v1' },
      { at: '2026-10-03T11:20', user: 'admin.demo', action: 'REJEITAR_PLANEJAMENTO', detail: 'v1 — não apto' },
      { at: '2026-10-03T14:30', user: 'operador.demo', action: 'CRIAR_PLANEJAMENTO', detail: 'v2' },
      { at: '2026-10-04T09:00', user: 'operador.demo', action: 'CRIAR_PLANEJAMENTO', detail: 'v3' },
      { at: '2026-10-04T10:00', user: 'admin.demo', action: 'AUTORIZAR_PLANEJAMENTO', detail: 'v3' },
    ],
  },
  {
    id: 'DEMO-ES-004', vesselId: 'V4', port: port.name, terminal: 'Terminal Demo', operationType: 'Descarga',
    eta: '2026-10-05T11:00', etb: '2026-10-05T12:00', etd: '2026-10-05T22:00', arrivalDraft: 2.8, departureDraft: 2.5, status: 'EM_ANALISE',
    plans: [{ version: 1, status: 'PROPOSTO', allocation: al(400, 425, '2026-10-05T12:00', '2026-10-05T22:00', 'B02'), createdBy: 'operador.demo', createdAt: '2026-10-05T08:00' }],
    timeline: [
      { id: 'c1', kind: 'ALTERACAO_PLANO', at: '2026-10-05T08:00', title: 'Planejamento v1 criado', actor: 'operador.demo' },
      { id: 'c2', kind: 'OCORRENCIA', at: '2026-10-05T08:01', title: 'Conflito de alocação', description: 'Sobreposição com DEMO-ES-003', actor: 'Sistema' },
    ],
    audit: [{ at: '2026-10-05T08:00', user: 'operador.demo', action: 'CRIAR_PLANEJAMENTO', detail: 'v1' }],
  },
  {
    id: 'DEMO-ES-007', vesselId: 'V7', port: port.name, terminal: 'Terminal Demo', operationType: 'Carga',
    eta: '2026-10-06T07:00', etb: '2026-10-06T08:00', etd: '2026-10-06T23:00', arrivalDraft: 8.5, departureDraft: 8.8, status: 'EM_ANALISE',
    plans: [{ version: 1, status: 'PROPOSTO', allocation: al(460, 590, '2026-10-06T08:00', '2026-10-06T23:00', 'B03'), createdBy: 'operador.demo', createdAt: '2026-10-05T09:00' }],
    timeline: [{ id: 'd1', kind: 'ALTERACAO_PLANO', at: '2026-10-05T09:00', title: 'Planejamento v1 criado', actor: 'operador.demo' }],
    audit: [],
  },
  {
    id: 'DEMO-ES-005', vesselId: 'V5', port: port.name, terminal: 'Terminal Demo', operationType: 'Embarque de passageiros',
    eta: '2026-10-07T10:00', etb: '2026-10-07T10:30', etd: '2026-10-07T18:00', arrivalDraft: 2.2, departureDraft: 2.2, status: 'PLANEJADA',
    plans: [], timeline: [{ id: 'e1', kind: 'MARCO', at: '2026-10-05T07:00', title: 'Escala criada', actor: 'operador.demo' }], audit: [],
  },
  {
    id: 'DEMO-ES-006', vesselId: 'V6', port: port.name, terminal: 'Terminal Demo', operationType: 'Apoio',
    eta: '2026-10-03T06:00', etb: '2026-10-03T06:30', etd: '2026-10-04T06:00', arrivalDraft: 3.0, departureDraft: 3.0, status: 'FINALIZADA',
    plans: [{ version: 1, status: 'AUTORIZADO', allocation: al(130, 165, '2026-10-03T06:30', '2026-10-04T06:00', 'B01'), createdBy: 'operador.demo', createdAt: '2026-10-02T12:00' }],
    authorization: { version: 1, by: 'admin.demo', at: '2026-10-02T13:00' },
    timeline: [
      { id: 'f1', kind: 'MARCO', at: '2026-10-03T06:35', title: 'All Fast — atracação registrada', actor: 'operador.demo' },
      { id: 'f2', kind: 'MARCO', at: '2026-10-04T05:50', title: 'Desatracação registrada — escala finalizada', actor: 'operador.demo' },
    ],
    audit: [],
  },
];

/** Monta o cenário calculando a elegibilidade de cada versão com o mesmo motor simulado. */
export function buildSeed(): PortCall[] {
  const base: PortCall[] = seeds.map(s => ({ ...s, plans: s.plans.map(p => ({ ...p, eligibility: [], result: 'APTO' as EligibilityResult })) }));
  return base.map(pc => {
    const v = seedVessels.find(x => x.id === pc.vesselId)!;
    return { ...pc, plans: pc.plans.map(p => { const e = evaluate(pc, v, p.allocation, base); return { ...p, eligibility: e.checks, result: e.result }; }) };
  });
}
