"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function JarModel() {
  const jarRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const grainsCount = 45;
  const grainPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < grainsCount; i++) {
      const r = Math.random() * 0.6;
      const theta = Math.random() * Math.PI * 2;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      const y = (Math.random() - 0.5) * 1.5;
      positions.push({ x, y, z, scale: 0.05 + Math.random() * 0.04 });
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (!jarRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Swaying float effect
    jarRef.current.position.y = Math.sin(time * 1.2) * 0.12;
    
    // Handle hover speed increase
    const targetSpeed = hovered ? 0.06 : 0.01;
    jarRef.current.rotation.y += targetSpeed;
    jarRef.current.rotation.x = Math.sin(time * 0.4) * 0.06;
  });

  return (
    <group 
      ref={jarRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Cap */}
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.2, 24]} />
        <meshStandardMaterial color="#c69a75" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Glass Jar Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.75, 0.75, 2.0, 24, 1, true]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.25}
          roughness={0.05}
          metalness={0.1}
          transmission={0.9}
          thickness={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Base */}
      <mesh position={[0, -1.0, 0]}>
        <cylinderGeometry args={[0.75, 0.75, 0.05, 24]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.25}
          roughness={0.05}
          transmission={0.9}
        />
      </mesh>

      {/* Floating Grains */}
      <group>
        {grainPositions.map((p, idx) => (
          <mesh 
            key={idx} 
            position={[p.x, p.y, p.z]} 
            scale={[p.scale, p.scale * 1.8, p.scale]}
            rotation={[Math.random() * 2, Math.random() * 2, Math.random() * 2]}
          >
            <sphereGeometry args={[1, 5, 5]} />
            <meshStandardMaterial
              color="#f5c842"
              roughness={0.4}
              metalness={0.15}
              emissive="#f5c842"
              emissiveIntensity={0.1}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function InteractiveJar() {
  return (
    <div className="h-64 w-full relative">
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.1} />
        <pointLight position={[5, 5, 5]} intensity={1.0} color="#ffffff" />
        <pointLight position={[-5, -5, -5]} intensity={0.4} color="#f5c842" />
        <directionalLight position={[0, 5, 0]} intensity={0.6} />
        <JarModel />
      </Canvas>
    </div>
  );
}
