import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { SITE, FOOTER_COMPANY, FOOTER_SERVICES } from "@/data/siteConfig";

export default function Footer() {
  const year = new Date().getFullYear();
  const socials = [
    { t:"fb", label:"Facebook",  href:SITE.social.facebook },
    { t:"ig", label:"Instagram", href:SITE.social.instagram },
    { t:"tt", label:"TikTok",    href:SITE.social.tiktok },
    { t:"yt", label:"YouTube",   href:SITE.social.youtube },
    { t:"in", label:"LinkedIn",  href:SITE.social.linkedin },
    { t:"wa", label:"WhatsApp",  href:SITE.social.whatsapp },
  ];
  return (
    <footer className="bg-[#030306] border-t border-white/8 mt-10">
  <div className="container pt-20 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand col — Logo and info */}
          <div className="lg:col-span-2">
            {/* Logo wrapper link */}
            <Link href="/" className="flex items-center gap-3 mb-5 group">
              <div className="relative w-10 h-10">
                <Image src="/logo-small.png" alt="HaadinGlobal" fill className="object-contain" />
              </div>
              <div>
                <p className="font-black text-xl text-white">HaadinGlobal</p>
                <p className="text-xs text-slate-400 font-mono">Global Digital Excellence</p>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              results-driven digital marketing agency. Meta Ads, Google Ads, SEO, YouTube Automation, Shopify & AI — proven results for businesses across Pakistan & the Gulf.
            </p>
            <div className="space-y-2.5 mb-6">
              <a href={`tel:${SITE.phoneClean}`} aria-label="Call HaadinGlobal" className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors text-sm">
                <Phone size={14} className="text-red-400 flex-shrink-0" />{SITE.phone}
              </a>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors text-sm">
                <Mail size={14} className="text-red-400 flex-shrink-0" />{SITE.email}
              </a>
              <div className="flex items-center gap-2.5 text-slate-400 text-sm">
                <MapPin size={14} className="text-red-400 flex-shrink-0" />{SITE.address}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 hover:border-red-500/40 hover:bg-red-500/8 flex items-center justify-center text-xs font-bold text-slate-400 hover:text-white transition-all">
                  {s.t}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2.5">
              {FOOTER_COMPANY.map(l => (
                <li key={l.href}><Link href={l.href} className="text-slate-400 hover:text-white transition-colors text-sm">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">Services</h3>
            <ul className="space-y-2.5">
              {FOOTER_SERVICES.map(l => (
                <li key={l.href}><Link href={l.href} className="text-slate-400 hover:text-white transition-colors text-sm">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">Markets We Serve</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {SITE.markets.map(m => (
                <span key={m} className="text-xs text-slate-400 bg-white/5 border border-white/8 px-2.5 py-1.5 rounded-lg">{m}</span>
              ))}
            </div>
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2.5">
              <li><Link href="/privacy-policy" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-400 hover:text-white transition-colors text-sm">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">© {year} HaadinGlobal. {/* t("footer_rights") */} All rights reserved. Built with ❤️ in Pakistan.</p>
          <a href={SITE.social.whatsapp} target="_blank" rel="noopener noreferrer"
            className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors">
            💬 WhatsApp Now
          </a>
        </div>
      </div>
    </footer>
  );
}
