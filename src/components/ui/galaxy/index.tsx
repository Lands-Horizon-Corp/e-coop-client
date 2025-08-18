'use client'

import type React from 'react'
import { useRef } from 'react'

import { Canvas } from '@react-three/fiber'

import { Galaxy } from './galaxy'

export function Galaxy3D() {
    const mouse = useRef({ x: 0, y: 0 })

    const handleMouseMove = (event: React.MouseEvent) => {
        mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    return (
        <div
            className="fixed inset-0 -z-10 bg-background"
            onMouseMove={handleMouseMove}
        >
            <Canvas
                camera={{
                    position: [1, 2, 3],
                    fov: 75,
                }}
                gl={{
                    alpha: true,
                    antialias: true,
                }}
            >
                <Galaxy />
            </Canvas>
        </div>
    )
}
