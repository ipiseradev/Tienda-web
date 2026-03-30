import { useEffect, useRef, useState } from "react";

export function useInView(options) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
            break;
          }
        }
      },
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.12, ...(options || {}) }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
}

