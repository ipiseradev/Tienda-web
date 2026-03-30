export default function Logo({
  mark = "VW",
  name = "VoltWear",
  tagline = "Indumentaria Deportiva",
  tone = "dark",
  compact = false,
  className = ""
}) {
  const isLight = tone === "light";
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-ink ${
          isLight ? "bg-white text-ink-950" : "bg-ink-950 text-white"
        }`}
      >
        {mark}
      </div>
      <div>
        <p
          className={`font-display text-[17px] font-semibold leading-tight ${
            isLight ? "text-white" : "text-ink-950"
          }`}
        >
          {name}
        </p>
        {!compact ? (
          <p
            className={`text-[10px] uppercase tracking-[0.34em] ${
              isLight ? "text-white/60" : "text-ink-500"
            }`}
          >
            {tagline}
          </p>
        ) : (
          <p
            className={`hidden text-[10px] uppercase tracking-[0.34em] md:block ${
              isLight ? "text-white/60" : "text-ink-500"
            }`}
          >
            {tagline}
          </p>
        )}
      </div>
    </div>
  );
}
