"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Stars(props: any) {
    const ref = useRef<any>();

    // Generate random points in a sphere
    const sphere = useMemo(() => {
        const points = new Float32Array(5000 * 3);
        for (let i = 0; i < 5000; i++) {
            const r = 1.5 * Math.cbrt(Math.random());
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            points[i * 3] = x;
            points[i * 3 + 1] = y;
            points[i * 3 + 2] = z;
        }
        return points;
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#3b82f6"
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}

export default function ThreeScene() {
    return (
        <div className="absolute inset-0 -z-10 h-full w-full bg-black">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Stars />
            </Canvas>
        </div>
    );
}
