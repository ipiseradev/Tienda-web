import { useEffect, useMemo, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock.js";
import Button from "./Button.jsx";

function uniqueLines(products) {
  const set = new Set();
  for (const p of products) if (p?.line) set.add(p.line);
  return Array.from(set);
}

function uniqueValues(products, key) {
  const set = new Set();
  for (const p of products) {
    const v = p?.[key];
    if (v) set.add(String(v));
  }
  return Array.from(set);
}

function parsePrice(price) {
  const s = String(price || "").replace(/[^\d]/g, "");
  const n = Number(s || 0);
  return Number.isFinite(n) ? n : 0;
}

function stockLabel(stock) {
  const n = Number(stock);
  if (!Number.isFinite(n)) return { label: "Consultar", tone: "bg-ink-50 text-ink-700" };
  if (n <= 0) return { label: "A pedido", tone: "bg-amber-50 text-amber-900 border border-amber-200" };
  if (n <= 6) return { label: "Bajo stock", tone: "bg-ember-50 text-ember-900 border border-ember-200" };
  return { label: "En stock", tone: "bg-emerald-50 text-emerald-900 border border-emerald-200" };
}

export default function CatalogModal({
  open,
  onClose,
  products,
  initialLine = "Todos",
  initialDiscipline = "Todas",
  onOpenProduct
}) {
  const reduceMotion = usePrefersReducedMotion();
  const modalRef = useRef(null);
  const searchRef = useRef(null);
  const closeButtonRef = useRef(null);
  const lastActiveRef = useRef(null);

  const [query, setQuery] = useState("");
  const [line, setLine] = useState("Todos");
  const [discipline, setDiscipline] = useState("Todas");
  const [brand, setBrand] = useState("Todas");
  const [size, setSize] = useState("Todos");
  const [measure, setMeasure] = useState("Todas");
  const [stockOnly, setStockOnly] = useState(false);
  const [sort, setSort] = useState("relevance");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const lines = useMemo(() => ["Todos", ...uniqueLines(products || [])], [products]);
  const disciplines = useMemo(() => {
    const set = new Set();
    for (const p of products || []) {
      const list = Array.isArray(p?.disciplines) ? p.disciplines : [];
      for (const d of list) if (d) set.add(String(d));
    }
    return ["Todas", ...Array.from(set).sort()];
  }, [products]);
  const brands = useMemo(() => ["Todas", ...uniqueValues(products || [], "brand")].sort(), [products]);
  const measures = useMemo(
    () => ["Todas", ...uniqueValues(products || [], "measure")].sort(),
    [products]
  );
  const sizes = useMemo(() => {
    const set = new Set();
    for (const p of products || []) {
      const list = Array.isArray(p?.sizes) ? p.sizes : [];
      for (const s of list) if (s) set.add(String(s));
    }
    return ["Todos", ...Array.from(set).sort((a, b) => String(a).localeCompare(String(b)))];
  }, [products]);
  const priceBounds = useMemo(() => {
    const values = (products || []).map((p) => parsePrice(p?.price)).filter((n) => n > 0);
    if (!values.length) return { min: 0, max: 0 };
    return { min: Math.min(...values), max: Math.max(...values) };
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const min = minPrice === "" ? null : Number(String(minPrice).replace(/[^\d]/g, ""));
    const max = maxPrice === "" ? null : Number(String(maxPrice).replace(/[^\d]/g, ""));
    const base = (products || []).filter((p) => {
      if (line !== "Todos" && p.line !== line) return false;
      if (discipline !== "Todas") {
        const list = Array.isArray(p?.disciplines) ? p.disciplines : [];
        if (!list.map((d) => String(d)).includes(discipline)) return false;
      }
      if (brand !== "Todas" && String(p.brand || "") !== brand) return false;
      if (measure !== "Todas" && String(p.measure || "") !== measure) return false;
      if (size !== "Todos") {
        const list = Array.isArray(p?.sizes) ? p.sizes : [];
        if (!list.map((s) => String(s)).includes(size)) return false;
      }
      if (stockOnly && Number(p.stock || 0) <= 0) return false;
      const priceValue = parsePrice(p?.price);
      if (min !== null && Number.isFinite(min) && priceValue < min) return false;
      if (max !== null && Number.isFinite(max) && priceValue > max) return false;
      if (!q) return true;
      return (
        String(p.name || "").toLowerCase().includes(q) ||
        String(p.badge || "").toLowerCase().includes(q) ||
        String(p.line || "").toLowerCase().includes(q) ||
        String(p.brand || "").toLowerCase().includes(q) ||
        String(p.sku || "").toLowerCase().includes(q) ||
        String(p.measure || "").toLowerCase().includes(q)
      );
    });

    const sorted = [...base];
    if (sort === "price_asc") sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    if (sort === "price_desc") sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    if (sort === "stock_desc") sorted.sort((a, b) => Number(b.stock || 0) - Number(a.stock || 0));
    if (sort === "name_asc") sorted.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
    if (sort === "best_sellers")
      sorted.sort((a, b) => Number(b.bestSellerScore || 0) - Number(a.bestSellerScore || 0));
    return sorted;
  }, [brand, discipline, line, maxPrice, measure, minPrice, products, query, size, sort, stockOnly]);

  useEffect(() => {
    if (!open) return;
    lastActiveRef.current = document.activeElement;
    window.setTimeout(() => {
      if (searchRef.current) searchRef.current.focus();
      else closeButtonRef.current?.focus();
    }, 0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setBrand("Todas");
    setDiscipline(initialDiscipline || "Todas");
    setSize("Todos");
    setMeasure("Todas");
    setStockOnly(false);
    setSort("relevance");
    setMinPrice("");
    setMaxPrice("");
  }, [initialDiscipline, open]);

  useEffect(() => {
    if (!open) return;
    setLine(initialLine || "Todos");
  }, [initialLine, open]);

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
      }
      if (event.key === "Tab") {
        const root = modalRef.current;
        if (!root) return;
        const focusables = root.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (event.shiftKey) {
          if (active === first || !root.contains(active)) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (active === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  useEffect(() => {
    if (open) return;
    const last = lastActiveRef.current;
    if (last && typeof last.focus === "function") last.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Catálogo">
      <button
        type="button"
        className="absolute inset-0 bg-ink-950/60"
        aria-label="Cerrar catálogo"
        onClick={onClose}
      />

      <div
        ref={modalRef}
        className="absolute inset-x-0 bottom-0 top-0 mx-auto w-full max-w-7xl px-4 py-4 md:px-10 md:py-10"
      >
        <div
          className={`relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/15 bg-white/90 shadow-ink backdrop-blur ${
            reduceMotion ? "" : "animate-revealBlur"
          }`}
        >
          <div className="sticky top-0 z-10 shrink-0 border-b border-steel-100 bg-white/90 backdrop-blur">
            <div className="flex items-start justify-between gap-3 px-4 pt-4 sm:px-6 sm:pt-5">
              <div className="min-w-0">
                <p className="nike-kicker">Catálogo</p>
                <p className="mt-1 truncate text-xl font-semibold tracking-tight text-ink-950 sm:mt-2 sm:text-2xl">
                  Ver todo el catálogo
                </p>
                <p className="mt-1 text-xs text-ink-600 sm:text-sm">{filtered.length} items</p>
              </div>

              <Button
                variant="dark"
                type="button"
                className="shrink-0 px-5 py-2.5 sm:px-6 sm:py-3"
                onClick={onClose}
                ref={closeButtonRef}
              >
                Cerrar
              </Button>
            </div>

            <div className="px-4 pt-3 sm:px-6">
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="focus-ring w-full rounded-full border border-steel-200 bg-white px-5 py-3 text-sm text-ink-950 placeholder:text-ink-400"
                placeholder='Buscar (ej: "remera", "calza", "running")'
                aria-label="Buscar prendas"
              />
            </div>

            <div className="no-scrollbar mt-3 flex items-center gap-2 overflow-x-auto px-4 pb-4 sm:px-6 sm:pb-5">
              {lines.map((l) => (
                <button
                  key={l}
                  type="button"
                  className={`focus-ring shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    l === line
                      ? "border-ink-950 bg-ink-950 text-white shadow-ink ring-2 ring-volt-300/35"
                      : "border-steel-200 bg-white text-ink-700 hover:border-steel-300 hover:bg-ink-50"
                  }`}
                  onClick={() => setLine(l)}
                >
                  {l}
                </button>
              ))}

              <span className="h-6 w-px shrink-0 bg-steel-200" aria-hidden="true" />

              <select
                className="focus-ring shrink-0 rounded-full border border-steel-200 bg-white px-4 py-2 text-xs font-semibold text-ink-700"
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                aria-label="Filtrar por disciplina"
              >
                {disciplines.map((d) => (
                  <option key={d} value={d}>
                    Disciplina: {d}
                  </option>
                ))}
              </select>
              <select
                className="focus-ring shrink-0 rounded-full border border-steel-200 bg-white px-4 py-2 text-xs font-semibold text-ink-700"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                aria-label="Filtrar por marca"
              >
                {brands.map((b) => (
                  <option key={b} value={b}>
                    Marca: {b}
                  </option>
                ))}
              </select>
              <select
                className="focus-ring shrink-0 rounded-full border border-steel-200 bg-white px-4 py-2 text-xs font-semibold text-ink-700"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                aria-label="Filtrar por talle"
              >
                {sizes.map((s) => (
                  <option key={s} value={s}>
                    Talle: {s}
                  </option>
                ))}
              </select>
              <select
                className="focus-ring shrink-0 rounded-full border border-steel-200 bg-white px-4 py-2 text-xs font-semibold text-ink-700"
                value={measure}
                onChange={(e) => setMeasure(e.target.value)}
                aria-label="Filtrar por medida"
              >
                {measures.map((m) => (
                  <option key={m} value={m}>
                    Medida: {m}
                  </option>
                ))}
              </select>
              <input
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                inputMode="numeric"
                className="focus-ring w-[110px] shrink-0 rounded-full border border-steel-200 bg-white px-4 py-2 text-xs font-semibold text-ink-700 placeholder:text-ink-400"
                placeholder={priceBounds.min ? `Min ${priceBounds.min}` : "Min"}
                aria-label="Precio mínimo"
              />
              <input
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                inputMode="numeric"
                className="focus-ring w-[110px] shrink-0 rounded-full border border-steel-200 bg-white px-4 py-2 text-xs font-semibold text-ink-700 placeholder:text-ink-400"
                placeholder={priceBounds.max ? `Max ${priceBounds.max}` : "Max"}
                aria-label="Precio máximo"
              />
              <select
                className="focus-ring shrink-0 rounded-full border border-steel-200 bg-white px-4 py-2 text-xs font-semibold text-ink-700"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Ordenar catálogo"
              >
                <option value="relevance">Orden: Relevancia</option>
                <option value="best_sellers">Orden: Más vendidos</option>
                <option value="stock_desc">Orden: Stock</option>
                <option value="price_asc">Orden: Precio ↑</option>
                <option value="price_desc">Orden: Precio ↓</option>
                <option value="name_asc">Orden: Nombre</option>
              </select>
              <label className="focus-ring inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-steel-200 bg-white px-4 py-2 text-xs font-semibold text-ink-700">
                <input
                  type="checkbox"
                  checked={stockOnly}
                  onChange={(e) => setStockOnly(e.target.checked)}
                  className="h-4 w-4 accent-ink-950"
                />
                Solo stock
              </label>
            </div>
          </div>

          <div className="modal-scroll flex-1 overflow-y-auto p-6 md:p-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((p) => (
                <div
                  key={p.name}
                  className="group overflow-hidden rounded-[2rem] border border-steel-100 bg-white shadow-soft hover-lift"
                >
                  <div className="relative h-40 w-full overflow-hidden">
                    <button
                      type="button"
                      className="absolute inset-0"
                      onClick={() => onOpenProduct?.(p)}
                      aria-label={`Ver ${p.name}`}
                    >
                      <img
                        src={p.image}
                        alt={p.alt}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-650 ease-out-quint group-hover:scale-[1.04]"
                      />
                    </button>
                    <div
                      aria-hidden="true"
                      className={`absolute inset-0 bg-gradient-to-br ${p.tone} opacity-35`}
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-ink-950/25 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100"
                    />
                    <div className="relative flex h-full items-end justify-between p-4">
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                        {p.badge}
                      </span>
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                        {p.price}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.45em] text-ink-400">
                      {p.line}
                    </p>
                    <button
                      type="button"
                      className="focus-ring mt-3 text-left text-lg font-semibold text-ink-950 hover:underline underline-offset-4"
                      onClick={() => onOpenProduct?.(p)}
                    >
                      {p.name}
                    </button>
                    {p.rating ? (
                      <p className="mt-2 text-sm font-semibold text-ink-700">
                        <span aria-hidden="true" className="text-volt-300">★</span>{" "}
                        {Number(p.rating).toFixed(1)}{" "}
                        <span className="text-ink-500">
                          ({Number(p.reviewsCount || 0).toLocaleString("es-AR")})
                        </span>
                      </p>
                    ) : null}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {p.brand ? (
                        <span className="rounded-full bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-700">
                          {p.brand}
                        </span>
                      ) : null}
                      {p.measure ? (
                        <span className="rounded-full bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-700">
                          {p.measure}
                        </span>
                      ) : null}
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${stockLabel(p.stock).tone}`}>
                        {stockLabel(p.stock).label}
                      </span>
                    </div>
                    <div className="mt-5">
                      <Button
                        variant="dark"
                        className="w-full px-6 py-3 opacity-100 transition duration-400 ease-out-quint sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
                        onClick={() => onOpenProduct?.(p)}
                      >
                        Elegir talle
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="mt-10 rounded-[2rem] border border-steel-100 bg-white p-8 text-center">
                <p className="text-lg font-semibold text-ink-950">Sin resultados</p>
                <p className="mt-2 text-sm text-ink-600">
                  Probá con otra palabra o cambiá el filtro.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
