import Button from "../components/Button.jsx";
import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { useLead } from "../context/LeadContext.jsx";

function MetricCard({ metric, idx = 0 }) {
  const value = metric?.value || "";
  const headline = metric?.headline || "";
  const detail = metric?.detail || "";
  const isPrimary = metric?.key === "pedidos" || idx === 0;

  return (
    <Reveal
      as="div"
      variant="blur"
      delayMs={idx * 70}
      className={`card relative overflow-hidden ${isPrimary ? "sm:col-span-2" : ""}`}
    >
      {isPrimary ? (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-10 bg-gradient-to-br from-volt-100/70 via-white to-ember-50/50 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-volt-200/70"
          />
        </>
      ) : null}

      <div className="relative">
        {value ? (
          <p className={`text-3xl font-semibold ${isPrimary ? "text-volt-700 sm:text-4xl lg:text-5xl" : "text-ink-950 sm:text-4xl"}`}>
            {value}
          </p>
        ) : null}

        <p className={`mt-2 text-base font-semibold text-ink-950 ${isPrimary ? "sm:text-lg" : ""}`}>
          {headline}
        </p>
        {detail ? <p className="mt-2 text-sm font-medium text-ink-600">{detail}</p> : null}
      </div>
    </Reveal>
  );
}

function LogoChip({ name, src }) {
  const letters = String(name || "")
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  return (
    <div className="inline-flex shrink-0 items-center gap-3 rounded-full border border-steel-200 bg-white px-4 py-3 shadow-soft">
      {src ? (
        <img
          src={src}
          alt={name}
          loading="lazy"
          width="36"
          height="36"
          className="h-9 w-9 rounded-full border border-steel-200 bg-white object-contain"
        />
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-950 text-xs font-semibold text-white">
          {letters}
        </div>
      )}
      <p className="text-sm font-semibold text-ink-950">{name}</p>
    </div>
  );
}

export default function EnterpriseProof({ clientLogos, proof, site }) {
  const { openFitFinder } = useStore();
  const { setLeadContext } = useLead();
  const metrics = proof?.metrics || [];
  const cases = proof?.cases || [];
  const logos = clientLogos || [];

  return (
    <section id="clientes" className="section relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-8 -top-10 -z-10 h-72 bg-radial-fade opacity-70"
      />
      <Container>
        <Reveal as="div" className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <p className="eyebrow">RESULTADOS</p>
            <h2 className="section-title">Reducí devoluciones y aumentá conversiones con una mejor elección de talle.</h2>
            <p className="section-subtitle">Elegí mejor tu talle desde el inicio y evitá cambios innecesarios.</p>
          </div>
          <div className="pill text-ink-700">Comprá mejor • Reducí devoluciones • Elegí tu talle sin errores</div>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:items-start lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal
            as="div"
            variant="blur"
            className="overflow-hidden rounded-[28px] border border-steel-100 bg-white shadow-soft lg:self-start"
          >
            <div className="border-b border-steel-100 px-6 py-5">
              <p className="text-sm font-semibold text-ink-950">Equipos, gimnasios y marcas que ya usan este sistema</p>
            </div>
            <div
              className="no-scrollbar mask-fade-x focus-ring flex snap-x snap-mandatory gap-3 overflow-x-auto p-6 lg:flex-wrap lg:overflow-visible"
              role="region"
              tabIndex={0}
              aria-label="Logos de empresas (lista desplazable)"
            >
              {logos.map((item) => {
                const name = typeof item === "string" ? item : item?.name;
                const src = typeof item === "string" ? "" : item?.src;
                return (
                  <div key={name} className="snap-start">
                    <LogoChip name={name} src={src} />
                  </div>
                );
              })}
            </div>
          </Reveal>

          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[32px] bg-gradient-to-br from-volt-50/60 via-white to-ember-50/40 blur-2xl"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {metrics.map((metric, idx) => (
                <MetricCard key={metric?.key || metric?.headline || idx} metric={metric} idx={idx} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {cases.map((c, idx) => (
            <Reveal key={c.title} as="div" variant="blur" delayMs={idx * 80} className="card hover-lift">
              <p className="text-sm font-semibold text-ink-600">{c.title}</p>
              <p className="mt-4 text-2xl font-semibold text-volt-700">{c.kpi}</p>
              {c.detail ? <p className="mt-2 text-sm text-ink-600">{c.detail}</p> : null}
            </Reveal>
          ))}
        </div>  

        <Reveal
          as="div"
          variant="blur"
          delayMs={220}
          className="mt-10 rounded-[28px] border border-steel-100 bg-white/70 p-6 shadow-soft"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-base font-semibold text-ink-950">
                Elegí bien tu talle desde el inicio y evitá devoluciones innecesarias.
              </p>
              <p className="mt-2 text-sm text-ink-600">
                Elegir bien el talle desde el inicio mejora ventas y reduce devoluciones.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="accent"
                type="button"
                className="cta-shine px-6 py-3 shadow-soft"
                onClick={() => {
                  setLeadContext?.({ topic: "CTA: Encontrar mi talle", source: "enterprise_proof_cta" });
                  openFitFinder?.();
                }}
              >
                Encontrar mi talle
              </Button>
              {site?.whatsappUrl ? (
                <a
                  className="focus-ring inline-flex items-center justify-center rounded-full border border-steel-200/70 bg-white/50 px-6 py-3 text-sm font-semibold text-ink-800 backdrop-blur transition hover:bg-white hover:text-ink-950"
                  href={site.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setLeadContext?.({ topic: "CTA: Hablar por WhatsApp", source: "enterprise_proof_cta" })}
                >
                  Hablar por WhatsApp
                </a>
              ) : null}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
