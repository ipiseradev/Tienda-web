import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";

export default function Testimonials({ testimonials }) {
  return (
    <section id="testimonios" className="section">
      <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <Reveal as="div" className="space-y-6">
          <p className="eyebrow">Clientes</p>
          <h2 className="section-title">Opiniones reales de gente que entrena.</h2>
          <p className="section-subtitle">Calce, tela, envío y cambios: lo que importa.</p>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="card text-center">
              <p className="text-3xl font-semibold text-ink-950">12k+</p>
              <p className="text-sm text-ink-600">clientes</p>
            </div>
            <div className="card text-center">
              <p className="text-3xl font-semibold text-ink-950">24–72h</p>
              <p className="text-sm text-ink-600">envío</p>
            </div>
            <div className="card text-center">
              <p className="text-3xl font-semibold text-ink-950">&lt;2h</p>
              <p className="text-sm text-ink-600">soporte</p>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-4">
          {testimonials.map((item, idx) => (
            <Reveal
              key={item.name}
              as="div"
              variant="blur"
              delayMs={idx * 80}
              className="card hover-lift"
            >
              <p className="text-sm text-ink-600">"{item.quote}"</p>
              <p className="mt-4 text-sm font-semibold text-ink-950">{item.name}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-ink-400">{item.role}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
