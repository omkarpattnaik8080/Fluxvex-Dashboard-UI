import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Animates from the previously shown value to `target` (easeOutCubic). */
export function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(prefersReducedMotion() ? target : 0);
  const fromRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) return setValue(target);
    const from = fromRef.current;
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const next = from + (target - from) * (1 - (1 - t) ** 3);
      setValue(next);
      if (t < 1) frame = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

/**
 * Count-up number whose fractional part renders smaller ("$9,100.89" style).
 * @param {(n:number)=>string} format formatter applied every frame
 */
export const AnimatedNumber = ({ value, format, className, testId }) => {
  const current = useCountUp(value ?? 0);
  const text = format(current);
  const finalText = format(value ?? 0);
  const match = text.match(/^([^.]*?)(\.\d+)?([^\d.]*)$/);
  const [, main, decimals, suffix] = match ?? [text, text, "", ""];
  return (
    <span className={cn("fx-display", className)} data-testid={testId} aria-label={finalText}>
      <span aria-hidden>
        {main}
        {decimals && <span className="text-[0.55em] tracking-[-0.02em]">{decimals}</span>}
        {suffix && <span className="text-[0.7em] tracking-[-0.02em]">{suffix}</span>}
      </span>
    </span>
  );
};

/** Green/red circle-arrow chip, e.g. "↗ 44% today" (reference cards). */
export const TrendPill = ({ value, label, className, testId, size = "md" }) => {
  if (value === null || value === undefined || Number.isNaN(value)) return <span className="text-xs fx-subtle">No comparison</span>;
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  const color = up ? "var(--app-success)" : "var(--app-danger)";
  return (
    <span data-testid={testId} className={cn("fx-num inline-flex items-center gap-2 font-medium", size === "sm" ? "text-xs" : "text-[13px]", className)} style={{ color }}>
      <span className={cn("flex items-center justify-center rounded-full text-white", size === "sm" ? "h-4 w-4" : "h-6 w-6")} style={{ background: color }}>
        <Icon className={size === "sm" ? "h-2.5 w-2.5" : "h-3.5 w-3.5"} strokeWidth={2.6} />
      </span>
      {up ? "+" : "−"}
      {Math.abs(value).toFixed(1)}%{label && <span className="font-normal">{label}</span>}
    </span>
  );
};

/** Animated progress ring. `rings` renders concentric arcs (outermost first). */
export const Rings = ({ rings, size = 180, stroke = 12, gap = 6, children }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        {rings.map((ring, i) => {
          const r = size / 2 - stroke / 2 - i * (stroke + gap);
          const len = 2 * Math.PI * r;
          return (
            <g key={ring.id ?? i}>
              <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F1F0EC" strokeWidth={stroke} />
              <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={ring.color} strokeWidth={stroke} strokeLinecap="round"
                strokeDasharray={len} strokeDashoffset={mounted ? len * (1 - Math.min(Math.max(ring.value, 0.001), 1)) : len}
                style={{ transition: `stroke-dashoffset 1100ms cubic-bezier(0.2,0.8,0.2,1) ${i * 140}ms` }} />
            </g>
          );
        })}
      </svg>
      {children && <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>}
    </div>
  );
};

/** Avatar image with optional online dot; falls back to initials. */
export const PersonAvatar = ({ person, size = 40, ring = false, className }) => {
  const initials = person?.name?.split(" ").map((w) => w[0]).slice(0, 2).join("") ?? "?";
  const inner = person?.avatarUrl ? (
    <img src={person.avatarUrl} alt="" className="h-full w-full rounded-full object-cover" />
  ) : (
    <span className="flex h-full w-full items-center justify-center rounded-full bg-[var(--app-accent-wash)] text-xs font-semibold text-[var(--app-accent)]">{initials}</span>
  );
  return (
    <span className={cn("relative inline-flex shrink-0", className)} style={{ width: size, height: size }}>
      {ring ? (
        <span className="h-full w-full rounded-full p-[2.5px]" style={{ background: "conic-gradient(from 200deg, #FFB547, #FF5C8A, #7B7FFF, #FFB547)" }}>
          <span className="block h-full w-full rounded-full bg-white p-[2px]">{inner}</span>
        </span>
      ) : inner}
      {person?.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[var(--app-success)]" aria-label="Online" />}
    </span>
  );
};
