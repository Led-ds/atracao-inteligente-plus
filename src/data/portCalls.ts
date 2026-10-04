// DADOS SIMULADOS — cenário de demonstração (não representam normas oficiais)
export type PortCallStatus =
  | 'PLANEJADA' | 'EM_ANALISE' | 'AUTORIZADA' | 'AGUARDANDO' | 'ATRACADA' | 'DESATRACADA' | 'ENCERRADA' | 'CANCELADA';

export type TimelineKind = 'MARCO' | 'OCORRENCIA' | 'ALTERACAO_PLANO';

export interface TimelineEvent {
  id: string;
  kind: TimelineKind;
  at: string;
  title: string;
  description?: string;
  actor: string;
  source: string;
}

export interface PlanVersion {
  version: number;
  status: 'RASCUNHO' | 'REJEITADO' | 'AUTORIZADO' | 'SUBSTITUIDO';
  berth: string;
  positionStart: number;
  positionEnd: number;
  eta: string;
  etd: string;
  reason?: string;
  createdBy: string;
  createdAt: string;
}

export interface EligibilityCheck {
  pillar: 'NAUTICA' | 'ESPACIAL' | 'TEMPORAL' | 'OPERACIONAL';
  rule: string;
  result: 'APTO' | 'INAPTO' | 'ALERTA';
  explanation: string;
  source: string;
}

export interface AuditEntry { at: string; user: string; action: string; detail: string }

export interface PortCall {
  id: string;
  vesselName: string;
  imo: string;
  vesselType: string;
  loa: number;
  draft: number;
  agent: string;
  terminal: string;
  berth: string;
  status: PortCallStatus;
  reason?: string;
  eta: string;
  etd: string;
  plans: PlanVersion[];
  eligibility: EligibilityCheck[];
  timeline: TimelineEvent[];
  audit: AuditEntry[];
  environment: { label: string; value: string; source: string; readAt: string }[];
}

export const portCalls: PortCall[] = [
  {
    id: 'DEMO-ES-001',
    vesselName: 'MV Atlântico Sul',
    imo: '9876543',
    vesselType: 'Carga geral',
    loa: 180,
    draft: 10.2,
    agent: 'Agência Marítima Demo',
    terminal: 'Terminal Demo',
    berth: 'Berço 2',
    status: 'AUTORIZADA',
    eta: '2026-10-05T06:00',
    etd: '2026-10-06T18:00',
    plans: [
      { version: 1, status: 'REJEITADO', berth: 'Berço 1', positionStart: 20, positionEnd: 200, eta: '2026-10-05T02:00', etd: '2026-10-06T14:00', reason: 'Conflito espacial com DEMO-ES-002 entre 120m e 200m', createdBy: 'operador.demo', createdAt: '2026-10-03T10:00' },
      { version: 2, status: 'AUTORIZADO', berth: 'Berço 2', positionStart: 260, positionEnd: 440, eta: '2026-10-05T06:00', etd: '2026-10-06T18:00', reason: 'Realocação de berço e ETA ajustado para janela de preamar', createdBy: 'operador.demo', createdAt: '2026-10-03T14:30' },
    ],
    eligibility: [
      { pillar: 'NAUTICA', rule: 'Calado + margem ≤ profundidade disponível', result: 'APTO', explanation: 'Calado 10,2m + margem 0,5m = 10,7m ≤ 11,5m disponíveis na preamar', source: 'Parâmetro simulado' },
      { pillar: 'ESPACIAL', rule: 'Sem sobreposição na linha de cais', result: 'APTO', explanation: 'Ocupa 260–440m; nenhuma escala no intervalo', source: 'Plano v2' },
      { pillar: 'TEMPORAL', rule: 'Janela livre no período', result: 'APTO', explanation: '05/10 06:00 a 06/10 18:00 sem conflitos', source: 'Plano v2' },
      { pillar: 'OPERACIONAL', rule: 'Vento abaixo do limite de manobra', result: 'ALERTA', explanation: 'Rajadas previstas de 22 nós; limite simulado 25 nós', source: 'Limite simulado — sem norma oficial' },
    ],
    timeline: [
      { id: 't1', kind: 'MARCO', at: '2026-10-03T09:00', title: 'ETA recebido', description: 'Agência informa ETA 05/10 02:00', actor: 'Agência', source: 'E-mail' },
      { id: 't2', kind: 'ALTERACAO_PLANO', at: '2026-10-03T10:00', title: 'Plano v1 criado', actor: 'operador.demo', source: 'Sistema' },
      { id: 't3', kind: 'OCORRENCIA', at: '2026-10-03T11:15', title: 'Conflito espacial detectado', description: 'Sobreposição com DEMO-ES-002', actor: 'Sistema', source: 'Elegibilidade' },
      { id: 't4', kind: 'ALTERACAO_PLANO', at: '2026-10-03T14:30', title: 'Plano v2 criado', description: 'Berço 2, ETA 06:00', actor: 'operador.demo', source: 'Sistema' },
      { id: 't5', kind: 'MARCO', at: '2026-10-03T15:00', title: 'Atracação autorizada', actor: 'admin.demo', source: 'Sistema' },
    ],
    audit: [
      { at: '2026-10-03T10:00', user: 'operador.demo', action: 'CRIAR_PLANO', detail: 'v1' },
      { at: '2026-10-03T11:20', user: 'admin.demo', action: 'REJEITAR_PLANO', detail: 'v1 — conflito espacial' },
      { at: '2026-10-03T14:30', user: 'operador.demo', action: 'CRIAR_PLANO', detail: 'v2' },
      { at: '2026-10-03T15:00', user: 'admin.demo', action: 'AUTORIZAR', detail: 'v2' },
    ],
    environment: [
      { label: 'Maré (preamar)', value: '3,8 m às 05:40', source: 'SIMULADO', readAt: '2026-10-03T23:00' },
      { label: 'Vento', value: '15 nós NE, rajadas 22', source: 'SIMULADO', readAt: '2026-10-03T23:00' },
      { label: 'Correnteza', value: '1,2 nó', source: 'SIMULADO', readAt: '2026-10-03T23:00' },
    ],
  },
  {
    id: 'DEMO-ES-002', vesselName: 'Balsa Rio Negro', imo: '—', vesselType: 'Balsa', loa: 80, draft: 3.5,
    agent: 'Navegação Amazônia', terminal: 'Terminal Demo', berth: 'Berço 1', status: 'ATRACADA',
    eta: '2026-10-04T08:00', etd: '2026-10-05T20:00', plans: [], eligibility: [], audit: [], environment: [],
    timeline: [{ id: 'a', kind: 'MARCO', at: '2026-10-04T08:10', title: 'Atracada', actor: 'operador.demo', source: 'Sistema' }],
  },
  {
    id: 'DEMO-ES-003', vesselName: 'Pesqueiro Boa Sorte', imo: '—', vesselType: 'Pesca', loa: 25, draft: 2.8,
    agent: 'Cooperativa Pesca', terminal: 'Terminal Demo', berth: 'Berço 3', status: 'AGUARDANDO', reason: 'Aguardando maré',
    eta: '2026-10-05T12:00', etd: '2026-10-05T22:00', plans: [], eligibility: [], audit: [], environment: [], timeline: [],
  },
  {
    id: 'DEMO-ES-004', vesselName: 'Iate Esmeralda', imo: '—', vesselType: 'Turismo', loa: 40, draft: 2.2,
    agent: 'Marina Demo', terminal: 'Terminal Demo', berth: '—', status: 'EM_ANALISE',
    eta: '2026-10-07T10:00', etd: '2026-10-07T18:00', plans: [], eligibility: [], audit: [], environment: [], timeline: [],
  },
];

export const statusStyle: Record<PortCallStatus, string> = {
  PLANEJADA: 'bg-muted text-muted-foreground',
  EM_ANALISE: 'bg-secondary text-secondary-foreground',
  AUTORIZADA: 'bg-primary text-primary-foreground',
  AGUARDANDO: 'bg-accent text-accent-foreground',
  ATRACADA: 'bg-primary/80 text-primary-foreground',
  DESATRACADA: 'bg-muted text-foreground',
  ENCERRADA: 'bg-muted text-muted-foreground',
  CANCELADA: 'bg-destructive text-destructive-foreground',
};

export const fmt = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
