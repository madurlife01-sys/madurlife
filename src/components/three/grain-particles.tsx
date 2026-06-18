"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const count = 120;

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        x: (Math.random() - 0.5) * 14,
        y: (Math.random() - 0.5) * 9,
        z: (Math.random() - 0.5) * 6,
        speed: 0.08 + Math.random() * 0.2,
        amplitude: 0.15 + Math.random() * 0.35,
        scale: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return data;
  }, []);

  useFrame(({ clock, pointer }) => {
    if (!mesh.current) return;

    const time = clock.getElapsedTime();
    const targetMouseX = pointer.x * 0.6;
    const targetMouseY = pointer.y * 0.6;

    particleData.forEach((p, i) => {
      const floatY = p.y + Math.sin(time * p.speed + p.phase) * p.amplitude;
      const floatX = p.x + Math.cos(time * p.speed * 0.5 + p.phase) * p.amplitude;
      
      const depthFactor = (6 - p.z) / 6;
      const finalX = floatX + targetMouseX * depthFactor * 1.2;
      const finalY = floatY + targetMouseY * depthFactor * 1.2;

      dummy.position.set(finalX, finalY, p.z);
      dummy.scale.setScalar(p.scale * 0.08);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });

    mesh.current.instanceMatrix.needsUpdate = true;
    mesh.current.rotation.y = time * 0.015;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, count]}
      position={[0, 0, 0]}
    >
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial 
        color="#f5c842" 
        roughness={0.3}
        metalness={0.1}
        emissive="#f5c842"
        emissiveIntensity={0.1}
      />
    </instancedMesh>
  );
}

export function GrainParticles() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false }}
        onCreated={({ gl }) => {
          gl.setClearColor("#fafaf5", 0);
        }}
      >
        <ambientLight intensity={1.2} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
        <directionalLight position={[-5, 5, -5]} intensity={0.4} color="#f5c842" />
        <Particles />
      </Canvas>
    </div>
  );
}
