import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";

export default function Certifications({ certifications }) {
  return (
    <section className="section">
      <Container className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <Reveal as="div" className="space-y-6">
          <p className="eyebrow">Tecnología</p>
          <h2 className="section-title">Materiales pensados para moverte.</h2>
          <p className="section-subtitle">Telas técnicas, costuras y cuidado: lo que importa de verdad.</p>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-3">
          {certifications.map((item) => (
            <Reveal key={item.title} as="div" className="card">
              <p className="text-lg font-semibold text-ink-950">{item.title}</p>
              <p className="mt-2 text-sm text-ink-600">{item.detail}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
