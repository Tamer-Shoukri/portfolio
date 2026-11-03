"use client";

import * as THREE from "three";
import { projects } from "@/data/content";
import { Floor } from "./Floor";
import { RoomInterior } from "./RoomInterior";
import { FLOOR_WIDTH, FLOOR_DEPTH, buildingHeight } from "./layout";
import { useStore } from "@/state/store";

export function Building() {
  const view = useStore((s) => s.view);
  const activeFloor = useStore((s) => s.activeFloor);

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

      {/* Room interiors — only the entered floor mounts one. */}
      {projects.map((p, i) => (
        <RoomInterior
          key={`room-${p.id}`}
          index={i}
          project={p}
          active={view === "room" && activeFloor === i}
        />
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
