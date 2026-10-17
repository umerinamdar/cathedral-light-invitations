import type { ReactNode } from "react";

export function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2 text-accent" aria-hidden>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-accent sm:w-28" />
      <svg width="88" height="24" viewBox="0 0 88 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M2 12h20c6 0 8-8 14-8s6 8 8 8 2-8 8-8 8 8 14 8h20" />
        <path d="M44 4l4 8-4 8-4-8z" fill="var(--accent-soft)" />
        <circle cx="30" cy="12" r="1.6" fill="currentColor" />
        <circle cx="58" cy="12" r="1.6" fill="currentColor" />
        <path d="M22 12c4 4 8 6 12 6M66 12c-4 4-8 6-12 6" />
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-accent sm:w-28" />
    </div>
  );
}

function Corner({ className }: { className: string }) {
  return (
    <svg className={`absolute h-14 w-14 text-accent sm:h-20 sm:w-20 ${className}`} viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
      <path d="M4 76V20C4 11 11 4 20 4h56" />
      <path d="M10 76V24c0-8 6-14 14-14h52" opacity="0.6" />
      <path d="M18 18c8-2 14 2 14 10-6 0-12-4-14-10z" fill="var(--accent-soft)" fillOpacity="0.35" />
      <path d="M18 18c-2 8 2 14 10 14 0-6-4-12-10-14z" fill="var(--accent-soft)" fillOpacity="0.35" />
      <circle cx="18" cy="18" r="2.2" fill="currentColor" />
      <path d="M36 10c4 2 6 6 4 10M10 36c2 4 6 6 10 4" />
    </svg>
  );
}

export function Frame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`card-paper relative rounded-sm px-6 py-12 sm:px-12 sm:py-16 ${className}`}>
      <div className="pointer-events-none absolute inset-2 border border-border/80 sm:inset-3" />
      <Corner className="left-1 top-1" />
      <Corner className="right-1 top-1 -scale-x-100" />
      <Corner className="bottom-1 left-1 -scale-y-100" />
      <Corner className="bottom-1 right-1 -scale-100" />
      <div className="relative">{children}</div>
    </div>
  );
}

export function Heading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="mb-8 text-center">
      <p className="eyebrow">{eyebrow}</p>
      <div className="mx-auto mt-4 flex max-w-sm items-center gap-4">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-accent" />
        <h2 className="font-display text-4xl font-normal italic text-foreground sm:text-5xl">{title}</h2>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-accent" />
      </div>
    </header>
  );
}

export function Section({ id, children, alt = false }: { id?: string; children: ReactNode; alt?: boolean }) {
  return (
    <section id={id} className={`${alt ? "paper-ground-alt" : "paper-ground"} px-4 py-16 sm:px-8 sm:py-24`}>
      <div className="mx-auto max-w-3xl">{children}</div>
      <div className="mx-auto mt-16 max-w-3xl sm:mt-24"><Divider /></div>
    </section>
  );
}
