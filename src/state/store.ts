"use client";

import { useSyncExternalStore } from "react";
import { projects } from "@/data/content";

export type View = "intro" | "exterior" | "room";

export interface AppState {
  view: View;
  /** Index into projects[] for the currently focused floor, or null. */
  activeFloor: number | null;
  /** Whether a door is mid-opening (used to gate room entry). */
  doorOpen: number | null;
  /** Scroll progress 0..1 across the whole building (drives exterior camera). */
  scroll: number;
}

const floorCount = projects.length;

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
  enterBuilding() {
    if (state.view === "intro") set({ view: "exterior" });
  },
  setScroll(s: number) {
    set({ scroll: Math.max(0, Math.min(1, s)) });
  },
  /** Focus a floor (camera approaches). */
  focusFloor(index: number) {
    set({ view: "exterior", activeFloor: index });
  },
  clearFloor() {
    set({ activeFloor: null, doorOpen: null });
  },
  openDoor(index: number) {
    set({ doorOpen: index });
  },
  enterRoom(index: number) {
    set({ view: "room", activeFloor: index, doorOpen: index });
  },
  exitRoom() {
    set({ view: "exterior", doorOpen: null });
  },
  goToIntro() {
    set({ view: "intro", activeFloor: null, doorOpen: null, scroll: 0 });
  },
};

export { floorCount };

// ---------- Hook ----------

export function useStore<T>(selector: (s: AppState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(state),
  );
}
