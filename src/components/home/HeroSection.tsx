"use client";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MessageCircle, CheckCircle, TrendingUp, Users, Zap, ShoppingBag, Star } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SITE } from "@/data/siteConfig";

/* ── Particle Canvas ── */
function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Respect users who prefer reduced motion — skip the animation entirely.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let started = false;
    let cleanupResize = () => {};

    // Defer ALL canvas work until the browser is idle (i.e. after first paint /
    // LCP). This stops the 70-point animation loop from blocking the main
    // thread during initial render — the subtitle text paints first, particles
    // start a moment later. Visual result is identical; LCP is no longer held up.
    const start = () => {
      if (started) return;
      started = true;

      let W = canvas.offsetWidth, H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;

      type P = { x:number; y:number; vx:number; vy:number; r:number; a:number };
      const pts: P[] = Array.from({ length: 70 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.4, a: Math.random() * 0.5 + 0.1,
      }));

      const draw = () => {
        ctx.clearRect(0, 0, W, H);
        pts.forEach(p => {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(239,68,68,${p.a})`;
          ctx.fill();
        });
        // connections
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
            if (d < 130) {
              ctx.beginPath();
              ctx.moveTo(pts[i].x, pts[i].y);
              ctx.lineTo(pts[j].x, pts[j].y);
              ctx.strokeStyle = `rgba(239,68,68,${0.06 * (1 - d / 130)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
        raf = requestAnimationFrame(draw);
      };
      draw();

      const onResize = () => {
        W = canvas.offsetWidth; H = canvas.offsetHeight;
        canvas.width = W; canvas.height = H;
      };
      window.addEventListener("resize", onResize);
      cleanupResize = () => window.removeEventListener("resize", onResize);
    };

    // requestIdleCallback runs after the browser finishes critical work (paint).
    // Fallback to a short timeout for Safari, which lacks it.
    const ric = (window as any).requestIdleCallback as
      | ((cb: () => void, opts?: { timeout: number }) => number)
      | undefined;
    const idleId = ric
      ? ric(start, { timeout: 2000 })
      : (setTimeout(start, 1200) as unknown as number);

    return () => {
      cancelAnimationFrame(raf);
      cleanupResize();
      const cic = (window as any).cancelIdleCallback as ((id: number) => void) | undefined;
      if (ric && cic) cic(idleId); else clearTimeout(idleId as unknown as ReturnType<typeof setTimeout>);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full particles pointer-events-none opacity-70" />;
}

/* ── CSS 3D Globe ── */
function Globe3D() {
  return (
    <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-80 md:h-80 mx-auto select-none">
      {/* Outer glow halo */}
      <div className="absolute inset-0 rounded-full bg-red-600/15 blur-3xl animate-pulse pointer-events-none" />

      {/* Globe shell */}
      <div
        className="absolute inset-6 rounded-full overflow-hidden shadow-[0_0_80px_rgba(239,68,68,0.25)] border border-red-500/20"
        style={{ background: "radial-gradient(ellipse at 30% 30%, #1a0a14 0%, #0a0210 50%, #020205 100%)" }}
      >
        {/* Latitude lines */}
        {[20, 35, 50, 65, 80].map(top => (
          <div key={top} className="absolute left-0 right-0 border-t border-red-500/10" style={{ top: `${top}%` }} />
        ))}
        {/* Longitude lines */}
        {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5].map((deg, i) => (
          <div
            key={i}
            className="absolute inset-0 border-l border-red-500/8 rounded-full"
            style={{ transform: `rotateY(${deg}deg)`, transformOrigin: "50% 50%", transformStyle: "preserve-3d" }}
          />
        ))}
        {/* Continent blobs */}
        <div className="absolute top-[28%] left-[22%] w-14 h-9 rounded-full bg-red-500/20 blur-md" />
        <div className="absolute top-[35%] right-[20%] w-10 h-7 rounded-full bg-red-400/15 blur-md" />
        <div className="absolute bottom-[30%] left-[30%] w-18 h-10 rounded-full bg-red-500/18 blur-md" />
        <div className="absolute top-[20%] right-[35%] w-8 h-5 rounded-full bg-red-400/12 blur-md" />
        {/* Sheen */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/6 via-transparent to-transparent rounded-full" />
        {/* Spin ring */}
        <div className="absolute inset-0 rounded-full border border-red-500/25 animate-spin-slow" />
      </div>

      {/* Equator ring */}
      <div
        className="absolute inset-4 rounded-full border-2 border-red-500/20"
        style={{ transform: "rotateX(75deg)", transformStyle: "preserve-3d" }}
      />

      {/* Orbiting dots */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="orbit-1 relative">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-[0_0_10px_rgba(239,68,68,0.9)]" />
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="orbit-2 relative">
          <div className="w-2 h-2 rounded-full bg-rose-300 shadow-[0_0_8px_rgba(253,164,175,0.8)]" />
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="orbit-3 relative">
          <div className="w-1.5 h-1.5 rounded-full bg-red-300 shadow-[0_0_6px_rgba(239,68,68,0.7)]" />
        </div>
      </div>

      {/* Location pins */}
      {[
        { label: "🇵🇰 PK", left: "44%", top: "36%" },
        { label: "🇦🇪 UAE", left: "60%", top: "40%" },
        { label: "🇬🇧 UK",  left: "30%", top: "26%" },
        { label: "🇺🇸 USA", left: "16%", top: "38%" },
        { label: "🇸🇦 KSA", left: "55%", top: "30%" },
      ].map(p => (
        <div key={p.label} className="absolute flex flex-col items-center" style={{ left: p.left, top: p.top }}>
          <div className="glow-dot" />
          <span className="text-[8px] text-slate-300 font-bold mt-1 whitespace-nowrap bg-black/40 px-1 rounded">{p.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Floating Card (desktop only — on mobile these overlap, so we hide them
      and show a clean stats grid instead) ── */
function FloatCard({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.88 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, type: "spring", stiffness: 200 }}
      className={`hidden md:block absolute z-20 card p-3 md:p-4 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] ${className || ""}`}
    >
      {children}
    </motion.div>
  );
}

/* ── HERO ── */
export default function HeroSection() {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const yText  = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const opText = useTransform(scrollYProgress, [0, 1], [1, 1]);

  return (
    <section ref={ref} className="relative min-h-[100svh] flex items-center pt-20 overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020205] via-[#090215] to-[#020205]" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-red-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-rose-800/8 rounded-full blur-[110px] pointer-events-none" />
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{ backgroundImage:"radial-gradient(circle, rgba(239,68,68,0.8) 1px, transparent 1px)", backgroundSize:"40px 40px" }}
      />
      <Particles />

      <div className="container relative z-10 pt-36 pb-16 md:pt-12 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── LEFT ── */}
          <motion.div style={{ y: yText, }}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="label mb-6"
            >
              <Zap size={11} /> {t("hero_badge")}
            </motion.div>

            {/* H1 — no opacity fade so it paints instantly (best LCP) */}
            <motion.h1
              initial={{ y: 12 }} animate={{ y: 0 }} transition={{ duration: 0.4 }}
              className="font-display font-black text-white mb-5"
            >
              <span className="block">{t("hero_h1a")}</span>
              <span className="block gradient-text">{t("hero_h1b")}</span>
            </motion.h1>

            {/* Subtitle — renders immediately (LCP candidate) */}
            <motion.p
              initial={{ y: 10 }} animate={{ y: 0 }} transition={{ duration: 0.4 }}
              className="text-slate-300 text-lg leading-relaxed mb-8 max-w-xl"
            >
              {t("hero_sub")}
            </motion.p>

            {/* Proof chips */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {[
                { icon:<CheckCircle size={13}/>, text:"ROI Guaranteed" },
                { icon:<CheckCircle size={13}/>, text:"24hr Support" },
                { icon:<Users size={13}/>,        text:"Real Results" },
                { icon:<TrendingUp size={13}/>,    text:"5 Markets" },
              ].map((b,i) => (
                <motion.div
                  key={i}
                  initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.38+i*0.06 }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10"
                >
                  <span className="text-red-400">{b.icon}</span>
                  <span className="text-white text-xs font-semibold">{b.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.44 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              <Link href="/consultation" className="btn-primary text-sm md:text-base">
                {t("hero_cta1")} <ArrowRight size={16}/>
              </Link>
              <a href={SITE.social.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm md:text-base">
                <MessageCircle size={16}/> {t("hero_cta2")}
              </a>
            </motion.div>

            {/* Social proof strip */}
            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.7 }}
              className="flex items-center gap-4 pt-6 border-t border-white/10"
            >
              <div className="flex -space-x-2">
                {["UT","AS","HR","JH","SM"].map((s,i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#020205] flex items-center justify-center text-[10px] font-black text-white ${["bg-red-700","bg-rose-700","bg-orange-800","bg-amber-900","bg-red-800"][i]}`}>{s}</div>
                ))}
              </div>
              <div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_,i) => <Star key={i} size={13} fill="currentColor" />)}
                </div>
                <p className="text-slate-400 text-xs">Trusted by businesses across Pakistan &amp; the Gulf</p>
              </div>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Globe + Cards ── */}
          <motion.div
            initial={{ opacity:0, scale:0.85 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.8, delay:0.25 }}
            className="relative flex flex-col items-center justify-center min-h-[300px] md:min-h-[480px]"
          >
            <Globe3D />

            {/* Mobile-only clean stats grid (replaces the overlapping float cards) */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm mt-6 md:hidden">
              <div className="card rounded-2xl p-3 text-center">
                <p className="text-2xl font-black gradient-text">4x+</p>
                <p className="text-[11px] text-slate-400">Avg ROAS (Meta Ads)</p>
              </div>
              <div className="card rounded-2xl p-3 text-center">
                <p className="text-2xl font-black text-white">$500K+</p>
                <p className="text-[11px] text-slate-400">Revenue Generated</p>
              </div>
              <div className="card rounded-2xl p-3 text-center">
                <p className="text-2xl font-black text-white">40+</p>
                <p className="text-[11px] text-slate-400">Happy Clients</p>
              </div>
              <div className="card rounded-2xl p-3 text-center">
                <p className="text-2xl font-black text-white">6</p>
                <p className="text-[11px] text-slate-400">Markets Served</p>
              </div>
            </div>

            {/* Card: Live orders */}
            <FloatCard className="-top-4 -left-2 md:-left-6 w-48" delay={0.85}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Live Orders</span>
              </div>
              <p className="text-3xl font-black text-white">102</p>
              <p className="text-[11px] text-slate-500">Sample store · today</p>
              <div className="mt-2 flex items-center gap-1 text-green-300 text-[11px] font-bold">
                <TrendingUp size={11}/> +28% vs yesterday
              </div>
            </FloatCard>

            {/* Card: ROAS */}
            <FloatCard className="-bottom-4 -left-2 md:-left-6 w-40" delay={1.0}>
              <p className="text-[11px] text-slate-400 mb-1">Avg ROAS</p>
              <p className="text-3xl font-black gradient-text">4x+</p>
              <p className="text-[10px] text-slate-500">Meta Ads</p>
            </FloatCard>

            {/* Card: Rating */}
            <FloatCard className="-top-4 -right-2 md:-right-6 w-36" delay={1.05}>
              <p className="text-white font-black text-xl">24h</p>
              <p className="text-[10px] text-slate-400">Avg Response Time</p>
            </FloatCard>

            {/* Card: Revenue */}
            <FloatCard className="-bottom-4 -right-2 md:-right-6 w-44" delay={1.15}>
              <ShoppingBag size={15} className="text-red-400 mb-1"/>
              <p className="text-[11px] text-slate-400">Revenue Generated</p>
              <p className="text-2xl font-black text-white">$500K+</p>
              <p className="text-[11px] text-green-300 font-bold">For our clients</p>
            </FloatCard>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#020205] to-transparent pointer-events-none" />
    </section>
  );
}
