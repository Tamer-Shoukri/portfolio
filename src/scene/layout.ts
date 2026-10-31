import { projects } from "@/data/content";

/** Shared architectural dimensions so building + camera agree. */
export const FLOOR_HEIGHT = 3.6;
export const FLOOR_WIDTH = 5;
export const FLOOR_DEPTH = 5;
export const GROUND_Y = 0;

export const floorCount = projects.length;

/** World Y of a floor's vertical center (floor 0 is the lowest). */
export function floorCenterY(index: number): number {
  return GROUND_Y + FLOOR_HEIGHT * index + FLOOR_HEIGHT / 2;
}

/** Total building height. */
export const buildingHeight = FLOOR_HEIGHT * floorCount;

/** Front face Z (doors live here). */
export const FRONT_Z = FLOOR_DEPTH / 2;
