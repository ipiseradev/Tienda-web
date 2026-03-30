import Button from "../components/Button.jsx";
import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";
import { useLead } from "../context/LeadContext.jsx";

export default function Plans({ plans }) {
  const { setLeadContext } = useLead();
  return (
    <section id="empresas" className="section surface-soft">
      <Container>
        <Reveal as="div" className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <p className="eyebrow">Empresas</p>
            <h2 className="section-title">Planes de abastecimiento para compras recurrentes.</h2>
            <p className="section-subtitle">
              Elegí el nivel de soporte y entrega según tu operación.
            </p>
          </div>
          <Button variant="dark" as="a" href="#contacto">
            Hablar con ventas
          </Button>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <Reveal
              key={plan.title}
              as="a"
              href="#contacto"
              className="focus-ring card flex h-full flex-col p-7 transition duration-450 ease-out-quint hover:border-steel-300 hover:bg-white hover:shadow-ink"
              aria-label={`Consultar plan ${plan.title}`}
              onClick={() => setLeadContext({ topic: `Plan: ${plan.title}`, source: "plans" })}
            >
              <p className="truncate-1 text-sm font-semibold text-ember-600">{plan.title}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-ink-950">
                {plan.price}
              </p>
              <p className="mt-2 clamp-2 text-sm text-ink-600">{plan.detail}</p>
              <div className="mt-5 grid gap-2 text-sm text-ink-700">
                {plan.perks.map((perk) => (
                  <p key={perk} className="truncate-1">
                    - {perk}
                  </p>
                ))}
              </div>
              <div className="mt-auto pt-6">
                <span className="inline-flex w-fit items-center rounded-full border border-steel-200 bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-700">
                  Consultar este plan
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
