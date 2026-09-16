import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";

export default function Faq({ faqs }) {
  return (
    <section className="section surface-soft">
      <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Reveal as="div" className="space-y-6 lg:sticky lg:top-28">
          <p className="eyebrow">FAQ</p>
          <h2 className="section-title">Respuestas rápidas para comprar tranquilo.</h2>
          <p className="section-subtitle">
            Si necesitás una equivalencia o compatibilidad, te atendemos por WhatsApp.
          </p>
        </Reveal>
        <div className="divide-y divide-ink-950/8 border-t border-ink-950/8">
          {faqs.map((item, idx) => (
            <Reveal key={item.question} as="div" delayMs={idx * 50} className="py-7 first:pt-0">
              <p className="text-xl font-bold tracking-tight text-ink-950 md:text-2xl">{item.question}</p>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-600">{item.answer}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
