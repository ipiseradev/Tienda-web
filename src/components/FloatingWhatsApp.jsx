import { useEffect, useMemo, useState } from "react";
import Button from "./Button.jsx";
import { buildWhatsAppUrl, useLead } from "../context/LeadContext.jsx";

export default function FloatingWhatsApp({ site }) {
  const { lead } = useLead();
  const href = site?.whatsappUrl;
  if (!href) return null;

  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      setShow(y > 900);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const url = useMemo(() => {
    const lines = ["Hola, necesito ayuda con talles / outfit.", lead?.topic ? `Interés: ${lead.topic}.` : null].filter(Boolean);
    return buildWhatsAppUrl(href, lines.join("\n"));
  }, [href, lead?.topic]);

  return (
    <Button
      as="a"
      href={url}
      variant="ghost"
      target="_blank"
      rel="noreferrer"
      className={`fixed bottom-6 left-6 z-[60] inline-flex items-center gap-2 px-4 py-3 backdrop-blur transition duration-450 ease-out-quint ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
      aria-label="Soporte por WhatsApp"
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-steel-200 bg-white">
        <span aria-hidden="true">WA</span>
      </span>
      <span className="hidden sm:inline">Soporte</span>
    </Button>
  );
}
