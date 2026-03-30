import { useInView } from "../hooks/useInView.js";

export default function Reveal({
  as: As = "div",
  className = "",
  variant = "up",
  delayMs = 0,
  children,
  ...props
}) {
  const { ref, isInView } = useInView();
  return (
    <As
      ref={ref}
      className={`reveal ${variant === "blur" ? "blur" : ""} ${
        isInView ? "is-visible" : ""
      } ${className}`}
      style={delayMs ? { animationDelay: `${delayMs}ms` } : undefined}
      {...props}
    >
      {children}
    </As>
  );
}
