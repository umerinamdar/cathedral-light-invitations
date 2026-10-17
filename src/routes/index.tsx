import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import sealedBackdrop from "@/assets/sealed-backdrop.jpg";
import heroBackdrop from "@/assets/hero-backdrop.jpg";
import waxSeal from "@/assets/wax-seal.png";
import paperTexture from "@/assets/paper-texture.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import { Divider, Frame, Heading, Section } from "@/components/invite/ornaments";
import { ScratchCard } from "@/components/invite/ScratchCard";
import { Petals } from "@/components/invite/Petals";

const W = {
  partner1: "Aarav",
  partner2: "Anaya",
  initials: "A & A",
  // All times anchored to India Standard Time (+05:30)
  ceremonyISO: "2027-02-14T16:00:00+05:30",
  dateLabel: "14 February 2027",
  timeLabel: "Four o'clock in the afternoon",
  venue: "The Grand Pavilion",
  address: "Cathedral Road, Old Town",
  map: "https://maps.google.com/?q=The+Grand+Pavilion",
};

const schedule = [
  { name: "Ceremony", iso: "2027-02-14T16:00:00+05:30", dress: "Formal — ivory, blush and gold welcome" },
  { name: "Photographs", iso: "2027-02-14T17:15:00+05:30", dress: "As for ceremony" },
  { name: "Reception", iso: "2027-02-14T18:30:00+05:30", dress: "Cocktail attire" },
  { name: "Dinner", iso: "2027-02-14T20:00:00+05:30", dress: "Black tie optional" },
];

const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date(iso));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aarav & Anaya — 14 February 2027" },
      { name: "description", content: "You are invited to the wedding of Aarav & Anaya at The Grand Pavilion, 14 February 2027." },
      { property: "og:title", content: "Aarav & Anaya — A Wedding Invitation" },
      { property: "og:description", content: "Open the doors to our wedding day — 14 February 2027, The Grand Pavilion." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Invitation,
});

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setR(m.matches);
  }, []);
  return r;
}

function Invitation() {
  const [phase, setPhase] = useState<"sealed" | "opening" | "open">("sealed");
  const [petals, setPetals] = useState(false);
  const sealAudio = useRef<HTMLAudioElement>(null);
  const music = useRef<HTMLAudioElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    document.body.classList.toggle("is-sealed", phase !== "open");
    return () => document.body.classList.remove("is-sealed");
  }, [phase]);

  const open = () => {
    if (phase !== "sealed") return;
    sealAudio.current?.play().catch(() => {});
    const m = music.current;
    if (m) {
      m.muted = true;
      m.volume = 0;
      m.play().then(() => {
        m.muted = false;
        const start = performance.now();
        const tick = (t: number) => {
          const k = Math.min(1, (t - start) / 8000);
          m.volume = 0.6 * k;
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }).catch(() => {});
    }
    setPhase("opening");
    setTimeout(() => setPhase("open"), reduced ? 300 : 6000);
  };

  const celebrate = () => {
    if (!reduced) {
      const css = getComputedStyle(document.documentElement);
      const colors = ["--accent", "--accent-soft", "--highlight", "--scratch-foil"].map((n) => css.getPropertyValue(n).trim());
      confetti({ particleCount: 70, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors, scalar: 0.9 });
      confetti({ particleCount: 70, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors, scalar: 0.9 });
      setTimeout(() => setPetals(true), 1200);
    }
  };

  return (
    <div style={{ ["--paper-img" as string]: `url(${paperTexture})` }} className="paper-ground min-h-dvh">
      <audio ref={sealAudio} src="/audio/seal.wav" preload="auto" />
      <audio ref={music} src="/audio/music.wav" preload="auto" loop />

      {/* HERO (revealed interior) */}
      <header className="relative flex h-dvh min-h-[560px] items-center justify-center overflow-hidden">
        <img
          src={heroBackdrop}
          alt="Sunlit cathedral nave with lilies on the pews and a rose window"
          width={1536}
          height={1024}
          className={`absolute inset-0 h-full w-full object-cover ${phase !== "sealed" ? "hero-settle" : ""}`}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_50%_50%,var(--paper-light),transparent_75%)] opacity-70" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-paper" />
        {phase !== "sealed" && (
          <div className="relative z-10 px-6 text-center">
            <p className="eyebrow rise" style={{ animationDelay: "2.2s" }}>Together with their families</p>
            <h1 className="mt-4 font-display font-light italic leading-[0.9] text-foreground">
              <span className="rise gold-text shimmer block text-6xl sm:text-8xl lg:text-9xl" style={{ animationDelay: "2.8s" }}>{W.partner1}</span>
              <span className="rise block py-1 text-3xl text-accent sm:text-4xl" style={{ animationDelay: "3.4s" }}>&amp;</span>
              <span className="rise gold-text shimmer block text-6xl sm:text-8xl lg:text-9xl" style={{ animationDelay: "3.8s" }}>{W.partner2}</span>
            </h1>
            <p className="rise mt-6 font-label text-xs uppercase tracking-[0.35em] text-ink" style={{ animationDelay: "4.6s" }}>
              request the honour of your presence
            </p>
            <div className="rise mt-8" style={{ animationDelay: "5.2s" }}>
              <ScratchCard date={W.dateLabel} time={W.timeLabel} onReveal={celebrate} />
            </div>
          </div>
        )}
      </header>

      {/* SEALED DOORS */}
      {phase !== "open" && (
        <div
          className={`door-stage fixed inset-0 z-50 overflow-hidden transition-opacity duration-[1400ms] ${phase === "opening" ? "is-open pointer-events-none" : ""}`}
          style={{ opacity: phase === "opening" ? 0 : 1, transitionDelay: phase === "opening" ? "1.4s" : "0s" }}
        >
          <div className="door-light absolute inset-0" />
          <button onClick={open} aria-label={`Open the invitation from ${W.partner1} and ${W.partner2}`} className="absolute inset-0 block h-full w-full cursor-pointer">
            {(["left", "right"] as const).map((side) => (
              <span key={side} className={`door door-${side} absolute top-0 h-full w-1/2 overflow-hidden ${side === "left" ? "left-0" : "right-0"}`}>
                <img
                  src={sealedBackdrop}
                  alt=""
                  width={1536}
                  height={1024}
                  className="absolute top-0 h-full w-[100vw] max-w-none object-cover"
                  style={{ left: side === "left" ? 0 : "-50vw" }}
                />
              </span>
            ))}
            <span className={`absolute left-1/2 top-[54%] w-[34vmin] max-w-56 min-w-32 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${phase === "opening" ? "scale-125 opacity-0" : ""}`}>
              <img src={waxSeal} alt="" width={816} height={816} className="w-full drop-shadow-[0_10px_18px_var(--veil)]" />
              <span className="absolute inset-0 flex items-center justify-center font-display text-[clamp(1.1rem,4.4vmin,2.2rem)] italic text-ink">{W.initials}</span>
            </span>
            <span className={`absolute inset-x-0 bottom-[6%] flex flex-col items-center gap-3 transition-opacity duration-500 ${phase === "opening" ? "opacity-0" : ""}`}>
              <span className="pulse-plate card-paper rounded-sm border border-accent px-5 py-2 eyebrow">Tap to open</span>
              <span className="gold-text font-display text-3xl italic drop-shadow sm:text-5xl">{W.partner1} &amp; {W.partner2}</span>
            </span>
          </button>
        </div>
      )}

      {petals && <Petals />}

      <main>
        <Section id="families">
          <Frame>
            <Heading eyebrow="With the blessings of" title="Our Families" />
            <div className="grid gap-10 text-center sm:grid-cols-2">
              {[
                { side: "The Bride's Family", parents: "Mr Rohan & Mrs Meera Kapoor", grand: "Late Shri Vikram & Smt Kamala Kapoor · Shri Arjun & Smt Lata Mehra" },
                { side: "The Groom's Family", parents: "Mr Sanjay & Mrs Priya Sharma", grand: "Shri Mohan & Smt Usha Sharma · Late Shri Raghav & Smt Sita Iyer" },
              ].map((f) => (
                <div key={f.side}>
                  <p className="eyebrow">{f.side}</p>
                  <p className="mt-3 font-display text-2xl text-foreground">{f.parents}</p>
                  <p className="mt-4 text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">Grandparents</p>
                  <p className="mt-1 font-display text-lg italic text-ink">{f.grand}</p>
                </div>
              ))}
            </div>
          </Frame>
        </Section>

        <Section alt id="venue">
          <Frame>
            <Heading eyebrow="Where" title="The Venue" />
            <div className="text-center">
              <p className="font-display text-3xl text-foreground">{W.venue}</p>
              <p className="mt-2 text-sm tracking-wide text-muted-foreground">{W.address}</p>
              <a href={W.map} target="_blank" rel="noreferrer" className="mt-6 inline-block border border-accent px-6 py-3 eyebrow transition-colors hover:bg-accent hover:text-paper-light">
                Open in maps
              </a>
              <img src={gallery3} alt="The Grand Pavilion garden colonnade at golden hour" width={1024} height={768} loading="lazy" className="mt-10 w-full rounded-sm border border-border object-cover" />
            </div>
          </Frame>
        </Section>

        <Section id="countdown">
          <Frame>
            <Heading eyebrow="Until we say I do" title="Counting Down" />
            <Countdown iso={W.ceremonyISO} />
          </Frame>
        </Section>

        <Section alt id="schedule">
          <Frame>
            <Heading eyebrow={W.dateLabel} title="Order of the Day" />
            <ol className="relative mx-auto max-w-md">
              <span className="absolute bottom-3 left-[5.5rem] top-3 w-px bg-gradient-to-b from-transparent via-accent to-transparent" aria-hidden />
              {schedule.map((s) => (
                <li key={s.name} className="relative grid grid-cols-[5rem_1fr] gap-6 py-5">
                  <time dateTime={s.iso} className="pt-1 text-right font-label text-sm tracking-wider text-accent">{fmtTime(s.iso)}</time>
                  <div>
                    <span className="absolute left-[5.3rem] top-7 h-2 w-2 rotate-45 bg-accent" aria-hidden />
                    <p className="font-display text-2xl text-foreground">{s.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">Dress · {s.dress}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Frame>
        </Section>

        <Section id="gallery">
          <Heading eyebrow="Moments" title="Gallery" />
          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            {[
              { src: gallery1, alt: "Lilies and roses in a stone window niche", w: 768, h: 1024 },
              { src: gallery2, alt: "Two gold rings on ivory silk by candlelight", w: 768, h: 1024 },
            ].map((g) => (
              <figure key={g.alt} className="card-paper p-2 sm:p-3">
                <img src={g.src} alt={g.alt} width={g.w} height={g.h} loading="lazy" className="aspect-[3/4] w-full object-cover" />
              </figure>
            ))}
            <figure className="card-paper col-span-2 p-2 sm:p-3">
              <img src={heroBackdrop} alt="The cathedral nave in afternoon light" width={1536} height={1024} loading="lazy" className="aspect-[16/9] w-full object-cover" />
            </figure>
          </div>
        </Section>

        <Section alt id="reading">
          <Frame>
            <Heading eyebrow="A blessing" title="A Reading" />
            <blockquote className="mx-auto max-w-lg text-center font-display text-2xl font-light italic leading-relaxed text-foreground sm:text-3xl">
              “May your love be as the light through these windows — patient, warm, and coloured by every season you share.”
            </blockquote>
            <p className="mt-6 text-center eyebrow">— A wedding blessing</p>
          </Frame>
        </Section>

        <Section id="travel">
          <Frame>
            <Heading eyebrow="Journeys" title="Travel & Stay" />
            <div className="grid gap-8 text-center sm:grid-cols-3">
              {[
                { t: "By air", d: "The nearest airport is 40 minutes away. Car transfers can be arranged on request." },
                { t: "Accommodation", d: "A block of rooms is held at the Pavilion House under the name Kapoor–Sharma until 10 January 2027." },
                { t: "Parking", d: "Valet parking is provided at the north gate from three o'clock." },
              ].map((x) => (
                <div key={x.t}>
                  <p className="eyebrow">{x.t}</p>
                  <p className="mt-3 font-display text-lg leading-snug text-ink">{x.d}</p>
                </div>
              ))}
            </div>
          </Frame>
        </Section>

        <Section alt id="rsvp">
          <Frame>
            <Heading eyebrow="Kindly reply by 10 January 2027" title="RSVP" />
            <Rsvp />
          </Frame>
        </Section>

        <section className="relative overflow-hidden py-28 text-center">
          <img src={heroBackdrop} alt="" width={1536} height={1024} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-paper via-paper/60 to-paper" />
          <div className="relative px-6">
            <Divider />
            <p className="mt-6 eyebrow">With love</p>
            <p className="gold-text mt-4 font-display text-6xl italic sm:text-7xl">{W.partner1} &amp; {W.partner2}</p>
            <p className="mt-4 font-label text-xs uppercase tracking-[0.35em] text-ink">{W.dateLabel} · {W.venue}</p>
            <div className="mx-auto mt-10 w-28">
              <img src={waxSeal} alt="" width={816} height={816} loading="lazy" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Countdown({ iso }: { iso: string }) {
  const target = new Date(iso).getTime();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - (now ?? target));
  const parts = [
    ["Days", Math.floor(diff / 864e5)],
    ["Hours", Math.floor(diff / 36e5) % 24],
    ["Minutes", Math.floor(diff / 6e4) % 60],
    ["Seconds", Math.floor(diff / 1e3) % 60],
  ] as const;
  return (
    <div className="grid grid-cols-4 gap-2 text-center sm:gap-6" role="timer" aria-live="off">
      {parts.map(([l, n]) => (
        <div key={l} className="border-y border-accent/60 py-4">
          <p className="font-display text-4xl tabular-nums text-foreground sm:text-6xl">{now === null ? "—" : String(n).padStart(2, "0")}</p>
          <p className="mt-1 text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground sm:text-xs">{l}</p>
        </div>
      ))}
    </div>
  );
}

function Rsvp() {
  const [sent, setSent] = useState<string | null>(null);
  if (sent)
    return (
      <p className="text-center font-display text-2xl italic text-foreground">
        Thank you, {sent}. Your reply has been received with joy.
      </p>
    );
  const field = "w-full border-0 border-b border-border bg-transparent px-1 py-3 font-display text-xl text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-accent";
  return (
    <form
      className="mx-auto grid max-w-md gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        const name = new FormData(e.currentTarget).get("name") as string;
        setSent(name.trim().split(" ")[0] || "dear guest");
      }}
    >
      <label className="block"><span className="eyebrow">Full name</span><input name="name" required className={field} placeholder="Your name" /></label>
      <fieldset>
        <legend className="eyebrow">Will you attend?</legend>
        <div className="mt-3 flex gap-6 font-display text-xl">
          <label className="flex items-center gap-2"><input type="radio" name="attend" value="yes" defaultChecked className="accent-accent" /> Joyfully accepts</label>
          <label className="flex items-center gap-2"><input type="radio" name="attend" value="no" className="accent-accent" /> Regretfully declines</label>
        </div>
      </fieldset>
      <label className="block"><span className="eyebrow">Guests</span><input name="guests" type="number" min={1} max={6} defaultValue={1} className={field} /></label>
      <label className="block"><span className="eyebrow">A note for the couple</span><textarea name="note" rows={2} className={field} placeholder="Optional" /></label>
      <button type="submit" className="mx-auto mt-2 bg-accent px-10 py-4 eyebrow text-paper-light transition-colors hover:bg-ink">Send reply</button>
    </form>
  );
}
