import { useMemo } from "react";
import Button from "../components/Button.jsx";
import Logo from "../components/Logo.jsx";
import MobileMenu from "../components/MobileMenu.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { useLead } from "../context/LeadContext.jsx";

function IconSearch({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M21 21l-4.35-4.35" />
      <circle cx="11" cy="11" r="7" />
    </svg>
  );
}

function IconList({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M9 5h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
      <path d="M7 9H5a2 2 0 0 0-2 2v8" />
      <path d="M10 9h8" />
      <path d="M10 13h8" />
      <path d="M10 17h6" />
    </svg>
  );
}

function IconUser({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  );
}

function NavLink({ href, label, isActive }) {
  return (
    <a
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`focus-ring relative whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-medium transition duration-300 ${
        isActive
          ? "bg-ink-950/5 text-ink-950"
          : "text-ink-700 hover:bg-white/70 hover:text-ink-950"
      }`}
    >
      <span>{label}</span>
      <span
        className={`absolute bottom-[2px] left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-volt-300 transition-all duration-300 ${
          isActive ? "w-7 opacity-100" : "w-0 opacity-0"
        }`}
      />
    </a>
  );
}

function NavAction({ label, isActive, onClick }) {
  return (
    <button
      type="button"
      className={`focus-ring relative whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-medium transition duration-300 ${
        isActive
          ? "bg-ink-950/5 text-ink-950"
          : "text-ink-700 hover:bg-white/70 hover:text-ink-950"
      }`}
      onClick={onClick}
    >
      <span>{label}</span>
      <span
        aria-hidden="true"
        className={`absolute bottom-[2px] left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-volt-300 transition-all duration-300 ${
          isActive ? "w-7 opacity-100" : "w-0 opacity-0"
        }`}
      />
    </button>
  );
}

function SearchButton({ onClick, className = "" }) {
  return (
    <button
      type="button"
      className={`focus-ring group inline-flex h-11 w-[240px] items-center justify-between rounded-full border border-steel-200/70 bg-white/70 px-4 text-sm font-medium text-ink-700 backdrop-blur-xl transition duration-300 hover:bg-white hover:shadow-soft xl:w-[320px] ${className}`}
      onClick={onClick}
      aria-label="Buscar por deporte, talle o prenda"
      title="Buscar (Ctrl/Cmd + K)"
    >
      <span className="flex min-w-0 items-center gap-2">
        <IconSearch className="h-[17px] w-[17px] shrink-0 text-ink-950/65" />
        <span className="truncate">Buscar por deporte, talle o prenda…</span>
      </span>

      <span className="hidden items-center gap-1 rounded-full border border-steel-200/70 bg-white px-2 py-1 text-[10px] font-semibold text-ink-500 xl:inline-flex">
        <span>Ctrl</span>
        <span>K</span>
      </span>
    </button>
  );
}

function IconButton({ label, title, onClick, children, badge, className = "" }) {
  const showBadge = badge !== undefined && badge !== null && badge !== "";

  return (
    <button
      type="button"
      className={`focus-ring relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-steel-200/70 bg-white/55 text-ink-950 backdrop-blur-xl transition duration-300 hover:bg-white hover:shadow-soft active:scale-[0.98] ${className}`}
      aria-label={label}
      title={title}
      onClick={onClick}
    >
      {children}

      {showBadge ? (
        <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-ink-950 px-1 text-[11px] font-semibold text-white shadow-ink">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

export default function Header({
  site,
  links,
  activeHref,
  hasScrolled,
  scrollProgress = 0,
  isMenuOpen,
  setIsMenuOpen,
  onOpenRfq,
  children
}) {
  const { openCatalog, openCart, totals, openFitFinder } = useStore();
  const { setLeadContext } = useLead();
  const safeLinks = useMemo(() => (Array.isArray(links) ? links : []), [links]);
  const equiposHref = safeLinks.find((l) => l?.href === "#empresas")?.href || "#empresas";
  const mobileLinks = useMemo(
    () => [
      {
        label: "Running",
        onClick: () => {
          setLeadContext({ topic: "Menú: Running (mobile)", source: "mobile_menu" });
          openCatalog?.("Shorts");
        }
      },
      {
        label: "Gym",
        onClick: () => {
          setLeadContext({ topic: "Menú: Gym (mobile)", source: "mobile_menu" });
          openCatalog?.("Calzas");
        }
      },
      { href: equiposHref, label: "Equipos" },
      {
        label: "Ofertas",
        onClick: () => {
          setLeadContext({ topic: "Menú: Ofertas/Drops (mobile)", source: "mobile_menu" });
          openCatalog?.("Todos");
          window.location.hash = "#packs";
        }
      }
    ],
    [equiposHref, openCatalog, openFitFinder, setLeadContext]
  );

  return (
    <header className="relative overflow-x-hidden overflow-y-visible bg-ink-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-mesh-hero-dark"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-dark opacity-70 [background-size:36px_36px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-ink-vignette"
      />

      <nav className="sticky top-0 z-50" aria-label="Navegación principal">
        <div
          className={`transition duration-300 ${
            hasScrolled ? "border-b border-steel-200/70 bg-white/80 backdrop-blur-xl" : ""
          }`}
        >
          <div className="w-full px-4 py-3 sm:px-6 md:px-10 lg:px-14 2xl:px-20">
            <div
              className={`relative flex items-center justify-between gap-3 rounded-[22px] border border-steel-200/70 bg-white/60 px-3 py-2.5 shadow-soft backdrop-blur-xl transition duration-300 sm:gap-4 sm:px-4 sm:py-3 md:px-5 ${
                hasScrolled ? "bg-white/78 shadow-[0_18px_55px_rgba(20,35,60,0.10)]" : ""
              }`}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-5 -top-px hidden h-px bg-volt-300 md:block"
                style={{
                  clipPath: `inset(0 ${
                    (1 - Math.max(0, Math.min(1, scrollProgress))) * 100
                  }% 0 0)`,
                }}
              />

              <div className="shrink-0">
                <Logo
                  mark={site.mark}
                  name={site.brand}
                  tagline={site.tagline}
                  compact
                  className="shrink-0"
                />
              </div>

              <div
                className="hidden min-w-0 flex-1 items-center justify-center lg:flex"
                aria-label="Secciones"
              >
                <div className="flex min-w-0 items-center gap-1.5 xl:gap-2">
                  <NavAction
                    label="Running"
                    isActive={activeHref === "#productos"}
                    onClick={() => {
                      setLeadContext({ topic: "Menú: Running", source: "header_nav" });
                      openCatalog?.("Shorts");
                    }}
                  />
                  <NavAction
                    label="Gym"
                    isActive={activeHref === "#productos"}
                    onClick={() => {
                      setLeadContext({ topic: "Menú: Gym", source: "header_nav" });
                      openCatalog?.("Calzas");
                    }}
                  />
                  <NavLink href={equiposHref} label="Equipos" isActive={activeHref === equiposHref} />
                  <NavAction
                    label="Ofertas"
                    isActive={activeHref === "#packs"}
                    onClick={() => {
                      setLeadContext({ topic: "Menú: Ofertas/Drops", source: "header_nav" });
                      openCatalog?.("Todos");
                      window.location.hash = "#packs";
                    }}
                  />
                </div>
              </div>

              <div className="hidden shrink-0 items-center gap-2 lg:flex" aria-label="Acciones">
                <IconButton
                  label="Ayuda"
                  title="Ayuda"
                  onClick={() => {
                    setLeadContext({ topic: "Ayuda", source: "header_icon" });
                    window.location.hash = "#contacto";
                  }}
                >
                  <IconUser className="h-[18px] w-[18px]" />
                </IconButton>

                <IconButton
                  label="Abrir carrito"
                  title="Ver carrito"
                  onClick={openCart}
                  badge={totals.itemsCount ? String(totals.itemsCount) : ""}
                >
                  <IconList className="h-[18px] w-[18px]" />
                </IconButton>

                <IconButton
                  label="Buscar"
                  title="Buscar"
                  onClick={() => openCatalog("Todos")}
                  className="xl:hidden"
                >
                  <IconSearch className="h-[18px] w-[18px]" />
                </IconButton>

                <SearchButton className="hidden xl:inline-flex" onClick={() => openCatalog("Todos")} />

                <div className="ml-1">
                  <Button
                    variant="accent"
                    className="cta-shine px-5 py-3 xl:px-6"
                    type="button"
                    onClick={() => {
                      setLeadContext({ topic: "CTA: Encontrar mi talle", source: "header_cta" });
                      openFitFinder?.();
                    }}
                  >
                    Encontrar mi talle
                  </Button>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:hidden">
                <IconButton
                  label="Carrito"
                  title="Carrito"
                  onClick={openCart}
                  badge={totals.itemsCount ? String(totals.itemsCount) : ""}
                >
                  <IconList className="h-[18px] w-[18px]" />
                </IconButton>

                <button
                  type="button"
                  className="focus-ring inline-flex h-11 items-center justify-center rounded-2xl border border-steel-200/80 bg-white/55 px-4 text-sm font-semibold text-ink-950 backdrop-blur-xl transition duration-300 hover:bg-white active:scale-[0.98]"
                  aria-label="Abrir menú"
                  aria-expanded={isMenuOpen ? "true" : "false"}
                  aria-controls="mobile-menu"
                  onClick={() => setIsMenuOpen(true)}
                >
                  Menú
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu
        open={isMenuOpen}
        links={mobileLinks}
        onClose={() => setIsMenuOpen(false)}
        onOpenCatalog={() => openCatalog?.("Todos")}
        onOpenFitFinder={() => openFitFinder?.()}
      />
      {children}
    </header>
  );
}
