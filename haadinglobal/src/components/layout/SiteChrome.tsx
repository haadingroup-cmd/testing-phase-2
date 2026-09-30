import { BottomNav } from "@/components/layout/BottomNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { JsonLd } from "@/components/seo/JsonLd";
import { getServices, getSettings } from "@/lib/data";
import { localBusinessSchema, organizationSchema, websiteSchema } from "@/lib/seo/schema";

/** Header, footer, mobile tab bar and WhatsApp button shared by every public page. */
export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);
  const headerServices = services.map(({ slug, title, icon, tagline }) => ({ slug, title, icon, tagline }));
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-lg bg-secondary px-4 py-2 text-on-secondary focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <SiteHeader services={headerServices} founderImage={settings.founderImage} founderName={settings.founderName} />
      <main id="main" className="relative flex w-full flex-1 flex-col pb-24 pt-16 lg:pb-0 lg:pt-[72px]">
        {children}
      </main>
      <SiteFooter settings={settings} services={headerServices} />
      <div className="h-16 lg:hidden" aria-hidden="true" />
      <WhatsAppFab number={settings.whatsapp} message={settings.whatsappMessage} />
      <BottomNav />
      <JsonLd data={[organizationSchema(settings), localBusinessSchema(settings), websiteSchema(settings)]} />
    </>
  );
}
