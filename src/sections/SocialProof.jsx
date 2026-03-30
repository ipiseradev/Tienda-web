import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";

function Stars({ rating = 0 }) {
  const full = Math.max(0, Math.min(5, Math.floor(rating)));
  const items = Array.from({ length: 5 }, (_, i) => i < full);
  return (
    <div className="inline-flex items-center gap-1" aria-label={`Rating ${rating} de 5`}>
      {items.map((on, idx) => (
        <span
          key={idx}
          className={`text-base ${on ? "text-volt-300" : "text-ink-200"}`}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  );
}

function toneForDiscipline(discipline) {
  const d = String(discipline || "").toLowerCase();
  if (d.includes("run")) return "from-volt-50 via-white to-white";
  if (d.includes("gym")) return "from-ember-50 via-white to-white";
  if (d.includes("out")) return "from-brass-50 via-white to-white";
  return "from-steel-50 via-white to-white";
}

export default function SocialProof({ ratingSummary, seenIn = [], ugcPosts = [] }) {
  const rating = Number(ratingSummary?.rating || 0);
  const reviews = Number(ratingSummary?.reviews || 0);

  return (
    <section className="section">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <Reveal as="div" className="space-y-6">
          <p className="eyebrow">Comunidad</p>
          <h2 className="section-title">Social proof que se entiende.</h2>
          <p className="section-subtitle">
            Reseñas (demo), UGC y “visto en” para transmitir confianza sin humo.
          </p>

          <div className="card">
            <p className="nike-kicker">Rating</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <p className="text-3xl font-semibold text-ink-950">{rating.toFixed(1)}</p>
              <Stars rating={rating} />
              <p className="text-sm text-ink-600">
                {reviews ? `${reviews.toLocaleString("es-AR")} reseñas` : "Reseñas demo"}
              </p>
            </div>
            {ratingSummary?.note ? (
              <p className="mt-3 text-sm text-ink-600">{ratingSummary.note}</p>
            ) : null}
          </div>

          <div className="card">
            <p className="nike-kicker">Visto en</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(seenIn || []).slice(0, 8).map((name) => (
                <span
                  key={name}
                  className="rounded-full border border-steel-200 bg-white px-4 py-2 text-xs font-semibold text-ink-700"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="grid gap-4">
          {(ugcPosts || []).slice(0, 6).map((p, idx) => (
            <Reveal
              key={`${p.handle}-${idx}`}
              as="div"
              variant="blur"
              delayMs={idx * 70}
              className={`card overflow-hidden bg-gradient-to-br ${toneForDiscipline(p.discipline)}`}
            >
              <p className="text-sm font-semibold text-ink-950">{p.handle}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.35em] text-ink-400">{p.discipline}</p>
              <p className="mt-4 text-sm text-ink-700">“{p.quote}”</p>
              <div className="mt-5 h-px w-full bg-gradient-to-r from-ink-950/10 via-transparent to-transparent" />
              <p className="mt-4 text-xs font-semibold text-ink-500">UGC demo • reemplazable por contenido real</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

