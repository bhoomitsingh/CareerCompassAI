import { type ReactNode } from 'react';

interface RadialBarProps {
  label: string;
  value: number; // 0..100
  color?: string;
  caption?: ReactNode;
}

export function RadialBar({ label, value, color = '#2DD4BF', caption }: RadialBarProps) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-28 w-28">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span className="font-display text-2xl font-bold text-white">{value}%</span>
        </div>
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-200">{label}</p>
      {caption && <p className="text-xs text-slate-500">{caption}</p>}
    </div>
  );
}

interface BarListProps {
  items: { label: string; value: number; color?: string }[];
  max?: number;
}

export function BarList({ items, max }: BarListProps) {
  const top = max ?? Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="capitalize text-slate-300">{item.label}</span>
            <span className="font-semibold text-slate-400">{item.value}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(item.value / top) * 100}%`,
                background: item.color ?? 'linear-gradient(90deg, #2DD4BF, #38BDF8)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

interface RadarChartProps {
  axes: { label: string; value: number }[]; // 0..100
  color?: string;
}

export function RadarChart({ axes, color = '#2DD4BF' }: RadarChartProps) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = 80;
  const n = axes.length;
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;

  const point = (i: number, radius: number) => [
    cx + Math.cos(angle(i)) * radius,
    cy + Math.sin(angle(i)) * radius,
  ];

  const polygon = (radius: number) =>
    axes.map((_, i) => point(i, radius).join(',')).join(' ');

  const dataPolygon = axes
    .map((a, i) => point(i, (a.value / 100) * r).join(','))
    .join(' ');

  return (
    <div className="grid place-items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <polygon
            key={f}
            points={polygon(r * f)}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="1"
          />
        ))}
        {axes.map((_, i) => {
          const [x, y] = point(i, r);
          return (
            <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          );
        })}
        <polygon points={dataPolygon} fill={`${color}33`} stroke={color} strokeWidth="2" />
        {axes.map((a, i) => {
          const [x, y] = point(i, r + 14);
          return (
            <text
              key={a.label}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-400 text-[9px] capitalize"
            >
              {a.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

interface ProgressBarProps {
  value: number; // 0..100
  className?: string;
}

export function ProgressBar({ value, className = '' }: ProgressBarProps) {
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-white/8 ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-accent-teal to-accent-glow transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
