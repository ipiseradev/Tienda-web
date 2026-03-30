import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";
import { useLead } from "../context/LeadContext.jsx";
import { useStore } from "../context/StoreContext.jsx";

function IconBolt({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13 2L4 14h7l-1 8 9-12h-7l1-8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function toneForTitle(title) {
  const t = String(title || "").toLowerCase();
  if (t.includes("run")) return "from-volt-200/70 via-white to-volt-50/40 text-volt-700";
  if (t.includes("gym") || t.includes("fuerza")) return "from-ember-200/50 via-white to-brass-50/40 text-ember-700";
  return "from-steel-200/55 via-white to-ink-50/40 text-ink-700";
}

function disciplineForTitle(title) {
  const t = String(title || "").toLowerCase();
  if (t.includes("run")) return "running";
  if (t.includes("gym") || t.includes("fuerza")) return "gym";
  return "outdoor";
}

function suggestedLineForDiscipline(discipline) {
  const d = String(discipline || "").toLowerCase();
  if (d === "running") return "Shorts";
  if (d === "gym") return "Calzas";
  return "Camperas";
}

export default function Industries({ industries }) {
  const { setLeadContext } = useLead();
  const { openCatalog } = useStore();
  return (
    <section className="section surface-soft">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <Reveal as="div" className="space-y-6">
          <p className="eyebrow">Segmentos</p>
          <h2 className="section-title">Todo lo que necesitás, según tu disciplina.</h2>
          <p className="section-subtitle">
            Running, gym u outdoor: armamos el mix correcto para no frenar.
          </p>
        </Reveal>
        <div className="grid gap-4">
          {industries.map((item, idx) => (
            <Reveal
              key={item.title}
              as="div"
              variant="blur"
              delayMs={idx * 80}
              className="card group relative overflow-hidden hover-lift"
            >
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -inset-10 bg-gradient-to-br ${toneForTitle(item.title)} blur-2xl opacity-60 transition duration-300 group-hover:opacity-85`}
              />
              <button
                type="button"
                className="focus-ring relative w-full text-left"
                onClick={() => {
                  setLeadContext?.({ topic: `Segmento: ${item.title}`, source: "industries_card" });
                  const discipline = disciplineForTitle(item.title);
                  openCatalog?.({ line: suggestedLineForDiscipline(discipline), discipline });
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-lg font-semibold tracking-tight text-ink-950 sm:text-xl">{item.title}</p>
                    <p className="mt-2 text-sm text-ink-600">{item.detail}</p>
                    <p className="mt-3 text-sm font-medium text-ink-600 transition duration-300 group-hover:text-ink-950/80">
                      Ver selección <span aria-hidden="true">→</span>
                    </p>
                  </div>
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-steel-200/50 bg-white/60 text-ink-950/60 backdrop-blur transition duration-300 group-hover:bg-white group-hover:text-ink-950">
                    <IconBolt />
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
