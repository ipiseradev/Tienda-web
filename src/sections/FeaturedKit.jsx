import Button from "../components/Button.jsx";
import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";
import { IconGear, IconMap } from "../components/icons.jsx";

export default function FeaturedKit({ productList }) {
  return (
    <section className="section surface-soft">
      <Container className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <Reveal as="div" className="card p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="nike-kicker">Featured kit</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-ink-950">
                Kit Entreno Express
              </p>
            </div>
            <span className="rounded-full bg-volt-300 px-3 py-1 text-xs font-semibold text-ink-950">
              Nuevo
            </span>
          </div>
          <p className="mt-4 clamp-2 text-sm text-ink-600">
            Lo esencial para entrenar sin pensar demasiado. Armado para combinar fácil.
          </p>
          <div className="mt-6 grid gap-2 text-sm text-ink-700">
            {productList.map((item) => (
              <p key={item} className="truncate-1">
                - {item}
              </p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="dark" as="a" href="#contacto" className="px-6 py-3">
              Quiero este kit
            </Button>
            <Button variant="ghost" as="a" href="#guia" className="px-6 py-3">
              Ver guía
            </Button>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2">
          <Reveal as="div" className="card flex h-full flex-col gap-4">
            <IconGear className="h-10 w-10 text-ink-900" />
            <p className="truncate-1 text-lg font-semibold text-ink-950">Calce</p>
            <p className="clamp-2 text-sm text-ink-600">
              Elegí regular, ajustado u oversize con una guía simple.
            </p>
          </Reveal>
          <Reveal as="div" className="card flex h-full flex-col gap-4">
            <IconMap className="h-10 w-10 text-ember-500" />
            <p className="truncate-1 text-lg font-semibold text-ink-950">Listo para entrenar</p>
            <p className="clamp-2 text-sm text-ink-600">
              Kits armados por disciplina: running, gym y outdoor.
            </p>
          </Reveal>
          <Reveal as="div" className="card space-y-4 sm:col-span-2">
            <p className="nike-kicker">Stock en vivo</p>
            <p className="text-3xl font-semibold text-ink-950">
              Drops y básicos listos para despachar.
            </p>
            <div className="mt-4 h-2 w-full rounded-full bg-gradient-to-r from-volt-300 via-brass-400 to-ember-500" />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
