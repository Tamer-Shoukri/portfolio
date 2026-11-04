"use client";

import { useSyncExternalStore } from "react";
import { projects } from "@/data/content";

export type View = "intro" | "space" | "focus" | "room";

export interface AppState {
  view: View;
  /** Index into projects[] for the focused card, or null. */
  activeFloor: number | null;
  /** Legacy door field (unused in cards concept, kept for type stability). */
  doorOpen: number | null;
  /** Orbit progress 0..1 (reserved; cards use OrbitControls directly). */
  scroll: number;
}

const cardCount = projects.length;

let state: AppState = {
  view: "intro",
  activeFloor: null,
  doorOpen: null,
  scroll: 0,
};

const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getState(): AppState {
  return state;
}

function set(patch: Partial<AppState>) {
  state = { ...state, ...patch };
  emit();
}

// ---------- Actions ----------

export const actions = {
  enterSpace() {
    if (state.view === "intro") set({ view: "space" });
  },
  setScroll(s: number) {
    set({ scroll: Math.max(0, Math.min(1, s)) });
  },
  /** Click a card: fly to it and open its showcase. */
  focusCard(index: number) {
    set({ view: "room", activeFloor: index });
  },
  /** Close the focused card, return to the floating constellation. */
  closeCard() {
    set({ view: "space", activeFloor: null });
  },
  goToIntro() {
    set({ view: "intro", activeFloor: null, doorOpen: null, scroll: 0 });
  },
};

export { cardCount };

// ---------- Hook ----------

export function useStore<T>(selector: (s: AppState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(state),
  );
}
