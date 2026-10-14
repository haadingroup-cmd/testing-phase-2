"use client";

import { useEffect, useRef } from "react";
import { BadgeCheck, Landmark, PoundSterling, ShieldCheck, TrendingUp } from "lucide-react";

/**
 * Lightweight CSS-3D hero scene: layered "benchmark" panels that respond to pointer movement.
 * Pure CSS transforms — no WebGL, no extra JS libraries. Static when reduced motion is preferred.
 */
export function Hero3D() {
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `rotateX(${14 - y * 10}deg) rotateY(${-18 + x * 16}deg)`;
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="perspective relative mx-auto h-[340px] w-full max-w-[460px] select-none sm:h-[400px]" aria-hidden="true">
      <div className="absolute inset-8 rounded-full bg-brand/10 blur-3xl" />
      <div
        ref={stage}
        className="preserve-3d relative h-full w-full transition-transform duration-300 ease-out"
        style={{ transform: "rotateX(14deg) rotateY(-18deg)" }}
      >
        {/* Base plate */}
        <div className="bg-grid absolute inset-x-6 bottom-6 top-10 rounded-xl border border-rule bg-surface-lowest/70 shadow-lift" style={{ transform: "translateZ(-60px)" }} />

        {/* Main scorecard */}
        <div className="absolute left-4 right-10 top-12 rounded-xl border border-rule bg-surface-lowest p-4 shadow-lift sm:left-8" style={{ transform: "translateZ(30px)" }}>
          <div className="flex items-center justify-between">
            <span className="text-caption font-semibold uppercase tracking-wider text-slate-mute">UK SME Benchmark</span>
            <span className="chip-teal"><BadgeCheck className="h-3 w-3" />Editor&apos;s Choice</span>
          </div>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="font-serif text-[26px] font-semibold leading-tight text-ink">AI Assistant</p>
              <p className="text-body-sm text-slate-mute">Writing • Contracts • Research</p>
            </div>
            <span className="tnum rounded bg-ink px-2.5 py-1 text-[20px] font-bold text-white">9.4</span>
          </div>
          <div className="mt-4 space-y-2.5">
            {[
              ["Value (£)", 90, "bg-brand"],
              ["UK fit", 94, "bg-teal"],
              ["Ease of use", 95, "bg-brand"],
            ].map(([label, v, c]) => (
              <div key={label as string}>
                <div className="flex justify-between text-caption text-slate-body"><span>{label}</span><span className="tnum font-semibold text-ink">{((v as number) / 10).toFixed(1)}</span></div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-high">
                  <div className={`h-full origin-left animate-grow-x rounded-full ${c}`} style={{ width: `${v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating chips */}
        <div className="absolute -left-1 bottom-16 animate-float rounded-lg border border-brand-line bg-brand-tint px-3 py-2 shadow-pop" style={{ transform: "translateZ(90px)" }}>
          <p className="flex items-center gap-1.5 text-price text-brand-active"><PoundSterling className="h-4 w-4" />£18/mo + VAT</p>
        </div>
        <div className="absolute bottom-6 right-2 animate-float rounded-lg border border-rule bg-surface-lowest px-3 py-2 shadow-pop [animation-delay:1.2s]" style={{ transform: "translateZ(110px)" }}>
          <p className="flex items-center gap-1.5 text-label text-teal-deep"><Landmark className="h-4 w-4" />MTD ready</p>
        </div>
        <div className="absolute right-0 top-2 animate-float rounded-lg border border-rule bg-ink px-3 py-2 shadow-pop [animation-delay:2.1s]" style={{ transform: "translateZ(70px)" }}>
          <p className="flex items-center gap-1.5 text-label text-white"><ShieldCheck className="h-4 w-4 text-teal-light" />UK GDPR checked</p>
        </div>
        <div className="absolute bottom-28 right-6 hidden animate-float rounded-full border border-rule bg-surface-lowest p-2 shadow-pop [animation-delay:.6s] sm:block" style={{ transform: "translateZ(140px)" }}>
          <TrendingUp className="h-5 w-5 text-brand" />
        </div>
      </div>
    </div>
  );
}
