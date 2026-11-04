"use client";

import * as THREE from "three";
import { projects } from "@/data/content";
import { ProjectCard } from "./ProjectCard";

export function CardField() {
  return (
    <group>
      {/* Reflective grid floor */}
      <gridHelper
        args={[80, 80, "#2a2d36", "#181a20"]}
        position={[0, -3.2, 0]}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.22, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#0b0c10" roughness={0.4} metalness={0.6} />
      </mesh>

      {projects.map((p, i) => (
        <ProjectCard key={p.id} index={i} project={p} />
      ))}
    </group>
  );
}

// Keep THREE import used (grid colors need Color coercion in some versions).
void THREE;
