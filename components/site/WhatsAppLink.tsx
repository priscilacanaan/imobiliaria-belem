"use client";

import type { AnchorHTMLAttributes } from "react";
import { useSiteSettings } from "@/lib/team";

/** Link de WhatsApp com o número atual das configurações do site. */
export function WhatsAppLink({ text, ...props }: { text?: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { settings } = useSiteSettings();
  const href = `https://wa.me/${settings.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
  return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
}
