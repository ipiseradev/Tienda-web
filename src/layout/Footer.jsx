import Container from "../components/Container.jsx";
import Logo from "../components/Logo.jsx";

function IconMail({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 6h16v12H4z" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}

function IconPhone({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2C10.5 21 3 13.5 3 6a2 2 0 0 1 2-2z" />
    </svg>
  );
}

function IconArrowRight({ className = "h-3.5 w-3.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h12" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

export default function Footer({ site }) {
  return (
    <footer className="section relative isolate overflow-hidden bg-ink-950 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-volt-300 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-grid-soft opacity-20 [background-size:28px_28px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-ink-fade opacity-65"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-volt-glow opacity-15"
      />
      <Container className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div className="space-y-4">
          <Logo mark={site.mark} name={site.brand} tagline={site.tagline} tone="light" />
          <p className="text-sm text-white/70">
            Indumentaria deportiva para entrenar, correr y moverte todos los días. Guía de talles clara,
            envíos rápidos y cambios simples.
          </p>

          <div className="rounded-[22px] border border-white/12 bg-white/5 p-4 text-xs text-white/70 backdrop-blur">
            <p className="font-semibold text-white/85">Datos legales (placeholder)</p>
            <p className="mt-2">{site.legalName}</p>
            <p>CUIT: {site.cuit}</p>
            <p>Domicilio fiscal: {site.fiscalAddress}</p>
          </div>
        </div>

        <div className="space-y-3 text-sm text-white/70">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Contacto</p>
          <a
            className="focus-ring group inline-flex items-center gap-2 transition duration-300 hover:text-white"
            href={`mailto:${site.email}`}
          >
            <IconMail className="h-4 w-4 shrink-0 text-white/40 transition duration-300 group-hover:text-volt-300" />
            <span className="transition duration-300 group-hover:translate-x-0.5">{site.email}</span>
          </a>
          <a
            className="focus-ring group inline-flex items-center gap-2 transition duration-300 hover:text-white"
            href={`tel:${site.phoneTel}`}
          >
            <IconPhone className="h-4 w-4 shrink-0 text-white/40 transition duration-300 group-hover:text-volt-300" />
            <span className="transition duration-300 group-hover:translate-x-0.5">{site.phone}</span>
          </a>
          <p>
            {site.addressLine1} • {site.city}
          </p>
          <p>{site.hours}</p>
        </div>

        <div className="space-y-3 text-sm text-white/70">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Políticas</p>
          <a
            className="focus-ring group inline-flex items-center gap-1.5 transition duration-300 hover:text-white"
            href="/legal/terminos.html"
          >
            <span className="transition duration-300 group-hover:translate-x-0.5">Términos y condiciones</span>
          </a>
          <a
            className="focus-ring group inline-flex items-center gap-1.5 transition duration-300 hover:text-white"
            href="/legal/privacidad.html"
          >
            <span className="transition duration-300 group-hover:translate-x-0.5">Privacidad</span>
          </a>
          <a
            className="focus-ring group inline-flex items-center gap-1.5 transition duration-300 hover:text-white"
            href="/legal/cookies.html"
          >
            <span className="transition duration-300 group-hover:translate-x-0.5">Cookies</span>
          </a>
          <a
            className="focus-ring group inline-flex items-center gap-1.5 transition duration-300 hover:text-white"
            href="/legal/defensa-consumidor.html"
          >
            <span className="transition duration-300 group-hover:translate-x-0.5">Defensa del consumidor</span>
          </a>
        </div>
      </Container>

      <Container className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50">
        <p>© 2026 {site.brand}. Todos los derechos reservados.</p>
        <p className="inline-flex items-center gap-2">
          Envíos • Cambios simples • Soporte por WhatsApp
          <IconArrowRight className="hidden h-3 w-3 text-volt-300/70 sm:inline" />
        </p>
      </Container>
    </footer>
  );
}
