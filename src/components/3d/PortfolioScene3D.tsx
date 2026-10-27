'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useEffect, useMemo, useRef } from 'react';

function EventTable() {
  const group = useRef<THREE.Group>(null);
  const centerpiece = useRef<THREE.Group>(null);
  const scrollTarget = useRef(0);
  const scrollValue = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      scrollTarget.current = THREE.MathUtils.clamp(window.scrollY / maxScroll, 0, 1);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useFrame((state, delta) => {
    if (!group.current || !centerpiece.current) return;
    scrollValue.current = THREE.MathUtils.damp(scrollValue.current, scrollTarget.current, 3.5, delta);
    const scroll = scrollValue.current;
    const time = state.clock.elapsedTime;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, time * 0.12 + scroll * Math.PI * 1.4, 3, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -0.12 + Math.sin(time * 0.32) * 0.04 + scroll * 0.18, 3, delta);
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, -0.25 + Math.sin(time * 0.55) * 0.05 + scroll * 0.5, 3, delta);
    centerpiece.current.rotation.y = -time * 0.2 - scroll * Math.PI;
    centerpiece.current.position.y = Math.sin(time * 0.8) * 0.04;
  });

  const settings = useMemo(() => [0, 1, 2, 3].map((index) => {
    const angle = (index / 4) * Math.PI * 2;
    return { angle, x: Math.cos(angle) * 1.55, z: Math.sin(angle) * 1.55 };
  }), []);

  return <group ref={group} scale={0.92}>
    <mesh position={[0, -0.64, 0]}><cylinderGeometry args={[2.45, 2.65, 0.24, 64]} /><meshStandardMaterial color="#6b4a35" roughness={0.45} metalness={0.18} /></mesh>
    <mesh position={[0, -0.95, 0]}><cylinderGeometry args={[0.42, 0.68, 0.7, 32]} /><meshStandardMaterial color="#3e3028" roughness={0.5} /></mesh>
    <mesh position={[0, -0.58, 0]} rotation={[0, 0.1, 0]}><torusGeometry args={[2.18, 0.035, 12, 64]} /><meshStandardMaterial color="#d3a75c" metalness={0.8} roughness={0.2} /></mesh>
    {settings.map(({ angle, x, z }) => <group key={angle} position={[x, -0.42, z]} rotation={[0, -angle, 0]}><mesh rotation={[-Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.43, 0.43, 0.04, 32]} /><meshStandardMaterial color="#f7f1e6" roughness={0.28} /></mesh><mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[0.31, 0.025, 12, 48]} /><meshStandardMaterial color="#c5673e" metalness={0.55} roughness={0.25} /></mesh><mesh position={[0, 0.08, -0.15]}><cylinderGeometry args={[0.045, 0.045, 0.38, 12]} /><meshStandardMaterial color="#d3a75c" metalness={0.72} roughness={0.22} /></mesh></group>)}
    <group ref={centerpiece} position={[0, -0.3, 0]}>{[0, 1, 2, 3, 4, 5].map((index) => { const angle = index * Math.PI / 3; return <mesh key={index} position={[Math.cos(angle) * 0.48, Math.sin(index * 1.7) * 0.08, Math.sin(angle) * 0.48]}><sphereGeometry args={[0.22 + (index % 2) * 0.05, 18, 18]} /><meshStandardMaterial color={index % 2 ? '#d8b9a8' : '#a9b5a1'} roughness={0.35} /></mesh>; })}<mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.34, 0.42, 0.18, 32]} /><meshStandardMaterial color="#f7f1e6" roughness={0.3} /></mesh></group>
    {[[-0.92, -0.12, 0.2], [0.92, -0.12, -0.2]].map(([x, y, z], index) => <group key={index} position={[x, y, z]}><mesh><cylinderGeometry args={[0.11, 0.16, 0.38, 20]} /><meshStandardMaterial color="#d3a75c" metalness={0.75} roughness={0.2} /></mesh><mesh position={[0, 0.28, 0]}><sphereGeometry args={[0.1, 16, 16]} /><meshBasicMaterial color="#f6b45d" /></mesh></group>)}
  </group>;
}

function Scene() {
  const particles = useMemo(() => { const values = new Float32Array(180 * 3); for (let index = 0; index < 180; index += 1) { const angle = index * 2.39996; const radius = 2.4 + (index % 17) * 0.085; values[index * 3] = Math.cos(angle) * radius; values[index * 3 + 1] = ((index % 23) - 11) * 0.11; values[index * 3 + 2] = Math.sin(angle) * radius; } return values; }, []);
  return <><ambientLight intensity={1.35} color="#fff7e8" /><pointLight position={[3, 3, 4]} intensity={8} distance={8} color="#f4b86a" /><pointLight position={[-3, -1, 2]} intensity={5} distance={7} color="#c5673e" /><EventTable /><points><bufferGeometry><bufferAttribute attach="attributes-position" args={[particles, 3]} /></bufferGeometry><pointsMaterial color="#fff5dd" size={0.025} transparent opacity={0.62} sizeAttenuation /></points><Sparkles count={70} scale={5} size={2.2} speed={0.22} color="#d3a75c" opacity={0.6} /></>;
}

export default function PortfolioScene3D() { return <div className="portfolio-scene" aria-hidden="true"><Canvas camera={{ position: [0, 0.1, 5.3], fov: 38 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}><Scene /></Canvas></div>; }
