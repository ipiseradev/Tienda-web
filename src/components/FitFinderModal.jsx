import { useEffect, useMemo, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock.js";
import Button from "./Button.jsx";

function IconX({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function recommendSize({ heightCm, weightKg, fit }) {
  const h = Number(heightCm);
  const w = Number(weightKg);
  if (!Number.isFinite(h) || !Number.isFinite(w) || h <= 0 || w <= 0) return "";

  // Simple, explainable heuristic (demo).
  let base = "M";
  if (w < 60) base = h < 170 ? "S" : "M";
  else if (w < 72) base = h < 170 ? "M" : "M";
  else if (w < 85) base = h < 180 ? "L" : "L";
  else base = "XL";

  if (String(fit || "").toLowerCase().includes("ajust")) {
    if (base === "XL") base = "L";
    else if (base === "L") base = "M";
    else if (base === "M") base = "S";
  }
  if (String(fit || "").toLowerCase().includes("over")) {
    if (base === "S") base = "M";
    else if (base === "M") base = "L";
    else if (base === "L") base = "XL";
  }
  return base;
}

export default function FitFinderModal({ open, onClose, profile, onSave }) {
  const reduceMotion = usePrefersReducedMotion();
  const rootRef = useRef(null);
  const closeRef = useRef(null);
  const lastActiveRef = useRef(null);

  const [heightCm, setHeightCm] = useState(profile?.heightCm || "");
  const [weightKg, setWeightKg] = useState(profile?.weightKg || "");
  const [fit, setFit] = useState(profile?.fit || "Regular");

  const recommendedSize = useMemo(
    () => recommendSize({ heightCm, weightKg, fit }),
    [fit, heightCm, weightKg]
  );

  useEffect(() => {
    if (!open) return;
    lastActiveRef.current = document.activeElement;
    window.setTimeout(() => closeRef.current?.focus(), 0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setHeightCm(profile?.heightCm || "");
    setWeightKg(profile?.weightKg || "");
    setFit(profile?.fit || "Regular");
  }, [open, profile?.fit, profile?.heightCm, profile?.weightKg]);

  useBodyScrollLock(open);

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

  const canSave = Boolean(recommendedSize);

  return (
    <div className="fixed inset-0 z-[120]" role="dialog" aria-modal="true" aria-label="Fit Finder">
      <button
        type="button"
        className="absolute inset-0 bg-ink-950/60"
        aria-label="Cerrar Fit Finder"
        onClick={onClose}
      />

      <div ref={rootRef} className="absolute inset-x-0 bottom-0 top-0 mx-auto w-full max-w-3xl px-4 py-4 md:px-10 md:py-10">
        <div
          className={`relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/15 bg-white/92 shadow-ink backdrop-blur ${
            reduceMotion ? "" : "animate-revealBlur"
          }`}
        >
          <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-steel-100 bg-white/80 px-6 py-5 backdrop-blur">
            <div className="min-w-0">
              <p className="nike-kicker">Fit Finder</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-ink-950">
                Recomendación de talle
              </p>
              <p className="mt-1 text-sm text-ink-600">
                Cargá altura/peso y tu preferencia de calce. Guardamos una sugerencia para el catálogo.
              </p>
            </div>

            <button
              type="button"
              className="focus-ring inline-flex items-center justify-center rounded-2xl border border-steel-200 bg-white/70 p-3 text-ink-950 shadow-soft transition hover:bg-white"
              onClick={onClose}
              aria-label="Cerrar"
              ref={closeRef}
            >
              <IconX />
            </button>
          </div>

          <div className="modal-scroll flex-1 overflow-y-auto p-6 md:p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[28px] border border-steel-100 bg-white p-6 shadow-soft">
                <p className="text-sm font-semibold text-ink-950">Tus datos</p>

                <div className="mt-5 grid gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-400" htmlFor="fit-height">
                      Altura (cm)
                    </label>
                    <input
                      id="fit-height"
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value)}
                      inputMode="numeric"
                      className="focus-ring mt-2 w-full rounded-2xl border border-steel-200 bg-white px-4 py-3 text-sm text-ink-950 placeholder:text-ink-400"
                      placeholder="Ej: 172"
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-400" htmlFor="fit-weight">
                      Peso (kg)
                    </label>
                    <input
                      id="fit-weight"
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value)}
                      inputMode="numeric"
                      className="focus-ring mt-2 w-full rounded-2xl border border-steel-200 bg-white px-4 py-3 text-sm text-ink-950 placeholder:text-ink-400"
                      placeholder="Ej: 68"
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-400" htmlFor="fit-fit">
                      Calce
                    </label>
                    <select
                      id="fit-fit"
                      value={fit}
                      onChange={(e) => setFit(e.target.value)}
                      className="focus-ring mt-2 w-full rounded-2xl border border-steel-200 bg-white px-4 py-3 text-sm text-ink-950"
                    >
                      <option>Regular</option>
                      <option>Ajustado</option>
                      <option>Oversize</option>
                    </select>
                  </div>
                </div>

                <p className="mt-5 text-xs text-ink-500">
                  Nota: es una recomendación aproximada. Para prendas específicas, revisá la guía de talles.
                </p>
              </div>

              <div className="rounded-[28px] border border-steel-100 bg-white p-6 shadow-soft">
                <p className="text-sm font-semibold text-ink-950">Resultado</p>
                <div className="mt-5 rounded-3xl border border-steel-100 bg-ink-50 p-6">
                  <p className="nike-kicker">Talle sugerido</p>
                  <p className="mt-3 text-5xl font-semibold tracking-tight text-ink-950">
                    {recommendedSize || "—"}
                  </p>
                  <p className="mt-3 text-sm text-ink-600">
                    Lo vamos a preseleccionar en las fichas si está disponible para el producto.
                  </p>
                </div>

                <div className="mt-6 grid gap-3">
                  <Button
                    variant="dark"
                    type="button"
                    className="cta-shine w-full justify-center px-7 py-3"
                    disabled={!canSave}
                    onClick={() => {
                      if (!canSave) return;
                      onSave?.({
                        heightCm,
                        weightKg,
                        fit,
                        recommendedSize
                      });
                      onClose?.();
                    }}
                  >
                    Guardar recomendación
                  </Button>
                  <Button
                    variant="ghost"
                    type="button"
                    className="w-full justify-center"
                    onClick={() => {
                      setHeightCm("");
                      setWeightKg("");
                    }}
                  >
                    Limpiar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
