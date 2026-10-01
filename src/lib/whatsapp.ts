import { DEFAULT_WHATSAPP } from "@/lib/site";

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hello HaadinGlobal, I would like to discuss your digital marketing services.";

/** Build a wa.me link with a correctly URL-encoded pre-filled message. */
export function whatsappLink(message: string = DEFAULT_WHATSAPP_MESSAGE, number: string = DEFAULT_WHATSAPP): string {
  const digits = number.replace(/\D/g, "") || DEFAULT_WHATSAPP;
  const text = message.trim();
  return text ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : `https://wa.me/${digits}`;
}
