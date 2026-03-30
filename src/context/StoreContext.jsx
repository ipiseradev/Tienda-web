import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const StoreContext = createContext(null);

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function parsePrice(price) {
  // Accepts "$149.900" or "149.900"
  const s = String(price || "").replace(/[^\d]/g, "");
  const n = Number(s || 0);
  return Number.isFinite(n) ? n : 0;
}

function formatPriceARS(n) {
  const value = Number(n || 0);
  // Keep it simple (no Intl to avoid environment issues)
  const s = Math.round(value).toString();
  const withDots = s.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `$${withDots}`;
}

export function StoreProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    const raw = localStorage.getItem("cart_v1");
    const parsed = raw ? safeParse(raw) : null;
    if (Array.isArray(parsed)) return parsed;
    return [];
  });
  const [fitFinderOpen, setFitFinderOpen] = useState(false);
  const [fitProfile, setFitProfile] = useState(() => {
    const raw = localStorage.getItem("fit_profile_v1");
    const parsed = raw ? safeParse(raw) : null;
    if (parsed && typeof parsed === "object") return parsed;
    return { heightCm: "", weightKg: "", fit: "Regular", recommendedSize: "" };
  });

  const [catalogOpen, setCatalogOpen] = useState(false);
  const [catalogInitialLine, setCatalogInitialLine] = useState("Todos");
  const [catalogInitialDiscipline, setCatalogInitialDiscipline] = useState("Todas");

  const [productSheetOpen, setProductSheetOpen] = useState(false);
  const [productSheetItem, setProductSheetItem] = useState(null);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const openFitFinder = useCallback(() => setFitFinderOpen(true), []);
  const closeFitFinder = useCallback(() => setFitFinderOpen(false), []);

  const openCatalog = useCallback((arg = "Todos") => {
    if (arg && typeof arg === "object") {
      setCatalogInitialLine(arg.line || "Todos");
      setCatalogInitialDiscipline(arg.discipline || "Todas");
      setCatalogOpen(true);
      return;
    }
    setCatalogInitialLine(arg || "Todos");
    setCatalogInitialDiscipline("Todas");
    setCatalogOpen(true);
  }, []);
  const closeCatalog = useCallback(() => setCatalogOpen(false), []);

  const openProductSheet = useCallback((product) => {
    setProductSheetItem(product || null);
    setProductSheetOpen(true);
  }, []);
  const closeProductSheet = useCallback(() => setProductSheetOpen(false), []);

  useEffect(() => {
    localStorage.setItem("fit_profile_v1", JSON.stringify(fitProfile));
  }, [fitProfile]);

  useEffect(() => {
    localStorage.setItem("cart_v1", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((product, qty = 1, options = {}) => {
    if (!product) return;
    const baseId = product.id || product.name;
    const size = options?.size ? String(options.size) : "";
    const color = options?.color ? String(options.color) : "";
    const id = `${baseId}::${size}::${color}`;
    const priceValue = parsePrice(product.price);
    const normalized = {
      id,
      baseId,
      name: product.name,
      line: product.line,
      image: product.image,
      alt: product.alt,
      price: product.price,
      priceValue,
      size,
      color,
      qty: Math.max(1, Number(qty || 1))
    };

    setCartItems((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx === -1) return [...prev, normalized];
      const copy = [...prev];
      copy[idx] = { ...copy[idx], qty: copy[idx].qty + normalized.qty };
      return copy;
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const setQty = useCallback((id, qty) => {
    const q = Math.max(1, Number(qty || 1));
    setCartItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: q } : p)));
  }, []);

  const totals = useMemo(() => {
    const itemsCount = cartItems.reduce((acc, it) => acc + (it.qty || 0), 0);
    const subtotal = cartItems.reduce((acc, it) => acc + (it.priceValue || 0) * (it.qty || 0), 0);
    return { itemsCount, subtotal, subtotalLabel: formatPriceARS(subtotal) };
  }, [cartItems]);

  const value = useMemo(
    () => ({
      cartOpen,
      cartItems,
      totals,
      openCart,
      closeCart,
      addToCart,
      removeFromCart,
      setQty,
      fitFinderOpen,
      openFitFinder,
      closeFitFinder,
      fitProfile,
      setFitProfile,
      catalogOpen,
      catalogInitialLine,
      catalogInitialDiscipline,
      openCatalog,
      closeCatalog,
      productSheetOpen,
      productSheetItem,
      openProductSheet,
      closeProductSheet
    }),
    [
      addToCart,
      cartItems,
      cartOpen,
      closeFitFinder,
      catalogInitialLine,
      catalogInitialDiscipline,
      catalogOpen,
      closeCart,
      closeCatalog,
      closeProductSheet,
      openCart,
      openFitFinder,
      openCatalog,
      openProductSheet,
      fitFinderOpen,
      fitProfile,
      productSheetItem,
      productSheetOpen,
      removeFromCart,
      setQty,
      setFitProfile,
      totals
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within <StoreProvider>");
  return ctx;
}
