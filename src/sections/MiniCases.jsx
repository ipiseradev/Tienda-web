import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";

export default function MiniCases({ cases = [] }) {
  if (!cases?.length) return null;
  return (
    <section className="section">
      <Container>
        <Reveal as="div" className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <p className="eyebrow">Prueba</p>
            <h2 className="section-title">Resultados concretos, sin humo.</h2>
            <p className="section-subtitle">
              2–3 mini casos para mostrar proceso + resultado (reemplazables por clientes reales).
            </p>
          </div>
          <div className="pill">Calce • Tela • Comodidad</div>
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {cases.map((c, idx) => (
            <Reveal key={c.title} as="div" variant="blur" delayMs={idx * 80} className="card hover-lift">
              <p className="nike-kicker">{c.context}</p>
              <p className="mt-3 text-lg font-semibold text-ink-950">{c.title}</p>
              <p className="mt-5 text-3xl font-semibold text-ink-950">{c.result}</p>
              <p className="mt-2 text-sm text-ink-600">{c.detail}</p>
              <ul className="mt-5 grid gap-2 text-sm text-ink-700">
                {(c.bullets || []).slice(0, 3).map((b) => (
                  <li key={b}>• {b}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
