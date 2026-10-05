import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { EligibilityResult, PortCallStatus, resultLabel, statusLabel, PlanStatus, planStatusLabel } from '@/data/portCalls';

const statusClass: Record<PortCallStatus, string> = {
  PLANEJADA: 'bg-muted text-muted-foreground', EM_ANALISE: 'bg-secondary text-secondary-foreground border-border',
  AUTORIZADA: 'bg-primary text-primary-foreground', AGUARDANDO_ATRACACAO: 'bg-warning text-warning-foreground',
  EM_MANOBRA_ATRACACAO: 'bg-accent text-accent-foreground', ATRACADA: 'bg-primary/80 text-primary-foreground',
  EM_OPERACAO: 'bg-success text-success-foreground', PRONTA_PARA_PARTIDA: 'bg-accent text-accent-foreground',
  EM_MANOBRA_DESATRACACAO: 'bg-accent text-accent-foreground', FINALIZADA: 'bg-muted text-muted-foreground',
  CANCELADA: 'bg-destructive text-destructive-foreground',
};
export const PortCallStatusBadge = ({ status }: { status: PortCallStatus }) => (
  <Badge className={cn('whitespace-nowrap hover:opacity-90', statusClass[status])}>{statusLabel[status]}</Badge>
);

export const resultClass: Record<EligibilityResult, string> = {
  APTO: 'bg-success text-success-foreground', APTO_COM_RESTRICAO: 'bg-warning text-warning-foreground', NAO_APTO: 'bg-destructive text-destructive-foreground',
};
export const EligibilityBadge = ({ result }: { result?: EligibilityResult }) =>
  result ? <Badge className={cn('whitespace-nowrap hover:opacity-90', resultClass[result])}>{resultLabel[result]}</Badge>
    : <span className="text-muted-foreground text-sm">Não avaliada</span>;

export const PlanStatusBadge = ({ status }: { status: PlanStatus }) => (
  <Badge variant={status === 'REJEITADO' ? 'destructive' : status === 'AUTORIZADO' ? 'default' : 'outline'}>{planStatusLabel[status]}</Badge>
);

export const SimulatedBadge = () => <Badge variant="outline" className="border-warning text-foreground">DADOS SIMULADOS</Badge>;
