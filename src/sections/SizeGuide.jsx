import Button from "../components/Button.jsx";
import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";

function TableRow({ label, xs, s, m, l, xl }) {
  return (
    <div className="grid min-w-[560px] grid-cols-6 gap-2 rounded-2xl border border-steel-100 bg-white px-4 py-3 text-sm">
      <p className="font-semibold text-ink-950">{label}</p>
      <p className="text-center text-ink-600">{xs}</p>
      <p className="text-center text-ink-600">{s}</p>
      <p className="text-center text-ink-600">{m}</p>
      <p className="text-center text-ink-600">{l}</p>
      <p className="text-center text-ink-600">{xl}</p>
    </div>
  );
}

export default function SizeGuide() {
  return (
    <section id="guia" className="section">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <Reveal as="div" className="space-y-6">
          <p className="eyebrow">Guía</p>
          <h2 className="section-title">Elegí tu talle sin dudas.</h2>
          <p className="section-subtitle">
            Medite con un centímetro y compará con la tabla. Si estás entre dos, te ayudamos por WhatsApp.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button variant="dark" as="a" href="#contacto" className="cta-shine">
              Pedir ayuda
            </Button>
            <Button variant="ghost" as="a" href="#productos">
              Ver catálogo
            </Button>
          </div>

          <div className="card">
            <p className="text-sm font-semibold text-ink-950">Tips rápidos</p>
            <ul className="mt-3 grid gap-2 text-sm text-ink-600">
              <li>• Regular: tu talle habitual. Ajustado: un talle menos. Oversize: un talle más.</li>
              <li>• Si te interesa compresión, priorizá cintura/cadera y buscá “fit/compresión”.</li>
              <li>• Si entrenás outdoor, considerá capas: base + abrigo liviano + shell.</li>
            </ul>
          </div>
        </Reveal>

        <Reveal
          as="div"
          variant="blur"
          className="rounded-[28px] border border-steel-100 bg-white p-6 shadow-soft"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink-950">Tabla de talles (referencia)</p>
            <span className="pill">XS–XL</span>
          </div>

          <div className="mt-5 grid gap-2">
            <div className="overflow-x-auto" role="region" aria-label="Tabla de talles (desplazable)">
              <div className="grid min-w-[560px] grid-cols-6 gap-2 px-4 text-xs font-semibold uppercase tracking-[0.35em] text-ink-400">
              <p>Dato</p>
              <p className="text-center">XS</p>
              <p className="text-center">S</p>
              <p className="text-center">M</p>
              <p className="text-center">L</p>
              <p className="text-center">XL</p>
            </div>
              <TableRow label="Pecho (cm)" xs="78–84" s="85–91" m="92–99" l="100–107" xl="108–116" />
              <TableRow label="Cintura (cm)" xs="62–67" s="68–74" m="75–82" l="83–90" xl="91–99" />
              <TableRow label="Cadera (cm)" xs="86–92" s="93–99" m="100–107" l="108–115" xl="116–124" />
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-steel-100 bg-ink-50 p-5">
            <p className="text-sm font-semibold text-ink-950">Tip rápido</p>
            <p className="mt-2 text-sm text-ink-600">
              Si estás entre dos talles, elegí el mayor para calce relajado o el menor para calce más ajustado.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
