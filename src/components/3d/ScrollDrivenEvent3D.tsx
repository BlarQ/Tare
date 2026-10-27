'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface ScrollDrivenEvent3DProps {
  currentStage: number; // 0 to 10
  progress: number;     // 0 to 1
}

// Stage camera targets and smooth framing for the table story
const STAGE_CAMERA_CONFIGS = [
  // Stage 0: Hero - Looking at the empty table & floating wavy silk tablecloth high above
  { pos: [0, 0.95, 4.3], rot: [-0.14, 0, 0], fov: 42, lightIntensity: 2.8, colorTemp: '#fff6eb' },
  // Stage 1: Philosophy - Tablecloth billowing & flowing down in mid-air over the table
  { pos: [-0.8, 0.8, 3.8], rot: [-0.1, -0.22, 0], fov: 40, lightIntensity: 3.0, colorTemp: '#ffd4a3' },
  // Stage 2: Event 1 - Tablecloth covers table completely with flared wavy draped folds
  { pos: [1.15, 0.85, 3.6], rot: [-0.14, 0.3, 0], fov: 42, lightIntensity: 3.2, colorTemp: '#fff6eb' },
  // Stage 3: Event 2 - Charger & dinner plates descend into place
  { pos: [-1.2, 0.9, 3.4], rot: [-0.16, -0.34, 0], fov: 40, lightIntensity: 3.2, colorTemp: '#ffe082' },
  // Stage 4: Event 3 - Gold cutlery & folded napkins fly into place
  { pos: [0.85, 1.05, 3.3], rot: [-0.22, 0.24, 0], fov: 42, lightIntensity: 3.4, colorTemp: '#ffecb3' },
  // Stage 5: Event 4 - Crystal glassware & champagne flutes materialize
  { pos: [-0.65, 0.85, 3.2], rot: [-0.15, -0.18, 0], fov: 38, lightIntensity: 3.4, colorTemp: '#ffcc80' },
  // Stage 6: Event 5 - Decanters & champagne bottles settle on the table
  { pos: [1.05, 0.75, 3.4], rot: [-0.12, 0.28, 0], fov: 42, lightIntensity: 3.3, colorTemp: '#fff6eb' },
  // Stage 7: Track Record - Floral orchid runner spreads across table center
  { pos: [0, 1.15, 3.5], rot: [-0.26, 0, 0], fov: 42, lightIntensity: 3.2, colorTemp: '#ffd8a8' },
  // Stage 8: Services - Grand Candelabra descends to center
  { pos: [-0.95, 0.65, 3.5], rot: [-0.1, -0.24, 0], fov: 40, lightIntensity: 3.4, colorTemp: '#fff6eb' },
  // Stage 9: VIP Intake - Grand Finale: Candles ignite, glasses glimmer, stardust flourishes
  { pos: [0, 0.65, 3.6], rot: [-0.08, 0, 0], fov: 40, lightIntensity: 3.6, colorTemp: '#ffe8cc' },
  // Stage 10: FULL UNOBSTRUCTED BANQUET TABLE SHOWCASE - Cinematic 3/4 beauty angle
  { pos: [1.3, 0.85, 3.6], rot: [-0.14, 0.35, 0], fov: 42, lightIntensity: 3.8, colorTemp: '#fff6eb' },
];

// Reusable Candle Flame with dynamic flicker
function CandleFlame({ position, intensity = 1, visible = true }: { position: [number, number, number]; intensity?: number; visible?: boolean }) {
  const lightRef = useRef<THREE.PointLight>(null);
  const flameMesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!visible) {
      if (lightRef.current) lightRef.current.intensity = 0;
      if (flameMesh.current) flameMesh.current.scale.set(0, 0, 0);
      return;
    }

    const t = state.clock.getElapsedTime();
    if (lightRef.current) {
      lightRef.current.intensity = intensity * (1.3 + Math.sin(t * 7 + position[0] * 3) * 0.3 + Math.cos(t * 11) * 0.2);
    }
    if (flameMesh.current) {
      flameMesh.current.scale.set(
        1 + Math.sin(t * 8) * 0.15,
        1 + Math.cos(t * 6) * 0.22,
        1 + Math.sin(t * 9) * 0.15
      );
    }
  });

  return (
    <group position={position}>
      <mesh ref={flameMesh} position={[0, 0.12, 0]}>
        <coneGeometry args={[0.038, 0.14, 16]} />
        <meshBasicMaterial color="#ffb703" />
      </mesh>
      <pointLight ref={lightRef} distance={4.5} decay={2} color="#ffe8cc" intensity={visible ? intensity : 0} />
    </group>
  );
}

// 1. Raw Banquet Table Plinth with rich ebony wood and 24K gold accents
function BanquetTable({ goldMat, woodMat }: { goldMat: THREE.Material; woodMat: THREE.Material }) {
  return (
    <group position={[0, -0.65, 0]}>
      {/* Table Top Surface */}
      <mesh position={[0, 0.35, 0]} material={woodMat}>
        <boxGeometry args={[3.2, 0.1, 1.8]} />
      </mesh>
      {/* Gold Trim Bevel */}
      <mesh position={[0, 0.3, 0]} material={goldMat}>
        <boxGeometry args={[3.24, 0.04, 1.84]} />
      </mesh>
      {/* 4 Architectural Table Pedestal Legs */}
      {[
        [-1.3, -0.15, -0.65],
        [1.3, -0.15, -0.65],
        [-1.3, -0.15, 0.65],
        [1.3, -0.15, 0.65],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh material={woodMat}>
            <cylinderGeometry args={[0.08, 0.1, 0.9, 16]} />
          </mesh>
          <mesh position={[0, -0.42, 0]} material={goldMat}>
            <cylinderGeometry args={[0.13, 0.15, 0.06, 16]} />
          </mesh>
          <mesh position={[0, 0.42, 0]} material={goldMat}>
            <cylinderGeometry args={[0.13, 0.11, 0.06, 16]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 2. Procedural Wavy Flared Silk Tablecloth with organic fabric waves & cascading ruffled skirts
function OrganicFlaredTablecloth({ currentStage, silkMat }: { currentStage: number; silkMat: THREE.Material }) {
  const clothGroupRef = useRef<THREE.Group>(null);
  const frontMeshRef = useRef<THREE.Mesh>(null);
  const backMeshRef = useRef<THREE.Mesh>(null);
  const leftMeshRef = useRef<THREE.Mesh>(null);
  const rightMeshRef = useRef<THREE.Mesh>(null);
  const topMeshRef = useRef<THREE.Mesh>(null);

  // Create custom high-subdivision geometries with sinusoidal wavy folds and flared hem curves
  const frontGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(3.5, 0.75, 48, 16);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Sinusoidal fabric wave across x
      const wave = Math.sin(x * 6.5) * 0.08 + Math.cos(x * 12.0) * 0.03;
      // Flare outward at the bottom hem
      const flare = (0.375 - y) * 0.18;
      pos.setZ(i, wave + flare);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const backGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(3.5, 0.75, 48, 16);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const wave = Math.sin(x * 6.5) * 0.08 + Math.sin(x * 11.0) * 0.03;
      const flare = (0.375 - y) * 0.18;
      pos.setZ(i, -wave - flare);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const sideGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(2.1, 0.75, 32, 16);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const wave = Math.sin(x * 7.0) * 0.07;
      const flare = (0.375 - y) * 0.18;
      pos.setZ(i, wave + flare);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const topGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(3.4, 2.0, 32, 24);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);

  useFrame((state, delta) => {
    if (!clothGroupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Stage 0: Floating high (y = 1.35), undulating billowing silk veil
    // Stage 1: Descending over the table in mid-air (y = 0.38)
    // Stage 2+: Fully draped over the table with ruffled flared skirts (y = -0.28)
    let targetY = 1.35;
    let targetScaleY = 0.35;
    let targetRotX = Math.sin(t * 0.8) * 0.09;
    let targetRotZ = Math.cos(t * 0.6) * 0.06;

    if (currentStage === 0) {
      targetY = 1.35 + Math.sin(t * 0.9) * 0.07;
      targetScaleY = 0.38;
    } else if (currentStage === 1) {
      targetY = 0.38 + Math.sin(t * 1.2) * 0.04;
      targetScaleY = 0.72;
    } else {
      targetY = -0.28;
      targetScaleY = 1.0;
      targetRotX = 0;
      targetRotZ = 0;
    }

    clothGroupRef.current.position.y = THREE.MathUtils.damp(clothGroupRef.current.position.y, targetY, 3.5, delta);
    clothGroupRef.current.rotation.x = THREE.MathUtils.damp(clothGroupRef.current.rotation.x, targetRotX, 3.0, delta);
    clothGroupRef.current.rotation.z = THREE.MathUtils.damp(clothGroupRef.current.rotation.z, targetRotZ, 3.0, delta);
    clothGroupRef.current.scale.y = THREE.MathUtils.damp(clothGroupRef.current.scale.y, targetScaleY, 3.5, delta);
  });

  return (
    <group ref={clothGroupRef} position={[0, 1.35, 0]}>
      {/* Top Silk Tablecloth surface */}
      <mesh ref={topMeshRef} geometry={topGeo} material={silkMat} position={[0, 0, 0]} />

      {/* Draped Organic Flared Front Skirt */}
      <mesh ref={frontMeshRef} geometry={frontGeo} material={silkMat} position={[0, -0.37, 1.0]} />

      {/* Draped Organic Flared Back Skirt */}
      <mesh ref={backMeshRef} geometry={backGeo} material={silkMat} position={[0, -0.37, -1.0]} rotation={[0, Math.PI, 0]} />

      {/* Draped Organic Flared Left Skirt */}
      <mesh ref={leftMeshRef} geometry={sideGeo} material={silkMat} position={[-1.7, -0.37, 0]} rotation={[0, -Math.PI / 2, 0]} />

      {/* Draped Organic Flared Right Skirt */}
      <mesh ref={rightMeshRef} geometry={sideGeo} material={silkMat} position={[1.7, -0.37, 0]} rotation={[0, Math.PI / 2, 0]} />

      {/* 4 Flared Waterfall Corner Cascade Folds */}
      {[
        [-1.7, 1.0, 0.75],
        [1.7, 1.0, 2.35],
        [-1.7, -1.0, -0.75],
        [1.7, -1.0, -2.35],
      ].map(([cx, cz, crot], i) => (
        <group key={i} position={[cx as number, -0.37, cz as number]} rotation={[0, crot as number, 0]}>
          <mesh material={silkMat}>
            <cylinderGeometry args={[0.06, 0.22, 0.75, 16, 1, true, 0, Math.PI * 0.7]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 3. Charger Dishes & Porcelain Plates with Brilliant Gold Mirror Rims
function PlaceSettingsPlates({ currentStage, goldMat, chinaMat }: { currentStage: number; goldMat: THREE.Material; chinaMat: THREE.Material }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const isPlaced = currentStage >= 3;
    const targetY = isPlaced ? -0.27 : 2.5;
    const targetScale = isPlaced ? 1 : 0.01;

    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 3.5, delta);
    groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 3.5, delta));
  });

  const placeCoords = [
    [-1.0, 0.65],
    [0, 0.65],
    [1.0, 0.65],
    [-1.0, -0.65],
    [0, -0.65],
    [1.0, -0.65],
  ];

  return (
    <group ref={groupRef} position={[0, 2.5, 0]}>
      {placeCoords.map(([x, z], idx) => (
        <group key={idx} position={[x, 0, z]}>
          {/* Gold Mirror Charger Plate */}
          <mesh position={[0, 0.01, 0]} material={goldMat}>
            <cylinderGeometry args={[0.26, 0.24, 0.016, 32]} />
          </mesh>
          {/* Luminous Porcelain Dinner Plate */}
          <mesh position={[0, 0.026, 0]} material={chinaMat}>
            <cylinderGeometry args={[0.21, 0.19, 0.014, 32]} />
          </mesh>
          {/* Fine Bone China Salad Plate */}
          <mesh position={[0, 0.04, 0]} material={chinaMat}>
            <cylinderGeometry args={[0.16, 0.14, 0.012, 32]} />
          </mesh>
          {/* Inner 24K Gold Ring Filigree */}
          <mesh position={[0, 0.048, 0]} material={goldMat}>
            <ringGeometry args={[0.11, 0.13, 32]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 4. Mirror Gold Cutlery & Folded Silk Napkins
function PlaceSettingsCutlery({ currentStage, goldMat, silkMat }: { currentStage: number; goldMat: THREE.Material; silkMat: THREE.Material }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const isPlaced = currentStage >= 4;
    const targetY = isPlaced ? -0.27 : 2.5;
    const targetScale = isPlaced ? 1 : 0.01;

    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 3.5, delta);
    groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 3.5, delta));
  });

  const placeCoords = [
    [-1.0, 0.65],
    [0, 0.65],
    [1.0, 0.65],
    [-1.0, -0.65],
    [0, -0.65],
    [1.0, -0.65],
  ];

  return (
    <group ref={groupRef} position={[0, 2.5, 0]}>
      {placeCoords.map(([x, z], idx) => (
        <group key={idx} position={[x, 0, z]}>
          {/* Dinner Fork (Left) */}
          <mesh position={[-0.32, 0.02, 0]} material={goldMat}>
            <boxGeometry args={[0.032, 0.01, 0.38]} />
          </mesh>
          {/* Salad Fork (Left outer) */}
          <mesh position={[-0.38, 0.02, 0]} material={goldMat}>
            <boxGeometry args={[0.028, 0.01, 0.32]} />
          </mesh>
          {/* Dinner Knife (Right) */}
          <mesh position={[0.32, 0.02, 0]} material={goldMat}>
            <boxGeometry args={[0.032, 0.01, 0.4]} />
          </mesh>
          {/* Dessert Spoon (Right outer) */}
          <mesh position={[0.38, 0.02, 0]} material={goldMat}>
            <boxGeometry args={[0.034, 0.01, 0.34]} />
          </mesh>
          {/* Folded Silk Napkin with Gold Ring */}
          <group position={[0, 0.058, 0]}>
            <mesh material={silkMat}>
              <boxGeometry args={[0.11, 0.028, 0.22]} />
            </mesh>
            <mesh material={goldMat}>
              <torusGeometry args={[0.038, 0.009, 12, 24]} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

// 5. Crystal Glassware (Wine Glasses & Champagne Flutes) with Refractive Glints
function PlaceSettingsGlassware({ currentStage, crystalMat, goldMat }: { currentStage: number; crystalMat: THREE.Material; goldMat: THREE.Material }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const isPlaced = currentStage >= 5;
    const targetY = isPlaced ? -0.27 : 2.5;
    const targetScale = isPlaced ? 1 : 0.01;

    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 3.5, delta);
    groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 3.5, delta));
  });

  const placeCoords = [
    [-1.0, 0.65],
    [0, 0.65],
    [1.0, 0.65],
    [-1.0, -0.65],
    [0, -0.65],
    [1.0, -0.65],
  ];

  return (
    <group ref={groupRef} position={[0, 2.5, 0]}>
      {placeCoords.map(([x, z], idx) => {
        const sign = z > 0 ? -1 : 1;
        return (
          <group key={idx} position={[x, 0, z]}>
            {/* Wine Glass (Upper Right) */}
            <group position={[0.36, 0, sign * 0.26]} scale={0.8}>
              <mesh position={[0, 0.01, 0]} material={crystalMat}>
                <cylinderGeometry args={[0.075, 0.075, 0.012, 16]} />
              </mesh>
              <mesh position={[0, 0.12, 0]} material={crystalMat}>
                <cylinderGeometry args={[0.012, 0.012, 0.22, 12]} />
              </mesh>
              <mesh position={[0, 0.28, 0]} material={crystalMat}>
                <sphereGeometry args={[0.095, 16, 16]} />
              </mesh>
              <mesh position={[0, 0.36, 0]} material={goldMat}>
                <torusGeometry args={[0.072, 0.006, 8, 24]} />
              </mesh>
            </group>

            {/* Champagne Flute (Upper Left) */}
            <group position={[0.22, 0, sign * 0.33]} scale={0.75}>
              <mesh position={[0, 0.01, 0]} material={crystalMat}>
                <cylinderGeometry args={[0.065, 0.065, 0.012, 16]} />
              </mesh>
              <mesh position={[0, 0.15, 0]} material={crystalMat}>
                <cylinderGeometry args={[0.009, 0.009, 0.28, 12]} />
              </mesh>
              <mesh position={[0, 0.33, 0]} material={crystalMat}>
                <cylinderGeometry args={[0.048, 0.028, 0.28, 16]} />
              </mesh>
              <mesh position={[0, 0.47, 0]} material={goldMat}>
                <torusGeometry args={[0.048, 0.005, 8, 24]} />
              </mesh>
            </group>
          </group>
        );
      })}
    </group>
  );
}

// 6. Decanters & Vintage Champagne Bottles
function TableDecanters({ currentStage, crystalMat, goldMat, wineMat }: { currentStage: number; crystalMat: THREE.Material; goldMat: THREE.Material; wineMat: THREE.Material }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const isPlaced = currentStage >= 6;
    const targetY = isPlaced ? -0.27 : 2.5;
    const targetScale = isPlaced ? 1 : 0.01;

    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 3.5, delta);
    groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 3.5, delta));
  });

  return (
    <group ref={groupRef} position={[0, 2.5, 0]}>
      {/* Crystal Wine Decanter Left */}
      <group position={[-0.55, 0, 0]}>
        <mesh position={[0, 0.12, 0]} material={crystalMat}>
          <cylinderGeometry args={[0.05, 0.16, 0.24, 24]} />
        </mesh>
        <mesh position={[0, 0.28, 0]} material={crystalMat}>
          <cylinderGeometry args={[0.035, 0.05, 0.15, 16]} />
        </mesh>
        <mesh position={[0, 0.39, 0]} material={crystalMat}>
          <octahedronGeometry args={[0.048, 0]} />
        </mesh>
        <mesh position={[0, 0.08, 0]} material={wineMat}>
          <cylinderGeometry args={[0.04, 0.14, 0.15, 16]} />
        </mesh>
      </group>

      {/* Vintage Champagne Bottle Right */}
      <group position={[0.55, 0, 0]}>
        <mesh position={[0, 0.16, 0]} material={wineMat}>
          <cylinderGeometry args={[0.065, 0.075, 0.32, 24]} />
        </mesh>
        <mesh position={[0, 0.35, 0]} material={wineMat}>
          <cylinderGeometry args={[0.022, 0.065, 0.12, 16]} />
        </mesh>
        <mesh position={[0, 0.38, 0]} material={goldMat}>
          <cylinderGeometry args={[0.026, 0.026, 0.08, 16]} />
        </mesh>
      </group>
    </group>
  );
}

// 7. Botanical Floral Garland Runner along Table Center
function FloralGarlandRunner({ currentStage, goldMat, flowerMat, greenMat }: { currentStage: number; goldMat: THREE.Material; flowerMat: THREE.Material; greenMat: THREE.Material }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const isPlaced = currentStage >= 7;
    const targetY = isPlaced ? -0.26 : 2.5;
    const targetScale = isPlaced ? 1 : 0.01;

    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 3.5, delta);
    groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 3.5, delta));
  });

  const blossomNodes = useMemo(() => {
    const nodes = [];
    for (let x = -1.3; x <= 1.3; x += 0.22) {
      nodes.push({
        x,
        z: Math.sin(x * 5) * 0.12,
        rot: x * 2,
        isGold: Math.abs(x) % 0.44 < 0.1,
      });
    }
    return nodes;
  }, []);

  return (
    <group ref={groupRef} position={[0, 2.5, 0]}>
      {/* Central foliage runner strand */}
      <mesh position={[0, 0.01, 0]} material={greenMat}>
        <boxGeometry args={[2.8, 0.02, 0.18]} />
      </mesh>

      {blossomNodes.map((n, i) => (
        <group key={i} position={[n.x, 0.03, n.z]} rotation={[0, n.rot, 0]}>
          <mesh material={n.isGold ? goldMat : flowerMat} scale={0.06}>
            <dodecahedronGeometry args={[1, 0]} />
          </mesh>
          <mesh position={[0.035, 0.018, 0]} material={flowerMat} scale={0.035}>
            <sphereGeometry args={[1, 8, 8]} />
          </mesh>
          <mesh position={[-0.035, -0.018, 0]} material={goldMat} scale={0.028}>
            <sphereGeometry args={[1, 8, 8]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 8, 9 & 10. Grand 5-Arm Imperial Candelabra Centerpiece with Ignited Candle Flames
function CenterpieceCandelabra({ currentStage, goldMat, crystalMat }: { currentStage: number; goldMat: THREE.Material; crystalMat: THREE.Material }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const isPlaced = currentStage >= 8;
    const targetY = isPlaced ? -0.27 : 2.8;
    const targetScale = isPlaced ? 1 : 0.01;

    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 3.5, delta);
    groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 3.5, delta));
  });

  const candlesLit = currentStage >= 8;
  const flameIntensity = currentStage >= 9 ? 1.8 : 0.9;

  return (
    <group ref={groupRef} position={[0, 2.8, 0]}>
      {/* Plinth Base */}
      <mesh position={[0, 0.04, 0]} material={goldMat}>
        <cylinderGeometry args={[0.22, 0.26, 0.08, 24]} />
      </mesh>

      {/* Main Fluted Column */}
      <mesh position={[0, 0.45, 0]} material={goldMat}>
        <cylinderGeometry args={[0.04, 0.08, 0.8, 16]} />
      </mesh>

      {/* Central Crystal Sphere */}
      <mesh position={[0, 0.85, 0]} material={crystalMat}>
        <sphereGeometry args={[0.13, 16, 16]} />
      </mesh>

      {/* Center Top Candle */}
      <mesh position={[0, 1.05, 0]} material={crystalMat}>
        <cylinderGeometry args={[0.024, 0.024, 0.35, 16]} />
      </mesh>
      <CandleFlame position={[0, 1.25, 0]} intensity={flameIntensity * 1.3} visible={candlesLit} />

      {/* 4 Curved Branch Arms */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2;
        const radius = 0.46;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <group key={i} position={[0, 0.5, 0]}>
            {/* Curved Arm */}
            <mesh
              position={[x * 0.5, 0.1, z * 0.5]}
              rotation={[0, -angle + Math.PI / 2, Math.PI / 4]}
              material={goldMat}
            >
              <cylinderGeometry args={[0.02, 0.026, 0.46, 12]} />
            </mesh>

            {/* Candle Cup */}
            <mesh position={[x, 0.28, z]} material={goldMat}>
              <cylinderGeometry args={[0.048, 0.032, 0.06, 16]} />
            </mesh>

            {/* Candle Stem */}
            <mesh position={[x, 0.44, z]} material={crystalMat}>
              <cylinderGeometry args={[0.022, 0.022, 0.28, 16]} />
            </mesh>

            {/* Candle Flame */}
            <CandleFlame position={[x, 0.6, z]} intensity={flameIntensity} visible={candlesLit} />

            {/* Hanging Crystal Drop */}
            <mesh position={[x, 0.18, z]} material={crystalMat}>
              <octahedronGeometry args={[0.055, 0]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function CameraRig({ currentStage, progress }: { currentStage: number; progress: number }) {
  const stageRef = useRef(currentStage);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    // Dynamic Responsive Camera: on mobile portrait screens, scale distance and framing
    const isPortrait = state.size.width < state.size.height;
    const isMobileSmall = state.size.width < 540;
    const distanceMult = isMobileSmall ? 1.45 : isPortrait ? 1.25 : 1.0;
    const yOffset = isPortrait ? 0.25 : 0;

    // Follow the actual story progress instead of snapping to the next camera
    // preset. This keeps wheel, touch, keyboard and jump navigation cinematic.
    const storyProgress = THREE.MathUtils.clamp(progress, 0, 1) * (STAGE_CAMERA_CONFIGS.length - 1);
    stageRef.current = THREE.MathUtils.damp(stageRef.current, storyProgress, 4.8, delta);

    const lowerIndex = Math.floor(stageRef.current);
    const upperIndex = Math.min(lowerIndex + 1, STAGE_CAMERA_CONFIGS.length - 1);
    const blend = THREE.MathUtils.smoothstep(stageRef.current - lowerIndex, 0, 1);
    const lower = STAGE_CAMERA_CONFIGS[lowerIndex];
    const upper = STAGE_CAMERA_CONFIGS[upperIndex];
    const t = state.clock.getElapsedTime();
    const finalPanX = THREE.MathUtils.lerp(lower.pos[0], upper.pos[0], blend) + (storyProgress > 9.85 ? Math.sin(t * 0.2) * 0.6 : 0);
    const finalPanY = THREE.MathUtils.lerp(lower.pos[1], upper.pos[1], blend) + yOffset;
    const finalPanZ = (THREE.MathUtils.lerp(lower.pos[2], upper.pos[2], blend) + (storyProgress > 9.85 ? Math.cos(t * 0.2) * 0.3 : 0)) * distanceMult;
    const targetFov = THREE.MathUtils.lerp(lower.fov, upper.fov, blend);

    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, finalPanX, 2.2, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, finalPanY, 2.2, delta);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, finalPanZ, 2.2, delta);

    if (state.camera instanceof THREE.PerspectiveCamera) {
      state.camera.fov = THREE.MathUtils.damp(state.camera.fov, targetFov, 3.5, delta);
      state.camera.updateProjectionMatrix();
    }
    lookTarget.set(0, isPortrait ? 0.05 : -0.2, 0);
    state.camera.lookAt(lookTarget);
  });

  return null;
}

function CinematicLighting({ progress }: { progress: number }) {
  const keyLight = useRef<THREE.DirectionalLight>(null);
  const fillLight = useRef<THREE.DirectionalLight>(null);
  const rimLight = useRef<THREE.DirectionalLight>(null);
  const candleLight = useRef<THREE.PointLight>(null);
  const stageRef = useRef(progress);
  const keyColor = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    const targetStage = THREE.MathUtils.clamp(progress, 0, 1) * (STAGE_CAMERA_CONFIGS.length - 1);
    stageRef.current = THREE.MathUtils.damp(stageRef.current, targetStage, 4.5, delta);
    const lowerIndex = Math.floor(stageRef.current);
    const upperIndex = Math.min(lowerIndex + 1, STAGE_CAMERA_CONFIGS.length - 1);
    const blend = THREE.MathUtils.smoothstep(stageRef.current - lowerIndex, 0, 1);
    const lower = STAGE_CAMERA_CONFIGS[lowerIndex];
    const upper = STAGE_CAMERA_CONFIGS[upperIndex];
    const intensity = THREE.MathUtils.lerp(lower.lightIntensity, upper.lightIntensity, blend);

    keyColor.set(lower.colorTemp).lerp(new THREE.Color(upper.colorTemp), blend);
    if (keyLight.current) {
      keyLight.current.intensity = intensity;
      keyLight.current.color.copy(keyColor);
    }
    if (fillLight.current) fillLight.current.intensity = THREE.MathUtils.damp(fillLight.current.intensity, 1.7 + progress * 0.45, 3, delta);
    if (rimLight.current) rimLight.current.intensity = THREE.MathUtils.damp(rimLight.current.intensity, 0.7 + progress * 0.35, 3, delta);
    if (candleLight.current) candleLight.current.intensity = THREE.MathUtils.damp(candleLight.current.intensity, 1.1 + progress * 0.8, 3, delta);

    // A tiny, slow pulse gives the background depth without competing with copy.
    if (keyLight.current) keyLight.current.position.x = 5 + Math.sin(state.clock.elapsedTime * 0.22) * 0.35;
  });

  return (
    <>
      <ambientLight intensity={0.65} color="#ffe8d1" />
      <directionalLight ref={keyLight} position={[5, 8, 5]} intensity={2.8} color="#fff6eb" />
      <directionalLight ref={fillLight} position={[-5, 4, -4]} intensity={1.7} color="#ffaa55" />
      <directionalLight ref={rimLight} position={[0, -3, 3]} intensity={0.7} color="#dc5000" />
      <pointLight ref={candleLight} position={[0, 2.6, 1]} intensity={1.1} color="#ffffff" distance={8} />
    </>
  );
}

export function ScrollDrivenEvent3D({ currentStage, progress }: ScrollDrivenEvent3DProps) {
  // High-contrast, radiant luxury materials
  const goldMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#f5c542'), // Radiant 24K African Gold
        metalness: 0.95,
        roughness: 0.12,
        envMapIntensity: 2.2,
      }),
    []
  );

  const woodMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#24150c'), // Rich Ebony Walnut Plinth
        metalness: 0.25,
        roughness: 0.35,
      }),
    []
  );

  const silkMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#fff7ee'), // Luminous Warm Cream Satin
        roughness: 0.3,
        metalness: 0.15,
      }),
    []
  );

  const chinaMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#ffffff'), // Pure Brilliant Bone China
        roughness: 0.08,
        metalness: 0.05,
      }),
    []
  );

  const crystalMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#ffffff'),
        metalness: 0.08,
        roughness: 0.02,
        transmission: 0.96,
        thickness: 0.85,
        ior: 1.62,
        transparent: true,
        opacity: 0.9,
      }),
    []
  );

  const wineMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#8b0020'), // Vintage Burgundy / Cabernet
        roughness: 0.15,
        metalness: 0.1,
        transparent: true,
        opacity: 0.88,
      }),
    []
  );

  const flowerMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#ffffff'), // Pure White Calla Lilies & Orchids
        roughness: 0.5,
        metalness: 0.05,
      }),
    []
  );

  const greenMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#2d4a22'), // Botanical Emerald Foliage
        roughness: 0.6,
        metalness: 0.05,
      }),
    []
  );

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0.95, 4.3], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
      >
        <color attach="background" args={['#100904']} />
        
        {/* Luminous High-Contrast Studio Lighting */}
        <CinematicLighting progress={progress} />

        {/* 3D Storytelling Table Metamorphosis */}
        <Float speed={1.1} rotationIntensity={0.06} floatIntensity={0.12}>
          <group position={[0, 0, 0]}>
            {/* Step 0: Raw Banquet Table */}
            <BanquetTable goldMat={goldMaterial} woodMat={woodMaterial} />

            {/* Step 1 & 2: Floating & Draping Wavy Flared Silk Tablecloth */}
            <OrganicFlaredTablecloth currentStage={currentStage} silkMat={silkMaterial} />

            {/* Step 3: Charger & Dinner Plates */}
            <PlaceSettingsPlates currentStage={currentStage} goldMat={goldMaterial} chinaMat={chinaMaterial} />

            {/* Step 4: Gold Cutlery & Folded Silk Napkins */}
            <PlaceSettingsCutlery currentStage={currentStage} goldMat={goldMaterial} silkMat={silkMaterial} />

            {/* Step 5: Crystal Wine Glasses & Champagne Flutes */}
            <PlaceSettingsGlassware currentStage={currentStage} crystalMat={crystalMaterial} goldMat={goldMaterial} />

            {/* Step 6: Wine Decanters & Vintage Champagne Bottles */}
            <TableDecanters currentStage={currentStage} crystalMat={crystalMaterial} goldMat={goldMaterial} wineMat={wineMaterial} />

            {/* Step 7: Botanical Orchid Floral Garland Runner */}
            <FloralGarlandRunner currentStage={currentStage} goldMat={goldMaterial} flowerMat={flowerMaterial} greenMat={greenMaterial} />

            {/* Step 8, 9 & 10: Imperial Candelabra Centerpiece with Ignited Candle Flames */}
            <CenterpieceCandelabra currentStage={currentStage} goldMat={goldMaterial} crystalMat={crystalMaterial} />
          </group>
        </Float>

        {/* Dynamic Stardust Sparkles during Gala / Final Stages */}
        <Sparkles 
          count={currentStage >= 8 ? 140 : 50} 
          scale={4.8} 
          size={currentStage >= 8 ? 3.0 : 1.8} 
          speed={0.35} 
          color="#ffedd7" 
          opacity={currentStage >= 8 ? 0.75 : 0.35} 
        />

        {/* Dynamic Camera Choreography */}
        <CameraRig currentStage={currentStage} progress={progress} />
      </Canvas>

      {/* Subtle radial vignette overlay to blend into Walnut Shadow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(16,9,4,0.12) 0%, rgba(16,9,4,0.65) 75%, rgba(16,9,4,0.96) 100%)'
        }}
      />
    </div>
  );
}

export default ScrollDrivenEvent3D;
