import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { portCalls, statusStyle, fmt, TimelineKind } from '@/data/portCalls';

const kindLabel: Record<TimelineKind, string> = { MARCO: 'Marco', OCORRENCIA: 'Ocorrência', ALTERACAO_PLANO: 'Alteração do plano' };
const kindStyle: Record<TimelineKind, string> = {
  MARCO: 'bg-primary text-primary-foreground',
  OCORRENCIA: 'bg-destructive text-destructive-foreground',
  ALTERACAO_PLANO: 'bg-secondary text-secondary-foreground',
};
const resultStyle = { APTO: 'bg-primary text-primary-foreground', INAPTO: 'bg-destructive text-destructive-foreground', ALERTA: 'bg-accent text-accent-foreground' };
const pillars = ['NAUTICA', 'ESPACIAL', 'TEMPORAL', 'OPERACIONAL'] as const;
const pillarName = { NAUTICA: 'Náutica', ESPACIAL: 'Espacial', TEMPORAL: 'Temporal', OPERACIONAL: 'Operacional' };

const Empty = ({ text = 'Sem registros para esta escala.' }) => <p className="text-muted-foreground text-sm">{text}</p>;

export default function PortCallDetail() {
  const { id } = useParams();
  const pc = portCalls.find(p => p.id === id);
  if (!pc) return <div className="p-6">Escala não encontrada. <Link className="underline" to="/port-calls">Voltar</Link></div>;

  return (
    <div className="p-6 space-y-6">
      <Button variant="ghost" size="sm" asChild><Link to="/port-calls"><ArrowLeft className="h-4 w-4 mr-1" />Escalas</Link></Button>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold">{pc.vesselName}</h1>
        <span className="font-mono text-muted-foreground">{pc.id}</span>
        <Badge className={statusStyle[pc.status]}>{pc.status}</Badge>
        {pc.reason && <Badge variant="outline">{pc.reason}</Badge>}
        <Badge variant="outline" className="ml-auto">DADOS SIMULADOS</Badge>
      </div>

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

        <TabsContent value="overview">
          <Card><CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 text-sm">
            {[['IMO', pc.imo], ['Tipo', pc.vesselType], ['Comprimento (LOA)', `${pc.loa} m`], ['Calado', `${pc.draft} m`],
              ['Agência', pc.agent], ['Terminal', pc.terminal], ['Berço', pc.berth], ['Período', `${fmt(pc.eta)} → ${fmt(pc.etd)}`]]
              .map(([k, v]) => <div key={k}><div className="text-muted-foreground">{k}</div><div className="font-medium">{v}</div></div>)}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="plan" className="space-y-3">
          {pc.plans.length === 0 ? <Empty text="Nenhum plano criado." /> : [...pc.plans].reverse().map(v => (
            <Card key={v.version}>
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                <CardTitle className="text-lg">Versão {v.version}</CardTitle>
                <Badge variant={v.status === 'REJEITADO' ? 'destructive' : 'default'}>{v.status}</Badge>
                <span className="ml-auto text-xs text-muted-foreground">{v.createdBy} • {fmt(v.createdAt)}</span>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <div>{v.berth} • posição {v.positionStart}–{v.positionEnd} m • {fmt(v.eta)} → {fmt(v.etd)}</div>
                {v.reason && <div className="text-muted-foreground">{v.reason}</div>}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="elig">
          {pc.eligibility.length === 0 ? <Empty text="Elegibilidade ainda não avaliada." /> : (
            <div className="grid md:grid-cols-2 gap-4">
              {pillars.map(p => (
                <Card key={p}><CardHeader className="pb-2"><CardTitle className="text-lg">{pillarName[p]}</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {pc.eligibility.filter(e => e.pillar === p).map(e => (
                      <div key={e.rule} className="text-sm space-y-1">
                        <div className="flex gap-2 items-center"><Badge className={resultStyle[e.result]}>{e.result}</Badge><span className="font-medium">{e.rule}</span></div>
                        <div className="text-muted-foreground">{e.explanation}</div>
                        <div className="text-xs text-muted-foreground">Fonte: {e.source}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="timeline">
          {pc.timeline.length === 0 ? <Empty /> : (
            <ol className="relative border-l border-border ml-3 space-y-6">
              {[...pc.timeline].sort((a, b) => a.at.localeCompare(b.at)).map(t => (
                <li key={t.id} className="ml-6">
                  <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-primary" />
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-muted-foreground">{fmt(t.at)}</span>
                    <Badge className={kindStyle[t.kind]}>{kindLabel[t.kind]}</Badge>
                    <span className="font-medium">{t.title}</span>
                  </div>
                  {t.description && <p className="text-sm text-muted-foreground">{t.description}</p>}
                  <p className="text-xs text-muted-foreground">{t.actor} • fonte: {t.source}</p>
                </li>
              ))}
            </ol>
          )}
        </TabsContent>

        <TabsContent value="env">
          {pc.environment.length === 0 ? <Empty /> : (
            <div className="grid md:grid-cols-3 gap-4">
              {pc.environment.map(e => (
                <Card key={e.label}><CardContent className="pt-6">
                  <div className="text-muted-foreground text-sm">{e.label}</div>
                  <div className="text-xl font-semibold">{e.value}</div>
                  <div className="text-xs text-muted-foreground">Fonte: {e.source} • lido em {fmt(e.readAt)}</div>
                </CardContent></Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="audit">
          {pc.audit.length === 0 ? <Empty /> : (
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
