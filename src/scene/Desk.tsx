"use client";

import { useMemo } from "react";
import * as THREE from "three";

/**
 * Vintage drafting desk: aged wood surface with grain, a large blueprint sheet,
 * a drafting ruler, and faint grid lines. Pure procedural (no texture files).
 */
export function Desk() {
  // Procedural wood-grain texture via canvas.
  const woodTex = useMemo(() => makeWoodTexture(), []);
  const blueTex = useMemo(() => makeBlueprintTexture(), []);

  return (
    <group>
      {/* Desk top */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[46, 32]} />
        <meshStandardMaterial map={woodTex} roughness={0.72} metalness={0.05} />
      </mesh>

      {/* Desk edge / thickness for depth */}
      <mesh position={[0, -0.6, 12]} receiveShadow>
        <boxGeometry args={[46, 1.1, 1.2]} />
        <meshStandardMaterial map={woodTex} roughness={0.8} />
      </mesh>

      {/* Blueprint sheet under the cards */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.4, -0.02, 1.2]} receiveShadow>
        <planeGeometry args={[16, 11]} />
        <meshStandardMaterial map={blueTex} roughness={0.9} metalness={0} />
      </mesh>
      {/* slight curl shadow edge of blueprint */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.4, -0.015, 1.2]}>
        <planeGeometry args={[16.3, 11.3]} />
        <meshBasicMaterial color="#0b2a3a" transparent opacity={0.25} />
      </mesh>

      {/* Drafting ruler (brass-edged) */}
      <mesh position={[-6.5, 0.02, 4.2]} rotation={[0, 0.18, 0]} castShadow>
        <boxGeometry args={[0.5, 0.06, 9]} />
        <meshStandardMaterial color="#caa45a" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* A couple of scattered pencils for character */}
      <mesh position={[6.3, 0.05, 3.4]} rotation={[0, -0.5, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 3.2, 6]} />
        <meshStandardMaterial color="#b8912f" roughness={0.6} />
      </mesh>
      <mesh position={[6.6, 0.05, 4.1]} rotation={[0, -0.35, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 2.8, 6]} />
        <meshStandardMaterial color="#8a5a2b" roughness={0.7} />
      </mesh>
    </group>
  );
}

function makeWoodTexture(): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 1024;
  const ctx = c.getContext("2d")!;
  // base
  const g = ctx.createLinearGradient(0, 0, 1024, 1024);
  g.addColorStop(0, "#3b2a1a");
  g.addColorStop(0.5, "#4a3523");
  g.addColorStop(1, "#2e2015");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 1024);
  // grain lines
  for (let i = 0; i < 160; i++) {
    const y = Math.random() * 1024;
    ctx.strokeStyle = `rgba(${20 + Math.random() * 30},${12 + Math.random() * 20},6,${0.08 + Math.random() * 0.12})`;
    ctx.lineWidth = 0.5 + Math.random() * 2.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= 1024; x += 32) {
      ctx.lineTo(x, y + Math.sin(x * 0.01 + i) * 6 + (Math.random() - 0.5) * 4);
    }
    ctx.stroke();
  }
  // darker knots
  for (let i = 0; i < 6; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const r = 10 + Math.random() * 24;
    const rg = ctx.createRadialGradient(x, y, 1, x, y, r);
    rg.addColorStop(0, "rgba(25,15,8,0.6)");
    rg.addColorStop(1, "rgba(25,15,8,0)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 1.4);
  tex.anisotropy = 4;
  return tex;
}

function makeBlueprintTexture(): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 704;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#123b52";
  ctx.fillRect(0, 0, c.width, c.height);
  // grid
  ctx.strokeStyle = "rgba(190,220,235,0.18)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= c.width; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, c.height);
    ctx.stroke();
  }
  for (let y = 0; y <= c.height; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(c.width, y);
    ctx.stroke();
  }
  // some "technical drawing" strokes
  ctx.strokeStyle = "rgba(220,235,245,0.5)";
  ctx.lineWidth = 2;
  ctx.strokeRect(120, 110, 420, 300);
  ctx.beginPath();
  ctx.arc(760, 360, 150, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(120, 500);
  ctx.lineTo(900, 500);
  ctx.stroke();
  // border frame + title block
  ctx.strokeStyle = "rgba(220,235,245,0.7)";
  ctx.lineWidth = 3;
  ctx.strokeRect(24, 24, c.width - 48, c.height - 48);
  ctx.strokeRect(c.width - 300, c.height - 150, 276, 126);
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}
