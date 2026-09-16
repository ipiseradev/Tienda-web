import { useMemo } from "react";
import Button from "../components/Button.jsx";
import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { useTilt } from "../hooks/useTilt.js";

function IconArrowRight({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h12" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

function ProductCard({ product, onOpen }) {
  const { ref: tiltRef, tiltProps } = useTilt({ max: 6, scale: 1.02 });
  return (
    <button
      ref={tiltRef}
      {...tiltProps}
      type="button"
      onClick={onOpen}
      aria-label={`Ver ${product.name}`}
      className="focus-ring group relative flex h-full w-full flex-col overflow-hidden rounded-[24px] border border-ink-950/8 bg-white text-left shadow-soft transition duration-450 ease-out-quint hover:border-ink-950/20 hover:shadow-ink active:translate-y-0"
    >
      <div className="relative h-48 w-full overflow-hidden bg-ink-50">
        <img
          src={product.image}
          alt={product.alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-650 ease-out-quint group-hover:scale-[1.05]"
        />
        <div aria-hidden="true" className={`absolute inset-0 bg-gradient-to-br ${product.tone} opacity-[0.18]`} />
        <div className="relative flex h-full w-full items-start justify-between gap-3 p-5">
          <span className="truncate-1 max-w-[70%] rounded-full bg-ink-950 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
            {product.badge}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate-1 text-xs font-semibold uppercase tracking-[0.45em] text-ink-400">
            {product.line}
          </p>
          {product.rating ? (
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-ink-600">
              <span aria-hidden="true" className="text-volt-500">★</span>
              {Number(product.rating).toFixed(1)}
            </span>
          ) : null}
        </div>
        <p className="mt-3 clamp-2 text-xl font-bold leading-snug tracking-tight text-ink-950">
          {product.name}
        </p>
        <p className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-950">{product.price}</p>

        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
          <p className="truncate-1 text-sm text-ink-500">Disponible hoy</p>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ink-950 bg-white px-3 py-1.5 text-xs font-bold text-ink-950 transition duration-300 group-hover:bg-ink-950 group-hover:text-white">
            Elegir talle
            <IconArrowRight className="h-3.5 w-3.5 transition duration-300 group-hover:translate-x-0.5" />
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
