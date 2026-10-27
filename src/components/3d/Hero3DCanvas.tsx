'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshReflectorMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// 3D Metallic Sculpture / Monolith
function ChromeMonolith({ accentColor = '#d4af37' }: { accentColor?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const mouseX = state.pointer.x * 0.4;
    const mouseY = state.pointer.y * 0.4;

    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.2 + mouseY;
      meshRef.current.rotation.y = t * 0.4 + mouseX;
      meshRef.current.rotation.z = Math.cos(t * 0.2) * 0.15;
    }

    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.25 - mouseY * 0.5;
      ringRef.current.rotation.y = -t * 0.35 + mouseX * 0.5;
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.x = -t * 0.45;
      innerRingRef.current.rotation.z = t * 0.3;
    }
  });

  return (
    <group position={[0, 0.2, 0]}>
      {/* Central Complex Torus Knot / Architectural Form */}
      <Float speed={2} rotationIntensity={0.8} floatIntensity={1.2}>
        <mesh ref={meshRef} scale={1.45}>
          <torusKnotGeometry args={[1, 0.32, 128, 32, 2, 3]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.96}
            roughness={0.08}
            envMapIntensity={2.5}
          />
        </mesh>
      </Float>

      {/* Outer Slender Orbit Ring */}
      <mesh ref={ringRef} scale={2.5}>
        <torusGeometry args={[1.3, 0.02, 32, 100]} />
        <meshStandardMaterial
          color={accentColor}
          metalness={0.98}
          roughness={0.12}
          emissive={accentColor}
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Inner Gimbal Ring */}
      <mesh ref={innerRingRef} scale={1.9}>
        <torusGeometry args={[1.1, 0.015, 32, 100]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>
    </group>
  );
}

// Particle Constellation of Golden Stardust & Embers
function GoldParticleNebula({ count = 280, color = '#d4af37' }: { count?: number; color?: string }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sca = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const radius = 3.5 + Math.random() * 4.5;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
      sca[i] = Math.random() * 1.5 + 0.5;
    }
    return [pos, sca];
  }, [count]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.04;
      pointsRef.current.rotation.x = Math.sin(t * 0.03) * 0.08;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={color}
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

// Floor Reflection Plane
function ReflectiveFloor() {
  return (
    <mesh position={[0, -2.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[30, 30]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={512}
        mirror={0.4}
        mixBlur={1}
        mixStrength={40}
        roughness={0.4}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#080808"
        metalness={0.8}
      />
    </mesh>
  );
}

export default function Hero3DCanvas({ accentColor = '#d4af37' }: { accentColor?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="w-12 h-12 border border-[#d4af37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full absolute inset-0 pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0.4, 4.8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 4, 10]} />

        {/* Ambient & Cinematic Dramatic Spotlights */}
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 4, 4]} intensity={25} color="#ffffff" />
        <pointLight position={[-5, -2, -3]} intensity={15} color={accentColor} />
        <spotLight
          position={[0, 7, 3]}
          angle={0.4}
          penumbra={0.9}
          intensity={40}
          color="#ffffff"
          castShadow
        />

        {/* 3D Model Elements */}
        <ChromeMonolith accentColor={accentColor} />
        <GoldParticleNebula count={300} color={accentColor} />
        <Sparkles count={120} scale={6} size={2} speed={0.4} opacity={0.6} color={accentColor} />
        <ReflectiveFloor />
      </Canvas>
    </div>
  );
}
