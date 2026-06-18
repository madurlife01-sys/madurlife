"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FloatingIngredientsProps {
  categorySlug?: string;
}

function Ingredients({ categorySlug = "default" }: { categorySlug: string }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const count = 50;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const isSpices = categorySlug.includes("spice") || categorySlug.includes("masala");
  const isGrains = categorySlug.includes("grain") || categorySlug.includes("flour");

  const color = isSpices ? "#e63946" : isGrains ? "#dcdcd4" : "#f5c842";
  const emissiveColor = isSpices ? "#b01a25" : isGrains ? "#8f8f87" : "#c4981d";

  const particleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 8,
        z: (Math.random() - 0.5) * 4,
        speedX: 0.05 + Math.random() * 0.08,
        speedY: 0.04 + Math.random() * 0.12,
        rotSpeed: 0.15 + Math.random() * 0.3,
        scale: 0.4 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return data;
  }, []);

  useFrame(({ clock, pointer }) => {
    if (!mesh.current) return;

    const time = clock.getElapsedTime();
    const mouseX = pointer.x * 0.5;
    const mouseY = pointer.y * 0.5;

    particleData.forEach((p, i) => {
      const floatY = p.y + Math.sin(time * p.speedY + p.phase) * 0.3;
      const floatX = p.x + Math.cos(time * p.speedX + p.phase) * 0.3;

      dummy.position.set(floatX + mouseX * (1 - p.z / 6), floatY + mouseY * (1 - p.z / 6), p.z);
      
      if (isGrains) {
        dummy.scale.set(p.scale * 0.06, p.scale * 0.14, p.scale * 0.06);
      } else if (isSpices) {
        dummy.scale.setScalar(p.scale * 0.08);
      } else {
        dummy.scale.setScalar(p.scale * 0.07);
      }

      dummy.rotation.set(
        time * p.rotSpeed + p.phase,
        time * p.rotSpeed * 0.4 + p.phase,
        time * p.rotSpeed * 0.1
      );

      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });

    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      {isGrains ? (
        <coneGeometry args={[1, 2, 4]} />
      ) : (
        <sphereGeometry args={[1, 6, 6]} />
      )}
      <meshStandardMaterial
        color={color}
        roughness={0.4}
        metalness={0.1}
        emissive={emissiveColor}
        emissiveIntensity={0.2}
      />
    </instancedMesh>
  );
}

export function FloatingIngredients({ categorySlug = "default" }: FloatingIngredientsProps) {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false }}
        onCreated={({ gl }) => {
          gl.setClearColor("#fafaf5", 0);
        }}
      >
        <ambientLight intensity={1.3} />
        <pointLight position={[3, 3, 3]} intensity={0.8} />
        <Ingredients categorySlug={categorySlug} />
      </Canvas>
    </div>
  );
}
