import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";

export default function Faq({ faqs }) {
  return (
    <section className="section surface-soft">
      <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <Reveal as="div" className="space-y-6">
          <p className="eyebrow">FAQ</p>
          <h2 className="section-title">Respuestas rápidas para comprar tranquilo.</h2>
          <p className="section-subtitle">
            Si necesitás una equivalencia o compatibilidad, te atendemos por WhatsApp.
          </p>
        </Reveal>
        <div className="grid gap-4">
          {faqs.map((item) => (
            <Reveal key={item.question} as="div" className="card">
              <p className="text-lg font-semibold text-ink-950">{item.question}</p>
              <p className="mt-3 text-sm text-ink-600">{item.answer}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
