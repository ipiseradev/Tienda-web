import { useMemo } from "react";
import Button from "../components/Button.jsx";
import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";
import { useStore } from "../context/StoreContext.jsx";

function ProductCard({ product, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Ver ${product.name}`}
      className="focus-ring group relative flex h-full w-full flex-col overflow-hidden rounded-[28px] border border-steel-200/70 bg-white/85 text-left shadow-soft transition duration-450 ease-out-quint hover:border-steel-300 hover:bg-white hover:shadow-ink active:translate-y-0"
    >
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={product.image}
          alt={product.alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-650 ease-out-quint group-hover:scale-[1.03]"
        />
        <div aria-hidden="true" className={`absolute inset-0 bg-gradient-to-br ${product.tone} opacity-40`} />
        <div className="relative flex h-full w-full items-end justify-between gap-3 p-5">
          <span className="truncate-1 max-w-[60%] rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {product.badge}
          </span>
          <span className="truncate-1 max-w-[40%] rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {product.price}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="truncate-1 text-xs font-semibold uppercase tracking-[0.45em] text-ink-400">
          {product.line}
        </p>
        <p className="mt-3 clamp-2 text-xl font-semibold leading-snug text-ink-950">
          {product.name}
        </p>

        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
          <p className="truncate-1 text-sm text-ink-600">Disponible hoy</p>
          <span className="shrink-0 rounded-full border border-steel-200 bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-700">
            Elegir talle
          </span>
        </div>
      </div>
    </button>
  );
}

export default function Products({ products }) {
  const { openCatalog, openProductSheet } = useStore();
  const visible = useMemo(() => products.slice(0, 4), [products]);

  return (
    <section id="productos" className="section">
      <Container>
        <Reveal as="div" className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <p className="eyebrow">Recomendados</p>
            <h2 className="section-title">Top picks listos para entrenar.</h2>
            <p className="section-subtitle">
              Selección práctica: básicos técnicos que combinan con todo.
            </p>
          </div>
          <Button
            variant="ghost"
            type="button"
            onClick={() => openCatalog("Todos")}
          >
            Ver catálogo
          </Button>
        </Reveal>

        <div className="mt-10">
          <div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 transition duration-900 ease-out-quint"
          >
            {visible.map((p, idx) => (
              <Reveal key={p.name} as="div" className="h-full" variant="blur" delayMs={idx * 60}>
                <ProductCard
                  product={p}
                  onOpen={() => openProductSheet(p)}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
