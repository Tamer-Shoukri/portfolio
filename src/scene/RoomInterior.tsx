"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import type { Project } from "@/data/content";
import { FLOOR_HEIGHT, FLOOR_WIDTH, FLOOR_DEPTH, floorCenterY } from "./layout";

interface Props {
  index: number;
  project: Project;
  /** Fades/scales in when true (floor is the entered room). */
  active: boolean;
}

const W = FLOOR_WIDTH - 0.4;
const H = FLOOR_HEIGHT - 0.3;
const D = FLOOR_DEPTH - 0.4;

/**
 * A real interior space rendered inside a floor's volume. Only mounted when its
 * floor is the active room, so it costs nothing otherwise. The camera sits just
 * inside the doorway looking toward the back wall, which carries a large framed
 * "display" tinted with the project accent.
 */
export function RoomInterior({ index, project, active }: Props) {
  const y = floorCenterY(index);
  const accent = new THREE.Color(project.accent);
  const panelMat = useRef<THREE.MeshStandardMaterial>(null);

  // Gentle breathing glow on the back display while the room is open.
  useFrame(() => {
    if (panelMat.current && active) {
      const t = performance.now() * 0.001;
      panelMat.current.emissiveIntensity = 0.5 + Math.sin(t * 1.2) * 0.12;
    }
  });

  // Only mount the interior when its floor is the active room (zero cost otherwise).
  if (!active) return null;

  return (
    <group position={[0, y, 0]}>
      {/* Back wall */}
      <mesh position={[0, 0, -D / 2]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#3a3f49" roughness={0.85} metalness={0.05} fog={false} />
      </mesh>
      {/* Side walls */}
      <mesh position={[-W / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#2d313b" roughness={0.9} fog={false} />
      </mesh>
      <mesh position={[W / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#262a33" roughness={0.9} fog={false} />
      </mesh>
      {/* Floor */}
      <mesh position={[0, -H / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color="#1c1f26" roughness={0.5} metalness={0.4} fog={false} />
      </mesh>
      {/* Ceiling */}
      <mesh position={[0, H / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color="#20232b" roughness={1} fog={false} />
      </mesh>

      {/* Ceiling light strips */}
      <mesh position={[0, H / 2 - 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W * 0.55, 0.22]} />
        <meshBasicMaterial color="#fff6e6" toneMapped={false} fog={false} />
      </mesh>
      {/* Bright interior fill so the room reads clearly. */}
      <pointLight position={[0, H / 2 - 0.3, 0.6]} intensity={22} distance={16} decay={1.4} color="#fff3e2" />
      <pointLight position={[0, 0, -D / 2 + 0.9]} intensity={8} distance={11} decay={1.6} color={accent} />

      {/* Back-wall framed display (accent) */}
      <group position={[0, 0.15, -D / 2 + 0.06]}>
        {/* frame */}
        <mesh>
          <planeGeometry args={[W * 0.62 + 0.14, H * 0.5 + 0.14]} />
          <meshStandardMaterial color="#0a0c10" roughness={0.6} metalness={0.4} fog={false} />
        </mesh>
        {/* glowing panel */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[W * 0.62, H * 0.5]} />
          <meshStandardMaterial
            ref={panelMat}
            color={accent}
            emissive={accent}
            emissiveIntensity={0.9}
            toneMapped={false}
            fog={false}
          />
        </mesh>
        {/* project name etched on the display */}
        <Text
          position={[0, 0.12, 0.02]}
          fontSize={0.26}
          maxWidth={W * 0.56}
          textAlign="center"
          color="#0b0d12"
          anchorX="center"
          anchorY="middle"
        >
          {project.name}
        </Text>
        <Text
          position={[0, -0.28, 0.02]}
          fontSize={0.12}
          maxWidth={W * 0.56}
          textAlign="center"
          color="#0b0d12"
          anchorX="center"
          anchorY="middle"
        >
          {project.tagline}
        </Text>
      </group>

      {/* A simple plinth / pedestal in the room for depth */}
      <mesh position={[0, -H / 2 + 0.25, 0.4]} castShadow>
        <boxGeometry args={[1.1, 0.5, 0.8]} />
        <meshStandardMaterial color="#2a2e37" roughness={0.5} metalness={0.4} fog={false} />
      </mesh>
      <mesh position={[0, -H / 2 + 0.56, 0.4]}>
        <boxGeometry args={[1.2, 0.04, 0.9]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.4} toneMapped={false} fog={false} />
      </mesh>
    </group>
  );
}
