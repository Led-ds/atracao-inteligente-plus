import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Allocation, QuayLine, fmt, isConflict } from '@/data/portCalls';
import { cn } from '@/lib/utils';

export interface QuayItem { id: string; label: string; alloc: Allocation; kind: 'autorizada' | 'proposta' | 'rascunho' }

/**
 * Linha de Cais como eixo métrico, com berços discretos e alocações contínuas.
 * mode "space": uma faixa; mode "time": gráfico posição (x) × tempo (y) para mostrar conflitos.
 */
export function QuayLineVisualization({ line, items, mode = 'space' }: { line: QuayLine; items: QuayItem[]; mode?: 'space' | 'time' }) {
  const pct = (m: number) => `${(Math.max(0, Math.min(m, line.length)) / line.length) * 100}%`;
  const w = (a: Allocation) => `${(Math.max(0, Math.min(a.end, line.length) - Math.max(0, a.start)) / line.length) * 100}%`;
  const conflicted = new Set<string>();
  items.forEach(a => items.forEach(b => { if (a !== b && isConflict(a.alloc, b.alloc)) { conflicted.add(a.id); conflicted.add(b.id); } }));

  const times = items.flatMap(i => [+new Date(i.alloc.from), +new Date(i.alloc.to)]);
  const t0 = Math.min(...times), t1 = Math.max(...times), span = Math.max(1, t1 - t0);
  const ticks = [0, 100, 200, 300, 400, 500, 600].filter(t => t <= line.length);

  const box = (i: QuayItem, style: React.CSSProperties) => (
    <Link key={i.id + i.alloc.from} to={`/port-calls/${i.id}`} style={style} title={`${i.label} • ${i.alloc.start}–${i.alloc.end} m • ${fmt(i.alloc.from)} → ${fmt(i.alloc.to)}`}
      className={cn('absolute rounded border text-[11px] px-1 overflow-hidden leading-tight hover:z-10 hover:ring-2 hover:ring-ring',
        i.kind === 'autorizada' ? 'bg-primary/80 text-primary-foreground border-primary' : 'bg-primary/15 text-foreground border-dashed border-primary',
        i.kind === 'rascunho' && 'bg-warning/30 border-warning',
        conflicted.has(i.id) && 'bg-destructive/80 text-destructive-foreground border-destructive border-solid')}>
      <span className="font-medium">{i.label}</span>{mode === 'space' && <><br />{i.alloc.start}–{i.alloc.end} m</>}
    </Link>
  );

  return (
    <div className="space-y-2">
      {/* Berços */}
      <div className="relative h-7 rounded bg-muted">
        {line.berths.map(b => (
          <div key={b.id} className="absolute top-0 h-full border-l border-r border-border flex items-center justify-center text-xs text-muted-foreground"
            style={{ left: pct(b.start), width: pct(b.end - b.start) }}>{b.id} • {b.depth} m</div>
        ))}
      </div>

      {mode === 'space' ? (
        <div className="relative h-14 rounded bg-secondary">{items.map(i => box(i, { left: pct(i.alloc.start), width: w(i.alloc), top: 6, height: 44 }))}</div>
      ) : (
        <div className="relative h-72 rounded bg-secondary">
          {items.map(i => box(i, {
            left: pct(i.alloc.start), width: w(i.alloc),
            top: `${((+new Date(i.alloc.from) - t0) / span) * 100}%`, height: `${((+new Date(i.alloc.to) - +new Date(i.alloc.from)) / span) * 100}%`,
          }))}
          <span className="absolute -left-1 top-0 -translate-x-full text-[10px] text-muted-foreground">{items.length ? fmt(new Date(t0).toISOString()) : ''}</span>
        </div>
      )}

      {/* Eixo métrico */}
      <div className="relative h-4 text-[10px] text-muted-foreground">
        {ticks.map(t => <span key={t} className="absolute -translate-x-1/2" style={{ left: pct(t) }}>{t} m</span>)}
      </div>
      {mode === 'time' && items.length > 0 && (
        <p className="text-xs text-muted-foreground">Eixo vertical: tempo, de {fmt(new Date(t0).toISOString())} (topo) a {fmt(new Date(t1).toISOString())} (base).</p>
      )}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-primary/80" />Alocação autorizada</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded border border-dashed border-primary bg-primary/15" />Proposta em análise</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-destructive/80" />Conflito de alocação</span>
      </div>
    </div>
  );
}

export function AllocationConflict({ items }: { items: QuayItem[] }) {
  const pairs: [QuayItem, QuayItem][] = [];
  items.forEach((a, i) => items.slice(i + 1).forEach(b => { if (isConflict(a.alloc, b.alloc)) pairs.push([a, b]); }));
  if (!pairs.length) return <p className="text-sm text-muted-foreground">Nenhum conflito espaço-temporal entre as alocações exibidas.</p>;
  return (
    <div className="space-y-2">
      {pairs.map(([a, b]) => (
        <div key={a.id + b.id} className="flex gap-2 rounded-lg border border-destructive bg-destructive/10 p-3 text-sm">
          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
          <div>
            <div className="font-semibold">CONFLITO DE ALOCAÇÃO: {a.label} × {b.label}</div>
            <div className="text-muted-foreground">
              Espaço: {a.alloc.start}–{a.alloc.end} m × {b.alloc.start}–{b.alloc.end} m • Tempo: {fmt(a.alloc.from)}→{fmt(a.alloc.to)} × {fmt(b.alloc.from)}→{fmt(b.alloc.to)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
