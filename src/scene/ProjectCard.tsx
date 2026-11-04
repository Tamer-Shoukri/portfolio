"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text, RoundedBox } from "@react-three/drei";
import type { Project } from "@/data/content";
import { CARD_W, CARD_H, CARD_T, cardTransform } from "./layout";
import { actions, useStore } from "@/state/store";

interface Props {
  index: number;
  project: Project;
}

export function ProjectCard({ index, project }: Props) {
  const { position, rotationY } = cardTransform(index);
  const accent = new THREE.Color(project.accent);

  const view = useStore((s) => s.view);
  const activeCard = useStore((s) => s.activeFloor);
  const isFocused = (view === "room" || view === "focus") && activeCard === index;
  const dimmed = project.comingSoon;

  const group = useRef<THREE.Group>(null);
  const edgeMat = useRef<THREE.MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);

  // Per-card phase so they don't bob in unison.
  const phase = index * 1.7;

  useFrame((state, dt) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    // Gentle bob + slight sway, suppressed when focused.
    const bob = isFocused ? 0 : Math.sin(t * 0.6 + phase) * 0.12;
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, position.y + bob, 4, dt);

    // Lift + face camera a touch on hover.
    const targetScale = hovered && !isFocused ? 1.06 : 1;
    const s = THREE.MathUtils.damp(group.current.scale.x, targetScale, 8, dt);
    group.current.scale.setScalar(s);

    if (edgeMat.current) {
      const want = isFocused ? 1.6 : hovered ? 1.2 : dimmed ? 0.3 : 0.7;
      edgeMat.current.emissiveIntensity = THREE.MathUtils.damp(edgeMat.current.emissiveIntensity, want, 6, dt);
    }
  });

  const interactive = view === "space" || view === "focus";

  return (
    <group ref={group} position={position} rotation={[0, rotationY, 0]}>
      {/* Accent edge glow (slightly larger slab behind the face) */}
      <RoundedBox args={[CARD_W + 0.12, CARD_H + 0.12, CARD_T * 0.6]} radius={0.12} smoothness={4} position={[0, 0, -0.04]}>
        <meshStandardMaterial
          ref={edgeMat}
          color={accent}
          emissive={accent}
          emissiveIntensity={0.7}
          toneMapped={false}
        />
      </RoundedBox>

      {/* Card body */}
      <RoundedBox
        args={[CARD_W, CARD_H, CARD_T]}
        radius={0.1}
        smoothness={4}
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
          actions.focusCard(index);
        }}
      >
        <meshStandardMaterial
          color="#14161c"
          roughness={0.35}
          metalness={0.6}
          opacity={dimmed ? 0.9 : 1}
          transparent={dimmed}
        />
      </RoundedBox>

      {/* Face content */}
      <group position={[0, 0, CARD_T / 2 + 0.01]}>
        {/* index number, top-left */}
        <Text
          position={[-CARD_W / 2 + 0.4, CARD_H / 2 - 0.45, 0]}
          fontSize={0.3}
          color={project.accent}
          anchorX="left"
          anchorY="middle"
        >
          {String(index + 1).padStart(2, "0")}
        </Text>

        {/* status tag, top-right */}
        {(project.comingSoon || project.links.length > 0) && (
          <Text
            position={[CARD_W / 2 - 0.4, CARD_H / 2 - 0.45, 0]}
            fontSize={0.17}
            color={project.comingSoon ? project.accent : "#9a9ba1"}
            anchorX="right"
            anchorY="middle"
            letterSpacing={0.15}
          >
            {project.comingSoon ? "COMING SOON" : "LIVE"}
          </Text>
        )}

        {/* title */}
        <Text
          position={[0, 0.35, 0]}
          fontSize={0.3}
          lineHeight={1.1}
          maxWidth={CARD_W - 0.5}
          textAlign="center"
          color="#f4f4f2"
          anchorX="center"
          anchorY="middle"
        >
          {project.name}
        </Text>

        {/* tagline */}
        <Text
          position={[0, -0.75, 0]}
          fontSize={0.17}
          maxWidth={CARD_W - 0.7}
          textAlign="center"
          color="#9a9ba1"
          anchorX="center"
          anchorY="middle"
        >
          {project.tagline}
        </Text>

        {/* accent underline */}
        <mesh position={[0, -1.15, 0.001]}>
          <planeGeometry args={[0.9, 0.02]} />
          <meshBasicMaterial color={accent} toneMapped={false} />
        </mesh>

        {/* click hint */}
        <Text
          position={[0, -CARD_H / 2 + 0.5, 0]}
          fontSize={0.14}
          color="#5c5e66"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.2}
        >
          CLICK TO OPEN
        </Text>
      </group>
    </group>
  );
}
