"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "@/state/store";

type OrbitControlsImpl = React.ComponentRef<typeof OrbitControls>;
import { floorCenterY, buildingHeight, FRONT_Z } from "./layout";

const tmpPos = new THREE.Vector3();
const tmpLook = new THREE.Vector3();

/** Compute the desired camera position + look target for the current state. */
function computeTarget(
  view: string,
  activeFloor: number | null,
  scroll: number,
  outPos: THREE.Vector3,
  outLook: THREE.Vector3,
) {
  if (view === "intro") {
    // Cinematic establishing shot: tower sits to the right, camera low & wide,
    // leaving the left/center clear for the name.
    const y = buildingHeight * 0.5;
    outPos.set(13, y - 1.5, 22);
    outLook.set(-2.4, y + 1.5, 0);
    return;
  }

  if (view === "room" && activeFloor !== null) {
    // Inside the room: camera just in front of the doorway, looking in.
    const y = floorCenterY(activeFloor);
    outPos.set(0, y + 0.1, FRONT_Z + 2.2);
    outLook.set(0, y, 0);
    return;
  }

  if (activeFloor !== null) {
    // Approaching a specific floor: close, slightly angled, door-height.
    const y = floorCenterY(activeFloor);
    outPos.set(3.2, y + 1.1, FRONT_Z + 8);
    outLook.set(0, y - 0.1, 0);
    return;
  }

  // Exterior free view: scroll drives vertical height along the building.
  // Pulled back for a full, elegant 3/4 framing of the whole tower.
  const y = THREE.MathUtils.lerp(buildingHeight * 0.78, buildingHeight * 0.26, scroll);
  outPos.set(11, y + 3, 20);
  outLook.set(0, y, 0);
}

export function CameraRig() {
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const view = useStore((s) => s.view);
  const activeFloor = useStore((s) => s.activeFloor);
  const scroll = useStore((s) => s.scroll);

  // When the user is in free exterior view with no focused floor, let OrbitControls
  // own the camera (orbit + zoom). Otherwise we drive it programmatically.
  const orbitActive = view === "exterior" && activeFloor === null;

  useFrame((_, dt) => {
    if (orbitActive) {
      // Still ease the orbit target vertically with scroll so scrolling pans up/down.
      if (controls.current) {
        computeTarget(view, activeFloor, scroll, tmpPos, tmpLook);
        controls.current.target.y = THREE.MathUtils.damp(controls.current.target.y, tmpLook.y, 3, dt);
        controls.current.update();
      }
      return;
    }

    computeTarget(view, activeFloor, scroll, tmpPos, tmpLook);
    const k = view === "room" ? 4.5 : 3.2;
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
      minDistance={6}
      maxDistance={30}
      minPolarAngle={Math.PI * 0.12}
      maxPolarAngle={Math.PI * 0.52}
      enableDamping
      dampingFactor={0.08}
    />
  );
}
