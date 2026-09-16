import Container from "../components/Container.jsx";
import Reveal from "../components/Reveal.jsx";

export default function Highlights({ highlights }) {
  return (
    <section className="section surface-ink">
      <Container className="grid gap-8 lg:grid-cols-3">
        {highlights.map((item) => (
          <Reveal
            key={item.label}
            as="div"
            className="rounded-[2rem] border border-white/10 p-8 transition duration-450 ease-out-quint hover:-translate-y-1 hover:border-volt-300/30 hover:bg-white/[0.03]"
          >
            <p className="nike-kicker text-white/50">{item.label}</p>
            <p className="mt-4 font-display text-5xl font-bold leading-none tracking-[-0.03em] text-volt-300 sm:text-6xl md:text-7xl">
              {item.value}
            </p>
            <p className="mt-4 text-sm text-white/70">{item.description}</p>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}

