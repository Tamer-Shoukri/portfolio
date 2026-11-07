"use client";

import { projects } from "@/data/content";
import { ProjectCard } from "./ProjectCard";
import { Desk } from "./Desk";

export function CardField() {
  return (
    <group>
      <Desk />
      {projects.map((p, i) => (
        <ProjectCard key={p.id} index={i} project={p} />
      ))}
    </group>
  );
}
