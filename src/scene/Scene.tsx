"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Stars } from "@react-three/drei";
import { Suspense } from "react";
import { CardField } from "./CardField";
import { CameraRig } from "./CameraRig";

export function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [9, 3.5, 17], fov: 45, near: 0.1, far: 300 }}
    >
      <color attach="background" args={["#08090d"]} />
      <fog attach="fog" args={["#08090d", 26, 90]} />

      {/* Soft futuristic lighting: cool key + warm rim. */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[8, 14, 10]}
        intensity={1.3}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={60}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[-14, 6, -10]} intensity={0.5} color="#7f9bff" />
      <pointLight position={[0, 6, 6]} intensity={30} distance={40} decay={2} color="#cfe0ff" />

      <Suspense fallback={null}>
        <CardField />
        <Environment preset="night" />
        <Stars radius={120} depth={60} count={1600} factor={2.2} fade speed={0.3} />
      </Suspense>

      <CameraRig />
    </Canvas>
  );
}
