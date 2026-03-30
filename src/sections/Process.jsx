import Button from "../components/Button.jsx";
import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";
import { useLead } from "../context/LeadContext.jsx";

export default function Process({ onOpenRfq }) {
  const { setLeadContext } = useLead();
  return (
    <section className="section surface-soft">
      <Container className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <Reveal as="div" className="space-y-6">
          <p className="eyebrow">Cómo comprás</p>
          <h2 className="section-title">Un proceso simple, rápido y con guía real.</h2>
          <p className="section-subtitle">
            Elegís prendas o drops, te ayudamos con el talle y coordinamos el envío.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="dark"
              type="button"
              className="cta-shine"
              onClick={() => {
                setLeadContext({ topic: "Ayuda con talle / recomendación", source: "process_rfq" });
                onOpenRfq?.();
              }}
            >
              Pedir recomendación
            </Button>
            <Button variant="ghost" as="a" href="#contacto">
              Hablar con un asesor
            </Button>
          </div>

          <div className="card space-y-4">
            <p className="text-lg font-semibold text-ink-950">Info rápida</p>
            <ul className="grid gap-2 text-sm text-ink-600">
              <li>• Medios de pago: transferencia / efectivo / tarjetas (placeholder)</li>
              <li>• Plazos: 24/48h CABA/GBA • Interior según transportista</li>
              <li>• Cambios: 7 días (demo) con etiqueta y prenda sin uso</li>
            </ul>
          </div>

          <div className="card space-y-4">
            <p className="text-lg font-semibold text-ink-950">Envíos y soporte</p>
            <p className="text-sm text-ink-600">
              Te confirmamos talle, calce y fecha de entrega antes de cerrar. Si tenés una carrera o
              fecha, lo marcamos para coordinar.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { k: "Respuesta", v: "<2h", d: "en horario hábil" },
                { k: "CABA/GBA", v: "24/48h", d: "según zona" },
                { k: "Interior", v: "48/72h", d: "según transporte" }
              ].map((m) => (
                <div key={m.k} className="rounded-3xl border border-steel-200/70 bg-white/70 p-4">
                  <p className="nike-kicker">{m.k}</p>
                  <p className="mt-2 text-xl font-semibold text-ink-950">{m.v}</p>
                  <p className="mt-1 text-xs text-ink-500">{m.d}</p>
                </div>
              ))}
            </div>

            <Button
              variant="ghost"
              as="a"
              href="#contacto"
              className="w-full justify-center text-center"
              onClick={() => setLeadContext({ topic: "Envíos / cambios", source: "process_sla" })}
            >
              Consultar tiempos y cambios
            </Button>
          </div>
        </Reveal>

        <div className="grid gap-4">
          {[
            { step: "1", title: "Elegís prendas", detail: "Catálogo o drops. Guardás tus favoritos en el carrito." },
            { step: "2", title: "Ajustamos el talle", detail: "Si estás en duda, te ayudamos por WhatsApp con la guía." },
            { step: "3", title: "Enviamos", detail: "Coordinamos envío y te dejamos todo claro para cambios." }
          ].map((item, idx) => (
            <Reveal key={item.step} as="div" variant="blur" delayMs={idx * 70} className="card">
              <p className="nike-kicker">Paso {item.step}</p>
              <p className="mt-3 text-lg font-semibold text-ink-950">{item.title}</p>
              <p className="mt-2 text-sm text-ink-600">{item.detail}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
