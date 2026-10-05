import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Anchor, Wind, Waves } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fmt, currentPlan, nextStep, quayLine, reasons, SIM, windForecast } from '@/data/portCalls';
import { usePortCalls } from '@/contexts/PortCallStore';
import { PortCallStatusBadge, EligibilityBadge, PlanStatusBadge, SimulatedBadge } from '@/components/portcall/Badges';
import { EligibilitySummary, EligibilityRuleCard } from '@/components/portcall/EligibilitySummary';
import { PortCallTimeline } from '@/components/portcall/PortCallTimeline';
import { AuthorizationCard } from '@/components/portcall/AuthorizationCard';
import { PlanBerthingDialog } from '@/components/portcall/PlanBerthingDialog';
import { QuayLineVisualization } from '@/components/portcall/QuayLineVisualization';

const planningStatuses = ['PLANEJADA', 'EM_ANALISE'];

export default function PortCallDetail() {
  const { id } = useParams();
  const { portCalls, vesselOf, advance, setReason } = usePortCalls();
  const pc = portCalls.find(p => p.id === id);
  if (!pc) return <div>Escala não encontrada. <Link className="underline" to="/port-calls">Voltar</Link></div>;
  const v = vesselOf(pc);
  const plan = currentPlan(pc);
  const step = nextStep[pc.status];
  const canPlan = planningStatuses.includes(pc.status);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild><Link to="/port-calls"><ArrowLeft className="h-4 w-4 mr-1" />Escalas</Link></Button>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">{v.name}</h1>
            <span className="font-mono text-muted-foreground">{pc.id}</span>
            <PortCallStatusBadge status={pc.status} />
            {pc.reason && <Badge variant="outline">Motivo: {pc.reason}</Badge>}
            <div className="ml-auto"><SimulatedBadge /></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4 text-sm">
            {[['IMO', v.imo], ['ETA', fmt(pc.eta)], ['ETB', fmt(pc.etb)], ['ETD', fmt(pc.etd)], ['Terminal', pc.terminal],
              ['Plano vigente', plan ? `v${plan.version}` : '—']].map(([k, val]) =>
              <div key={k}><div className="text-muted-foreground">{k}</div><div className="font-medium">{val}</div></div>)}
            <div><div className="text-muted-foreground">Elegibilidade</div><EligibilityBadge result={plan?.result} /></div>
          </div>
          <div className="flex flex-wrap gap-2">
            {canPlan && <PlanBerthingDialog pc={pc} trigger={<Button><Anchor className="h-4 w-4 mr-1" />Planejar Atracação</Button>} />}
            {step && <Button variant="secondary" onClick={() => advance(pc.id)}>{step.action}</Button>}
            {pc.status === 'AGUARDANDO_ATRACACAO' && (
              <Select value={pc.reason ?? 'none'} onValueChange={r => setReason(pc.id, r === 'none' ? undefined : r)}>
                <SelectTrigger className="w-56"><SelectValue placeholder="Motivo / condição" /></SelectTrigger>
                <SelectContent><SelectItem value="none">Sem motivo</SelectItem>{reasons.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="plan">Planejamento</TabsTrigger>
          <TabsTrigger value="elig">Elegibilidade</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="env">Ambiente</TabsTrigger>
          <TabsTrigger value="audit">Auditoria</TabsTrigger>
          <TabsTrigger value="integ">Integrações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="md:col-span-2"><CardHeader className="pb-2"><CardTitle className="text-base">Embarcação e visita</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {[['Tipo', v.type], ['LOA', `${v.loa} m`], ['Boca', `${v.beam} m`], ['Operação', pc.operationType],
                  ['Calado de chegada', `${pc.arrivalDraft} m`], ['Calado de saída', `${pc.departureDraft} m`], ['Porto', pc.port],
                  ['Alocação', plan ? `${plan.allocation.start}–${plan.allocation.end} m${plan.allocation.berthId ? ` (${plan.allocation.berthId})` : ''}` : '—']]
                  .map(([k, val]) => <div key={k}><div className="text-muted-foreground">{k}</div><div className="font-medium">{val}</div></div>)}
              </CardContent></Card>
            <AuthorizationCard pc={pc} />
          </div>
          {plan && <Card><CardHeader className="pb-2"><CardTitle className="text-base">Posição na {quayLine.name}</CardTitle></CardHeader>
            <CardContent><QuayLineVisualization line={quayLine} items={[{ id: pc.id, label: v.name, alloc: plan.allocation, kind: plan.status === 'AUTORIZADO' ? 'autorizada' : 'proposta' }]} /></CardContent></Card>}
        </TabsContent>

        <TabsContent value="plan" className="space-y-3">
          {canPlan && <PlanBerthingDialog pc={pc} trigger={<Button variant="outline">{pc.plans.length ? 'Criar nova versão' : 'Planejar Atracação'}</Button>} />}
          {pc.plans.length === 0 ? <p className="text-muted-foreground text-sm">Nenhum planejamento de atracação criado.</p> : [...pc.plans].reverse().map(p => (
            <Card key={p.version} className={p.status === 'SUBSTITUIDO' || p.status === 'REJEITADO' ? 'opacity-75' : ''}>
              <CardHeader className="flex flex-row flex-wrap items-center gap-3 space-y-0 pb-2">
                <CardTitle className="text-lg">Versão {p.version}</CardTitle>
                <PlanStatusBadge status={p.status} /><EligibilityBadge result={p.result} />
                {pc.authorization?.version === p.version && <span className="text-xs text-muted-foreground">Autorizado por {pc.authorization.by} em {fmt(pc.authorization.at)}</span>}
                <span className="ml-auto text-xs text-muted-foreground">{p.createdBy} • {fmt(p.createdAt)}</span>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <div>{quayLine.name}{p.allocation.berthId ? ` • ${p.allocation.berthId}` : ' • sem berço'} • {p.allocation.start}–{p.allocation.end} m • {fmt(p.allocation.from)} → {fmt(p.allocation.to)}</div>
                {p.reason && <div className="text-muted-foreground">Motivo: {p.reason}</div>}
                {p.eligibility.filter(c => c.result === 'NAO_APTO').map(c => <div key={c.pillar} className="text-destructive">{c.explanation}</div>)}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="elig">
          {!plan ? <p className="text-muted-foreground text-sm">Elegibilidade ainda não avaliada — crie um planejamento.</p> : (
            <div className="grid md:grid-cols-[260px_1fr] gap-4">
              <div className="space-y-2"><div className="text-sm font-semibold">Planejamento v{plan.version}</div><EligibilitySummary checks={plan.eligibility} result={plan.result} /></div>
              <div className="grid md:grid-cols-2 gap-4">{plan.eligibility.map(c => <EligibilityRuleCard key={c.pillar} check={c} />)}</div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="timeline"><Card><CardContent className="pt-6"><PortCallTimeline events={pc.timeline} /></CardContent></Card></TabsContent>

        <TabsContent value="env">
          <div className="grid md:grid-cols-3 gap-4">
            {[{ icon: Waves, label: 'Maré atual', value: `${SIM.tideNow} m (preamar ${SIM.highTide} m)` },
              { icon: Wind, label: 'Vento previsto na janela', value: `${windForecast(plan?.allocation.from ?? pc.eta)} nós (limite configurado ${SIM.windLimit})` },
              { icon: Waves, label: 'UKC requerido (parâmetro)', value: `${SIM.ukc} m` }].map(e => (
              <Card key={e.label}><CardContent className="pt-6 space-y-1">
                <div className="text-muted-foreground text-sm flex items-center gap-2"><e.icon className="h-4 w-4" />{e.label}</div>
                <div className="text-xl font-semibold">{e.value}</div>
                <div className="text-xs text-muted-foreground">Fonte: SIMULADO • sem integração real</div>
              </CardContent></Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audit">
          {pc.audit.length === 0 ? <p className="text-muted-foreground text-sm">Sem registros.</p> : (
            <Card><CardContent className="pt-6 divide-y divide-border text-sm">
              {pc.audit.map((a, i) => (
                <div key={i} className="py-2 flex gap-4"><span className="text-muted-foreground w-28">{fmt(a.at)}</span>
                  <span className="w-32">{a.user}</span><span className="font-mono">{a.action}</span><span className="text-muted-foreground">{a.detail}</span></div>
              ))}
            </CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="integ">
          <Card><CardContent className="pt-6 text-sm space-y-2">
            <div className="flex justify-between"><span>DUV / Porto Sem Papel</span><Badge variant="outline">Não integrado</Badge></div>
            <p className="text-muted-foreground">Espaço reservado para futura integração.</p>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
