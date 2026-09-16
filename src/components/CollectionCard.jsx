import { useStore } from "../context/StoreContext.jsx";
import { useLead } from "../context/LeadContext.jsx";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";

function ArrowRight({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h12" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

function Icon({ name, className = "" }) {
  // Minimal icons (store-like, not "illustrative")
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true
  };

  if (name === "wrench") {
    return (
      <svg {...common}>
        <path d="M21 3l-4 4" />
        <path d="M7 17l-4 4" />
        <path d="M8.5 8.5l7 7" />
        <path d="M14 5a4 4 0 0 0-5.7 3.6L3 14l3 3 5.4-5.3A4 4 0 0 0 15 10" />
      </svg>
    );
  }
  if (name === "shield") {
    return (
      <svg {...common}>
        <path d="M12 2l8 4v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4z" />
        <path d="M9 12l2 2 4-5" />
      </svg>
    );
  }
  if (name === "disc") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="2" />
        <path d="M12 4v3" />
        <path d="M20 12h-3" />
        <path d="M12 20v-3" />
        <path d="M4 12h3" />
      </svg>
    );
  }
  if (name === "shoe") {
    return (
      <svg {...common}>
        <path d="M3 15c5 0 7-2 9-6 2 3 5 5 9 5v3c0 2-2 3-4 3H6c-2 0-3-1-3-3v-2z" />
        <path d="M12 9l2 1" />
        <path d="M10 11l2 1" />
      </svg>
    );
  }
  if (name === "bolt") {
    return (
      <svg {...common}>
        <path d="M13 2L4 14h7l-1 8 10-14h-7l0-6z" />
      </svg>
    );
  }
  if (name === "mountain") {
    return (
      <svg {...common}>
        <path d="M3 19l7-12 4 7 2-3 5 8H3z" />
        <path d="M10 7l2 3" />
      </svg>
    );
  }
  // bag
  return (
    <svg {...common}>
      <path d="M7 8c0-2 2-4 5-4s5 2 5 4" />
      <path d="M5 9h14l1 11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2L5 9z" />
      <path d="M9 12v1" />
      <path d="M15 12v1" />
    </svg>
  );
}

function hexToRgb(hex) {
  const value = String(hex || "").replace("#", "").trim();
  const full = value.length === 3 ? value.split("").map((c) => c + c).join("") : value;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return { r: 183, g: 255, b: 26 };
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function chipsFor(title) {
  const t = String(title || "").toLowerCase();
  if (t.includes("training")) return ["Básicos", "Calce regular", "Gym"];
  if (t.includes("running")) return ["Liviano", "Transpirable", "Running"];
  if (t.includes("studio")) return ["Soporte", "Flex", "Studio"];
  if (t.includes("outdoor")) return ["Corta viento", "Abrigo", "Trail"];
  return ["Stock", "Nuevo", "Top"];
}

function iconFor(title) {
  const t = String(title || "").toLowerCase();
  if (t.includes("training")) return "disc";
  if (t.includes("running")) return "shoe";
  if (t.includes("studio")) return "shield";
  if (t.includes("outdoor")) return "mountain";
  return "bag";
}

export default function CollectionCard({ item, layout = "standard" }) {
  const { openCatalog } = useStore();
  const { setLeadContext } = useLead();
  const reduceMotion = usePrefersReducedMotion();
  const isFeatured = layout === "featured";
  const isWide = layout === "wide";
  const defaultLine = item?.defaultLine || "Todos";

  const accent = item?.accent || "#B7FF1A";
  const { r, g, b } = hexToRgb(accent);

  const titleClass = isFeatured ? "text-4xl sm:text-5xl" : isWide ? "text-4xl" : "text-3xl";

  return (
    <button
      type="button"
      aria-label={`Ver categoría ${item.title}`}
      className="focus-ring group relative h-full min-h-[240px] overflow-hidden rounded-[28px] border border-white/20 bg-ink-950/35 text-left shadow-[0_22px_70px_rgba(10,11,18,0.18)] backdrop-blur-md transition duration-300 ease-out-quint hover:border-white/30 active:translate-y-0 sm:min-h-[260px]"
      style={{
        "--accent": accent,
        "--accent-rgb": `${r} ${g} ${b}`,
        "--mx": "30%",
        "--my": "30%",
        transition: "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: "transform"
      }}
      onMouseMove={(e) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        el.style.setProperty("--mx", `${(px * 100).toFixed(2)}%`);
        el.style.setProperty("--my", `${(py * 100).toFixed(2)}%`);
        if (!reduceMotion) {
          const rotateY = (px - 0.5) * 6;
          const rotateX = -(py - 0.5) * 6;
          el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.setProperty("--mx", "30%");
        el.style.setProperty("--my", "30%");
        el.style.transform = "";
      }}
      onClick={() => {
        setLeadContext({ topic: `Categoría: ${item.title}`, source: "category_card" });
        openCatalog(defaultLine);
      }}
    >
      <div className="absolute inset-0">
        <img
          src={item.image}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.92] transition duration-650 ease-out-quint group-hover:scale-[1.06] group-hover:opacity-100"
        />

        <div
          aria-hidden="true"
          className={`absolute inset-0 bg-gradient-to-br ${item.tone} opacity-40 transition duration-650 ease-out-quint group-hover:opacity-55`}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/14 to-transparent"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-0 transition duration-500 ease-out-quint group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(900px circle at var(--mx) var(--my), rgb(var(--accent-rgb) / 0.16), transparent 46%), radial-gradient(620px circle at 80% 18%, rgba(255,255,255,0.08), transparent 56%)"
          }}
        />

        <div aria-hidden="true" className="absolute inset-0 collection-noise opacity-60" />
      </div>

      <div className="relative flex h-full flex-col justify-between p-7 sm:p-8">
        <div className="flex items-start justify-between gap-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="glass-pill">
              <span className="inline-flex items-center gap-2">
                <Icon name={iconFor(item.title)} className="h-4 w-4 text-white/80" />
                <span>{item.tag}</span>
              </span>
            </span>
            {item?.badge ? <span className="glass-pill">{item.badge}</span> : null}
          </div>

          <span className="glass-pill">2026</span>
        </div>

        <div className="max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.55em] text-white/60">
            Categoría
          </p>

          <h3 className={`mt-3 clamp-2 font-display font-semibold tracking-[-0.03em] text-white ${titleClass}`}>
            {item.title}
          </h3>

          <p className="mt-3 clamp-2 max-w-md text-sm leading-relaxed text-white/75">{item.description}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {chipsFor(item.title).map((c) => (
              <span key={c} className="glass-chip">
                {c}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white/90 shadow-[0_16px_50px_rgba(0,0,0,0.16)] backdrop-blur">
              Ver categoría
              <ArrowRight className="h-4 w-4 opacity-85 transition duration-300 group-hover:translate-x-0.5" />
            </span>

            <span className="text-xs font-semibold text-white/60">
              Curado para {item.title.toLowerCase()}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
