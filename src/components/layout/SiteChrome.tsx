"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import EntryPopup from "@/components/common/EntryPopup";
import MobileCTABar from "@/components/common/MobileCTABar";

/**
 * Public site chrome (navbar, footer, WhatsApp button, entry popup, mobile CTA).
 * These belong on the marketing site only — NOT on the dashboard or login,
 * which have their own layout. Rendering both caused the overlapping double
 * header. We hide all public chrome on /dashboard and /login routes.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const isApp = pathname.startsWith("/dashboard") || pathname.startsWith("/login");

  if (isApp) {
    // App shell: no public navbar/footer/popup — the dashboard layout handles its own.
    return <main id="main">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
      <WhatsAppButton />
      <EntryPopup />
      <MobileCTABar />
    </>
  );
}
