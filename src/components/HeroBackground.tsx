import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const TopographicPointGrid = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Create a grid of points
  const [positions] = useState(() => {
    const size = 80;
    const spacing = 0.6;
    const positions = new Float32Array(size * size * 3);
    
    let i = 0;
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        positions[i * 3] = (x - size / 2) * spacing;
        positions[i * 3 + 1] = 0; // We will animate Y
        positions[i * 3 + 2] = (z - size / 2) * spacing;
        i++;
      }
    }
    return positions;
  });

  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.getElapsedTime();
      const positionsArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
      
      let i = 0;
      for (let x = 0; x < 80; x++) {
        for (let z = 0; z < 80; z++) {
          const px = positionsArray[i * 3];
          const pz = positionsArray[i * 3 + 2];
          
          const distance = Math.sqrt(px * px + pz * pz);
          const ripple = Math.sin(distance * 0.4 - time * 1.5) * 0.6;
          const wave = Math.sin(px * 0.15 + time * 0.4) * Math.cos(pz * 0.15 + time * 0.4) * 2.5;
          
          positionsArray[i * 3 + 1] = wave + ripple - 2;
          i++;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.rotation.y = time * 0.03;
    }
  });

  return (
    <points ref={pointsRef} position={[0, -3, -6]} rotation={[0.3, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#8B94A3"
        size={0.06}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// Reusable CAD Material
const cadMaterial = new THREE.MeshStandardMaterial({
  color: "#161A22",
  roughness: 0.9,
  metalness: 0.1,
});
// Reusable CAD Wireframe overlay
const WireframeOverlay = ({ args, geo }: any) => {
  const GeoComponent = geo;
  return (
    <mesh>
      <GeoComponent args={args} />
      <meshBasicMaterial color="#E0A526" wireframe={true} transparent opacity={0.5} />
    </mesh>
  );
};

const TripodLeg = ({ rotationY }: { rotationY: number }) => (
  <group rotation={[0, rotationY, 0]}>
    <mesh position={[0, -2.1, 0.85]} rotation={[-0.28, 0, 0]} material={cadMaterial}>
      <cylinderGeometry args={[0.08, 0.05, 4.2, 32]} />
      <WireframeOverlay geo="cylinderGeometry" args={[0.081, 0.051, 4.2, 16]} />
    </mesh>
    <mesh position={[0, -4.3, 1.48]} rotation={[-0.28, 0, 0]} material={cadMaterial}>
      <coneGeometry args={[0.06, 0.6, 16]} />
      <WireframeOverlay geo="coneGeometry" args={[0.061, 0.6, 8]} />
    </mesh>
  </group>
);

const RealisticTotalStation = () => {
  const baseRef = useRef<THREE.Group>(null);
  const telescopeRef = useRef<THREE.Group>(null);

  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (baseRef.current && telescopeRef.current) {
      const targetRotationY = -mousePos.current.x * 1.5; 
      baseRef.current.rotation.y = THREE.MathUtils.lerp(baseRef.current.rotation.y, targetRotationY, 0.05);

      const targetRotationX = mousePos.current.y * 1.2;
      telescopeRef.current.rotation.x = THREE.MathUtils.lerp(telescopeRef.current.rotation.x, targetRotationX, 0.05);
    }
  });

  return (
    <group position={[4, -1.2, -2]} scale={1.3}>
      
      {/* --- STATIONARY TRIPOD --- */}
      <group position={[0, -1, 0]}>
        <mesh position={[0, 0, 0]} material={cadMaterial}>
          <cylinderGeometry args={[0.55, 0.6, 0.2, 64]} />
          <WireframeOverlay geo="cylinderGeometry" args={[0.551, 0.601, 0.2, 32]} />
        </mesh>
        
        <TripodLeg rotationY={0} />
        <TripodLeg rotationY={(Math.PI * 2) / 3} />
        <TripodLeg rotationY={(Math.PI * 4) / 3} />
      </group>


      {/* --- INTERACTIVE INSTRUMENT --- */}
      <group position={[0, -0.9, 0]} ref={baseRef}>
        
        {/* Tribrach */}
        <mesh position={[0, 0.2, 0]} material={cadMaterial}>
          <cylinderGeometry args={[0.5, 0.55, 0.25, 64]} />
          <WireframeOverlay geo="cylinderGeometry" args={[0.501, 0.551, 0.25, 32]} />
        </mesh>
        
        {/* Main Base */}
        <mesh position={[0, 0.5, 0]} material={cadMaterial}>
          <cylinderGeometry args={[0.45, 0.5, 0.35, 64]} />
          <WireframeOverlay geo="cylinderGeometry" args={[0.451, 0.501, 0.35, 32]} />
        </mesh>

        {/* Left Arm (Sleek Capsule) */}
        <mesh position={[-0.35, 1.2, 0]} material={cadMaterial}>
          <capsuleGeometry args={[0.15, 0.9, 32, 64]} />
          <WireframeOverlay geo="capsuleGeometry" args={[0.151, 0.9, 16, 32]} />
        </mesh>
        {/* Right Arm (Sleek Capsule) */}
        <mesh position={[0.35, 1.2, 0]} material={cadMaterial}>
          <capsuleGeometry args={[0.15, 0.9, 32, 64]} />
          <WireframeOverlay geo="capsuleGeometry" args={[0.151, 0.9, 16, 32]} />
        </mesh>
        
        {/* Top Handle */}
        <mesh position={[0, 1.85, 0]} rotation={[0, 0, Math.PI / 2]} material={cadMaterial}>
          <capsuleGeometry args={[0.08, 0.7, 16, 32]} />
          <WireframeOverlay geo="capsuleGeometry" args={[0.081, 0.7, 8, 16]} />
        </mesh>

        {/* Control Panel Screen */}
        <group position={[0, 0.65, 0.35]}>
          <mesh rotation={[0.2, 0, 0]}>
             <boxGeometry args={[0.45, 0.35, 0.1]} />
             <meshStandardMaterial color="#0A0B0E" />
          </mesh>
          <mesh position={[0, 0.05, 0.055]} rotation={[0.2, 0, 0]}>
            <planeGeometry args={[0.35, 0.2]} />
            <meshBasicMaterial color="#FFC107" />
          </mesh>
        </group>

        {/* Telescope Group */}
        <group ref={telescopeRef} position={[0, 1.3, 0]}>
          
          {/* Main Barrel */}
          <mesh rotation={[Math.PI / 2, 0, 0]} material={cadMaterial}>
            <cylinderGeometry args={[0.22, 0.22, 1.1, 64]} />
            <WireframeOverlay geo="cylinderGeometry" args={[0.221, 0.221, 1.1, 32]} />
          </mesh>
          
          {/* Lens Hood */}
          <mesh position={[0, 0, 0.55]} rotation={[Math.PI / 2, 0, 0]} material={cadMaterial}>
            <cylinderGeometry args={[0.26, 0.22, 0.3, 64]} />
            <WireframeOverlay geo="cylinderGeometry" args={[0.261, 0.221, 0.3, 32]} />
          </mesh>
          
          {/* Objective Lens */}
          <mesh position={[0, 0, 0.65]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.24, 0.24, 0.05, 64]} />
            <meshBasicMaterial color="#000" />
          </mesh>
          
          {/* Eyepiece */}
          <mesh position={[0, 0, -0.6]} rotation={[Math.PI / 2, 0, 0]} material={cadMaterial}>
            <cylinderGeometry args={[0.08, 0.08, 0.25, 64]} />
            <WireframeOverlay geo="cylinderGeometry" args={[0.081, 0.081, 0.25, 16]} />
          </mesh>

          {/* Interactive Laser Beam (Subtle technical scan) */}
          <mesh position={[0, 0, 15]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 30, 8]} />
            <meshBasicMaterial color="#FFC107" transparent opacity={0.8} depthWrite={false} toneMapped={false} />
          </mesh>
        </group>

      </group>
    </group>
  );
};

export default function HeroBackground() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'var(--c-bg)', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 2, 12], fov: 45 }}>
        <fog attach="fog" args={['#0F1115', 5, 25]} />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <spotLight position={[0, 10, 0]} intensity={1} angle={0.8} />
        
        <RealisticTotalStation />
        
        <TopographicPointGrid />
      </Canvas>
    </div>
  );
}
