import { ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PortCall, fmt } from '@/data/portCalls';
import { usePortCalls } from '@/contexts/PortCallStore';
import { useAuth } from '@/contexts/AuthContext';
import { EligibilityBadge } from './Badges';

/** Autorização: decisão humana posterior à elegibilidade. */
export function AuthorizationCard({ pc }: { pc: PortCall }) {
  const { authorize } = usePortCalls();
  const { user } = useAuth();
  const pending = [...pc.plans].reverse().find(p => p.status === 'PROPOSTO');
  const canAuthorize = user?.role === 'admin';

  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="h-4 w-4" />Autorização</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-2">
        {pc.authorization ? (
          <div className="space-y-1">
            <div className="font-semibold">AUTORIZADO — versão v{pc.authorization.version}</div>
            <div className="text-muted-foreground">Por {pc.authorization.by} em {fmt(pc.authorization.at)}</div>
          </div>
        ) : pending ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">Versão v{pending.version} • elegibilidade <EligibilityBadge result={pending.result} /></div>
            {pending.result === 'NAO_APTO'
              ? <p className="text-muted-foreground">Não é possível autorizar uma proposta não apta. Crie uma nova versão do planejamento.</p>
              : canAuthorize
                ? <Button size="sm" onClick={() => authorize(pc.id)}>Autorizar planejamento v{pending.version}</Button>
                : <p className="text-muted-foreground">Somente usuários autorizados podem autorizar.</p>}
          </div>
        ) : <p className="text-muted-foreground">Nenhum planejamento aguardando autorização.</p>}
      </CardContent>
    </Card>
  );
}
