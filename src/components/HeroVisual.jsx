// Decorative visual layer for Hero (tool image + gradients).
// Keep it separate so the Hero layout stays clean and reusable.
export default function HeroVisual() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
    >
      {/* Base tool image (replace with a real .webp later) */}
      <div
        className="absolute -right-6 -top-10 h-[280px] w-[280px] opacity-28 motion-safe:animate-float sm:-right-12 sm:-top-16 sm:h-[480px] sm:w-[480px] sm:opacity-55 lg:h-[560px] lg:w-[560px] lg:opacity-90"
      >
        <img
          src="/images/hero-athlete.svg"
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Motion/energy blur layer */}
      <div
        className="absolute -right-10 -top-8 h-[300px] w-[300px] rotate-[-4deg] opacity-16 blur-[1.2px] motion-safe:animate-float motion-safe:[animation-delay:-2.2s] sm:-right-16 sm:-top-12 sm:h-[510px] sm:w-[510px] sm:opacity-32 lg:h-[580px] lg:w-[580px] lg:opacity-50"
      >
        <img
          src="/images/hero-athlete.svg"
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Accent glow and overlays so it feels integrated */}
      <div className="absolute -top-10 right-10 h-56 w-56 rounded-full bg-volt-300/20 blur-3xl motion-safe:animate-float motion-safe:[animation-delay:-1.1s]" />
      <div className="absolute -bottom-10 right-24 h-56 w-56 rounded-full bg-ember-500/14 blur-3xl motion-safe:animate-float motion-safe:[animation-delay:-3.6s]" />

      {/* Overlay to fuse the tool with the existing hero background */}
      <div className="absolute inset-0 bg-gradient-to-l from-ink-950/0 via-ink-950/0 to-ink-950/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/12 via-transparent to-transparent" />

      {/* Soft mask fade so image doesn't fight the card */}
      <div
        className="absolute inset-0"
        style={{
          WebkitMaskImage:
            "radial-gradient(560px circle at 72% 35%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0) 78%)",
          maskImage:
            "radial-gradient(560px circle at 72% 35%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0) 78%)"
        }}
      >
        <div className="absolute inset-0 bg-white/0 backdrop-blur-[1px]" />
      </div>
    </div>
  );
}
