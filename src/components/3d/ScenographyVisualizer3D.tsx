'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { Sparkles as SparklesIcon, Moon, Flame, Trees, Eye, RotateCw, ArrowUpRight } from 'lucide-react';

type LightingPreset = 'golden_hour' | 'midnight_noir' | 'candlelight' | 'emerald_botanic';

interface PresetConfig {
  name: string;
  subtitle: string;
  mainColor: string;
  accentColor: string;
  ambientIntensity: number;
  spotIntensity: number;
  fogColor: string;
  luxRating: string;
  atmosphereNote: string;
}

const PRESETS: Record<LightingPreset, PresetConfig> = {
  golden_hour: {
    name: 'GOLDEN HOUR GALA',
    subtitle: 'Warm 2800K Amber & 24K Gold Specular Spec',
    mainColor: '#f5b041',
    accentColor: '#ffedd7',
    ambientIntensity: 0.6,
    spotIntensity: 35,
    fogColor: '#100904',
    luxRating: '180 Lux · Warm Intimate',
    atmosphereNote: 'Engineered for grand sunset toasts, heirloom floral highlights, and flattering portrait photography.'
  },
  midnight_noir: {
    name: 'MIDNIGHT NOIR VIP',
    subtitle: 'Deep Obsidian with Precision Ray-Traced Indigo Points',
    mainColor: '#6c5ce7',
    accentColor: '#a29bfe',
    ambientIntensity: 0.25,
    spotIntensity: 50,
    fogColor: '#050308',
    luxRating: '85 Lux · High Dramatic Contrast',
    atmosphereNote: 'High-jewelry galas & late-night dance debuts. Laser-cut contrast with maximum diamond sparkle.'
  },
  candlelight: {
    name: 'CANDLELIGHT ROMANCE',
    subtitle: 'Flickering 1800K Taper Candle Flame & Rose Gold',
    mainColor: '#e17055',
    accentColor: '#fab1a0',
    ambientIntensity: 0.35,
    spotIntensity: 25,
    fogColor: '#0e0604',
    luxRating: '65 Lux · Hypnotic Sensuality',
    atmosphereNote: 'Organic flame rhythm with soft rose gold undertones. Perfect for historic palazzos and intimate banquets.'
  },
  emerald_botanic: {
    name: 'EMERALD BOTANIC ELYSIUM',
    subtitle: 'Lush Forest Bioluminescence & Starlight Canopy',
    mainColor: '#00b894',
    accentColor: '#55efc4',
    ambientIntensity: 0.45,
    spotIntensity: 30,
    fogColor: '#020d06',
    luxRating: '120 Lux · Ethereal Enchantment',
    atmosphereNote: 'Designed for glasshouse and botanical garden nuptials with living ivy canopies.'
  }
};

// 3D Table Centerpiece & Architectural Setting
function TableScenographyScene({ preset }: { preset: PresetConfig }) {
  const tableRef = useRef<THREE.Group>(null);
  const candleLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (candleLightRef.current) {
      candleLightRef.current.intensity = preset.spotIntensity * (0.9 + Math.sin(t * 8) * 0.1 + Math.cos(t * 13) * 0.05);
    }
  });

  return (
    <group ref={tableRef} position={[0, -0.4, 0]}>
      {/* Banquet Mirror Table Top */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4.2, 0.12, 1.6]} />
        <meshStandardMaterial color="#100904" metalness={0.92} roughness={0.15} />
      </mesh>

      {/* Table Legs */}
      {[-1.8, 1.8].map((x, i) => (
        <mesh key={i} position={[x, -0.7, 0]}>
          <cylinderGeometry args={[0.04, 0.06, 1.3, 16]} />
          <meshStandardMaterial color="#382416" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* 5-Tier Crystal Candelabra Centerpiece */}
      <group position={[0, 0.1, 0]}>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.03, 0.08, 0.9, 24]} />
          <meshStandardMaterial color="#ffedd7" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.3, 0.35, 0.08, 32]} />
          <meshStandardMaterial color="#382416" metalness={0.9} roughness={0.2} />
        </mesh>

        {[-0.6, -0.3, 0, 0.3, 0.6].map((xOffset, idx) => {
          const height = 0.75 + Math.abs(xOffset) * 0.2;
          return (
            <group key={idx} position={[xOffset, height, 0]}>
              <mesh position={[0, -0.2, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 0.4, 16]} />
                <meshStandardMaterial color="#382416" metalness={0.8} />
              </mesh>
              <mesh position={[0, 0.1, 0]}>
                <cylinderGeometry args={[0.025, 0.025, 0.25, 16]} />
                <meshStandardMaterial color="#ffedd7" roughness={0.5} />
              </mesh>
              <mesh position={[0, 0.28, 0]}>
                <sphereGeometry args={[0.03, 16, 16]} />
                <meshBasicMaterial color={preset.mainColor} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Wine Stemware */}
      {[-1.4, -0.7, 0.7, 1.4].map((x, idx) => (
        <group key={idx}>
          <mesh position={[x, 0.07, 0.5]}>
            <cylinderGeometry args={[0.22, 0.2, 0.02, 32]} />
            <meshStandardMaterial color="#382416" metalness={0.85} roughness={0.15} />
          </mesh>
          <mesh position={[x + 0.15, 0.2, 0.38]}>
            <cylinderGeometry args={[0.04, 0.01, 0.25, 16]} />
            <meshPhysicalMaterial
              color="#ffffff"
              transmission={0.9}
              opacity={1}
              transparent
              roughness={0.05}
              ior={1.5}
            />
          </mesh>
        </group>
      ))}

      {/* Floating Botanical Arch Overhead */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
        <group position={[0, 1.6, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[1.8, 0.08, 16, 64, Math.PI]} />
            <meshStandardMaterial color="#1a0e08" roughness={0.8} />
          </mesh>
        </group>
      </Float>

      {/* Spot & Point Lights */}
      <pointLight
        ref={candleLightRef}
        position={[0, 1.2, 0]}
        intensity={preset.spotIntensity}
        color={preset.mainColor}
        distance={6}
      />
      <spotLight
        position={[3, 4, 3]}
        angle={0.5}
        penumbra={0.8}
        intensity={preset.spotIntensity * 0.7}
        color={preset.accentColor}
        castShadow
      />
    </group>
  );
}

export default function ScenographyVisualizer3D() {
  const [activePresetKey, setActivePresetKey] = useState<LightingPreset>('golden_hour');
  const [isClient, setIsClient] = useState(false);
  const activePreset = PRESETS[activePresetKey];

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="w-full bg-[#100904] border border-[#40372e] rounded-[12px] overflow-hidden text-[#ffedd7]">
      {/* Top Header & Interactive Mode Bar */}
      <div className="p-6 md:p-8 border-b border-[#40372e] flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[#100904]/90 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#dc5000] animate-ping" />
            <span className="font-display-halyard text-xs text-[#dc5000] tracking-wider uppercase">
              Live WebGL Scenography Simulator
            </span>
          </div>
          <h3 className="font-display-halyard text-2xl md:text-3xl text-[#ffedd7] uppercase">
            {activePreset.name}
          </h3>
          <p className="font-body-conversational text-sm text-[#ffedd7]/80 mt-1 max-w-xl">
            {activePreset.subtitle}
          </p>
        </div>

        {/* Preset Selector Buttons (Pill buttons from DESIGN-3.md) */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActivePresetKey('golden_hour')}
            className={`px-4 py-2 text-xs font-display-halyard tracking-wider uppercase transition-all rounded-[22.5px] flex items-center gap-2 ${
              activePresetKey === 'golden_hour'
                ? 'bg-[#382416] text-[#ffedd7] border border-[#ffedd7]'
                : 'bg-transparent text-[#6c5f51] hover:text-[#ffedd7] border border-[#40372e]'
            }`}
          >
            <SparklesIcon className="w-3.5 h-3.5 text-[#dc5000]" />
            Golden Hour
          </button>

          <button
            onClick={() => setActivePresetKey('midnight_noir')}
            className={`px-4 py-2 text-xs font-display-halyard tracking-wider uppercase transition-all rounded-[22.5px] flex items-center gap-2 ${
              activePresetKey === 'midnight_noir'
                ? 'bg-[#382416] text-[#ffedd7] border border-[#ffedd7]'
                : 'bg-transparent text-[#6c5f51] hover:text-[#ffedd7] border border-[#40372e]'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-[#6c5ce7]" />
            Midnight Noir
          </button>

          <button
            onClick={() => setActivePresetKey('candlelight')}
            className={`px-4 py-2 text-xs font-display-halyard tracking-wider uppercase transition-all rounded-[22.5px] flex items-center gap-2 ${
              activePresetKey === 'candlelight'
                ? 'bg-[#382416] text-[#ffedd7] border border-[#ffedd7]'
                : 'bg-transparent text-[#6c5f51] hover:text-[#ffedd7] border border-[#40372e]'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#e17055]" />
            Candlelight
          </button>

          <button
            onClick={() => setActivePresetKey('emerald_botanic')}
            className={`px-4 py-2 text-xs font-display-halyard tracking-wider uppercase transition-all rounded-[22.5px] flex items-center gap-2 ${
              activePresetKey === 'emerald_botanic'
                ? 'bg-[#382416] text-[#ffedd7] border border-[#ffedd7]'
                : 'bg-transparent text-[#6c5f51] hover:text-[#ffedd7] border border-[#40372e]'
            }`}
          >
            <Trees className="w-3.5 h-3.5 text-[#00b894]" />
            Emerald Botanic
          </button>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div className="relative w-full h-[460px] md:h-[520px] bg-[#100904] cursor-grab active:cursor-grabbing">
        {isClient ? (
          <Canvas
            camera={{ position: [0, 2.2, 4.2], fov: 42 }}
            gl={{ antialias: true }}
          >
            <color attach="background" args={[activePreset.fogColor]} />
            <fog attach="fog" args={[activePreset.fogColor, 4, 12]} />
            <ambientLight intensity={activePreset.ambientIntensity} />

            <TableScenographyScene preset={activePreset} />

            <Sparkles
              count={50}
              scale={5}
              size={1.6}
              speed={0.3}
              opacity={0.5}
              color={activePreset.accentColor}
            />

            <OrbitControls
              enablePan={false}
              maxPolarAngle={Math.PI / 2 - 0.05}
              minDistance={2.5}
              maxDistance={7}
              dampingFactor={0.05}
            />
          </Canvas>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border border-[#ffedd7] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Orbit Interaction Overlay */}
        <div className="absolute bottom-4 left-4 bg-[#100904]/80 backdrop-blur-md px-3.5 py-1.5 border border-[#40372e] rounded-[22.5px] flex items-center gap-2 text-xs font-mono text-[#ffedd7]/80 pointer-events-none">
          <RotateCw className="w-3.5 h-3.5 text-[#dc5000]" />
          Drag to orbit 360° · Scroll to zoom
        </div>

        {/* Metric Overlay */}
        <div className="absolute top-4 right-4 bg-[#100904]/80 backdrop-blur-md p-3 border border-[#40372e] rounded-[12px] text-right pointer-events-none">
          <div className="text-[10px] font-display-halyard text-[#6c5f51] uppercase">
            Photometric Spec
          </div>
          <div className="text-xs font-display-halyard text-[#ffedd7] mt-0.5">
            {activePreset.luxRating}
          </div>
        </div>
      </div>

      {/* Bottom Atmosphere Analysis */}
      <div className="p-6 bg-[#100904] border-t border-[#40372e] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[8px] bg-[#382416] border border-[#40372e] flex items-center justify-center text-[#ffedd7]">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-display-halyard text-[#6c5f51] uppercase">Planner&apos;s Scenography Notes</div>
            <p className="font-body-conversational text-sm text-[#ffedd7]/90 mt-0.5">{activePreset.atmosphereNote}</p>
          </div>
        </div>

        <a
          href="#inquiry"
          className="btn-pill-bark text-xs flex items-center gap-2 whitespace-nowrap"
        >
          <span>Commission This Scenography</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#dc5000]" />
        </a>
      </div>
    </div>
  );
}
