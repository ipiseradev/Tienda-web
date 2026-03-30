import Button from "./Button.jsx";
import { useEffect, useRef } from "react";

export default function MobileMenu({ open, links = [], onClose, onOpenCatalog, onOpenFitFinder }) {
  const rootRef = useRef(null);
  const closeButtonRef = useRef(null);
  const lastActiveRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    lastActiveRef.current = document.activeElement;
    closeButtonRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
      }
      if (event.key === "Tab") {
        const root = rootRef.current;
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
  return (
    <div className="fixed inset-0 z-[70] md:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Cerrar menú"
        className="absolute inset-0 bg-ink-950/60"
        onClick={onClose}
      />
      <div
        id="mobile-menu"
        ref={rootRef}
        className="absolute right-4 top-4 w-[min(92vw,420px)] rounded-3xl border border-steel-200/70 bg-white/90 p-5 shadow-soft backdrop-blur"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-ink-950">Navegación</p>
          <Button
            ref={closeButtonRef}
            variant="ghost"
            type="button"
            className="px-4 py-2"
            onClick={onClose}
          >
            Cerrar
          </Button>
        </div>

        <div className="mt-4 grid gap-2">
          {links.map((link) =>
            typeof link?.onClick === "function" ? (
              <button
                key={link.label}
                type="button"
                className="focus-ring rounded-2xl border border-steel-200 bg-white px-4 py-3 text-left text-sm font-semibold text-ink-950 transition hover:border-steel-300"
                onClick={() => {
                  link.onClick();
                  onClose?.();
                }}
              >
                {link.label}
              </button>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="focus-ring rounded-2xl border border-steel-200 bg-white px-4 py-3 text-sm font-semibold text-ink-950 transition hover:border-steel-300"
                onClick={onClose}
              >
                {link.label}
              </a>
            )
          )}
        </div>

        <div className="mt-4 grid gap-3">
          <Button
            variant="ghost"
            type="button"
            className="w-full text-center"
            onClick={() => {
              onOpenCatalog?.();
              onClose?.();
            }}
          >
            Ver catálogo
          </Button>
          <Button
            type="button"
            variant="accent"
            className="w-full text-center"
            onClick={() => {
              onOpenFitFinder?.();
              onClose?.();
            }}
          >
            Encontrar mi talle
          </Button>
        </div>
      </div>
    </div>
  );
}
