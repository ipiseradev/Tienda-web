import { useEffect, useMemo, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock.js";
import Button from "./Button.jsx";
import { buildWhatsAppUrl } from "../context/LeadContext.jsx";

function msToCountdown(ms) {
  const m = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(m / 86400);
  const hours = Math.floor((m % 86400) / 3600);
  const mins = Math.floor((m % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

export default function DropsModal({ open, onClose, drops, site }) {
  const reduceMotion = usePrefersReducedMotion();
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const lastActiveRef = useRef(null);

  const [query, setQuery] = useState("");
  const [now, setNow] = useState(() => Date.now());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (drops || []).filter((d) => {
      if (!q) return true;
      return (
        String(d.title || "").toLowerCase().includes(q) ||
        String(d.subtitle || "").toLowerCase().includes(q) ||
        String(d.badge || "").toLowerCase().includes(q)
      );
    });
  }, [drops, query]);

  useEffect(() => {
    if (!open) return;
    lastActiveRef.current = document.activeElement;
    closeButtonRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(id);
  }, [open]);

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
      }
      if (event.key === "Tab") {
        const root = modalRef.current;
        if (!root) return;
        const focusables = root.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (event.shiftKey) {
          if (active === first || !root.contains(active)) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (active === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  useEffect(() => {
    if (open) return;
    const last = lastActiveRef.current;
    if (last && typeof last.focus === "function") last.focus();
  }, [open]);

  if (!open) return null;

  const openAlert = (drop) => {
    const name = drop?.title || "Drop";
    const lines = [
      `Hola, quiero que me avises cuando haya stock del ${name}.`,
      drop?.restockEta ? `Restock (demo): ${drop.restockEta}` : null
    ].filter(Boolean);
    const text = lines.join("\n");

    if (site?.whatsappUrl) {
      const url = buildWhatsAppUrl(site.whatsappUrl, text);
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    if (site?.email) {
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Alertame: ${name}`)}&body=${encodeURIComponent(text)}`;
    }
  };

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Drops">
      <button
        type="button"
        className="absolute inset-0 bg-ink-950/60"
        aria-label="Cerrar packs"
        onClick={onClose}
      />

      <div
        ref={modalRef}
        className="absolute inset-x-0 bottom-0 top-0 mx-auto w-full max-w-7xl px-4 py-4 md:px-10 md:py-10"
      >
        <div
          className={`relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/15 bg-white/90 shadow-ink backdrop-blur ${
            reduceMotion ? "" : "animate-revealBlur"
          }`}
        >
          <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 border-b border-steel-100 bg-white/80 px-6 py-5 backdrop-blur">
            <div className="min-w-[240px]">
              <p className="nike-kicker">Drops</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-ink-950">
                Cápsulas listas para combinar
              </p>
              <p className="mt-1 text-sm text-ink-600">{filtered.length} drops</p>
            </div>

            <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
              <div className="w-full max-w-[340px]">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="focus-ring w-full rounded-full border border-steel-200 bg-white px-5 py-3 text-sm text-ink-950 placeholder:text-ink-400"
                  placeholder='Buscar drops (ej: "run", "gym", "outdoor")'
                  aria-label="Buscar drops"
                />
              </div>

              <Button
                variant="dark"
                type="button"
                className="cta-shine px-6 py-3"
                onClick={onClose}
                ref={closeButtonRef}
              >
                Cerrar
              </Button>
            </div>
          </div>

          <div className="modal-scroll flex-1 overflow-y-auto p-6 md:p-8">
            <div className="grid gap-6 lg:grid-cols-2">
              {filtered.map((drop) => (
                <div
                  key={drop.title}
                  className="group overflow-hidden rounded-[2rem] border border-steel-100 bg-white shadow-soft hover-lift"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={drop.image}
                      alt={drop.alt}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition duration-650 ease-out-quint group-hover:scale-[1.04]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-br from-ink-950/12 via-transparent to-volt-300/20"
                    />
                    <div className="relative flex h-full items-end justify-between p-5">
                      <span className="rounded-full bg-ink-950 px-3 py-1 text-xs font-semibold text-white">
                        {drop.badge}
                      </span>
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                        {drop.price}
                      </span>
                    </div>
                  </div>

                  <div className="p-7">
                    <p className="text-3xl font-semibold tracking-tight text-ink-950">
                      {drop.title}
                    </p>
                    <p className="mt-2 text-sm text-ink-600">{drop.subtitle}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {drop.endsAt ? (
                        <span className="rounded-full border border-steel-200 bg-white px-3 py-1 text-xs font-semibold text-ink-700">
                          Cierra en {msToCountdown(new Date(drop.endsAt).getTime() - now)}
                        </span>
                      ) : null}
                      {drop.restockEta ? (
                        <span className="rounded-full border border-steel-200 bg-white px-3 py-1 text-xs font-semibold text-ink-700">
                          Restock {drop.restockEta}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-6 grid gap-2 text-sm text-ink-700">
                      {drop.bullets.map((b) => (
                        <p key={b}>- {b}</p>
                      ))}
                    </div>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Button variant="dark" as="a" href="#contacto" className="px-6 py-3">
                        Pedir este drop
                      </Button>
                      <Button variant="ghost" className="px-6 py-3">
                        Ver detalle
                      </Button>
                      <Button variant="ghost" className="px-6 py-3" type="button" onClick={() => openAlert(drop)}>
                        Alertame
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="mt-10 rounded-[2rem] border border-steel-100 bg-white p-8 text-center">
                <p className="text-lg font-semibold text-ink-950">Sin resultados</p>
                <p className="mt-2 text-sm text-ink-600">Proba con otra palabra.</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
