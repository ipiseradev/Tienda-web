import { useRef } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion.js";

export function useTilt({ max = 8, scale = 1.02 } = {}) {
  const ref = useRef(null);
  const reduceMotion = usePrefersReducedMotion();

  const onMouseMove = (event) => {
    if (reduceMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    const rotateY = px * max * 2;
    const rotateX = -py * max * 2;
    el.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`;
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
  };

  return {
    ref,
    tiltProps: reduceMotion
      ? {}
      : {
          onMouseMove,
          onMouseLeave,
          style: { transition: "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)", willChange: "transform" }
        }
  };
}
