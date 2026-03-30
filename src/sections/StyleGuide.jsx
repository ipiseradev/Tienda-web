import Button from "../components/Button.jsx";
import Container from "../components/Container.jsx";

export default function StyleGuide() {
  return (
    <section className="section">
      <Container className="space-y-8">
        <div className="space-y-3">
          <p className="eyebrow">Interno</p>
          <h2 className="section-title">Style guide</h2>
          <p className="section-subtitle">
            Checklist visual rápida para mantener consistencia (no es parte del sitio público).
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="card">
            <p className="nike-kicker">Typography</p>
            <p className="mt-3 text-2xl font-semibold text-ink-950">Título de sección</p>
            <p className="mt-2 text-sm text-ink-600">Texto de apoyo / subtítulo con buena legibilidad.</p>
          </div>
          <div className="card">
            <p className="nike-kicker">Buttons</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="dark">Dark</Button>
              <Button variant="primary">Primary</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>
          <div className="card">
            <p className="nike-kicker">Chips</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="chip">Chip</span>
              <span className="pill">Pill</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

