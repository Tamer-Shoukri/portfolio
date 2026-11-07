"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text, RoundedBox } from "@react-three/drei";
import type { Project } from "@/data/content";
import { CARD_W, CARD_H, CARD_T, cardRest, cardLifted } from "./layout";
import { actions, useStore } from "@/state/store";

interface Props {
  index: number;
  project: Project;
}

const PAPER = "#ece3cf"; // aged paper
const INK = "#2a2620";

export function ProjectCard({ index, project }: Props) {
  const rest = cardRest(index);
  const lifted = cardLifted();
  const accent = new THREE.Color(project.accent);

  const view = useStore((s) => s.view);
  const activeCard = useStore((s) => s.activeFloor);
  const isFocused = (view === "room" || view === "focus") && activeCard === index;
  const anotherFocused = (view === "room" || view === "focus") && activeCard !== index;

  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, dt) => {
    if (!group.current) return;
    const g = group.current;

    // Target transform: lifted when focused, otherwise resting in the fan
    // (with a small lift on hover).
    const targetPos = isFocused ? lifted.position : rest.position.clone();
    const targetRot = isFocused ? lifted.rotation : rest.rotation;
    if (!isFocused && hovered) targetPos.y += 0.6;

    g.position.x = THREE.MathUtils.damp(g.position.x, targetPos.x, 6, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, targetPos.y, 6, dt);
    g.position.z = THREE.MathUtils.damp(g.position.z, targetPos.z, 6, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetRot.x, 6, dt);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetRot.y, 6, dt);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, targetRot.z, 6, dt);

    // Lifted card reads as a held card (smaller) beside the panel.
    const targetScale = isFocused ? 0.78 : 1;
    const s = THREE.MathUtils.damp(g.scale.x, targetScale, 6, dt);
    g.scale.setScalar(s);

    // Fade a non-selected card back while another is being read.
    const targetOpacity = anotherFocused ? 0.25 : 1;
    g.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | undefined;
      if (m && "opacity" in m) {
        (m as THREE.Material & { opacity: number }).transparent = true;
        (m as THREE.Material & { opacity: number }).opacity = THREE.MathUtils.damp(
          (m as THREE.Material & { opacity: number }).opacity,
          targetOpacity,
          6,
          dt,
        );
      }
    });
  });

  const interactive = view === "space" || view === "focus";

  return (
    <group
      ref={group}
      position={rest.position}
      rotation={rest.rotation}
    >
      {/* Card stock */}
      <RoundedBox
        args={[CARD_W, CARD_H, CARD_T]}
        radius={0.06}
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
        <meshStandardMaterial color={PAPER} roughness={0.9} metalness={0} />
      </RoundedBox>

      {/* Accent header band */}
      <mesh position={[0, CARD_H / 2 - 0.34, CARD_T / 2 + 0.002]}>
        <planeGeometry args={[CARD_W, 0.5]} />
        <meshBasicMaterial color={accent} />
      </mesh>

      {/* Face content (printed on the paper) */}
      <group position={[0, 0, CARD_T / 2 + 0.004]}>
        {/* index corner */}
        <Text position={[-CARD_W / 2 + 0.28, CARD_H / 2 - 0.34, 0]} fontSize={0.22} color={INK} anchorX="left" anchorY="middle">
          {String(index + 1).padStart(2, "0")}
        </Text>
        {/* status */}
        <Text
          position={[CARD_W / 2 - 0.28, CARD_H / 2 - 0.34, 0]}
          fontSize={0.13}
          color={INK}
          anchorX="right"
          anchorY="middle"
          letterSpacing={0.12}
        >
          {project.comingSoon ? "COMING SOON" : "LIVE"}
        </Text>

        {/* title */}
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.22}
          lineHeight={1.12}
          maxWidth={CARD_W - 0.4}
          textAlign="center"
          color={INK}
          anchorX="center"
          anchorY="middle"
        >
          {project.name}
        </Text>

        {/* divider */}
        <mesh position={[0, 0.02, 0]}>
          <planeGeometry args={[CARD_W - 0.8, 0.012]} />
          <meshBasicMaterial color={accent} />
        </mesh>

        {/* tagline */}
        <Text
          position={[0, -0.45, 0]}
          fontSize={0.145}
          maxWidth={CARD_W - 0.6}
          textAlign="center"
          color="#5b5345"
          anchorX="center"
          anchorY="middle"
        >
          {project.tagline}
        </Text>

        {/* bottom prompt */}
        <Text
          position={[0, -CARD_H / 2 + 0.34, 0]}
          fontSize={0.11}
          color="#8a8170"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.18}
        >
          {isFocused ? "" : "TAP TO OPEN"}
        </Text>
      </group>
    </group>
  );
}
