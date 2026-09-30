import { Icon } from "@/components/ui/Icon";
import { whatsappLink } from "@/lib/whatsapp";

export function WhatsAppFab({ number, message }: { number: string; message: string }) {
  return (
    <a
      href={whatsappLink(message, number)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with HaadinGlobal on WhatsApp"
      className="fixed bottom-20 right-margin-mobile z-40 flex items-center gap-2 rounded-full bg-whatsapp px-space-md py-2.5 text-white shadow-[0_12px_24px_-6px_rgba(7,26,53,0.18)] transition-all hover:scale-105 active:scale-95 lg:bottom-6 lg:right-6"
    >
      <Icon name="chat" size={20} />
      <span className="hidden whitespace-nowrap font-label-lg text-label-lg font-bold tracking-tight min-[380px]:inline">WhatsApp Agency Desk</span>
    </a>
  );
}
