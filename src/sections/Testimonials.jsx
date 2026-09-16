import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";
import { useTilt } from "../hooks/useTilt.js";

function initialsOf(name) {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

const AVATAR_TONES = [
  "from-ink-950 via-ink-900 to-steel-800",
  "from-ember-600 via-ember-500 to-brass-400",
  "from-steel-800 via-steel-600 to-ink-900"
];

function TestimonialCard({ item, idx }) {
  const { ref, tiltProps } = useTilt({ max: 5, scale: 1.015 });
  const tone = AVATAR_TONES[idx % AVATAR_TONES.length];

  return (
    <Reveal as="div" variant="blur" delayMs={idx * 80} className="card hover-lift">
      <div ref={ref} {...tiltProps}>
        <p className="text-sm text-ink-600">&ldquo;{item.quote}&rdquo;</p>
        <div className="mt-4 flex items-center gap-3">
          <span
            className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${tone} text-sm font-semibold text-white shadow-ink`}
            aria-hidden="true"
          >
            {initialsOf(item.name)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink-950">{item.name}</p>
            <p className="text-xs uppercase tracking-[0.3em] text-ink-400">{item.role}</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

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
            <TestimonialCard key={item.name} item={item} idx={idx} />
          ))}
        </div>
      </Container>
    </section>
  );
}
