import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";

export default function Highlights({ highlights }) {
  return (
    <section className="section surface-ink">
      <Container className="grid gap-8 lg:grid-cols-3">
        {highlights.map((item) => (
          <Reveal key={item.label} as="div" className="rounded-[2rem] border border-white/10 p-7">
            <p className="nike-kicker text-white/60">{item.label}</p>
            <p className="mt-4 text-4xl font-semibold tracking-tight">{item.value}</p>
            <p className="mt-2 text-sm text-white/70">{item.description}</p>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}

