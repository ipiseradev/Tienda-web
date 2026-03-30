import { useEffect, useState } from "react";
import Button from "./Button.jsx";
import { useLead } from "../context/LeadContext.jsx";
import { useStore } from "../context/StoreContext.jsx";

export default function StickyQuoteCTA({ onOpenFitFinder }) {
  const [show, setShow] = useState(false);
  const { setLeadContext } = useLead();
  const { openCart, totals } = useStore();
  const itemsCount = Number(totals?.itemsCount || 0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      setShow(y > 520);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-0 z-[105] px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] transition duration-450 ease-out-quint sm:hidden ${
          show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
        aria-hidden={show ? "false" : "true"}
      >
        <div className="rounded-[26px] border border-steel-200/70 bg-white/85 p-2 shadow-soft">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="accent"
              type="button"
              className="cta-shine w-full justify-center px-5 py-3"
              onClick={() => {
                setLeadContext({ topic: "CTA sticky mobile: Encontrar mi talle", source: "sticky_cta_mobile" });
                onOpenFitFinder?.();
              }}
            >
              Encontrar mi talle
            </Button>
            <Button
              variant="dark"
              type="button"
              className="w-full justify-center px-5 py-3"
              onClick={() => {
                setLeadContext({ topic: "CTA sticky mobile: Carrito", source: "sticky_cta_mobile" });
                openCart?.();
              }}
            >
              {itemsCount > 0 ? `Carrito (${itemsCount})` : "Carrito"}
            </Button>
          </div>
        </div>
      </div>

      <div
        className={`fixed bottom-4 right-4 z-[105] hidden transition duration-450 ease-out-quint sm:block ${
          show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
        aria-hidden={show ? "false" : "true"}
      >
        <div className="flex items-center gap-3 rounded-[24px] border border-steel-200/70 bg-white/75 p-2 shadow-soft backdrop-blur-xl">
          <div className="hidden pl-2 sm:block">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-400">Ayuda</p>
            <p className="text-sm font-semibold text-ink-950">Encontrá tu talle</p>
          </div>
          <Button
            variant="accent"
            type="button"
            className="cta-shine px-6 py-3"
            onClick={() => {
              setLeadContext({ topic: "CTA sticky: Encontrar mi talle", source: "sticky_cta" });
              onOpenFitFinder?.();
            }}
          >
            Mi talle
          </Button>
          <Button
            variant="dark"
            type="button"
            className="px-5 py-3"
            onClick={() => {
              setLeadContext({ topic: "CTA sticky: Carrito", source: "sticky_cta" });
              openCart?.();
            }}
          >
            {itemsCount > 0 ? `Carrito (${itemsCount})` : "Carrito"}
          </Button>
        </div>
      </div>
    </>
  );
}
