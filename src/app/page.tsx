"use client";

import dynamic from "next/dynamic";
import { Hud } from "@/ui/Hud";

// WebGL canvas must be client-only.
const Scene = dynamic(() => import("@/scene/Scene").then((m) => m.Scene), {
  ssr: false,
  loading: () => (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",
        color: "var(--fg-faint)",
        fontSize: 12,
        letterSpacing: "0.3em",
        textTransform: "uppercase",
      }}
    >
      Loading
    </div>
  ),
});

export default function Home() {
  return (
    <main style={{ position: "fixed", inset: 0 }}>
      <Scene />
      <Hud />
    </main>
  );
}
