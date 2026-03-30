import Container from "../components/Container.jsx";
import Logo from "../components/Logo.jsx";

export default function Footer({ site }) {
  return (
    <footer className="section relative isolate overflow-hidden bg-ink-950 text-white">
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
          <a className="focus-ring inline-flex hover:text-white" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <a className="focus-ring inline-flex hover:text-white" href={`tel:${site.phoneTel}`}>
            {site.phone}
          </a>
          <p>
            {site.addressLine1} • {site.city}
          </p>
          <p>{site.hours}</p>
        </div>

        <div className="space-y-3 text-sm text-white/70">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Políticas</p>
          <a className="focus-ring inline-flex hover:text-white" href="/legal/terminos.html">
            Términos y condiciones
          </a>
          <a className="focus-ring inline-flex hover:text-white" href="/legal/privacidad.html">
            Privacidad
          </a>
          <a className="focus-ring inline-flex hover:text-white" href="/legal/cookies.html">
            Cookies
          </a>
          <a className="focus-ring inline-flex hover:text-white" href="/legal/defensa-consumidor.html">
            Defensa del consumidor
          </a>
        </div>
      </Container>

      <Container className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50">
        <p>© 2026 {site.brand}. Todos los derechos reservados.</p>
        <p>Envíos • Cambios simples • Soporte por WhatsApp</p>
      </Container>
    </footer>
  );
}
