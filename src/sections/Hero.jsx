import { lazy, Suspense, useMemo, useRef, useState } from "react";
import Button from "../components/Button.jsx";
import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";
import HeroVisual from "../components/HeroVisual.jsx";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";
import { useMediaQuery } from "../hooks/useMediaQuery.js";
import { useStore } from "../context/StoreContext.jsx";
import { useLead } from "../context/LeadContext.jsx";

function IconArrowRight({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h12" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

function StepPill({ number, label, active, done }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span
        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition ${
          active
            ? "border-volt-300 bg-volt-300 text-ink-950"
            : done
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-steel-200 bg-white text-ink-500"
        }`}
      >
        {number}
      </span>
      <span className={`truncate-1 text-sm font-semibold ${active ? "text-ink-950" : "text-ink-600"}`}>
        {label}
      </span>
    </div>
  );
}

function OptionCard({ title, subtitle, selected, onClick }) {
  return (
    <button
      type="button"
      className={`focus-ring flex h-full flex-col rounded-2xl border px-4 py-4 text-left transition duration-300 ${
        selected
          ? "border-ink-950 bg-ink-50 shadow-sm"
          : "border-steel-200 bg-white hover:border-steel-300 hover:bg-ink-50/30"
      }`}
      aria-pressed={selected ? "true" : "false"}
      onClick={onClick}
    >
      <p className="truncate-1 text-sm font-semibold text-ink-950">{title}</p>
      <p className="clamp-2 mt-1 text-sm text-ink-600">{subtitle}</p>
    </button>
  );
}

function ProofPill({ label, value }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-ink-950/10 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 shadow-[0_6px_18px_rgba(15,23,42,0.04)]">
      <span className="text-ink-500">{label}</span>
      <span className="text-ink-950">{value}</span>
    </span>
  );
}

function SampleProductTile({ product }) {
  if (!product) return null;
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-steel-200/70 bg-white/80 p-3">
      <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-steel-200/70 bg-white">
        <img
          src={product.image}
          alt={product.alt || product.name}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div aria-hidden="true" className={`absolute inset-0 bg-gradient-to-br ${product.tone} opacity-35`} />
      </div>
      <div className="min-w-0">
        <p className="truncate-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink-500">
          {product.line}
        </p>
        <p className="clamp-2 mt-1 text-sm font-semibold leading-snug text-ink-950">{product.name}</p>
      </div>
    </div>
  );
}

const Scene3D = lazy(() => import("../components/Scene3D.jsx"));

function recommendSize({ heightCm, weightKg, fit }) {
  const h = Number(heightCm);
  const w = Number(weightKg);
  if (!Number.isFinite(h) || !Number.isFinite(w) || h <= 0 || w <= 0) return "";

  let base = "M";
  if (w < 60) base = h < 170 ? "S" : "M";
  else if (w < 72) base = "M";
  else if (w < 85) base = "L";
  else base = "XL";

  const fitLower = String(fit || "").toLowerCase();
  if (fitLower.includes("ajust")) {
    if (base === "XL") base = "L";
    else if (base === "L") base = "M";
    else if (base === "M") base = "S";
  }
  if (fitLower.includes("over")) {
    if (base === "S") base = "M";
    else if (base === "M") base = "L";
    else if (base === "L") base = "XL";
  }
  return base;
}

export default function Hero({ products = [], proof, rating }) {
  const reduceMotion = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { openCatalog, openFitFinder, fitProfile, setFitProfile } = useStore();
  const { setLeadContext } = useLead();

  const parallaxRef = useRef(null);
  const flowRef = useRef(null);
  const sceneMouseRef = useRef({ x: 0, y: 0 });

  const [step, setStep] = useState(1);
  const [sport, setSport] = useState("");
  const [fitPref, setFitPref] = useState(() => fitProfile?.fit || "Regular");
  const [heightCm, setHeightCm] = useState(() => fitProfile?.heightCm || "");
  const [weightKg, setWeightKg] = useState(() => fitProfile?.weightKg || "");
  const [flowPulse, setFlowPulse] = useState(false);

  const metrics = useMemo(() => {
    const list = Array.isArray(proof?.metrics) ? proof.metrics : [];
    const get = (label, fallback) => list.find((m) => m?.label === label) || fallback;
    return {
      pedidos: get("Pedidos", { label: "Pedidos", value: "14.800+" }),
      entrega: get("Entrega", { label: "Entrega", value: "24–72h" }),
      soporte: get("Soporte", { label: "Soporte", value: "<2h" })
    };
  }, [proof?.metrics]);

  const sportOptions = useMemo(
    () => [
      { key: "running", label: "Running", hint: "Ligero, respirable y ágil", line: "Shorts" },
      { key: "gym", label: "Gym", hint: "Soporte, flexibilidad y ajuste", line: "Calzas" },
      { key: "outdoor", label: "Outdoor", hint: "Capas, abrigo y resistencia", line: "Camperas" }
    ],
    []
  );

  const fitOptions = useMemo(
    () => [
      { key: "Ajustado", label: "Ajustado", hint: "Más ceñido al cuerpo" },
      { key: "Regular", label: "Regular", hint: "Equilibrado y cómodo" },
      { key: "Oversize", label: "Oversize", hint: "Más suelto y relajado" }
    ],
    []
  );

  const selectedSport = sportOptions.find((o) => o.key === sport) || null;

  const computedSize = useMemo(
    () => recommendSize({ heightCm, weightKg, fit: fitPref || "Regular" }),
    [fitPref, heightCm, weightKg]
  );

  const recommendedSize = computedSize || String(fitProfile?.recommendedSize || "");
  const hasExactSize = Boolean(recommendedSize);

  const sampleProducts = useMemo(() => {
    const key = selectedSport?.key;
    if (!key) return (Array.isArray(products) ? products : []).slice(0, 2);

    const match = (Array.isArray(products) ? products : [])
      .filter((p) => Array.isArray(p?.disciplines) && p.disciplines.includes(key))
      .slice(0, 2);

    return match.length ? match : (Array.isArray(products) ? products : []).slice(0, 2);
  }, [products, selectedSport?.key]);

  const onOpenFitFinder = () => {
    setLeadContext({
      topic: `Hero: Encontrar mi talle${selectedSport?.label ? ` (${selectedSport.label})` : ""} • Fit ${fitPref || "Regular"}`,
      source: "hero_primary_cta"
    });

    setFitProfile?.((prev) => ({
      ...(prev || {}),
      heightCm,
      weightKg,
      fit: fitPref || "Regular",
      recommendedSize: computedSize || prev?.recommendedSize || ""
    }));

    openFitFinder?.();
  };

  const onPrimary = () => {
    setLeadContext({ topic: "Hero: Encontrar mi talle", source: "hero_start" });
    setStep(1);
    setFlowPulse(true);
    window.setTimeout(() => setFlowPulse(false), 650);
    flowRef.current?.scrollIntoView?.({ behavior: "smooth", block: "center" });
  };

  const onSecondary = () => {
    setLeadContext({ topic: "Hero: Ver catálogo", source: "hero_secondary_cta" });
    openCatalog?.(selectedSport?.line || "Todos");
  };

  return (
    <section className="section relative overflow-hidden pb-20 pt-8 sm:pt-10 lg:pb-28 lg:pt-14">
      <Container className="relative grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
        <div className="space-y-7 lg:pt-2">
          <Reveal as="div" variant="blur" delayMs={0} className="inline-flex max-w-full">
            <span className="chip !rounded-2xl text-left sm:!rounded-full">
              Encontrá tu talle en menos de 1 min • sin devoluciones
            </span>
          </Reveal>

          <Reveal as="div" variant="blur" delayMs={50} className="flex flex-wrap items-center gap-2">
            {rating?.rating ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-950/10 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 shadow-[0_6px_18px_rgba(15,23,42,0.04)]">
                <span aria-hidden="true" className="text-volt-500">★</span>
                <span className="text-ink-950">{Number(rating.rating).toFixed(1)}</span>
                <span className="text-ink-500">
                  ({Number(rating.reviews || 0).toLocaleString("es-AR")}+ reseñas)
                </span>
              </span>
            ) : null}
            <ProofPill label={metrics.pedidos.label} value={metrics.pedidos.value} />
            <ProofPill label={metrics.entrega.label} value={metrics.entrega.value} />
            <ProofPill label={metrics.soporte.label} value={metrics.soporte.value} />
          </Reveal>

          <Reveal as="div" variant="blur" delayMs={110}>
            <h1 className="nike-h1 max-w-[16ch] text-white">
              ¿Cansado de errarle al talle?
              <span className="block">
                Encontralo{" "}
                <span className="relative inline-block text-ink-950">
                  <span className="relative z-10">sin errores</span>
                  <span
                    aria-hidden="true"
                    className="absolute -inset-x-1.5 bottom-[0.04em] -z-0 h-[0.55em] rounded-[10px] bg-volt-300"
                  />
                </span>{" "}
                en 1 minuto.
              </span>
            </h1>
          </Reveal>

          <Reveal as="div" variant="blur" delayMs={170}>
            <p className="max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              Respondé 3 preguntas y encontrá tu talle exacto para comprar con más confianza y evitar devoluciones.
            </p>
          </Reveal>

          <Reveal as="div" variant="blur" delayMs={220} className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Button
                variant="accent"
                type="button"
                className="cta-shine inline-flex w-full items-center justify-center gap-2 sm:w-auto"
                onClick={onPrimary}
              >
                Encontrar mi talle
                <IconArrowRight className="h-[18px] w-[18px] opacity-90 transition duration-300 group-hover:translate-x-1" />
              </Button>

              <Button
                variant="ghost"
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 border-white/25 bg-white/5 text-white hover:border-white/40 hover:bg-white/10 hover:text-white sm:w-auto"
                onClick={onSecondary}
              >
                Ver catálogo
                <IconArrowRight className="h-[18px] w-[18px] opacity-60 transition duration-300 group-hover:translate-x-1 group-hover:opacity-90" />
              </Button>
            </div>

            <p className="text-sm font-semibold text-white/60">
              {hasExactSize ? (
                <>
                  Tu talle guardado: <span className="text-white">{recommendedSize}</span>
                </>
              ) : (
                <>Sin registro • guardamos tu preferencia en este dispositivo</>
              )}
            </p>
          </Reveal>

          <Reveal as="div" variant="blur" delayMs={260}>
            <div
              ref={flowRef}
              className={`max-w-2xl rounded-[30px] border border-white/10 bg-white p-5 shadow-ink transition ${
                flowPulse ? "ring-2 ring-volt-300/50" : ""
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-5">
                  <StepPill number="1" label="Deporte" active={step === 1} done={step > 1} />
                  <StepPill number="2" label="Fit" active={step === 2} done={step > 2} />
                  <StepPill number="3" label="Resultado" active={step === 3} done={false} />
                </div>

                <p className="truncate-1 text-xs font-semibold text-ink-500">
                  Tiempo estimado: &lt; 1 min
                </p>
              </div>

              <div className="relative mt-5 min-h-[250px]">
                <div
                  className={`transition duration-450 ease-out-quint ${
                    step === 1 ? "opacity-100 translate-y-0" : "pointer-events-none absolute inset-0 translate-y-2 opacity-0"
                  }`}
                >
                  <p className="text-sm font-semibold text-ink-950">Paso 1 — Elegí tu disciplina</p>
                  <p className="mt-1 text-sm text-ink-600">Usamos esto para sugerirte prendas más relevantes.</p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {sportOptions.map((o) => (
                      <OptionCard
                        key={o.key}
                        title={o.label}
                        subtitle={o.hint}
                        selected={sport === o.key}
                        onClick={() => {
                          setSport(o.key);
                          setStep(2);
                          setLeadContext({ topic: `Hero flow: deporte ${o.label}`, source: "hero_flow" });
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div
                  className={`transition duration-450 ease-out-quint ${
                    step === 2 ? "opacity-100 translate-y-0" : "pointer-events-none absolute inset-0 translate-y-2 opacity-0"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-ink-950">Paso 2 — Elegí cómo te gusta el calce</p>
                      <p className="mt-1 text-sm text-ink-600">Así ajustamos mejor la recomendación final.</p>
                    </div>

                    <button
                      type="button"
                      className="focus-ring text-xs font-semibold text-ink-600 underline decoration-ink-950/20 underline-offset-4 hover:text-ink-950"
                      onClick={() => setStep(1)}
                    >
                      Cambiar deporte
                    </button>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {fitOptions.map((o) => (
                      <OptionCard
                        key={o.key}
                        title={o.label}
                        subtitle={o.hint}
                        selected={fitPref === o.key}
                        onClick={() => {
                          setFitPref(o.key);
                          setFitProfile?.((prev) => ({ ...(prev || {}), fit: o.key }));
                          setStep(3);
                          setLeadContext({ topic: `Hero flow: fit ${o.key}`, source: "hero_flow" });
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div
                  className={`transition duration-450 ease-out-quint ${
                    step === 3 ? "opacity-100 translate-y-0" : "pointer-events-none absolute inset-0 translate-y-2 opacity-0"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-ink-950">Paso 3 — Tu recomendación</p>
                      <p className="mt-1 text-sm text-ink-600">Completá tus datos para ver un talle más preciso.</p>
                    </div>

                    <button
                      type="button"
                      className="focus-ring text-xs font-semibold text-ink-600 underline decoration-ink-950/20 underline-offset-4 hover:text-ink-950"
                      onClick={() => setStep(2)}
                    >
                      Cambiar fit
                    </button>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-steel-200 bg-white p-4">
                      <p className="nike-kicker">Disciplina</p>
                      <p className="mt-2 text-lg font-semibold text-ink-950">{selectedSport?.label || "—"}</p>
                      <p className="mt-1 text-sm text-ink-600">
                        Esto define el contexto del catálogo sugerido.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-steel-200 bg-white p-4">
                      <p className="nike-kicker">Tu talle recomendado</p>
                      <p className="mt-2 text-4xl font-semibold tracking-tight text-ink-950">
                        {recommendedSize || "—"}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div>
                          <label
                            className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ink-500"
                            htmlFor="hero-height"
                          >
                            Altura
                          </label>
                          <input
                            id="hero-height"
                            inputMode="numeric"
                            className="focus-ring mt-2 w-full rounded-2xl border border-steel-200 bg-white px-3 py-2 text-sm font-semibold text-ink-950 placeholder:text-ink-400"
                            placeholder="172"
                            value={heightCm}
                            onChange={(e) => setHeightCm(e.target.value)}
                            autoComplete="off"
                          />
                        </div>

                        <div>
                          <label
                            className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ink-500"
                            htmlFor="hero-weight"
                          >
                            Peso
                          </label>
                          <input
                            id="hero-weight"
                            inputMode="numeric"
                            className="focus-ring mt-2 w-full rounded-2xl border border-steel-200 bg-white px-3 py-2 text-sm font-semibold text-ink-950 placeholder:text-ink-400"
                            placeholder="68"
                            value={weightKg}
                            onChange={(e) => setWeightKg(e.target.value)}
                            autoComplete="off"
                          />
                        </div>
                      </div>

                      <p className="mt-2 text-sm text-ink-600">
                        {computedSize
                          ? "Listo: calculamos un talle estimado con tus datos."
                          : hasExactSize
                            ? "Tu talle ya está guardado para comprar más rápido."
                            : "Completá altura y peso para verlo exacto."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-ink-600">
                      Algunos talles tienen stock limitado. Mejor asegurarlo antes de comprar.
                    </p>

                    <button
                      type="button"
                      className="focus-ring inline-flex items-center gap-2 rounded-full border border-steel-200 bg-white px-3 py-2 text-xs font-semibold text-ink-900 transition hover:bg-ink-50"
                      onClick={onOpenFitFinder}
                    >
                      Calcular mi talle
                      <IconArrowRight className="h-4 w-4 opacity-70" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal as="p" variant="blur" delayMs={320} className="text-sm font-semibold text-white/55">
            Entrega rápida en todo el país • soporte real cuando lo necesitás
          </Reveal>
        </div>

        <Reveal
          as="div"
          variant="blur"
          delayMs={150}
          className="relative mx-auto w-full max-w-[520px] lg:mx-0 lg:ml-auto lg:mt-6 lg:max-w-[520px]"
        >
          <div
            ref={parallaxRef}
            className="relative"
            onMouseMove={(e) => {
              if (reduceMotion) return;
              const el = parallaxRef.current;
              if (!el) return;
              const rect = el.getBoundingClientRect();
              const nx = (e.clientX - rect.left) / rect.width - 0.5;
              const ny = (e.clientY - rect.top) / rect.height - 0.5;
              const x = nx * 10;
              const y = ny * 10;
              el.style.setProperty("--px", `${x.toFixed(2)}px`);
              el.style.setProperty("--py", `${y.toFixed(2)}px`);
              sceneMouseRef.current.x = nx * 2;
              sceneMouseRef.current.y = ny * 2;
            }}
            onMouseLeave={() => {
              const el = parallaxRef.current;
              if (!el) return;
              el.style.setProperty("--px", "0px");
              el.style.setProperty("--py", "0px");
              sceneMouseRef.current.x = 0;
              sceneMouseRef.current.y = 0;
            }}
            style={{ "--px": "0px", "--py": "0px" }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                transform: reduceMotion ? undefined : "translate3d(var(--px), var(--py), 0)"
              }}
              aria-hidden="true"
            >
              <HeroVisual />
            </div>

            {!reduceMotion && isDesktop ? (
              <Suspense fallback={null}>
                <Scene3D
                  mouseRef={sceneMouseRef}
                  variant="core"
                  className="pointer-events-none absolute -inset-16 opacity-80 sm:-inset-24 lg:-inset-28"
                />
              </Suspense>
            ) : null}

            <div aria-hidden="true" className="pointer-events-none absolute -inset-10 rounded-[40px] bg-volt-300/18 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute -inset-10 translate-x-8 translate-y-8 rounded-[40px] bg-ember-500/10 blur-3xl" />

            <div className="relative z-10 overflow-hidden rounded-[32px] border border-white/10 bg-white shadow-ink">
              <div className="flex items-center justify-between gap-4 p-5">
                <div className="min-w-0">
                  <p className="nike-kicker">Recomendación en vivo</p>
                  <p className="mt-1 truncate text-lg font-semibold text-ink-950">
                    {hasExactSize ? `Tu talle sugerido: ${recommendedSize}` : "Tu talle sugerido: —"}
                  </p>
                </div>

                <span className="rounded-full border border-steel-200/70 bg-white px-3 py-1 text-xs font-semibold text-ink-700">
                  Fit: {fitPref || "Regular"}
                </span>
              </div>

              <div className="px-5 pb-5">
                <div className="rounded-3xl border border-steel-200/70 bg-ink-50/60 p-5">
                  <p className="nike-kicker">Producto sugerido</p>
                  <p className="mt-2 text-xl font-semibold text-ink-950">
                    {selectedSport?.label || "Elegí un deporte"}
                  </p>
                  <p className="mt-1 text-sm text-ink-600">
                    {hasExactSize
                      ? "Ya podés ver prendas alineadas a tu talle y disciplina."
                      : "Completá el flujo para recibir una recomendación más precisa."}
                  </p>

                  <div className="mt-4 grid gap-3">
                    <SampleProductTile product={sampleProducts[0]} />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      className="focus-ring inline-flex items-center gap-2 rounded-full border border-steel-200 bg-white px-3 py-2 text-xs font-semibold text-ink-900 transition hover:bg-ink-50"
                      onClick={onSecondary}
                    >
                      Ver catálogo sugerido
                      <IconArrowRight className="h-4 w-4 opacity-70" />
                    </button>

                    <span className="truncate-1 text-xs font-semibold text-ink-500">
                      {selectedSport?.line ? `Filtro sugerido: ${selectedSport.line}` : "Filtro sugerido: Todos"}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-sm text-ink-600">
                  Guardá tu talle y usalo después en el catálogo para comprar más rápido.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
