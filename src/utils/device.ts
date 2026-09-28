/**
 * True on touch-first devices (phones, tablets).
 * Used to switch double-click interactions to single-tap, matching
 * the platform convention (e.g. iOS Files opens items with one tap).
 */
export function isCoarsePointer(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches
  )
}
