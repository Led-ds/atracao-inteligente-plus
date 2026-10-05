import { Badge } from '@/components/ui/badge';
import { TimelineEvent, TimelineKind, fmt } from '@/data/portCalls';
import { cn } from '@/lib/utils';

const kindLabel: Record<TimelineKind, string> = { MARCO: 'Marco operacional', OCORRENCIA: 'Ocorrência operacional', ALTERACAO_PLANO: 'Alteração de planejamento' };
const kindClass: Record<TimelineKind, string> = {
  MARCO: 'bg-primary text-primary-foreground', OCORRENCIA: 'bg-warning text-warning-foreground', ALTERACAO_PLANO: 'bg-secondary text-secondary-foreground',
};
const dot: Record<TimelineKind, string> = { MARCO: 'bg-primary', OCORRENCIA: 'bg-warning', ALTERACAO_PLANO: 'bg-muted-foreground' };

export function PortCallTimeline({ events }: { events: TimelineEvent[] }) {
  if (!events.length) return <p className="text-muted-foreground text-sm">Sem eventos para esta escala.</p>;
  return (
    <ol className="relative border-l border-border ml-3 space-y-5">
      {[...events].sort((a, b) => a.at.localeCompare(b.at)).map(t => (
        <li key={t.id} className="ml-6 relative">
          <span className={cn('absolute -left-[1.92rem] top-1.5 h-3 w-3 rounded-full', dot[t.kind])} />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">{fmt(t.at)}</span>
            <Badge className={kindClass[t.kind]}>{kindLabel[t.kind]}</Badge>
            <span className="font-medium">{t.title}</span>
          </div>
          {t.description && <p className="text-sm text-muted-foreground">{t.description}</p>}
          <p className="text-xs text-muted-foreground">{t.actor}</p>
        </li>
      ))}
    </ol>
  );
}
