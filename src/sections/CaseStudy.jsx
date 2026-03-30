import Button from "../components/Button.jsx";
import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";
import { useLead } from "../context/LeadContext.jsx";

export default function CaseStudy({ onOpenRfq }) {
  const { setLeadContext } = useLead();
  return (
    <section className="section surface-soft">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <Reveal as="div" className="space-y-6">
          <p className="eyebrow">Caso real</p>
          <h2 className="section-title">Outfit semanal para un plan de 12 semanas.</h2>
          <p className="section-subtitle">
            Elegimos prendas por disciplina y clima, ajustamos talles y coordinamos el envío para que
            no se corte la rutina.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="ghost" as="a" href="#contacto">
              Hablar con ventas
            </Button>
            <Button
              variant="dark"
              type="button"
              className="cta-shine"
              onClick={() => {
                setLeadContext({ topic: "Recomendación por caso", source: "case_study" });
                onOpenRfq?.();
              }}
            >
              Pedir recomendación
            </Button>
          </div>
        </Reveal>

        <Reveal
          as="div"
          className="rounded-[32px] border border-steel-200/70 bg-white/85 p-7 shadow-soft"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink-700">Resultados</p>
            <span className="rounded-full bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-700">
              2026
            </span>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-3xl font-semibold text-ink-950">+22%</p>
              <p className="text-xs text-ink-500">comodidad</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-ink-950">-15%</p>
              <p className="text-xs text-ink-500">roces</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-ink-950">7 días</p>
              <p className="text-xs text-ink-500">cambios simples</p>
            </div>
          </div>
          <p className="mt-6 text-sm text-ink-600">
            Outfit por disciplina, guía de talles y sugerencias para capas según clima.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
