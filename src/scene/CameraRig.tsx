"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "@/state/store";
import { DESK_CAMERA, READ_CAMERA } from "./layout";

type OrbitControlsImpl = React.ComponentRef<typeof OrbitControls>;

const tmpPos = new THREE.Vector3();
const tmpLook = new THREE.Vector3();

function computeTarget(
  view: string,
  _activeCard: number | null,
  outPos: THREE.Vector3,
  outLook: THREE.Vector3,
) {
  if (view === "room" || view === "focus") {
    outPos.copy(READ_CAMERA.pos);
    outLook.copy(READ_CAMERA.look);
    return;
  }

  if (view === "intro") {
    // Slightly pulled-back desk establishing shot.
    outPos.set(DESK_CAMERA.pos.x + 2, DESK_CAMERA.pos.y + 1.5, DESK_CAMERA.pos.z + 3);
    outLook.copy(DESK_CAMERA.look);
    return;
  }

  // Free "space" view: desk overview (OrbitControls takes over interaction).
  outPos.copy(DESK_CAMERA.pos);
  outLook.copy(DESK_CAMERA.look);
}

export function CameraRig() {
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const view = useStore((s) => s.view);
  const activeCard = useStore((s) => s.activeFloor);

  // OrbitControls owns the camera only in free "space" view.
  const orbitActive = view === "space";

  useFrame((_, dt) => {
    if (orbitActive) {
      if (controls.current) controls.current.update();
      return;
    }

    computeTarget(view, activeCard, tmpPos, tmpLook);
    const k = view === "room" || view === "focus" ? 3.6 : 2.6;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, tmpPos.x, k, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, tmpPos.y, k, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, tmpPos.z, k, dt);

    if (controls.current) {
      controls.current.target.x = THREE.MathUtils.damp(controls.current.target.x, tmpLook.x, k, dt);
      controls.current.target.y = THREE.MathUtils.damp(controls.current.target.y, tmpLook.y, k, dt);
      controls.current.target.z = THREE.MathUtils.damp(controls.current.target.z, tmpLook.z, k, dt);
      controls.current.update();
    } else {
      camera.lookAt(tmpLook);
    }
  });

  return (
    <OrbitControls
      ref={controls}
      enabled={orbitActive}
      enablePan={false}
      minDistance={5}
      maxDistance={14}
      minPolarAngle={Math.PI * 0.12}
      maxPolarAngle={Math.PI * 0.46}
      enableDamping
      dampingFactor={0.08}
    />
  );
}
