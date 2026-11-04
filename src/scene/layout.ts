import { projects } from "@/data/content";
import * as THREE from "three";

/**
 * Floating-cards layout. Cards are arranged along a gentle arc on the XZ plane,
 * facing roughly toward the camera's default position, bobbing in a dark void.
 */
export const CARD_W = 4;
export const CARD_H = 4.6;
export const CARD_T = 0.22; // thickness

export const cardCount = projects.length;

/** Horizontal spacing between card centers along the arc. */
const ARC_SPACING = 5.8;
/** Radius of the arc the cards sit on (depth curvature). */
const ARC_RADIUS = 16;

/** World position + facing yaw for card i. Centered around x=0. */
export function cardTransform(i: number): { position: THREE.Vector3; rotationY: number } {
  const center = (cardCount - 1) / 2;
  const offset = i - center;
  const x = offset * ARC_SPACING;
  // Pull cards slightly back as they move out, forming a shallow arc.
  const z = -Math.abs(offset) * (ARC_SPACING * ARC_SPACING) / (2 * ARC_RADIUS);
  const y = 0;
  // Cards angle inward toward the viewer at the arc center.
  const rotationY = -offset * 0.14;
  return { position: new THREE.Vector3(x, y, z), rotationY };
}

/** Where the camera should sit to view a focused card head-on. */
export function cardFocusCamera(i: number): { pos: THREE.Vector3; look: THREE.Vector3 } {
  const { position, rotationY } = cardTransform(i);
  const dist = 5.4;
  const dir = new THREE.Vector3(Math.sin(rotationY), 0, Math.cos(rotationY));
  const pos = position.clone().add(dir.multiplyScalar(dist));
  pos.y += 0.3;
  return { pos, look: position.clone() };
}
