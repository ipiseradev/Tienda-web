import { useEffect, useMemo, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock.js";
import { useStore } from "../context/StoreContext.jsx";
import Button from "./Button.jsx";

function IconX({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function buildMessage({ site, form, cartItems, totals }) {
  const lines = [
    "Hola, quiero una recomendación de talle / outfit.",
    "",
    `Nombre: ${form.nombre || "—"}`,
    `Disciplina: ${form.disciplina || "—"}`,
    `Talle habitual: ${form.talle || "—"}`,
    `Altura/peso (opcional): ${form.alturaPeso || "—"}`,
    `Calce: ${form.calce || "Regular"}`,
    ""
  ];

  if (form.listaText?.trim()) {
    lines.push("Preferencias / lista (pegada):");
    lines.push(form.listaText.trim());
    lines.push("");
  }

  if (form.fileName) {
    lines.push(`Archivo: ${form.fileName} (adjunto por mail o WhatsApp)`);
    lines.push("");
  }

  if (cartItems?.length) {
    lines.push("Carrito (selección en la web):");
    for (const it of cartItems) {
      const meta = [it?.size ? `talle ${it.size}` : null, it?.color ? `color ${it.color}` : null]
        .filter(Boolean)
        .join(" • ");
      lines.push(`- ${it.qty}x ${it.name}${meta ? ` (${meta})` : ""}`);
    }
    if (totals?.subtotalLabel) lines.push(`Estimado: ${totals.subtotalLabel} (referencia)`);
    lines.push("");
  }

  if (form.notas?.trim()) {
    lines.push("Notas:");
    lines.push(form.notas.trim());
    lines.push("");
  }

  lines.push("Gracias.");
  if (site?.brand) lines.push(site.brand);
  return lines.join("\n");
}

export default function RFQModal({ open, onClose, site }) {
  const reduceMotion = usePrefersReducedMotion();
  const { cartItems, totals } = useStore();

  const rootRef = useRef(null);
  const closeRef = useRef(null);
  const firstFieldRef = useRef(null);
  const lastActiveRef = useRef(null);

  const [form, setForm] = useState({
    nombre: "",
    disciplina: "",
    talle: "",
    alturaPeso: "",
    calce: "Regular",
    listaText: "",
    fileName: "",
    notas: ""
  });

  const message = useMemo(() => buildMessage({ site, form, cartItems, totals }), [cartItems, form, site, totals]);

  const whatsappUrl = site?.whatsappUrl ? `${site.whatsappUrl}?text=${encodeURIComponent(message)}` : "";
  const mailtoUrl = site?.email
    ? `mailto:${site.email}?subject=${encodeURIComponent(`Consulta - ${site?.brand || ""}`)}&body=${encodeURIComponent(message)}`
    : "";

  useEffect(() => {
    if (!open) return;
    lastActiveRef.current = document.activeElement;
    window.setTimeout(() => firstFieldRef.current?.focus(), 0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setForm((prev) => ({ ...prev, fileName: "" }));
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

  const canWhatsApp = Boolean(whatsappUrl);
  const canMail = Boolean(mailtoUrl);

  return (
    <div className="fixed inset-0 z-[110]" role="dialog" aria-modal="true" aria-label="Pedir recomendación">
      <button
        type="button"
        className="absolute inset-0 bg-ink-950/60"
        aria-label="Cerrar"
        onClick={onClose}
      />

      <div
        ref={rootRef}
        className="absolute inset-x-0 bottom-0 top-0 mx-auto w-full max-w-6xl px-4 py-4 md:px-10 md:py-10"
      >
        <div
          className={`relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/15 bg-white/90 shadow-ink backdrop-blur ${
            reduceMotion ? "" : "animate-revealBlur"
          }`}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-steel-100 bg-white/80 px-6 py-5 backdrop-blur">
            <div className="min-w-0">
              <p className="nike-kicker">Asesoría</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-ink-950">
                Recomendación de talle y outfit
              </p>
              <p className="mt-1 text-sm text-ink-600">
                Completá lo básico y te respondemos por WhatsApp.
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
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-6">
                <div className="rounded-[28px] border border-steel-100 bg-white p-6 shadow-soft">
                  <p className="text-sm font-semibold text-ink-950">Tus datos</p>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-400" htmlFor="rfq-nombre">
                        Nombre
                      </label>
                      <input
                        id="rfq-nombre"
                        ref={firstFieldRef}
                        value={form.nombre}
                        onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
                        className="focus-ring mt-2 w-full rounded-2xl border border-steel-200 bg-white px-4 py-3 text-sm text-ink-950 placeholder:text-ink-400"
                        placeholder="Tu nombre"
                        autoComplete="name"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-400" htmlFor="rfq-disciplina">
                        Disciplina
                      </label>
                      <input
                        id="rfq-disciplina"
                        value={form.disciplina}
                        onChange={(e) => setForm((p) => ({ ...p, disciplina: e.target.value }))}
                        className="focus-ring mt-2 w-full rounded-2xl border border-steel-200 bg-white px-4 py-3 text-sm text-ink-950 placeholder:text-ink-400"
                        placeholder='Ej: "running", "gym", "outdoor"'
                        autoComplete="off"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-400" htmlFor="rfq-talle">
                        Talle habitual
                      </label>
                      <input
                        id="rfq-talle"
                        value={form.talle}
                        onChange={(e) => setForm((p) => ({ ...p, talle: e.target.value }))}
                        className="focus-ring mt-2 w-full rounded-2xl border border-steel-200 bg-white px-4 py-3 text-sm text-ink-950 placeholder:text-ink-400"
                        placeholder='Ej: "M", "L", "36–38"'
                        autoComplete="off"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-400" htmlFor="rfq-alturaPeso">
                        Altura/peso (opcional)
                      </label>
                      <input
                        id="rfq-alturaPeso"
                        value={form.alturaPeso}
                        onChange={(e) => setForm((p) => ({ ...p, alturaPeso: e.target.value }))}
                        className="focus-ring mt-2 w-full rounded-2xl border border-steel-200 bg-white px-4 py-3 text-sm text-ink-950 placeholder:text-ink-400"
                        placeholder='Ej: "1.70 / 65kg"'
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-400" htmlFor="rfq-calce">
                      Calce
                    </label>
                    <select
                      id="rfq-calce"
                      value={form.calce}
                      onChange={(e) => setForm((p) => ({ ...p, calce: e.target.value }))}
                      className="focus-ring mt-2 w-full rounded-2xl border border-steel-200 bg-white px-4 py-3 text-sm text-ink-950"
                    >
                      <option>Regular</option>
                      <option>Ajustado</option>
                      <option>Oversize</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-[28px] border border-steel-100 bg-white p-6 shadow-soft">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-ink-950">Preferencias</p>
                    <label className="focus-ring inline-flex cursor-pointer items-center justify-center rounded-full border border-steel-200 bg-white px-4 py-2 text-xs font-semibold text-ink-700 hover:bg-ink-50">
                      <input
                        type="file"
                        accept=".pdf,.txt,.png,.jpg,.jpeg,.webp"
                        className="sr-only"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          setForm((p) => ({ ...p, fileName: f?.name || "" }));
                        }}
                      />
                      Subir referencia
                    </label>
                  </div>

                  {form.fileName ? (
                    <p className="mt-3 text-sm text-ink-600">
                      Archivo: <span className="font-semibold text-ink-950">{form.fileName}</span>
                    </p>
                  ) : (
                    <p className="mt-3 text-sm text-ink-600">Podés subir una captura o pegar texto abajo.</p>
                  )}

                  <textarea
                    value={form.listaText}
                    onChange={(e) => setForm((p) => ({ ...p, listaText: e.target.value }))}
                    className="focus-ring mt-4 w-full rounded-2xl border border-steel-200 bg-white px-4 py-3 text-sm text-ink-950 placeholder:text-ink-400"
                    rows={6}
                    placeholder={
                      'Pegá tus preferencias (ej):\n- Remera liviana (running)\n- Short 2-en-1\n- Calza con bolsillo\n- Colores: negro/volt'
                    }
                  />

                  <div className="mt-4">
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-400" htmlFor="rfq-notas">
                      Notas (opcional)
                    </label>
                    <textarea
                      id="rfq-notas"
                      value={form.notas}
                      onChange={(e) => setForm((p) => ({ ...p, notas: e.target.value }))}
                      className="focus-ring mt-2 w-full rounded-2xl border border-steel-200 bg-white px-4 py-3 text-sm text-ink-950 placeholder:text-ink-400"
                      rows={3}
                      placeholder="Qué te molesta de otras prendas, clima, objetivo, etc."
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[28px] border border-steel-100 bg-white p-6 shadow-soft">
                  <p className="text-sm font-semibold text-ink-950">Vista previa</p>
                  <p className="mt-2 text-xs text-ink-500">
                    Copiable. WhatsApp no adjunta archivos: si subiste una referencia, enviala luego por el chat o por mail.
                  </p>
                  <pre className="modal-scroll mt-4 max-h-[320px] overflow-auto rounded-2xl border border-steel-100 bg-ink-50 p-4 text-[12px] leading-relaxed text-ink-800">
                    {message}
                  </pre>
                  <div className="mt-4 grid gap-3">
                    <Button
                      variant="dark"
                      className="cta-shine w-full justify-center px-7 py-3"
                      as={canWhatsApp ? "a" : "button"}
                      href={canWhatsApp ? whatsappUrl : undefined}
                      target={canWhatsApp ? "_blank" : undefined}
                      rel={canWhatsApp ? "noreferrer" : undefined}
                      disabled={!canWhatsApp}
                    >
                      Enviar por WhatsApp
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-center"
                      as={canMail ? "a" : "button"}
                      href={canMail ? mailtoUrl : undefined}
                      disabled={!canMail}
                    >
                      Enviar por mail
                    </Button>
                    <Button
                      variant="ghost"
                      type="button"
                      className="w-full justify-center"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(message);
                        } catch {
                          // ignore
                        }
                      }}
                    >
                      Copiar texto
                    </Button>
                  </div>
                </div>

                <div className="rounded-[28px] border border-steel-100 bg-white p-6 shadow-soft">
                  <p className="text-sm font-semibold text-ink-950">Tips</p>
                  <ul className="mt-3 grid gap-2 text-sm text-ink-600">
                    <li>• Si estás entre dos talles: mayor = más relajado, menor = más ajustado.</li>
                    <li>• Para running: priorizá liviano y respirable. Para gym: soporte y flex.</li>
                    <li>• Para outdoor: pensá en capas (base + abrigo liviano + shell).</li>
                  </ul>
                </div>

                <Button
                  variant="ghost"
                  type="button"
                  className="w-full justify-center"
                  onClick={onClose}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
