"use client";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Suspense } from "react";
import { CardField } from "./CardField";
import { CameraRig } from "./CameraRig";

export function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [2, 7.5, 10], fov: 42, near: 0.1, far: 200 }}
    >
      {/* Warm, dim room around the desk */}
      <color attach="background" args={["#0d0b08"]} />
      <fog attach="fog" args={["#0d0b08", 24, 60]} />

      <ambientLight intensity={0.35} color="#ffead0" />

      {/* Desk lamp: warm key light from upper-left, casting soft shadows */}
      <spotLight
        position={[-6, 11, 6]}
        angle={0.7}
        penumbra={0.6}
        intensity={420}
        distance={40}
        color="#ffdca8"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
      />
      {/* Cool fill from the right to keep shadows from going muddy */}
      <directionalLight position={[8, 6, 4]} intensity={0.35} color="#9fb6d8" />
      {/* Gentle warm bounce */}
      <pointLight position={[0, 2, 6]} intensity={14} distance={24} decay={2} color="#ffcf9a" />

      <Suspense fallback={null}>
        <CardField />
        <Environment preset="apartment" />
      </Suspense>

      <CameraRig />
    </Canvas>
  );
}
