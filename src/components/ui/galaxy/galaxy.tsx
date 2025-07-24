'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ConstellationLine {
    id: number
    point1: THREE.Vector3
    point2: THREE.Vector3
    createdAt: number
    opacity: number
    generation: number
    distanceFromCamera: number
}

interface ActiveHub {
    position: THREE.Vector3
    createdAt: number
    hasExpanded: boolean
}

export function Galaxy() {
    const particleSystemRef = useRef<THREE.Points>(null)
    const linesRef = useRef<THREE.Group>(null)
    const [constellationLines, setConstellationLines] = useState<
        ConstellationLine[]
    >([])
    const [, setActiveHubs] = useState<ActiveHub[]>([])
    const nextLineId = useRef(0)
    const frameCount = useRef(0)

    const parameters = {
        count: 50_000,
        size: 0.025,
        radius: 10,
        branches: 5,
        spin: 1.5,
        randomness: 0.35,
        randomnessPower: 2,
    }

    const [particleGeometry, particleMaterial] = useMemo(() => {
        const count = parameters.count
        const geometry = new THREE.BufferGeometry()

        const positions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)
        const sizes = new Float32Array(count)
        const randoms = new Float32Array(count)

        const colorVariants = [
            new THREE.Color('#ffffff'),
            new THREE.Color('#f0fdf4'),
            new THREE.Color('#dcfce7'),
            new THREE.Color('#bbf7d0'),
            new THREE.Color('#86efac'),
            new THREE.Color('#4ade80'),
            new THREE.Color('#22c55e'),
            new THREE.Color('#16a34a'),
            new THREE.Color('#15803d'),
            new THREE.Color('#166534'),
        ]

        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            const radius = Math.random() * parameters.radius
            const spinAngle = radius * parameters.spin
            const branchAngle =
                ((i % parameters.branches) / parameters.branches) * Math.PI * 2

            const randomX =
                Math.pow(Math.random(), parameters.randomnessPower) *
                (Math.random() < 0.5 ? 1 : -1) *
                parameters.randomness *
                radius *
                1.2
            const randomY =
                Math.pow(Math.random(), parameters.randomnessPower) *
                (Math.random() < 0.5 ? 1 : -1) *
                parameters.randomness *
                radius *
                0.6
            const randomZ =
                Math.pow(Math.random(), parameters.randomnessPower) *
                (Math.random() < 0.5 ? 1 : -1) *
                parameters.randomness *
                radius *
                1.2

            const x = Math.cos(branchAngle + spinAngle) * radius + randomX
            const y = randomY
            const z = Math.sin(branchAngle + spinAngle) * radius + randomZ

            positions[i3] = x
            positions[i3 + 1] = y
            positions[i3 + 2] = z

            const radiusRatio = radius / parameters.radius
            const centerDensity = Math.exp(-radiusRatio * 3)

            const selectedColor =
                colorVariants[Math.floor(Math.random() * colorVariants.length)]
            const finalColor = selectedColor
                .clone()
                .multiplyScalar(1.2 + centerDensity * 0.5)

            colors[i3] = finalColor.r
            colors[i3 + 1] = finalColor.g
            colors[i3 + 2] = finalColor.b

            sizes[i] =
                parameters.size *
                (0.8 + centerDensity * 1.5 + Math.random() * 0.4)
            randoms[i] = Math.random()
        }

        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(positions, 3)
        )
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
        geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                uSize: { value: 150 },
            },
            vertexShader: `uniform float uTime;
                uniform float uPixelRatio;
                uniform float uSize;
                attribute float size;
                attribute float aRandom;
                varying vec3 vColor;
                varying float vFlicker;
                void main() {
                    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                    vec4 viewPosition = viewMatrix * modelPosition;
                    vec4 projectionPosition = projectionMatrix * viewPosition;
                    gl_Position = projectionPosition;
                    float flicker = 0.8 + sin(uTime * 0.5 + aRandom * 10.0) * 0.15 + 
                                    sin(uTime * 0.3 + aRandom * 15.0) * 0.1 + 
                                    sin(uTime * 0.7 + aRandom * 20.0) * 0.05;
                    gl_PointSize = size * uSize * uPixelRatio * flicker;
                    gl_PointSize *= (1.0 / -viewPosition.z);
                    vColor = color;
                    vFlicker = flicker;
                }`,
            fragmentShader: `
                varying vec3 vColor;
                varying float vFlicker;
                void main() {
                    float strength = distance(gl_PointCoord, vec2(0.5));
                    strength = 1.0 - strength;
                    strength = pow(strength, 3.0);
                    float glow = 1.0 - distance(gl_PointCoord, vec2(0.5)) * 2.0;
                    glow = max(0.0, glow);
                    vec3 finalColor = mix(vColor, vColor * 1.5, glow * 0.3);
                    gl_FragColor = vec4(finalColor, strength * vFlicker);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            vertexColors: true,
        })

        return [geometry, material]
    }, [
        parameters.branches,
        parameters.count,
        parameters.radius,
        parameters.randomness,
        parameters.randomnessPower,
        parameters.size,
        parameters.spin,
    ])

    const findNeighbors = useCallback(
        (center: THREE.Vector3, maxDistance: number, maxNeighbors = 2) => {
            const neighbors: THREE.Vector3[] = []
            for (let i = 0; i < 20; i++) {
                const angle = Math.random() * Math.PI * 2
                const distance = 0.4 + Math.random() * (maxDistance - 0.4)
                const neighbor = new THREE.Vector3(
                    center.x + Math.cos(angle) * distance,
                    center.y + (Math.random() - 0.5) * 0.3,
                    center.z + Math.sin(angle) * distance
                )
                if (neighbor.length() < parameters.radius) {
                    neighbors.push(neighbor)
                    if (neighbors.length >= maxNeighbors) break
                }
            }
            return neighbors
        },
        [parameters.radius]
    )

    const expandFromHubs = useCallback(() => {
        setActiveHubs((prev) => {
            const updatedHubs = prev.map((hub) => {
                if (!hub.hasExpanded) {
                    const neighbors = findNeighbors(hub.position, 1.0, 2)
                    neighbors.forEach((neighbor) => {
                        setConstellationLines((lines) => [
                            ...lines,
                            {
                                id: nextLineId.current++,
                                point1: hub.position.clone(),
                                point2: neighbor,
                                createdAt: Date.now(),
                                opacity: 1.0,
                                generation: 1,
                                distanceFromCamera: 0,
                            },
                        ])
                        setActiveHubs((hubs) => [
                            ...hubs,
                            {
                                position: neighbor,
                                createdAt: Date.now(),
                                hasExpanded: true,
                            },
                        ])
                    })
                    return { ...hub, hasExpanded: true }
                }
                return hub
            })
            return updatedHubs
        })
    }, [findNeighbors])

    const createInitialConstellationLines = useCallback(() => {
        const numLines = 2 + Math.floor(Math.random() * 2)
        for (let i = 0; i < numLines; i++) {
            const radius1 = Math.random() * parameters.radius
            const angle1 = Math.random() * Math.PI * 2
            const point1 = new THREE.Vector3(
                Math.cos(angle1) * radius1,
                (Math.random() - 0.5) * 0.8,
                Math.sin(angle1) * radius1
            )
            const angle2 = angle1 + (Math.random() - 0.5) * 0.8
            const radius2 = radius1 + (Math.random() - 0.5) * 1.0
            const point2 = new THREE.Vector3(
                Math.cos(angle2) * Math.max(0.1, radius2),
                (Math.random() - 0.5) * 0.8,
                Math.sin(angle2) * Math.max(0.1, radius2)
            )
            if (
                point1.distanceTo(point2) > 0.3 &&
                point1.distanceTo(point2) < 1.8
            ) {
                setConstellationLines((lines) => [
                    ...lines,
                    {
                        id: nextLineId.current++,
                        point1,
                        point2,
                        createdAt: Date.now(),
                        opacity: 1.0,
                        generation: 0,
                        distanceFromCamera: 0,
                    },
                ])
                setActiveHubs((hubs) => [
                    ...hubs,
                    {
                        position: point1,
                        createdAt: Date.now(),
                        hasExpanded: false,
                    },
                    {
                        position: point2,
                        createdAt: Date.now(),
                        hasExpanded: false,
                    },
                ])
            }
        }
    }, [parameters.radius])

    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() < 0.6) {
                createInitialConstellationLines()
            }
        }, 1200)
        return () => clearInterval(interval)
    }, [createInitialConstellationLines])

    useEffect(() => {
        const interval = setInterval(() => {
            expandFromHubs()
        }, 300)
        return () => clearInterval(interval)
    }, [expandFromHubs])

    useFrame((state) => {
        frameCount.current++
        if (particleMaterial.uniforms) {
            particleMaterial.uniforms.uTime.value = state.clock.elapsedTime
        }

        if (particleSystemRef.current) {
            particleSystemRef.current.rotation.y += 0.0008

            // Static tilt values (adjust as needed)
            particleSystemRef.current.rotation.x = -0.7
            particleSystemRef.current.rotation.z = -0.1
        }

        if (linesRef.current && particleSystemRef.current) {
            linesRef.current.rotation.copy(particleSystemRef.current.rotation)
        }

        if (frameCount.current % 2 === 0) {
            const now = Date.now()
            const camPos = state.camera.position
            setConstellationLines((lines) =>
                lines
                    .map((line) => {
                        const age = now - line.createdAt
                        if (age > 3000) return null
                        const fadeStart = 2000
                        let opacity = line.opacity
                        if (age > fadeStart) {
                            opacity = 1 - (age - fadeStart) / (3000 - fadeStart)
                        }
                        const midpoint = new THREE.Vector3()
                            .addVectors(line.point1, line.point2)
                            .multiplyScalar(0.5)
                        return {
                            ...line,
                            opacity,
                            distanceFromCamera: midpoint.distanceTo(camPos),
                        }
                    })
                    .filter((line): line is ConstellationLine => line !== null)
            )

            setActiveHubs((hubs) =>
                hubs.filter((hub) => now - hub.createdAt < 4000)
            )
        }
    })

    return (
        <>
            <ambientLight intensity={0.6} />
            <points
                ref={particleSystemRef}
                geometry={particleGeometry}
                material={particleMaterial}
            />
            <group ref={linesRef}>
                {constellationLines.map((line) => {
                    const opacity =
                        line.opacity * (line.generation === 0 ? 0.8 : 0.6)
                    return (
                        <line key={line.id}>
                            <bufferGeometry>
                                <bufferAttribute
                                    attach="attributes-position"
                                    count={2}
                                    array={
                                        new Float32Array([
                                            line.point1.x,
                                            line.point1.y,
                                            line.point1.z,
                                            line.point2.x,
                                            line.point2.y,
                                            line.point2.z,
                                        ])
                                    }
                                    itemSize={3}
                                />
                            </bufferGeometry>
                            <lineBasicMaterial
                                color={
                                    line.generation === 0
                                        ? '#34d399'
                                        : '#22c55e'
                                }
                                transparent
                                opacity={opacity}
                            />
                        </line>
                    )
                })}
            </group>
        </>
    )
}
