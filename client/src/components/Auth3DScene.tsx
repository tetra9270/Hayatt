"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Stars, Environment, ContactShadows } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function FloatingCrystal() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
        meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[2, 0]} />
                <meshStandardMaterial
                    color="#4f46e5"
                    emissive="#312e81"
                    emissiveIntensity={0.5}
                    roughness={0.1}
                    metalness={1}
                    wireframe
                />
            </mesh>
            <mesh scale={[0.9, 0.9, 0.9]}>
                <icosahedronGeometry args={[2, 0]} />
                <meshStandardMaterial
                    color="#000000"
                    roughness={0.1}
                    metalness={1}
                />
            </mesh>
        </Float>
    );
}

function GridFloor() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#000000" transparent opacity={0.5} roughness={0.1} metalness={0.8} />
        </mesh>
    );
}

export default function Auth3DScene() {
    return (
        <div className="absolute inset-0 z-0 bg-black">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#4f46e5" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ec4899" />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                <FloatingCrystal />
                <GridFloor />

                <Environment preset="city" />
                <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={20} blur={2.5} far={4.5} />
            </Canvas>

            {/* Overlay Gradient for Text Readability if needed, though we act as background */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60 pointer-events-none" />
        </div>
    );
}
