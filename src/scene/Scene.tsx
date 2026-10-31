"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, Stars } from "@react-three/drei";
import { Suspense } from "react";
import { Building } from "./Building";
import { CameraRig } from "./CameraRig";
import { buildingHeight } from "./layout";

export function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [13, buildingHeight * 0.5 - 1.5, 22], fov: 42, near: 0.1, far: 200 }}
    >
      <color attach="background" args={["#0e0f12"]} />
      <fog attach="fog" args={["#0e0f12", 24, 70]} />

      {/* Key + fill + rim lighting for an architectural-viz feel */}
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[10, buildingHeight + 8, 8]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={60}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={30}
        shadow-camera-bottom={-5}
      />
      <directionalLight position={[-12, 6, -8]} intensity={0.4} color="#8fa6ff" />

      <Suspense fallback={null}>
        <Building />
        <Environment preset="city" />
        <Stars radius={90} depth={50} count={700} factor={1.6} fade speed={0.3} />
      </Suspense>

      <ContactShadows position={[0, 0.01, 0]} opacity={0.5} scale={30} blur={2.4} far={10} />

      <CameraRig />
    </Canvas>
  );
}
