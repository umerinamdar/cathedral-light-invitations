import { useEffect, useRef, useState } from "react";

const THRESHOLD = 0.38;

export function ScratchCard({ date, time, onReveal }: { date: string; time: string; onReveal: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"foil" | "fading" | "gone">("foil");
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const done = useRef(false);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = rect.width * dpr;
    c.height = rect.height * dpr;
    const ctx = c.getContext("2d")!;
    ctx.scale(dpr, dpr);
    const css = getComputedStyle(document.documentElement);
    const v = (n: string) => css.getPropertyValue(n).trim();
    const g = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    g.addColorStop(0, v("--scratch-ink"));
    g.addColorStop(0.25, v("--scratch-foil"));
    g.addColorStop(0.5, v("--highlight"));
    g.addColorStop(0.7, v("--accent-soft"));
    g.addColorStop(1, v("--accent"));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, rect.width, rect.height);
    // brushed foil grain
    for (let i = 0; i < 1400; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? v("--highlight") : v("--scratch-ink");
      ctx.globalAlpha = Math.random() * 0.12;
      ctx.fillRect(Math.random() * rect.width, Math.random() * rect.height, Math.random() * 18, 1);
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = v("--scratch-ink");
    ctx.globalAlpha = 0.55;
    ctx.font = `500 11px ${v("--font-label")}`;
    ctx.textAlign = "center";
    ctx.fillText("RUB  TO  REVEAL", rect.width / 2, rect.height / 2 + 4);
    ctx.globalAlpha = 1;
  }, []);

  const reveal = () => {
    if (done.current) return;
    done.current = true;
    setState("fading");
    onReveal();
    setTimeout(() => setState("gone"), 900);
  };

  const check = () => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    const { data } = ctx.getImageData(0, 0, c.width, c.height);
    let clear = 0, total = 0;
    for (let i = 3; i < data.length; i += 64) { total++; if (data[i] === 0) clear++; }
    if (clear / total >= THRESHOLD) reveal();
  };

  const scratch = (e: React.PointerEvent) => {
    if (!drawing.current || done.current) return;
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    const p = { x: e.clientX - r.left, y: e.clientY - r.top };
    const ctx = c.getContext("2d")!;
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 34;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(last.current?.x ?? p.x, last.current?.y ?? p.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };

  return (
    <div className="relative mx-auto w-full max-w-xs">
      <div className="card-paper relative rounded-sm border border-accent px-6 py-7 text-center">
        <p className="eyebrow">Save the date</p>
        <p className="mt-3 font-display text-3xl italic text-foreground">{date}</p>
        <p className="mt-2 font-label text-xs uppercase tracking-[0.3em] text-muted-foreground">{time}</p>
      </div>
      {state !== "gone" && (
        <canvas
          ref={canvasRef}
          role="button"
          tabIndex={0}
          aria-label="Gold foil covering the wedding date. Rub to reveal, or press Enter."
          className={`absolute inset-0 h-full w-full cursor-grab touch-none rounded-sm transition-opacity duration-700 ${state === "fading" ? "opacity-0" : "opacity-100"}`}
          onPointerDown={(e) => { drawing.current = true; last.current = null; (e.target as Element).setPointerCapture(e.pointerId); scratch(e); }}
          onPointerMove={scratch}
          onPointerUp={() => { drawing.current = false; last.current = null; check(); }}
          onPointerCancel={() => { drawing.current = false; check(); }}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); reveal(); } }}
        />
      )}
      <span className="sr-only" aria-live="polite">{state !== "foil" ? `${date}, ${time}` : ""}</span>
    </div>
  );
}
