import Button from "../components/Button.jsx";
import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";
import { useLead } from "../context/LeadContext.jsx";

function CheckIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function RetailPitch({ data, onOpenRfq }) {
  const { setLeadContext } = useLead();
  const bullets = data?.bullets || [];
  const kitItems = data?.kitItems || [];

  return (
    <section id="tiendas" className="section surface-soft">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start">
        <Reveal as="div" className="space-y-6">
          <p className="eyebrow">{data?.eyebrow || "Tiendas"}</p>
          <h2 className="section-title clamp-2">{data?.title || "Para tu tienda"}</h2>
          <p className="section-subtitle clamp-2">{data?.subtitle || ""}</p>

          <div className="grid gap-4 sm:grid-cols-2">
            {bullets.map((b) => (
              <div key={b.title} className="card h-full p-6">
                <p className="truncate-1 text-sm font-semibold text-ink-950">{b.title}</p>
                <p className="mt-2 clamp-2 text-sm text-ink-600">{b.detail}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="dark"
              type="button"
              className="cta-shine"
              onClick={() => {
                setLeadContext({ topic: "Condiciones mayoristas / tienda", source: "retail_pitch_cta" });
                onOpenRfq?.();
              }}
            >
              Condiciones mayoristas
            </Button>
            <Button
              variant="ghost"
              as="a"
              href="#productos"
              onClick={() => setLeadContext({ topic: "Ver catálogo (tienda)", source: "retail_pitch_catalog" })}
            >
              Catálogo
            </Button>
          </div>
        </Reveal>

        <Reveal as="div" variant="blur" className="card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-lg font-semibold text-ink-950">{data?.kitTitle || "Kit para tu tienda"}</p>
            {data?.badge ? (
              <span className="pill bg-ink-50 text-ink-800 shadow-none">{data.badge}</span>
            ) : null}
          </div>

          <ul className="mt-5 grid gap-3 text-sm text-ink-700">
            {kitItems.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-2xl border border-steel-200/70 bg-white/70 px-4 py-3">
                <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700">
                  <CheckIcon className="h-4 w-4" />
                </span>
                <span className="font-semibold text-ink-900">{item}</span>
              </li>
            ))}
          </ul>

          {data?.note ? <p className="mt-6 text-sm text-ink-600">{data.note}</p> : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="ghost" as="a" href="#contacto">
              Agendar una demo
            </Button>
            <Button
              variant="dark"
              type="button"
              onClick={() => {
                setLeadContext({ topic: "Demo para tienda (agenda)", source: "retail_pitch_demo_cta" });
                onOpenRfq?.();
              }}
            >
              Quiero mi propuesta
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
