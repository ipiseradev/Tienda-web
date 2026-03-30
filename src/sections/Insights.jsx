import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";

export default function Insights({ insights }) {
  return (
    <section className="section">
      <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <Reveal as="div" className="space-y-6">
          <p className="eyebrow">Guia</p>
          <h2 className="section-title">Guías rápidas para elegir bien.</h2>
          <p className="section-subtitle">
            Talles, telas y recomendaciones para entreno y outdoor.
          </p>
        </Reveal>
        <div className="grid gap-4">
          {insights.map((item, idx) => (
            <Reveal
              key={item.title}
              as="div"
              variant="blur"
              delayMs={idx * 80}
              className="card hover-lift"
            >
              <p className="text-lg font-semibold text-ink-950">{item.title}</p>
              <p className="mt-2 text-sm text-ink-600">{item.detail}</p>
              <p className="mt-4 nike-kicker text-ink-400">{item.time} lectura</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
