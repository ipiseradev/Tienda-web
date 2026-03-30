import Button from "../components/Button.jsx";
import CollectionCard from "../components/CollectionCard.jsx";
import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";
import { useLead } from "../context/LeadContext.jsx";

export default function Categories({ categories }) {
  const { setLeadContext } = useLead();
  return (
    <section id="categorias" className="section">
      <Container>
        <Reveal as="div" className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <p className="eyebrow">Categorías</p>
            <h2 className="section-title">Colecciones pensadas para moverte.</h2>
            <p className="section-subtitle max-w-xl">
              Elegí por disciplina y encontrá el calce y la tela que necesitás.
            </p>
            <div className="mt-4 h-px w-full max-w-[420px] bg-gradient-to-r from-ink-950/10 via-transparent to-transparent" />
          </div>
          <Button variant="dark" as="a" href="#packs" className="cta-shine px-7 py-3">
            Ver drops
          </Button>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-12 lg:auto-rows-[280px] xl:auto-rows-[300px]">
          {categories.map((item, idx) => (
            <Reveal
              key={item.title}
              as="div"
              variant="blur"
              delayMs={idx * 80}
              className="h-full lg:col-span-6"
            >
              <CollectionCard item={item} layout="featured" />
            </Reveal>
          ))}
        </div>

        <Reveal
          as="div"
          className="mt-12 overflow-hidden rounded-[28px] border border-steel-200/70 bg-white/80 shadow-soft backdrop-blur"
        >
          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-volt-300/25 via-transparent to-ember-500/15"
            />
            <div className="relative flex flex-wrap items-center justify-between gap-5 px-6 py-5 sm:px-7 sm:py-6">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-steel-200 bg-white shadow-soft">
                  <span className="text-sm font-semibold text-ink-950">i</span>
                </div>
                <div className="max-w-2xl">
                  <p className="text-sm font-semibold tracking-tight text-ink-950">
                    Navegación rápida
                  </p>
                  <p className="mt-1 text-sm text-ink-600">
                    "Ver categoría" abre el catálogo filtrado. "Ver drops" muestra cápsulas recomendadas.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="ghost" as="a" href="#productos" className="px-6 py-2.5">
                  Ver productos
                </Button>
                <Button
                  variant="dark"
                  as="a"
                  href="#contacto"
                  className="cta-shine px-7 py-3"
                  onClick={() =>
                    setLeadContext({ topic: "Ayuda para elegir categorías", source: "categories_help" })
                  }
                >
                  Necesito ayuda
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
