import Container from "../components/Container.jsx";

export default function TopBar({ site }) {
  return (
    <div className="relative isolate border-b border-white/10 bg-ink-950 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-grid-soft opacity-15 [background-size:28px_28px]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-ink-fade opacity-55" />
      <div className="section py-0">
        <Container className="flex items-center justify-between gap-3 py-2 text-[11px] tracking-wide">
          <p className="truncate-1 text-white/80">Envíos 24/72h • cambios simples • soporte por WhatsApp</p>
          <div className="hidden items-center gap-3 text-white/70 lg:flex">
            <a className="focus-ring hover:text-white" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <span className="text-white/25" aria-hidden="true">
              ·
            </span>
            <a className="focus-ring hover:text-white" href={`tel:${site.phoneTel}`}>
              {site.phone}
            </a>
            <span className="text-white/25" aria-hidden="true">
              ·
            </span>
            <span className="truncate-1 max-w-[260px]">{site.coverage}</span>
          </div>
        </Container>
      </div>
    </div>
  );
}
