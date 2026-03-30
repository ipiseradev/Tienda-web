import { useEffect, useMemo, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock.js";
import { useStore } from "../context/StoreContext.jsx";
import { useLead } from "../context/LeadContext.jsx";
import Button from "./Button.jsx";

function IconX({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function IconMinus({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14" />
    </svg>
  );
}

function IconPlus({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function buildQuoteMessage({ brand, cartItems, totals, customer }) {
  const lines = [
    "Hola, quiero hacer un pedido.",
    "",
    "Carrito:"
  ];

  for (const it of cartItems) {
    const meta = [
      it?.size ? `talle ${it.size}` : null,
      it?.color ? `color ${it.color}` : null
    ]
      .filter(Boolean)
      .join(" • ");
    lines.push(`- ${it.qty}x ${it.name}${meta ? ` (${meta})` : ""}`);
  }

  if (totals?.subtotalLabel) {
    lines.push("");
    lines.push(`Estimado: ${totals.subtotalLabel}`);
    lines.push("Confirmar stock, envío y medios de pago.");
  }

  if (customer) {
    const name = String(customer?.name || "").trim();
    const area = String(customer?.area || "").trim();
    const payment = String(customer?.payment || "").trim();
    const delivery = String(customer?.delivery || "").trim();
    const notes = String(customer?.notes || "").trim();

    const hasAny = Boolean(name || area || payment || delivery || notes);
    if (hasAny) {
      lines.push("");
      lines.push("Datos:");
      if (name) lines.push(`- Nombre: ${name}`);
      if (area) lines.push(`- Zona: ${area}`);
      if (delivery) lines.push(`- Entrega: ${delivery}`);
      if (payment) lines.push(`- Pago: ${payment}`);
      if (notes) lines.push(`- Nota: ${notes}`);
    }
  }

  if (brand) {
    lines.push("");
    lines.push(`Gracias — ${brand}`);
  }

  return lines.join("\n");
}

export default function CartDrawer({ site }) {
  const reduceMotion = usePrefersReducedMotion();
  const { setLeadContext } = useLead();
  const {
    cartOpen,
    closeCart,
    cartItems,
    totals,
    removeFromCart,
    setQty
  } = useStore();

  const rootRef = useRef(null);
  const closeRef = useRef(null);
  const lastActiveRef = useRef(null);

  const hasItems = cartItems.length > 0;
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [delivery, setDelivery] = useState("A coordinar");
  const [payment, setPayment] = useState("A coordinar");
  const [notes, setNotes] = useState("");

  const summary = useMemo(
    () => ({
      itemsLabel: totals.itemsCount === 1 ? "1 item" : `${totals.itemsCount} items`,
      subtotalLabel: totals.subtotalLabel
    }),
    [totals.itemsCount, totals.subtotalLabel]
  );

  useEffect(() => {
    if (!cartOpen) return;
    lastActiveRef.current = document.activeElement;
    closeRef.current?.focus();
  }, [cartOpen]);

  useBodyScrollLock(cartOpen);

  useEffect(() => {
    if (!cartOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeCart();
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
  }, [cartOpen, closeCart]);

  useEffect(() => {
    if (cartOpen) return;
    const last = lastActiveRef.current;
    if (last && typeof last.focus === "function") last.focus();
  }, [cartOpen]);

  if (!cartOpen) return null;

  const quoteMessage = buildQuoteMessage({
    brand: site?.brand,
    cartItems,
    totals,
    customer: { name, area, delivery, payment, notes }
  });
  const whatsappUrl = site?.whatsappUrl
    ? `${site.whatsappUrl}?text=${encodeURIComponent(quoteMessage)}`
    : "";
  const mailtoUrl = site?.email
    ? `mailto:${site.email}?subject=${encodeURIComponent(`Pedido - ${site?.brand || "Consulta"}`)}&body=${encodeURIComponent(quoteMessage)}`
    : "";

  const canWhatsApp = hasItems && Boolean(whatsappUrl);
  const canMail = hasItems && Boolean(mailtoUrl);

  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Carrito">
      <button
        type="button"
        className="absolute inset-0 bg-ink-950/55"
        aria-label="Cerrar carrito"
        onClick={closeCart}
      />

      <div ref={rootRef} className="absolute inset-y-0 right-0 w-[min(92vw,420px)] p-3 md:p-5">
        <div
          className={`relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/15 bg-white/90 shadow-ink backdrop-blur ${
            reduceMotion ? "" : "animate-revealBlur"
          }`}
        >
          <div className="flex items-center justify-between border-b border-steel-100 bg-white/80 px-5 py-4 backdrop-blur">
            <div>
              <p className="nike-kicker">Carrito</p>
              <p className="mt-1 text-lg font-semibold text-ink-950">{summary.itemsLabel}</p>
            </div>
            <button
              ref={closeRef}
              type="button"
              className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-steel-200 bg-white text-ink-950 transition hover:bg-ink-50"
              onClick={closeCart}
              aria-label="Cerrar"
            >
              <IconX />
            </button>
          </div>

          <div className="modal-scroll flex-1 overflow-y-auto p-5">
            {!hasItems ? (
              <div className="rounded-[24px] border border-steel-100 bg-white p-6 text-center">
                <p className="text-lg font-semibold text-ink-950">Tu carrito está vacío</p>
                <p className="mt-2 text-sm text-ink-600">Agregá prendas y enviá el pedido por WhatsApp o mail.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {cartItems.map((it) => (
                  <div
                    key={it.id}
                    className="flex gap-4 rounded-[24px] border border-steel-100 bg-white p-4 shadow-soft"
                  >
                    <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-steel-100">
                      <img
                        src={it.image}
                        alt={it.alt || it.name}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-950">{it.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.35em] text-ink-400">
                        {it.line}
                      </p>
                      {it.size || it.color ? (
                        <p className="mt-2 text-xs font-semibold text-ink-600">
                          {it.size ? `Talle ${it.size}` : null}
                          {it.size && it.color ? " • " : null}
                          {it.color ? `Color ${it.color}` : null}
                        </p>
                      ) : null}
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-steel-200 bg-white px-2 py-1">
                          <button
                            type="button"
                            className="focus-ring inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-950 hover:bg-ink-50"
                            aria-label="Quitar uno"
                            onClick={() => setQty(it.id, Math.max(1, it.qty - 1))}
                          >
                            <IconMinus />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold text-ink-950">
                            {it.qty}
                          </span>
                          <button
                            type="button"
                            className="focus-ring inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-950 hover:bg-ink-50"
                            aria-label="Agregar uno"
                            onClick={() => setQty(it.id, it.qty + 1)}
                          >
                            <IconPlus />
                          </button>
                        </div>

                        <button
                          type="button"
                          className="focus-ring text-xs font-semibold text-ink-600 underline-offset-4 hover:text-ink-950 hover:underline"
                          onClick={() => removeFromCart(it.id)}
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-steel-100 bg-white/85 px-5 py-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink-700">Estimado</p>
              <p className="text-lg font-semibold text-ink-950">{summary.subtotalLabel}</p>
            </div>
            <p className="mt-1 text-xs text-ink-500">
              Confirmamos stock y envío antes de despachar.
            </p>

            <div className="mt-4 grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-[0.35em] text-ink-400" htmlFor="cart-name">
                    Nombre
                  </label>
                  <input
                    id="cart-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="focus-ring mt-2 w-full rounded-2xl border border-steel-200 bg-white px-4 py-3 text-sm text-ink-950 placeholder:text-ink-400"
                    placeholder="Tu nombre (opcional)"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-[0.35em] text-ink-400" htmlFor="cart-area">
                    Zona
                  </label>
                  <input
                    id="cart-area"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="focus-ring mt-2 w-full rounded-2xl border border-steel-200 bg-white px-4 py-3 text-sm text-ink-950 placeholder:text-ink-400"
                    placeholder="CABA / GBA / Interior (opcional)"
                    autoComplete="address-level2"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-[0.35em] text-ink-400" htmlFor="cart-delivery">
                    Entrega
                  </label>
                  <select
                    id="cart-delivery"
                    value={delivery}
                    onChange={(e) => setDelivery(e.target.value)}
                    className="focus-ring mt-2 w-full rounded-2xl border border-steel-200 bg-white px-4 py-3 text-sm text-ink-950"
                  >
                    <option>A coordinar</option>
                    <option>Envío a domicilio</option>
                    <option>Retiro</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-[0.35em] text-ink-400" htmlFor="cart-payment">
                    Pago
                  </label>
                  <select
                    id="cart-payment"
                    value={payment}
                    onChange={(e) => setPayment(e.target.value)}
                    className="focus-ring mt-2 w-full rounded-2xl border border-steel-200 bg-white px-4 py-3 text-sm text-ink-950"
                  >
                    <option>A coordinar</option>
                    <option>Transferencia</option>
                    <option>Tarjeta</option>
                    <option>Efectivo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.35em] text-ink-400" htmlFor="cart-notes">
                  Nota
                </label>
                <input
                  id="cart-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="focus-ring mt-2 w-full rounded-2xl border border-steel-200 bg-white px-4 py-3 text-sm text-ink-950 placeholder:text-ink-400"
                  placeholder="Preferencia de calce, horario, etc. (opcional)"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              <Button
                as={canWhatsApp ? "a" : "button"}
                href={canWhatsApp ? whatsappUrl : undefined}
                target={canWhatsApp ? "_blank" : undefined}
                rel={canWhatsApp ? "noreferrer" : undefined}
                variant="dark"
                className="cta-shine w-full justify-center px-7 py-3"
                onClick={() => {
                  if (!canWhatsApp) {
                    closeCart();
                    return;
                  }
                  setLeadContext?.({ topic: "Checkout: WhatsApp", source: "cart_drawer" });
                }}
                disabled={!canWhatsApp}
              >
                Finalizar pedido por WhatsApp
              </Button>
              <Button
                as={canMail ? "a" : "button"}
                href={canMail ? mailtoUrl : undefined}
                variant="ghost"
                className="w-full justify-center"
                onClick={canMail ? undefined : closeCart}
                disabled={!canMail}
              >
                Enviar por mail
              </Button>
              <Button variant="ghost" type="button" className="w-full justify-center" onClick={closeCart}>
                Seguir agregando
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
