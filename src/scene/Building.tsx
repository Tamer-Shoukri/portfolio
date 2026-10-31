"use client";

import * as THREE from "three";
import { projects } from "@/data/content";
import { Floor } from "./Floor";
import { FLOOR_WIDTH, FLOOR_DEPTH, buildingHeight } from "./layout";

export function Building() {
  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#0b0c0f" roughness={1} metalness={0} />
      </mesh>

      {/* Subtle plaza ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <ringGeometry args={[FLOOR_WIDTH * 0.9, FLOOR_WIDTH * 1.4, 64]} />
        <meshStandardMaterial color="#121318" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* Floors */}
      {projects.map((p, i) => (
        <Floor key={p.id} index={i} project={p} />
      ))}

      {/* Roof cap */}
      <mesh position={[0, buildingHeight + 0.12, 0]} castShadow>
        <boxGeometry args={[FLOOR_WIDTH + 0.5, 0.24, FLOOR_DEPTH + 0.5]} />
        <meshStandardMaterial color="#17191e" roughness={0.8} metalness={0.2} />
      </mesh>
      {/* Rooftop antenna */}
      <mesh position={[FLOOR_WIDTH / 2 - 0.6, buildingHeight + 1.1, -FLOOR_DEPTH / 2 + 0.6]}>
        <cylinderGeometry args={[0.03, 0.03, 2, 8]} />
        <meshStandardMaterial color="#2a2d34" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}
