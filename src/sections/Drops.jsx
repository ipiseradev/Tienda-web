import { useEffect, useMemo, useState } from "react";
import Button from "../components/Button.jsx";
import DropsModal from "../components/DropsModal.jsx";
import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";
import { useLead } from "../context/LeadContext.jsx";
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

export default function Drops({ drops, site }) {
  const [open, setOpen] = useState(false);
  const preview = useMemo(() => (drops || []).slice(0, 2), [drops]);
  const { setLeadContext } = useLead();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(id);
  }, []);

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
    <section id="packs" className="section">
      <Container>
        <Reveal as="div" className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <p className="eyebrow">Drops</p>
            <h2 className="section-title">Cápsulas listas para combinar.</h2>
            <p className="section-subtitle">
              Selecciones recomendadas: armá outfit rápido y salí a entrenar.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="ghost" type="button" onClick={() => setOpen(true)}>
              Ver todos
            </Button>
            <Button
              variant="dark"
              as="a"
              href="#contacto"
              className="cta-shine"
              onClick={() => setLeadContext({ topic: "Drops recomendados", source: "packs_cta" })}
            >
              Pedir recomendación
            </Button>
          </div>
        </Reveal>

        <div className="mt-10">
          <div className="grid gap-6 lg:grid-cols-2">
            {preview.map((drop, idx) => (
              <Reveal key={drop.title} as="div" variant="blur" delayMs={idx * 90}>
                <div className="group overflow-hidden rounded-[2rem] border border-steel-100 bg-white shadow-soft hover-lift">
                  <div className="relative h-52 w-full overflow-hidden">
                    <img
                      src={drop.image}
                      alt={drop.alt}
                      loading="lazy"
                      decoding="async"
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
                      <Button
                        variant="dark"
                        as="a"
                        href="#contacto"
                        className="px-6 py-3"
                        onClick={() =>
                          setLeadContext({ topic: `Drop: ${drop.title}`, source: "pack_card" })
                        }
                      >
                        Pedir este drop
                      </Button>
                      <Button variant="ghost" className="px-6 py-3" onClick={() => setOpen(true)}>
                        Ver detalle
                      </Button>
                      <Button
                        variant="ghost"
                        className="px-6 py-3"
                        type="button"
                        onClick={() => openAlert(drop)}
                      >
                        Alertame
                      </Button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>

      <DropsModal open={open} onClose={() => setOpen(false)} drops={drops} site={site} />
    </section>
  );
}
