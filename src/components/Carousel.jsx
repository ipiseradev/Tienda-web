import { useEffect, useMemo, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";
import Button from "./Button.jsx";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export default function Carousel({
  items,
  renderItem,
  ariaLabel = "Carousel",
  autoplayMs = 4500,
  controls = "overlay",
  className = "",
  slideClassName = ""
}) {
  const reduceMotion = usePrefersReducedMotion();
  const viewportRef = useRef(null);
  const rafRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStateRef = useRef({
    active: false,
    startX: 0,
    startScrollLeft: 0,
    pointerId: null
  });

  const count = items?.length || 0;

  const scrollToIndex = (index) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const slides = viewport.querySelectorAll("[data-slide]");
    const target = slides[index];
    if (!target) return;
    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      inline: "start",
      block: "nearest"
    });
  };

  const go = (delta) => {
    if (!count) return;
    const next = (activeIndex + delta + count) % count;
    scrollToIndex(next);
  };

  const dots = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const slides = viewport.querySelectorAll("[data-slide]");
        if (!slides.length) return;

        const viewportRect = viewport.getBoundingClientRect();
        const viewportCenter = viewportRect.left + viewportRect.width * 0.35;

        let bestIndex = 0;
        let bestDist = Number.POSITIVE_INFINITY;

        slides.forEach((slide, idx) => {
          const rect = slide.getBoundingClientRect();
          const center = rect.left + rect.width * 0.5;
          const dist = Math.abs(center - viewportCenter);
          if (dist < bestDist) {
            bestDist = dist;
            bestIndex = idx;
          }
        });

        setActiveIndex((prev) => (prev === bestIndex ? prev : bestIndex));
      });
    };

    onScroll();
    viewport.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafRef.current);
      viewport.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      }
    };

    viewport.addEventListener("keydown", onKeyDown);
    return () => viewport.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, count]);

  useEffect(() => {
    if (reduceMotion) return;
    if (isPaused) return;
    if (!autoplayMs || autoplayMs < 1200) return;
    if (count <= 1) return;

    const id = window.setInterval(() => {
      const next = (activeIndex + 1) % count;
      scrollToIndex(next);
    }, autoplayMs);
    return () => window.clearInterval(id);
  }, [activeIndex, autoplayMs, count, isPaused, reduceMotion]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    if (reduceMotion) return;

    const onPointerDown = (event) => {
      if (event.button !== 0) return;
      dragStateRef.current.active = true;
      dragStateRef.current.startX = event.clientX;
      dragStateRef.current.startScrollLeft = viewport.scrollLeft;
      dragStateRef.current.pointerId = event.pointerId;
      viewport.setPointerCapture(event.pointerId);
      setIsDragging(true);
      setIsPaused(true);
    };

    const onPointerMove = (event) => {
      if (!dragStateRef.current.active) return;
      const dx = event.clientX - dragStateRef.current.startX;
      viewport.scrollLeft = dragStateRef.current.startScrollLeft - dx;
    };

    const stopDragging = () => {
      if (!dragStateRef.current.active) return;
      dragStateRef.current.active = false;
      dragStateRef.current.pointerId = null;
      setIsDragging(false);
      setIsPaused(false);
    };

    const onPointerUp = () => stopDragging();
    const onPointerCancel = () => stopDragging();
    const onLostPointerCapture = () => stopDragging();

    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", onPointerUp);
    viewport.addEventListener("pointercancel", onPointerCancel);
    viewport.addEventListener("lostpointercapture", onLostPointerCapture);

    return () => {
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", onPointerUp);
      viewport.removeEventListener("pointercancel", onPointerCancel);
      viewport.removeEventListener("lostpointercapture", onLostPointerCapture);
    };
  }, [reduceMotion]);

  return (
    <div
      className={className}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className="relative mt-6 overflow-hidden rounded-[2rem]">
        <div
          ref={viewportRef}
          className={`no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-6 px-1 pb-4 focus-ring ${
            reduceMotion ? "" : "cursor-grab active:cursor-grabbing"
          } ${isDragging ? "select-none" : ""}`}
          aria-label={ariaLabel}
          tabIndex={0}
          style={{ touchAction: reduceMotion ? "auto" : "pan-y" }}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              data-slide
              className={
                slideClassName ||
                "snap-start w-[min(78vw,360px)] shrink-0 sm:w-[320px] lg:w-[340px]"
              }
              role="group"
              aria-roledescription="slide"
              aria-label={`${idx + 1} de ${count}`}
            >
              <div
                className={`transition ${
                  idx === activeIndex ? "scale-[1.00]" : "scale-[0.98] opacity-95"
                }`}
              >
                {renderItem(item, idx, idx === activeIndex)}
              </div>
            </div>
          ))}
        </div>

        {controls === "overlay" ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between px-3 sm:flex">
            <div className="pointer-events-auto">
              <Button
                variant="dark"
                type="button"
                aria-label="Anterior"
                className="px-4 py-2 shadow-ink"
                onClick={() => go(-1)}
                disabled={count <= 1}
              >
                Anterior
              </Button>
            </div>
            <div className="pointer-events-auto">
              <Button
                variant="dark"
                type="button"
                aria-label="Siguiente"
                className="px-4 py-2 shadow-ink"
                onClick={() => go(1)}
                disabled={count <= 1}
              >
                Siguiente
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            type="button"
            aria-label="Anterior"
            className="px-4 py-2 sm:hidden"
            onClick={() => go(-1)}
            disabled={count <= 1}
          >
            Ant
          </Button>
          <Button
            variant="ghost"
            type="button"
            aria-label="Siguiente"
            className="px-4 py-2 sm:hidden"
            onClick={() => go(1)}
            disabled={count <= 1}
          >
            Sig
          </Button>
        </div>

        <div
          className="flex items-center gap-2"
          role="tablist"
          aria-label={`${ariaLabel} paginacion`}
        >
          {dots.map((i) => {
            const selected = i === activeIndex;
            return (
              <button
                key={i}
                type="button"
                className={`h-2.5 rounded-full transition ${
                  selected ? "w-8 bg-ink-950" : "w-2.5 bg-ink-200 hover:bg-ink-300"
                }`}
                aria-label={`Ir al item ${i + 1}`}
                aria-current={selected ? "true" : "false"}
                onClick={() => scrollToIndex(i)}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-2 h-1 w-full rounded-full bg-ink-100">
        <div
          className="h-full rounded-full bg-volt-300 transition"
          style={{
            width: `${count ? ((clamp(activeIndex, 0, count - 1) + 1) / count) * 100 : 0}%`
          }}
        />
      </div>
    </div>
  );
}
