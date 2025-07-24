'use client'

import type React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface GalaxyProps {
    mouseRef: React.MutableRefObject<{ x: number; y: number }>
}

interface ConstellationLine {
    id: number
    point1: THREE.Vector3
    point2: THREE.Vector3
    createdAt: number
    opacity: number
    generation: number
    distanceFromCamera: number
}

interface HoverLine {
    id: number
    point1: THREE.Vector3
    point2: THREE.Vector3
    opacity: number
}

interface ActiveHub {
    position: THREE.Vector3
    createdAt: number
    hasExpanded: boolean
}

export function Galaxy({ mouseRef }: GalaxyProps) {
    const particleSystemRef = useRef<THREE.Points>(null)
    const linesRef = useRef<THREE.Group>(null)
    const hoverLinesRef = useRef<THREE.Group>(null)
    const [constellationLines, setConstellationLines] = useState<
        ConstellationLine[]
    >([])
    const [hoverLines, setHoverLines] = useState<HoverLine[]>([])
    const [, setActiveHubs] = useState<ActiveHub[]>([])
    const nextLineId = useRef(0)
    const nextHoverLineId = useRef(0)
    const frameCount = useRef(0)

    // Galaxy parameters - smaller stars, many more of them
    const parameters = {
        count: 45000, // Increased from 35000 to 45000 stars
        size: 0.025, // Keep small size for delicate appearance
        radius: 4.5,
        branches: 6,
        spin: 1.2,
        randomness: 0.35,
        randomnessPower: 2,
    }

    // Create particle system with Three.js particle engine
    const [particleGeometry, particleMaterial, _starPositions, spatialGrid] =
        useMemo(() => {
            const count = parameters.count
            const geometry = new THREE.BufferGeometry()

            // Create arrays for particle attributes
            const positions = new Float32Array(count * 3)
            const colors = new Float32Array(count * 3)
            const sizes = new Float32Array(count)
            const randoms = new Float32Array(count) // For individual flickering
            const starPositions: THREE.Vector3[] = []

            // Create spatial grid for faster neighbor lookup
            const gridSize = 40 // Increased from 35 to 40 for better distribution with more stars
            const spatialGrid: THREE.Vector3[][][] = []
            for (let x = 0; x < gridSize; x++) {
                spatialGrid[x] = []
                for (let y = 0; y < gridSize; y++) {
                    spatialGrid[x][y] = []
                }
            }

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

                // Galaxy spiral generation
                const radius = Math.random() * parameters.radius
                const spinAngle = radius * parameters.spin
                const branchAngle =
                    ((i % parameters.branches) / parameters.branches) *
                    Math.PI *
                    2

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

                const starPos = new THREE.Vector3(x, y, z)
                starPositions.push(starPos)

                // Add to spatial grid
                const gridX = Math.floor(
                    ((x + parameters.radius) / (parameters.radius * 2)) *
                        (gridSize - 1)
                )
                const gridZ = Math.floor(
                    ((z + parameters.radius) / (parameters.radius * 2)) *
                        (gridSize - 1)
                )
                const clampedX = Math.max(0, Math.min(gridSize - 1, gridX))
                const clampedZ = Math.max(0, Math.min(gridSize - 1, gridZ))

                spatialGrid[clampedX][clampedZ].push(starPos)

                // Color based on distance from center
                const radiusRatio = radius / parameters.radius
                const centerDensity = Math.exp(-radiusRatio * 3)

                let selectedColor
                if (radiusRatio < 0.1) {
                    selectedColor = colorVariants[0]
                } else if (radiusRatio < 0.3) {
                    selectedColor = colorVariants[Math.floor(Math.random() * 3)]
                } else if (radiusRatio < 0.6) {
                    selectedColor =
                        colorVariants[3 + Math.floor(Math.random() * 4)]
                } else {
                    selectedColor =
                        colorVariants[7 + Math.floor(Math.random() * 3)]
                }

                const finalColor = selectedColor.clone()
                finalColor.multiplyScalar(1.2 + centerDensity * 0.5)

                colors[i3] = finalColor.r
                colors[i3 + 1] = finalColor.g
                colors[i3 + 2] = finalColor.b

                // Smaller variable star sizes
                sizes[i] =
                    parameters.size *
                    (0.8 + centerDensity * 1.5 + Math.random() * 0.4)

                // Random values for individual flickering
                randoms[i] = Math.random()
            }

            // Set geometry attributes
            geometry.setAttribute(
                'position',
                new THREE.BufferAttribute(positions, 3)
            )
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
            geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
            geometry.setAttribute(
                'aRandom',
                new THREE.BufferAttribute(randoms, 1)
            )

            // Create custom shader material for particles
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uPixelRatio: {
                        value: Math.min(window.devicePixelRatio, 2),
                    },
                    uSize: { value: 150 }, // Keep same size for consistent appearance
                },
                vertexShader: `
        uniform float uTime;
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
          
          // Individual flickering for each particle
          float flicker = 0.8 + sin(uTime * 0.5 + aRandom * 10.0) * 0.15 + 
                         sin(uTime * 0.3 + aRandom * 15.0) * 0.1 + 
                         sin(uTime * 0.7 + aRandom * 20.0) * 0.05;
          
          gl_PointSize = size * uSize * uPixelRatio * flicker;
          gl_PointSize *= (1.0 / -viewPosition.z);
          
          vColor = color;
          vFlicker = flicker;
        }
      `,
                fragmentShader: `
        varying vec3 vColor;
        varying float vFlicker;
        
        void main() {
          // Create circular particles
          float strength = distance(gl_PointCoord, vec2(0.5));
          strength = 1.0 - strength;
          strength = pow(strength, 3.0);
          
          // Add some glow effect
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

            return [geometry, material, starPositions, spatialGrid]
        }, [])

    // Optimized function to find nearby stars using spatial grid
    const findNearbyStarsOptimized = (mouseWorldPos: THREE.Vector3) => {
        const nearbyStars: THREE.Vector3[] = []
        const hoverRadius = 1.2
        const gridSize = 40

        const centerGridX = Math.floor(
            ((mouseWorldPos.x + parameters.radius) / (parameters.radius * 2)) *
                (gridSize - 1)
        )
        const centerGridZ = Math.floor(
            ((mouseWorldPos.z + parameters.radius) / (parameters.radius * 2)) *
                (gridSize - 1)
        )

        for (let dx = -1; dx <= 1; dx++) {
            for (let dz = -1; dz <= 1; dz++) {
                const gridX = centerGridX + dx
                const gridZ = centerGridZ + dz

                if (
                    gridX >= 0 &&
                    gridX < gridSize &&
                    gridZ >= 0 &&
                    gridZ < gridSize
                ) {
                    const cellStars = spatialGrid[gridX][gridZ]

                    cellStars.forEach((starPos) => {
                        const distance = mouseWorldPos.distanceTo(starPos)
                        if (distance < hoverRadius && nearbyStars.length < 10) {
                            // Increased to 10 for more connections with denser stars
                            nearbyStars.push(starPos)
                        }
                    })
                }
            }
        }

        return nearbyStars
    }

    const createHoverLines = (mouseWorldPos: THREE.Vector3) => {
        const nearbyStars = findNearbyStarsOptimized(mouseWorldPos)
        const newHoverLines: HoverLine[] = []

        const maxLines = 10 // Increased from 8 to 10 for denser connections
        let lineCount = 0

        for (let i = 0; i < nearbyStars.length && lineCount < maxLines; i++) {
            for (
                let j = i + 1;
                j < nearbyStars.length && lineCount < maxLines;
                j++
            ) {
                const distance = nearbyStars[i].distanceTo(nearbyStars[j])

                if (distance < 1.0) {
                    newHoverLines.push({
                        id: nextHoverLineId.current++,
                        point1: nearbyStars[i].clone(),
                        point2: nearbyStars[j].clone(),
                        opacity: 0.8,
                    })
                    lineCount++
                }
            }
        }

        setHoverLines(newHoverLines)
    }

    const getMouseWorldPosition = (camera: THREE.Camera) => {
        const vector = new THREE.Vector3(
            mouseRef.current.x,
            mouseRef.current.y,
            0.5
        )
        vector.unproject(camera)

        const dir = vector.sub(camera.position).normalize()
        const distance = -camera.position.z / dir.z
        const pos = camera.position.clone().add(dir.multiplyScalar(distance))

        return pos
    }

    const findNeighbors = (
        centerPoint: THREE.Vector3,
        maxDistance: number,
        maxNeighbors = 2
    ) => {
        const neighbors: THREE.Vector3[] = []

        for (let i = 0; i < 20; i++) {
            // Increased from 15 to 20 for more connections with denser stars
            const angle = Math.random() * Math.PI * 2
            const distance = 0.4 + Math.random() * (maxDistance - 0.4)

            const neighbor = new THREE.Vector3(
                centerPoint.x + Math.cos(angle) * distance,
                centerPoint.y + (Math.random() - 0.5) * 0.3,
                centerPoint.z + Math.sin(angle) * distance
            )

            const distanceFromCenter = Math.sqrt(
                neighbor.x * neighbor.x + neighbor.z * neighbor.z
            )
            if (distanceFromCenter < parameters.radius) {
                neighbors.push(neighbor)
                if (neighbors.length >= maxNeighbors) break
            }
        }

        return neighbors
    }

    const calculateLineDistance = (
        point1: THREE.Vector3,
        point2: THREE.Vector3,
        cameraPosition: THREE.Vector3
    ) => {
        const midpoint = new THREE.Vector3()
            .addVectors(point1, point2)
            .multiplyScalar(0.5)
        return midpoint.distanceTo(cameraPosition)
    }

    const expandFromHubs = () => {
        setActiveHubs((prev) => {
            const updatedHubs = prev.map((hub) => {
                if (!hub.hasExpanded) {
                    const neighbors = findNeighbors(hub.position, 1.0, 2)

                    neighbors.forEach((neighbor) => {
                        const newLine: ConstellationLine = {
                            id: nextLineId.current++,
                            point1: hub.position.clone(),
                            point2: neighbor,
                            createdAt: Date.now(),
                            opacity: 1.0,
                            generation: 1,
                            distanceFromCamera: 0,
                        }

                        setConstellationLines((prevLines) => [
                            ...prevLines,
                            newLine,
                        ])

                        setActiveHubs((prevHubs) => [
                            ...prevHubs,
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
    }

    const createInitialConstellationLines = useCallback(() => {
        const numLines = 2 + Math.floor(Math.random() * 2) // Keep same line creation rate

        for (let i = 0; i < numLines; i++) {
            const radius1 = Math.random() * parameters.radius
            const angle1 = Math.random() * Math.PI * 2

            const point1 = new THREE.Vector3(
                Math.cos(angle1) * radius1,
                (Math.random() - 0.5) * 0.8,
                Math.sin(angle1) * radius1
            )

            const neighborAngle = angle1 + (Math.random() - 0.5) * 0.8
            const neighborRadius = radius1 + (Math.random() - 0.5) * 1.0

            const point2 = new THREE.Vector3(
                Math.cos(neighborAngle) * Math.max(0.1, neighborRadius),
                (Math.random() - 0.5) * 0.8,
                Math.sin(neighborAngle) * Math.max(0.1, neighborRadius)
            )

            const distance = point1.distanceTo(point2)
            if (distance > 0.3 && distance < 1.8) {
                const newLine: ConstellationLine = {
                    id: nextLineId.current++,
                    point1,
                    point2,
                    createdAt: Date.now(),
                    opacity: 1.0,
                    generation: 0,
                    distanceFromCamera: 0,
                }

                setConstellationLines((prev) => [...prev, newLine])

                setActiveHubs((prev) => [
                    ...prev,
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
    }, [parameters.radius, setConstellationLines, setActiveHubs, nextLineId])

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
    }, [])

    // Animation loop
    useFrame((state) => {
        frameCount.current++

        if (particleSystemRef.current && mouseRef.current) {
            // Update shader time uniform for flickering
            if (particleMaterial.uniforms) {
                particleMaterial.uniforms.uTime.value = state.clock.elapsedTime
            }

            // Galaxy rotation and mouse interaction
            particleSystemRef.current.rotation.y += 0.0008
            particleSystemRef.current.rotation.x =
                -0.6 + mouseRef.current.y * 1.2
            particleSystemRef.current.rotation.z =
                -0.3 + mouseRef.current.x * 1.0
            particleSystemRef.current.rotation.y += mouseRef.current.x * 0.02

            const mouseDistance = Math.sqrt(
                mouseRef.current.x ** 2 + mouseRef.current.y ** 2
            )
            particleSystemRef.current.scale.setScalar(1 + mouseDistance * 0.1)

            // Update hover lines every 5 frames (slightly less frequent due to more stars)
            if (frameCount.current % 5 === 0) {
                const mouseWorldPos = getMouseWorldPosition(state.camera)
                createHoverLines(mouseWorldPos)
            }
        }

        // Sync line groups with particle system
        if (linesRef.current && particleSystemRef.current) {
            linesRef.current.rotation.copy(particleSystemRef.current.rotation)
            linesRef.current.scale.copy(particleSystemRef.current.scale)
        }

        if (hoverLinesRef.current && particleSystemRef.current) {
            hoverLinesRef.current.rotation.copy(
                particleSystemRef.current.rotation
            )
            hoverLinesRef.current.scale.copy(particleSystemRef.current.scale)
        }

        // Update constellation lines
        if (frameCount.current % 2 === 0) {
            const currentTime = Date.now()
            const cameraPosition = state.camera.position

            setConstellationLines((prev) =>
                prev
                    .map((line) => {
                        const age = currentTime - line.createdAt
                        const fadeStartTime = 2000
                        const disappearTime = 3000

                        if (age > disappearTime) {
                            return null
                        } else {
                            const distanceFromCamera = calculateLineDistance(
                                line.point1,
                                line.point2,
                                cameraPosition
                            )

                            let opacity = line.opacity
                            if (age > fadeStartTime) {
                                const fadeProgress =
                                    (age - fadeStartTime) /
                                    (disappearTime - fadeStartTime)
                                opacity = 1 - fadeProgress
                            }

                            return { ...line, opacity, distanceFromCamera }
                        }
                    })
                    .filter((line): line is ConstellationLine => line !== null)
            )

            setActiveHubs((prev) =>
                prev.filter((hub) => currentTime - hub.createdAt < 4000)
            )
        }
    })

    return (
        <>
            <ambientLight intensity={0.6} />

            <pointLight
                position={[mouseRef.current.x * 2, mouseRef.current.y * 2, 0]}
                intensity={1.5 + Math.abs(mouseRef.current.x) * 0.5}
                color="#ffffff"
                distance={8}
            />

            {/* Particle System using Three.js particle engine */}
            <points
                ref={particleSystemRef}
                geometry={particleGeometry}
                material={particleMaterial}
            />

            {/* Constellation Lines */}
            <group ref={linesRef}>
                {constellationLines.map((line) => {
                    const normalizedDistance = Math.max(
                        0,
                        Math.min(1, (line.distanceFromCamera - 2) / 6)
                    )
                    const lineOpacity =
                        line.opacity *
                        (line.generation === 0 ? 0.8 : 0.6) *
                        (0.4 + (1 - normalizedDistance) * 0.6)

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
                                    args={[
                                        new Float32Array([
                                            line.point1.x,
                                            line.point1.y,
                                            line.point1.z,
                                            line.point2.x,
                                            line.point2.y,
                                            line.point2.z,
                                        ]),
                                        3,
                                    ]}
                                />
                            </bufferGeometry>
                            <lineBasicMaterial
                                color={
                                    line.generation === 0
                                        ? '#34d399'
                                        : '#22c55e'
                                }
                                transparent={true}
                                opacity={lineOpacity}
                            />
                        </line>
                    )
                })}
            </group>

            {/* Hover Lines */}
            <group ref={hoverLinesRef}>
                {hoverLines.map((line) => (
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
                                args={[
                                    new Float32Array([
                                        line.point1.x,
                                        line.point1.y,
                                        line.point1.z,
                                        line.point2.x,
                                        line.point2.y,
                                        line.point2.z,
                                    ]),
                                    3,
                                ]}
                            />
                        </bufferGeometry>
                        <lineBasicMaterial
                            color="#60a5fa"
                            transparent={true}
                            opacity={line.opacity * 0.8}
                        />
                    </line>
                ))}
            </group>

            {/* Central lighting elements */}
            <mesh
                position={[0, 0, 0]}
                scale={1 + Math.abs(mouseRef.current.x) * 0.3}
            >
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshBasicMaterial
                    color="#ffffff"
                    transparent={true}
                    opacity={0.9}
                />
            </mesh>

            <mesh
                position={[0, 0, 0]}
                scale={1 + Math.abs(mouseRef.current.y) * 0.2}
            >
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial
                    color="#f0fdf4"
                    transparent={true}
                    opacity={0.2}
                />
            </mesh>
        </>
    )
}
