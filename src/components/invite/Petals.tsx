import { useMemo } from "react";

export function Petals() {
  const petals = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        left: Math.random() * 100,
        size: 8 + Math.random() * 10,
        dur: 12 + Math.random() * 12,
        delay: Math.random() * 14,
        drift: (Math.random() - 0.5) * 30,
        spin: (Math.random() > 0.5 ? 1 : -1) * (240 + Math.random() * 400),
        k: i,
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
      {petals.map((p) => (
        <span
          key={p.k}
          className="petal"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.2,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            ["--drift" as string]: `${p.drift}vw`,
            ["--spin" as string]: `${p.spin}deg`,
          }}
        />
      ))}
    </div>
  );
}
