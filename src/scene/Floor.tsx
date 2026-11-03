"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import type { Project } from "@/data/content";
import { FLOOR_HEIGHT, FLOOR_WIDTH, FLOOR_DEPTH, FRONT_Z, floorCenterY } from "./layout";
import { actions, useStore } from "@/state/store";

interface FloorProps {
  index: number;
  project: Project;
}

const DOOR_W = 1.4;
const DOOR_H = 2.3;

export function Floor({ index, project }: FloorProps) {
  const y = floorCenterY(index);
  const accent = new THREE.Color(project.accent);

  const activeFloor = useStore((s) => s.activeFloor);
  const doorOpen = useStore((s) => s.doorOpen);
  const view = useStore((s) => s.view);
  const isActive = activeFloor === index;
  const isOpen = doorOpen === index;
  // When this floor is the room the user has entered, hide its glass shell so
  // the camera (now inside) sees the interior cleanly rather than through tint.
  const isRoom = view === "room" && activeFloor === index;

  const [hovered, setHovered] = useState(false);
  const [doorHovered, setDoorHovered] = useState(false);

  // Door pivots around its left edge. We put the door mesh inside a hinge group
  // offset so the group's origin is the hinge line.
  const hinge = useRef<THREE.Group>(null);
  const glow = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((_, dt) => {
    // Animate door open/closed smoothly.
    if (hinge.current) {
      const target = isOpen ? -Math.PI / 2.1 : 0;
      hinge.current.rotation.y = THREE.MathUtils.damp(hinge.current.rotation.y, target, 6, dt);
    }
    // Accent appears only as a faint reflective sheen on hover/active — the
    // glass itself stays neutral dark so the tower reads restrained.
    if (glow.current) {
      const want = isActive ? 0.14 : hovered ? 0.1 : 0.0;
      glow.current.emissiveIntensity = THREE.MathUtils.damp(glow.current.emissiveIntensity, want, 5, dt);
      // Fade the glass shell out when inside this room, back in otherwise.
      const targetOpacity = isRoom ? 0.0 : 0.97;
      glow.current.opacity = THREE.MathUtils.damp(glow.current.opacity, targetOpacity, 8, dt);
    }
  });

  const interactive = view === "exterior";

  return (
    <group position={[0, y, 0]}>
      {/* Floor slab (thin elegant band) */}
      <mesh castShadow receiveShadow position={[0, -FLOOR_HEIGHT / 2 + 0.06, 0]}>
        <boxGeometry args={[FLOOR_WIDTH + 0.22, 0.12, FLOOR_DEPTH + 0.22]} />
        <meshStandardMaterial color="#2c2f36" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Glass body (slightly inset) */}
      <mesh
        castShadow
        onPointerOver={(e) => {
          if (!interactive) return;
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          if (!interactive) return;
          e.stopPropagation();
          actions.focusFloor(index);
        }}
      >
        <boxGeometry args={[FLOOR_WIDTH, FLOOR_HEIGHT - 0.12, FLOOR_DEPTH]} />
        <meshStandardMaterial
          ref={glow}
          color="#121419"
          emissive={accent}
          emissiveIntensity={0.05}
          roughness={0.32}
          metalness={0.55}
          transparent
          opacity={0.97}
          envMapIntensity={0.35}
        />
      </mesh>

      {/* Vertical mullion lines (architectural detail) */}
      {[-0.8, 0, 0.8].map((fx) => (
        <mesh key={fx} position={[fx * (FLOOR_WIDTH / 2), 0, FRONT_Z + 0.001]}>
          <boxGeometry args={[0.04, FLOOR_HEIGHT - 0.2, 0.02]} />
          <meshStandardMaterial color="#0d0e11" />
        </mesh>
      ))}

      {/* Thin accent light strip along the top of the floor — the ONLY place
          the floor's color appears, as a crisp architectural line. */}
      <mesh position={[0, FLOOR_HEIGHT / 2 - 0.22, FRONT_Z + 0.015]}>
        <boxGeometry args={[FLOOR_WIDTH - 0.5, 0.05, 0.03]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={isActive || hovered ? 1.6 : 0.8}
          toneMapped={false}
        />
      </mesh>
      {/* Same strip on the side faces for continuity */}
      <mesh position={[FLOOR_WIDTH / 2 + 0.015, FLOOR_HEIGHT / 2 - 0.22, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[FLOOR_DEPTH - 0.5, 0.05, 0.03]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.8} toneMapped={false} />
      </mesh>

      {/* Floor number tag on the side */}
      <Text
        position={[FLOOR_WIDTH / 2 + 0.12, 0, FLOOR_DEPTH / 2 - 0.6]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.34}
        color={isActive ? project.accent : "#6b6e77"}
        anchorX="center"
        anchorY="middle"
      >
        {String(index + 1).padStart(2, "0")}
      </Text>

      {/* Door frame */}
      <mesh position={[0, -FLOOR_HEIGHT / 2 + DOOR_H / 2 + 0.1, FRONT_Z + 0.02]}>
        <boxGeometry args={[DOOR_W + 0.16, DOOR_H + 0.12, 0.08]} />
        <meshStandardMaterial color="#0c0d10" roughness={0.8} />
      </mesh>

      {/* Hinge group: origin at the door's left edge */}
      <group
        ref={hinge}
        position={[-DOOR_W / 2, -FLOOR_HEIGHT / 2 + DOOR_H / 2 + 0.1, FRONT_Z + 0.05]}
      >
        <mesh
          position={[DOOR_W / 2, 0, 0]}
          castShadow
          onPointerOver={(e) => {
            if (!interactive || !isActive) return;
            e.stopPropagation();
            setDoorHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setDoorHovered(false);
            document.body.style.cursor = "auto";
          }}
          onClick={(e) => {
            if (!interactive || !isActive) return;
            e.stopPropagation();
            // Open the door, then enter the room shortly after.
            actions.openDoor(index);
            setTimeout(() => actions.enterRoom(index), 650);
          }}
        >
          <boxGeometry args={[DOOR_W, DOOR_H, 0.06]} />
          <meshStandardMaterial
            color="#20242b"
            emissive={accent}
            emissiveIntensity={doorHovered ? 0.4 : 0.0}
            metalness={0.7}
            roughness={0.3}
          />
          {/* Handle */}
          <mesh position={[DOOR_W / 2 - 0.18, 0, 0.05]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial color={project.accent} metalness={0.9} roughness={0.2} />
          </mesh>
        </mesh>
      </group>

      {/* Doorway glow behind the door (reveals interior light when open) */}
      <mesh position={[0, -FLOOR_HEIGHT / 2 + DOOR_H / 2 + 0.1, FRONT_Z - 0.02]}>
        <planeGeometry args={[DOOR_W, DOOR_H]} />
        <meshBasicMaterial color={accent} toneMapped={false} opacity={isOpen ? 0.5 : 0} transparent />
      </mesh>
    </group>
  );
}
