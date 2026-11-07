import { projects } from "@/data/content";
import * as THREE from "three";

/**
 * Deck-of-cards-on-a-desk layout. Cards lie fanned out on a desk surface,
 * tilted slightly up toward the viewer. Clicking a card lifts it forward and
 * upright to read it.
 */
export const CARD_W = 2.9;
export const CARD_H = 3.9;
export const CARD_T = 0.06; // thin printed card

export const cardCount = projects.length;

/** Desk surface height (cards rest just above it). */
export const DESK_Y = 0;

/** Fan geometry — overlapping hand of cards. */
const FAN_SPREAD = 0.3; // radians between cards (tighter = more overlap)
const FAN_RADIUS = 3.6;
const REST_TILT = -Math.PI / 2 + 0.42; // cards lie mostly flat, tilted up toward viewer

/**
 * Resting transform for card i in the fan (lying on the desk).
 * Returns position, and Euler rotation (x tilt, y fan yaw, z none).
 */
export function cardRest(i: number): { position: THREE.Vector3; rotation: THREE.Euler } {
  const center = (cardCount - 1) / 2;
  const a = (i - center) * FAN_SPREAD;
  const x = Math.sin(a) * FAN_RADIUS;
  const z = (1 - Math.cos(a)) * FAN_RADIUS * 0.4;
  const y = DESK_Y + 0.02 + i * 0.02; // stack order so later cards sit on top
  return {
    position: new THREE.Vector3(x, y, z),
    rotation: new THREE.Euler(REST_TILT, 0, -a),
  };
}

/** Lifted/active transform when a card is selected (upright, readable, left of panel). */
export function cardLifted(): { position: THREE.Vector3; rotation: THREE.Euler } {
  return {
    position: new THREE.Vector3(-3, 2.5, 4.4),
    rotation: new THREE.Euler(-0.06, 0.12, 0),
  };
}

/** Camera framing for the desk overview. */
export const DESK_CAMERA = {
  pos: new THREE.Vector3(0, 6.2, 7.2),
  look: new THREE.Vector3(0, 0.4, 1.2),
};

/** Camera framing when a card is lifted for reading (card sits left of panel). */
export const READ_CAMERA = {
  pos: new THREE.Vector3(-2.2, 2.8, 9.5),
  look: new THREE.Vector3(-2.8, 2.4, 3.5),
};
