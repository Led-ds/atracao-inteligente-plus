import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { port } from '@/data/portCalls';
import { QuayLineVisualization } from '@/components/portcall/QuayLineVisualization';
import { SimulatedBadge } from '@/components/portcall/Badges';

/** Estrutura Portuária: Porto → Terminal → Cais → Linha de Cais → Berços. */
export default function Infrastructure() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Estrutura Portuária</h1><p className="text-muted-foreground">Porto → Terminal → Cais → Linha de Cais → Berços</p></div>
        <SimulatedBadge />
      </div>
      <Card><CardHeader><CardTitle>{port.name}</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          {port.terminals.map(t => (
            <div key={t.id} className="space-y-4 border-l-2 border-primary pl-4">
              <div className="font-semibold">Terminal: {t.name}</div>
              {t.quays.map(c => (
                <div key={c.id} className="space-y-3 border-l-2 border-border pl-4">
                  <div className="font-medium">Cais: {c.name}</div>
                  {c.lines.map(l => (
                    <div key={l.id} className="space-y-3 rounded-lg border border-border p-4">
                      <div className="flex items-center gap-2"><span className="font-medium">{l.name}</span><Badge variant="outline">{l.length} m</Badge></div>
                      <QuayLineVisualization line={l} items={[]} />
                      <div className="grid md:grid-cols-3 gap-3 text-sm">
                        {l.berths.map(b => (
                          <div key={b.id} className="rounded-lg bg-secondary p-3">
                            <div className="font-medium">{b.name}</div>
                            <div className="text-muted-foreground">{b.start}–{b.end} m • {b.end - b.start} m de extensão</div>
                            <div className="text-muted-foreground">Profundidade de referência: {b.depth} m (SIMULADO)</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
          <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
            Canal de acesso, trechos de canal e bacia de evolução — previstos para etapas futuras.
          </div>
        </CardContent></Card>
    </div>
  );
}
