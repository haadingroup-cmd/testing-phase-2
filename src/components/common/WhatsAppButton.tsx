"use client";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { SITE } from "@/data/siteConfig";

export default function WhatsAppButton() {
  return (
    <motion.a
      href={SITE.social.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-2xl shadow-lg font-semibold text-sm"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2.5, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="absolute inset-0 rounded-2xl bg-[#25D366] animate-ping opacity-20 pointer-events-none" />
      <MessageCircle size={18} />
      <span className="hidden sm:inline">Chat with us</span>
    </motion.a>
  );
}
