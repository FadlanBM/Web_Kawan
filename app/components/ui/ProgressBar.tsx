// ============================================================
// KAWAN — ProgressBar Component
// ============================================================

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  className?: string;
}

export default function ProgressBar({ current, total, label, className = "" }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-semibold text-coklat">{label}</span>
          <span className="text-sm font-bold text-mint">{current}/{total}</span>
        </div>
      )}
      <div className="w-full h-4 bg-cream-dark rounded-full overflow-hidden border-2 border-border">
        <div
          className="h-full bg-gradient-to-r from-mint to-mint-dark rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
        />
      </div>
    </div>
  );
}
