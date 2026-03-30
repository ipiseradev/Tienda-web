import { useEffect } from "react";

let lockCount = 0;
let originalOverflow = "";

export function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) return;

    lockCount += 1;
    if (lockCount === 1) {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.body.style.overflow = originalOverflow;
      }
    };
  }, [locked]);
}

