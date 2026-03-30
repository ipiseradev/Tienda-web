import { useEffect, useMemo, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock.js";
import { useStore } from "../context/StoreContext.jsx";
import { buildWhatsAppUrl, useLead } from "../context/LeadContext.jsx";
import Button from "./Button.jsx";

function IconX({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function variantsForLine(line) {
  const l = String(line || "").toLowerCase();
  if (l.includes("zapat")) return ["36", "37", "38", "39", "40", "41", "42", "43", "44"];
  if (l.includes("acces")) return ["Único"];
  return ["XS", "S", "M", "L", "XL"];
}

function stockMeta(stock) {
  const n = Number(stock);
  if (!Number.isFinite(n)) return { label: "Consultar", tone: "bg-ink-50 text-ink-700" };
  if (n <= 0) return { label: "A pedido", tone: "bg-amber-50 text-amber-900 border border-amber-200" };
  if (n <= 6) return { label: "Bajo stock", tone: "bg-ember-50 text-ember-900 border border-ember-200" };
  return { label: "En stock", tone: "bg-emerald-50 text-emerald-900 border border-emerald-200" };
}

function buildAdvisorMessage(item) {
  const parts = [
    "Hola, necesito ayuda con talle/calce.",
    item?.sku ? `SKU: ${item.sku}` : null,
    item?.name ? `Producto: ${item.name}` : null,
    item?.measure ? `Medida: ${item.measure}` : null
  ].filter(Boolean);
  return parts.join("\n");
}

function buildBuyNowWhatsAppMessage({ brand, item, size, color, sourceTag = "" }) {
  const lines = [
    "Hola, quiero comprar este producto:",
    "",
    item?.name ? `• Producto: ${item.name}` : null,
    item?.sku ? `• SKU: ${item.sku}` : null,
    size ? `• Talle: ${size}` : null,
    color ? `• Color: ${color}` : null,
    item?.price ? `• Precio estimado: ${item.price}` : null,
    item?.leadTime ? `• Entrega: ${item.leadTime}` : null,
    "",
    "¿Me confirmás stock, total y envío?",
    sourceTag ? `Origen: ${sourceTag}` : null
  ].filter((v) => v !== null && v !== undefined);

  if (brand) lines.push("", `Gracias — ${brand}`);

  return lines.join("\n");
}

function TechRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ink-400">{label}</p>
      <p className="text-sm font-semibold text-ink-950">{value}</p>
    </div>
  );
}

export default function ProductSheetModal({ site, products, onOpenRfq }) {
  const reduceMotion = usePrefersReducedMotion();
  const { setLeadContext } = useLead();
  const {
    productSheetOpen,
    productSheetItem,
    closeProductSheet,
    addToCart,
    openCart,
    openProductSheet,
    fitProfile,
    openFitFinder
  } =
    useStore();

  const rootRef = useRef(null);
  const closeRef = useRef(null);
  const lastActiveRef = useRef(null);

  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [justAdded, setJustAdded] = useState(false);

  const sizes = useMemo(() => {
    const explicit = productSheetItem?.sizes;
    if (Array.isArray(explicit) && explicit.length) return explicit.map((s) => String(s));
    return variantsForLine(productSheetItem?.line);
  }, [productSheetItem?.line, productSheetItem?.sizes]);
  const colors = useMemo(() => {
    const explicit = productSheetItem?.colors;
    if (Array.isArray(explicit) && explicit.length) return explicit.map((c) => String(c));
    return [];
  }, [productSheetItem?.colors]);
  const compatList = useMemo(() => productSheetItem?.compat || [], [productSheetItem?.compat]);
  const stock = stockMeta(productSheetItem?.stock);
  const recommendedSize = fitProfile?.recommendedSize ? String(fitProfile.recommendedSize) : "";

  const equivalentProducts = useMemo(() => {
    const list = productSheetItem?.equivalents || [];
    if (!list.length) return [];
    const pool = Array.isArray(products) ? products : [];
    const found = list
      .map((name) => pool.find((p) => p.name === name))
      .filter(Boolean);
    return found;
  }, [productSheetItem?.equivalents, products]);

  useEffect(() => {
    if (!productSheetOpen) return;
    lastActiveRef.current = document.activeElement;
    closeRef.current?.focus();
  }, [productSheetOpen]);

  useEffect(() => {
    if (!productSheetOpen) return;
    setJustAdded(false);
    const nextSize =
      (recommendedSize && sizes.includes(recommendedSize) ? recommendedSize : "") || sizes[0] || "";
    setSize(nextSize);
    setColor(colors[0] || "");
  }, [colors, productSheetOpen, recommendedSize, sizes]);

  useBodyScrollLock(productSheetOpen);

  useEffect(() => {
    if (!productSheetOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeProductSheet();
      }
      if (event.key === "Tab") {
        const root = rootRef.current;
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
  }, [closeProductSheet, productSheetOpen]);

  useEffect(() => {
    if (productSheetOpen) return;
    const last = lastActiveRef.current;
    if (last && typeof last.focus === "function") last.focus();
  }, [productSheetOpen]);

  if (!productSheetOpen || !productSheetItem) return null;

  const onAdd = () => {
    if (!size) return;
    addToCart(productSheetItem, 1, { size, color });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 900);
  };

  const advisorUrl = site?.whatsappUrl
    ? buildWhatsAppUrl(site.whatsappUrl, buildAdvisorMessage(productSheetItem))
    : "";

  const buyNowUrl =
    site?.whatsappUrl && size
      ? buildWhatsAppUrl(
          site.whatsappUrl,
          buildBuyNowWhatsAppMessage({
            brand: site?.brand,
            item: productSheetItem,
            size,
            color,
            sourceTag: "Ficha de producto"
          })
        )
      : "";

  return (
    <div className="fixed inset-0 z-[95]" role="dialog" aria-modal="true" aria-label="Producto">
      <button
        type="button"
        className="absolute inset-0 bg-ink-950/60"
        aria-label="Cerrar"
        onClick={closeProductSheet}
      />

      <div
        ref={rootRef}
        className="absolute inset-x-0 bottom-0 top-0 mx-auto w-full max-w-6xl px-4 py-4 md:px-10 md:py-10"
      >
        <div
          className={`relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/15 bg-white/90 shadow-ink backdrop-blur ${
            reduceMotion ? "" : "animate-revealBlur"
          }`}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-steel-100 bg-white/80 px-6 py-5 backdrop-blur">
            <div className="min-w-0">
              <p className="nike-kicker">{productSheetItem.line}</p>
              <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-ink-950">
                {productSheetItem.name}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {productSheetItem.brand ? (
                  <span className="rounded-full bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-700">
                    {productSheetItem.brand}
                  </span>
                ) : null}
                {productSheetItem.sku ? (
                  <span className="rounded-full bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-700">
                    SKU {productSheetItem.sku}
                  </span>
                ) : null}
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${stock.tone}`}>
                  {stock.label}
                </span>
                {productSheetItem.rating ? (
                  <span className="text-xs font-semibold text-ink-700">
                    <span aria-hidden="true" className="text-volt-300">★</span>{" "}
                    {Number(productSheetItem.rating).toFixed(1)}{" "}
                    <span className="text-ink-500">
                      ({Number(productSheetItem.reviewsCount || 0).toLocaleString("es-AR")})
                    </span>
                  </span>
                ) : null}
                <span className="text-xs font-semibold text-ink-600">• {productSheetItem.price}</span>
              </div>
            </div>

            <button
              type="button"
              className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-steel-200 bg-white text-ink-900 transition hover:bg-ink-50"
              aria-label="Cerrar"
              onClick={closeProductSheet}
              ref={closeRef}
            >
              <IconX />
            </button>
          </div>

          <div className="modal-scroll flex-1 overflow-y-auto p-6 md:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-6">
                <div className="overflow-hidden rounded-[28px] border border-steel-100 bg-white shadow-soft">
                  <div className="relative h-64 w-full overflow-hidden">
                    <img
                      src={productSheetItem.image}
                      alt={productSheetItem.alt || productSheetItem.name}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-br from-ink-950/10 via-transparent to-volt-300/18"
                    />
                  </div>
                  <div className="p-6">
                  <p className="text-sm font-semibold text-ink-950">Compatibilidades</p>
                  <ul className="mt-3 grid gap-2 text-sm text-ink-600">
                      {(compatList.length ? compatList : ["Talles disponibles", "Envío coordinado", "Soporte por WhatsApp"]).map(
                        (b) => (
                          <li key={b}>• {b}</li>
                        )
                      )}
                  </ul>
                  </div>
                </div>

                {equivalentProducts.length ? (
                  <div className="rounded-[28px] border border-steel-100 bg-white p-6 shadow-soft">
                    <p className="text-sm font-semibold text-ink-950">Equivalencias en stock</p>
                    <p className="mt-2 text-sm text-ink-600">
                      Alternativas recomendadas si estás comparando marca o disponibilidad.
                    </p>
                    <div className="mt-4 grid gap-3">
                      {equivalentProducts.map((p) => (
                        <button
                          key={p.name}
                          type="button"
                          className="focus-ring flex items-center justify-between rounded-2xl border border-steel-200 bg-white px-4 py-3 text-left transition hover:bg-ink-50"
                          onClick={() => openProductSheet(p)}
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-ink-950">{p.name}</p>
                            <p className="mt-1 text-xs text-ink-500">
                              {p.brand ? `${p.brand} • ` : ""}
                              {p.measure || p.line}
                            </p>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${stockMeta(p.stock).tone}`}>
                            {stockMeta(p.stock).label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="space-y-6">
                <div className="rounded-[28px] border border-steel-100 bg-white p-6 shadow-soft">
                  <p className="text-sm font-semibold text-ink-950">Detalles</p>
                  <div className="mt-4 grid gap-3">
                    <TechRow label="Medida" value={productSheetItem.measure} />
                    <TechRow label="Entrega" value={productSheetItem.leadTime} />
                    <TechRow label="SKU" value={productSheetItem.sku} />
                    <TechRow label="Marca" value={productSheetItem.brand} />
                  </div>

                  {productSheetItem.datasheet ? (
                    <a
                      className="focus-ring mt-5 inline-flex items-center justify-center rounded-full border border-steel-200 bg-white px-5 py-2.5 text-sm font-semibold text-ink-950 transition hover:bg-ink-50"
                      href={productSheetItem.datasheet}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Abrir detalle
                    </a>
                  ) : null}
                </div>

                {sizes.length ? (
                  <div className="rounded-[28px] border border-steel-100 bg-white p-6 shadow-soft">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-ink-950">Talle</p>
                      {!recommendedSize ? (
                        <button
                          type="button"
                          className="focus-ring rounded-full border border-steel-200 bg-white px-3 py-1 text-xs font-semibold text-ink-700 transition hover:bg-ink-50"
                          onClick={() => openFitFinder?.()}
                        >
                          Fit Finder
                        </button>
                      ) : (
                        <span className="rounded-full bg-volt-50 px-3 py-1 text-xs font-semibold text-ink-800">
                          Recomendado: {recommendedSize}
                        </span>
                      )}
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {sizes.map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setSize(v)}
                          className={`focus-ring rounded-2xl border px-3 py-2 text-xs font-semibold transition ${
                            v === size
                              ? "border-ink-950 bg-ink-950 text-white shadow-ink"
                              : "border-steel-200 bg-white text-ink-700 hover:border-steel-300 hover:bg-ink-50"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {colors.length ? (
                  <div className="rounded-[28px] border border-steel-100 bg-white p-6 shadow-soft">
                    <p className="text-sm font-semibold text-ink-950">Color (opcional)</p>
                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {colors.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setColor(c)}
                          className={`focus-ring rounded-2xl border px-3 py-2 text-xs font-semibold transition ${
                            c === color
                              ? "border-ink-950 bg-ink-950 text-white shadow-ink"
                              : "border-steel-200 bg-white text-ink-700 hover:border-steel-300 hover:bg-ink-50"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="rounded-[28px] border border-steel-100 bg-white p-6 shadow-soft">
                  <p className="text-sm font-semibold text-ink-950">Acciones</p>
                  <div className="mt-4 grid gap-3">
                    <Button
                      variant="accent"
                      type="button"
                      className="cta-shine w-full justify-center px-7 py-3"
                      onClick={() => {
                        onAdd();
                        closeProductSheet();
                        openCart();
                      }}
                      disabled={!size}
                    >
                      Comprar ahora
                    </Button>

                    <Button
                      as={buyNowUrl ? "a" : "button"}
                      href={buyNowUrl || undefined}
                      target={buyNowUrl ? "_blank" : undefined}
                      rel={buyNowUrl ? "noreferrer" : undefined}
                      variant="dark"
                      className="cta-shine w-full justify-center px-7 py-3"
                      disabled={!buyNowUrl}
                      onClick={() => {
                        if (!buyNowUrl) return;
                        setLeadContext?.({
                          topic: "Checkout: WhatsApp directo",
                          source: "product_sheet_whatsapp",
                          meta: productSheetItem?.sku ? `SKU ${productSheetItem.sku}` : ""
                        });
                      }}
                    >
                      Comprar por WhatsApp
                    </Button>

                    <Button
                      variant="dark"
                      type="button"
                      className="w-full justify-center px-7 py-3"
                      onClick={onAdd}
                      disabled={!size}
                    >
                      {justAdded ? "Agregado" : "Agregar al carrito"}
                    </Button>

                    <Button
                      variant="ghost"
                      type="button"
                      className="w-full justify-center"
                      onClick={() => {
                        closeProductSheet();
                        onOpenRfq?.();
                      }}
                    >
                      Pedir recomendación
                    </Button>

                    {advisorUrl ? (
                      <Button
                        as="a"
                        href={advisorUrl}
                        target="_blank"
                        rel="noreferrer"
                        variant="ghost"
                        className="w-full justify-center"
                      >
                        Consultar a un asesor
                      </Button>
                    ) : null}
                  </div>

                  <p className="mt-4 text-xs text-ink-500">
                    Tip: contanos tu disciplina y el calce que buscás (regular, ajustado u oversize).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
