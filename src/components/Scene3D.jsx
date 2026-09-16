import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";

function CoreShape({ mouseRef }) {
  const groupRef = useRef(null);
  const ringRef = useRef(null);

  useFrame((state, delta) => {
    const group = groupRef.current;
    const ring = ringRef.current;
    const mouse = mouseRef.current;

    if (group) {
      const targetY = mouse.x * 0.5;
      const targetX = mouse.y * 0.3;
      group.rotation.y += (targetY - group.rotation.y) * Math.min(1, delta * 2.2);
      group.rotation.x += (targetX - group.rotation.x) * Math.min(1, delta * 2.2);
      group.rotation.z += delta * 0.08;
    }

    if (ring) {
      ring.rotation.x += delta * 0.35;
      ring.rotation.y += delta * 0.22;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.9}>
        <mesh>
          <icosahedronGeometry args={[1.35, 1]} />
          <MeshDistortMaterial
            color="#0a0b12"
            emissive="#2f4a00"
            emissiveIntensity={0.4}
            metalness={0.75}
            roughness={0.2}
            distort={0.32}
            speed={1.6}
          />
        </mesh>
      </Float>

      <mesh ref={ringRef}>
        <torusGeometry args={[2.05, 0.03, 16, 96]} />
        <meshStandardMaterial color="#b7ff1a" emissive="#b7ff1a" emissiveIntensity={0.9} roughness={0.3} />
      </mesh>

      <mesh rotation={[Math.PI / 3, Math.PI / 5, 0]}>
        <torusGeometry args={[1.75, 0.012, 12, 96]} />
        <meshStandardMaterial color="#ff5f1f" emissive="#ff5f1f" emissiveIntensity={0.7} roughness={0.4} />
      </mesh>
    </group>
  );
}

function OrbShape({ mouseRef }) {
  const groupRef = useRef(null);

  useFrame((state, delta) => {
    const group = groupRef.current;
    const mouse = mouseRef.current;
    if (!group) return;
    const targetY = mouse.x * 0.35;
    const targetX = mouse.y * 0.2;
    group.rotation.y += (targetY - group.rotation.y) * Math.min(1, delta * 2);
    group.rotation.x += (targetX - group.rotation.x) * Math.min(1, delta * 2);
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.7}>
        <mesh>
          <icosahedronGeometry args={[1.1, 2]} />
          <MeshDistortMaterial
            color="#0a0b12"
            emissive="#395a00"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.15}
            distort={0.4}
            speed={1.2}
          />
        </mesh>
      </Float>
    </group>
  );
}

function SceneContent({ mouseRef, variant }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight position={[3, 3, 4]} intensity={1.3} color="#b7ff1a" />
      <pointLight position={[-3, -2, -3]} intensity={0.9} color="#ff5f1f" />
      <pointLight position={[0, -3, 2]} intensity={0.4} color="#5a7eb0" />
      {variant === "orb" ? <OrbShape mouseRef={mouseRef} /> : <CoreShape mouseRef={mouseRef} />}
    </>
  );
}

export default function Scene3D({ mouseRef, className = "", variant = "core" }) {
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 6], fov: 42 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <SceneContent mouseRef={mouseRef} variant={variant} />
        </Suspense>
      </Canvas>
    </div>
  );
}
