import { lazy, Suspense, useMemo, useRef, useState } from "react";
import Button from "../components/Button.jsx";
import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";
import { buildWhatsAppUrl, useLead } from "../context/LeadContext.jsx";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";
import { useMediaQuery } from "../hooks/useMediaQuery.js";

const Scene3D = lazy(() => import("../components/Scene3D.jsx"));

export default function Contact({ site }) {
  const { lead, clearLeadContext } = useLead();
  const reduceMotion = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const idleMouseRef = useRef({ x: 0, y: 0 });
  const [form, setForm] = useState({
    nombre: "",
    empresa: "",
    email: "",
    telefono: "",
    consulta: "",
    detalle: "",
    privacidad: false
  });
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [draft, setDraft] = useState("");

  const leadHint = useMemo(() => {
    if (!lead?.topic) return "";
    return lead.topic;
  }, [lead?.topic]);

  const submitLead = (event) => {
    event.preventDefault();
    setStatus({ type: "idle", message: "" });

    const nombre = form.nombre.trim();
    const empresa = form.empresa.trim();
    const email = form.email.trim();
    const telefono = form.telefono.trim();
    const consulta = form.consulta.trim();
    const detalle = form.detalle.trim();

    if (!nombre || !consulta) {
      setStatus({
        type: "error",
        message: "Completa tu nombre y tu consulta para poder enviarla."
      });
      return;
    }

    if (!form.privacidad) {
      setStatus({
        type: "error",
        message: "Aceptá la política de privacidad para poder enviar la consulta."
      });
      return;
    }

    const messageLines = [
      `Hola, soy ${nombre}${empresa ? ` (${empresa})` : ""}.`,
      leadHint ? `Interés: ${leadHint}.` : null,
      detalle ? `Rubro/medida: ${detalle}.` : null,
      `Consulta: ${consulta}`,
      telefono ? `Tel: ${telefono}.` : null,
      email ? `Email: ${email}.` : null
    ].filter(Boolean);
    const message = messageLines.join("\n");
    setDraft(message);

    if (site?.whatsappUrl) {
      setStatus({ type: "sending", message: "Abriendo WhatsApp…" });
      const url = buildWhatsAppUrl(site.whatsappUrl, message);
      const win = window.open(url, "_blank", "noopener,noreferrer");
      if (!win) {
        // Popup blocked: fall back to copy
        navigator.clipboard
          ?.writeText?.(message)
          .then(() => {
            setStatus({
              type: "success",
              message:
                "Copiamos tu mensaje. Pegalo en WhatsApp y te respondemos con talles y recomendación."
            });
          })
          .catch(() => {
            setStatus({
              type: "success",
              message:
                "Listo. Si WhatsApp no se abrió, copiá el mensaje y pegalo manualmente (queda abajo)."
            });
          });
        return;
      }
    }

    setStatus({
      type: "success",
      message: "Listo. Se abrió WhatsApp para enviar tu consulta. Si no, escribinos por mail."
    });
    setForm({
      nombre: "",
      empresa: "",
      email: "",
      telefono: "",
      consulta: "",
      detalle: "",
      privacidad: false
    });
    clearLeadContext?.();
  };

  return (
    <section id="contacto" className="section relative overflow-hidden bg-ink-950 text-white">
      {!reduceMotion && isDesktop ? (
        <Suspense fallback={null}>
          <Scene3D
            mouseRef={idleMouseRef}
            variant="orb"
            className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] opacity-40"
          />
        </Suspense>
      ) : null}

      <Container className="relative grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <Reveal as="div" className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-volt-100">
            Contacto
          </p>
          <h2 className="font-display text-3xl font-semibold md:text-4xl">
            Te ayudamos con talles, calce y disciplina.
          </h2>
          <p className="text-white/70">
            Contanos qué buscás (running, gym u outdoor) y te recomendamos el mix ideal.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Atención</p>
              <a
                className="focus-ring mt-3 inline-flex text-lg font-semibold hover:text-white"
                href={site.whatsappUrl}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp directo
              </a>
              <p className="mt-2 text-sm text-white/70">Lun a Sab - respuesta en 24h</p>
            </div>
            <div className="glass">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Tienda</p>
              <p className="mt-3 text-lg font-semibold">{site.coverage}</p>
              <p className="text-sm text-white/70">{site.hours}</p>
            </div>
          </div>

          <div className="glass">
            <p className="text-sm text-white/70">Dirección</p>
            <p className="mt-2 text-lg font-semibold">
              {site.addressLine1}, {site.addressLine2}
            </p>
            <p className="text-sm text-white/60">{site.city}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button as="a" href={site.whatsappUrl} target="_blank" rel="noreferrer" variant="dark">
              Hablar por WhatsApp
            </Button>
            <Button
              as="a"
              href={`mailto:${site.email}`}
              variant="ghost"
              className="border-white/20 text-white hover:text-white"
            >
              Enviar mail
            </Button>
          </div>
        </Reveal>

        <div className="space-y-4">
          <Reveal as="form" className="card space-y-4 bg-white text-ink-950" onSubmit={submitLead}>
            <div>
              <label
                htmlFor="lead-nombre"
                className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-400"
              >
                Nombre
              </label>
              <input
                id="lead-nombre"
                className="mt-2 w-full rounded-2xl border border-steel-200 px-4 py-3 text-sm focus:border-volt-300 focus:outline-none"
                placeholder="Tu nombre"
                value={form.nombre}
                onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))}
                required
                autoComplete="name"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="lead-empresa"
                  className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-400"
                >
                  Empresa (opcional)
                </label>
                <input
                  id="lead-empresa"
                  className="mt-2 w-full rounded-2xl border border-steel-200 px-4 py-3 text-sm focus:border-volt-300 focus:outline-none"
                  placeholder="Obra / Taller / Empresa"
                  value={form.empresa}
                  onChange={(e) => setForm((prev) => ({ ...prev, empresa: e.target.value }))}
                  autoComplete="organization"
                />
              </div>
              <div>
                <label
                  htmlFor="lead-email"
                  className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-400"
                >
                  Email (opcional)
                </label>
                <input
                  id="lead-email"
                  type="email"
                  className="mt-2 w-full rounded-2xl border border-steel-200 px-4 py-3 text-sm focus:border-volt-300 focus:outline-none"
                  placeholder="tu@empresa.com"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="lead-telefono"
                className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-400"
              >
                Teléfono (opcional)
              </label>
              <input
                id="lead-telefono"
                type="tel"
                className="mt-2 w-full rounded-2xl border border-steel-200 px-4 py-3 text-sm focus:border-volt-300 focus:outline-none"
                placeholder="+54 …"
                value={form.telefono}
                onChange={(e) => setForm((prev) => ({ ...prev, telefono: e.target.value }))}
                autoComplete="tel"
              />
            </div>
            <div>
              <label
                htmlFor="lead-detalle"
                className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-400"
              >
                Prenda / talle (opcional)
              </label>
              <input
                id="lead-detalle"
                className="mt-2 w-full rounded-2xl border border-steel-200 px-4 py-3 text-sm focus:border-volt-300 focus:outline-none"
                placeholder='Ej: "calza M", "remera L", "campera S"'
                value={form.detalle}
                onChange={(e) => setForm((prev) => ({ ...prev, detalle: e.target.value }))}
                autoComplete="off"
              />
            </div>
            <div>
              <label
                htmlFor="lead-consulta"
                className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-400"
              >
                Consulta
              </label>
              <textarea
                id="lead-consulta"
                className="mt-2 w-full rounded-2xl border border-steel-200 px-4 py-3 text-sm focus:border-volt-300 focus:outline-none"
                rows="4"
                placeholder={
                  leadHint
                    ? `Interés: ${leadHint}\n¿Qué disciplina hacés? ¿Qué talle usás y qué calce preferís?`
                    : "¿Qué estás buscando? ¿Qué talle usás y qué calce preferís?"
                }
                value={form.consulta}
                onChange={(e) => setForm((prev) => ({ ...prev, consulta: e.target.value }))}
                required
              />
            </div>

            <label className="flex items-start gap-3 rounded-2xl border border-steel-200/70 bg-white/70 p-4 text-sm text-ink-700">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-ink-950"
                checked={form.privacidad}
                onChange={(e) => setForm((prev) => ({ ...prev, privacidad: e.target.checked }))}
                required
              />
              <span>
                Acepto la{" "}
                <a className="focus-ring font-semibold text-ink-950 underline underline-offset-4" href="/legal/privacidad.html" target="_blank" rel="noreferrer">
                  política de privacidad
                </a>
                .
              </span>
            </label>

            {status.type !== "idle" ? (
              <div
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  status.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                    : "border-ember-200 bg-ember-50 text-ember-900"
                }`}
                role={status.type === "success" ? "status" : "alert"}
              >
                {status.message}
              </div>
            ) : null}

            <Button
              variant="dark"
              type="submit"
              className="w-full bg-ink-950 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={status.type === "sending"}
            >
              {status.type === "sending" ? "Enviando…" : "Enviar por WhatsApp"}
            </Button>

            {draft && status.type !== "idle" ? (
              <div className="rounded-2xl border border-steel-200/70 bg-ink-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-500">
                    Mensaje
                  </p>
                  <button
                    type="button"
                    className="focus-ring rounded-full border border-steel-200 bg-white px-3 py-1 text-xs font-semibold text-ink-900 transition hover:border-steel-300"
                    onClick={() => navigator.clipboard?.writeText?.(draft)}
                  >
                    Copiar
                  </button>
                </div>
                <pre className="mt-3 whitespace-pre-wrap text-sm text-ink-800">{draft}</pre>
              </div>
            ) : null}
          </Reveal>

          <Reveal as="div" className="glass">
            <p className="text-sm text-white/70">Ayuda rápida</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
              {["Talles", "Envíos", "Cambios", "Telas", "Running", "Gym"].map((topic) => (
                <div
                  key={topic}
                  className="rounded-xl border border-white/10 px-3 py-2 text-center"
                >
                  {topic}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
