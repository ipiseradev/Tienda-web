import Button from "../components/Button.jsx";
import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";
import { useLead } from "../context/LeadContext.jsx";
import { useTilt } from "../hooks/useTilt.js";

function IconCheck({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
      <path d="M5 12l4.5 4.5L19 7" />
    </svg>
  );
}

function IconMinus({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
      <path d="M6 12h12" />
    </svg>
  );
}

function Cell({ children, tone = "muted" }) {
  if (tone === "ok") {
    return (
      <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
        <IconCheck className="h-4 w-4 shrink-0" />
        {children}
      </span>
    );
  }
  if (tone === "strong") {
    return <span className="font-semibold text-ink-950">{children}</span>;
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-ink-500">
      <IconMinus className="h-4 w-4 shrink-0 text-ink-300" />
      {children}
    </span>
  );
}

export default function WhyUs({ data }) {
  const { setLeadContext } = useLead();
  const { ref: tiltRef, tiltProps } = useTilt({ max: 3, scale: 1.005 });
  const title = data?.title || "Por qué nosotros";
  const subtitle = data?.subtitle || "";
  const comparison = data?.comparison || [];
  const zones = data?.zones || [];

  return (
    <section className="section surface-soft">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <Reveal as="div" className="space-y-6">
          <p className="eyebrow">Por qué</p>
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{subtitle}</p>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="dark"
              as="a"
              href="#contacto"
              className="cta-shine"
              onClick={() => setLeadContext({ topic: "Comparativa / por qué nosotros", source: "whyus_cta" })}
            >
              Quiero mi recomendación
            </Button>
            <Button variant="ghost" as="a" href="#clientes">
              Ver prueba social
            </Button>
          </div>
        </Reveal>

        <div className="grid gap-4">
          <Reveal as="div" variant="blur" className="card overflow-hidden p-0">
           <div ref={tiltRef} {...tiltProps}>
            <div className="border-b border-steel-200/70 bg-white/60 px-6 py-5">
              <p className="text-sm font-semibold text-ink-950">Comparativa rápida</p>
              <p className="mt-1 text-sm text-ink-600">Lo que cambia cuando elegís ropa técnica.</p>
            </div>

            <div className="grid">
              <div className="hidden gap-3 px-6 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-ink-500 sm:grid sm:grid-cols-[1.2fr_0.8fr_0.8fr]">
                <span>Feature</span>
                <span>Común</span>
                <span>VoltWear</span>
              </div>

              <div className="hidden h-px bg-steel-200/70 sm:block" aria-hidden="true" />

              <div className="divide-y divide-steel-200/70">
                {comparison.map((row) => (
                  <div
                    key={row.feature}
                    className="grid gap-2 px-6 py-4 sm:grid-cols-[1.2fr_0.8fr_0.8fr] sm:items-center sm:gap-3"
                  >
                    <Cell tone="strong">{row.feature}</Cell>
                    <div className="flex items-center gap-4 sm:contents">
                      <span className="w-20 shrink-0 text-xs font-semibold uppercase tracking-[0.2em] text-ink-400 sm:hidden">
                        Común
                      </span>
                      <Cell>{row.common}</Cell>
                    </div>
                    <div className="flex items-center gap-4 sm:contents">
                      <span className="w-20 shrink-0 text-xs font-semibold uppercase tracking-[0.2em] text-ink-400 sm:hidden">
                        VoltWear
                      </span>
                      <Cell tone="ok">{row.us}</Cell>
                    </div>
                  </div>
                ))}
              </div>
            </div>
           </div>
          </Reveal>

          <Reveal as="div" variant="blur" className="card">
            <p className="text-lg font-semibold text-ink-950">Envíos y cambios</p>
            <p className="mt-2 text-sm text-ink-600">
              Te confirmamos talle, entrega y cómo coordinar cambios si lo necesitás.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {zones.map((z) => (
                <div key={z.area} className="rounded-3xl border border-steel-200/70 bg-white/70 p-4">
                  <p className="nike-kicker">{z.area}</p>
                  <p className="mt-2 text-xl font-semibold text-ink-950">{z.time}</p>
                  <p className="mt-1 text-xs text-ink-500">{z.note}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
