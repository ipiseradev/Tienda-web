import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";
import { IconBolt, IconShield } from "../components/icons.jsx";

export default function Services({ services }) {
  return (
    <section id="servicios" className="section surface-soft">
      <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal as="div" className="space-y-6">
          <p className="eyebrow">Beneficios</p>
          <h2 className="section-title">Comprar simple. Entrenar mejor.</h2>
          <p className="section-subtitle">
            Guía de talles clara, cambios simples y envíos rápidos.
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            <Reveal as="div" variant="blur" delayMs={80} className="card hover-lift">
              <IconBolt className="h-10 w-10 text-volt-300" />
              <p className="mt-4 text-lg font-semibold text-ink-950">Drops curados</p>
              <p className="mt-2 text-sm text-ink-600">
                Cápsulas por disciplina: combinás rápido y salís a entrenar.
              </p>
            </Reveal>
            <Reveal as="div" variant="blur" delayMs={140} className="card hover-lift">
              <IconShield className="h-10 w-10 text-ember-500" />
              <p className="mt-4 text-lg font-semibold text-ink-950">Calce y tela</p>
              <p className="mt-2 text-sm text-ink-600">
                Detalles técnicos, terminaciones y soporte de talles por WhatsApp.
              </p>
            </Reveal>
          </div>
        </Reveal>

        <div className="grid gap-4">
          {services.map((service, idx) => (
            <Reveal
              key={service.title}
              as="div"
              variant="blur"
              delayMs={idx * 70}
              className="card hover-lift"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-lg font-semibold text-ink-950">{service.title}</p>
                  <p className="mt-2 text-sm text-ink-600">{service.description}</p>
                </div>
                <span className="text-2xl font-semibold text-ink-950">{service.stat}</span>
              </div>
            </Reveal>
          ))}

          <Reveal
            as="div"
            variant="blur"
            delayMs={240}
            className="rounded-[2rem] bg-ink-950 p-6 text-white shadow-ink hover-lift"
          >
            <p className="nike-kicker text-white/70">Atención</p>
            <p className="mt-2 text-2xl font-semibold">WhatsApp 1:1</p>
            <p className="mt-2 text-sm text-white/70">
              Te ayudamos a elegir talle, calce y disciplina en minutos.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
