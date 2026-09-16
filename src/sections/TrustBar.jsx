import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";

function IconTruck({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M3 7h11v10H3z" />
      <path d="M14 10h4l3 3v4h-7z" />
      <circle cx="7.5" cy="18.5" r="1.5" />
      <circle cx="17.5" cy="18.5" r="1.5" />
    </svg>
  );
}

function IconShield({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function IconCard({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 14h4" />
    </svg>
  );
}

function IconWhatsapp({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 20l1.3-3.9A8 8 0 1 1 8 18.6z" />
      <path d="M9 10.5c0 2.5 2.5 5 5 5" />
    </svg>
  );
}

const ICONS = {
  truck: IconTruck,
  shield: IconShield,
  card: IconCard,
  whatsapp: IconWhatsapp
};

export default function TrustBar({ items = [] }) {
  if (!items.length) return null;

  return (
    <section className="border-y border-ink-950/8 bg-white">
      <Container className="grid grid-cols-2 gap-y-5 gap-x-4 py-6 sm:grid-cols-4 sm:gap-6 sm:py-7">
        {items.map((item, idx) => {
          const Icon = ICONS[item.icon] || IconShield;
          return (
            <Reveal
              key={item.label}
              as="div"
              variant="blur"
              delayMs={idx * 60}
              className="flex items-center gap-3"
            >
              <Icon className="h-5 w-5 shrink-0 text-ink-950" />
              <span className="min-w-0">
                <p className="clamp-2 text-sm font-bold leading-snug text-ink-950">{item.label}</p>
                <p className="truncate-1 text-xs text-ink-500">{item.detail}</p>
              </span>
            </Reveal>
          );
        })}
      </Container>
    </section>
  );
}
