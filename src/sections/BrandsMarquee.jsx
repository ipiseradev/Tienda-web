import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";

export default function BrandsMarquee({ brands }) {
  const items = [...brands, ...brands];
  return (
    <section className="section py-12">
      <Container>
        <Reveal as="div" className="flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-2">
            <p className="eyebrow">Marcas aliadas</p>
            <p className="text-sm text-ink-600">
              Marcas y líneas seleccionadas para entrenamiento, running y outdoor.
            </p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-full border border-steel-200 bg-white px-4 py-2 text-xs font-semibold text-ink-700">
            Curado para performance real
          </div>
        </Reveal>

        <div className="mt-8 overflow-hidden rounded-[2rem] border border-steel-100 bg-white shadow-soft">
          <div className="mask-fade-x flex w-[200%] items-center gap-3 py-5 animate-marquee">
            {items.map((brand, idx) => (
              <span
                key={`${brand}-${idx}`}
                className="mx-2 inline-flex select-none items-center justify-center rounded-full border border-steel-200 bg-ink-50 px-5 py-3 text-sm font-semibold text-ink-800"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
