import { EligibilityCheck, EligibilityResult, pillarName, pillars } from '@/data/portCalls';
import { EligibilityBadge } from './Badges';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/** Resumo por dimensão + resultado geral. Elegibilidade é resultado técnico, não autorização. */
export function EligibilitySummary({ checks, result }: { checks: EligibilityCheck[]; result: EligibilityResult }) {
  return (
    <div className="rounded-lg border border-border p-3 space-y-2">
      {pillars.map(p => {
        const c = checks.find(x => x.pillar === p);
        return <div key={p} className="flex items-center justify-between text-sm"><span>{pillarName[p]}</span><EligibilityBadge result={c?.result} /></div>;
      })}
      <div className="flex items-center justify-between border-t border-border pt-2 font-semibold text-sm">
        <span>Resultado geral</span><EligibilityBadge result={result} />
      </div>
      <p className="text-xs text-muted-foreground">Apto não significa autorizado. A autorização é uma decisão posterior.</p>
    </div>
  );
}

export function EligibilityRuleCard({ check }: { check: EligibilityCheck }) {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">{pillarName[check.pillar]}</CardTitle><EligibilityBadge result={check.result} />
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        <div className="font-medium">{check.rule}</div>
        <div className="text-muted-foreground">{check.explanation}</div>
        <div className="text-xs text-muted-foreground">Fonte: {check.source}</div>
      </CardContent>
    </Card>
  );
}
