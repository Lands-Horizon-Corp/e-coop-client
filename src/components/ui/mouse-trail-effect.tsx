'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

interface TrailPoint {
    id: number
    life: number
    timestamp: number
    x: number
    y: number
}

export interface MouseTrailEffectProps {
    /** Custom CSS classes */
    className?: string
    /** Trail color (for non-rainbow effects) */
    color?: string
    /** Trail effect type */
    effect?: 'dots' | 'line' | 'particles' | 'glow' | 'rainbow'
    /** Enable/disable the effect */
    enabled?: boolean
    /** How long each point lasts (ms) */
    lifetime?: number
    /** Number of trail points to display */
    maxPoints?: number
    /** Size of trail elements */
    size?: number
    /** Animation speed multiplier */
    speed?: number
}

const MouseTrailEffect: React.FC<MouseTrailEffectProps> = ({
    maxPoints = 15,
    effect = 'dots',
    size = 8,
    lifetime = 1000,
    color = 'primary',
    speed = 1,
    enabled = true,
    className = '',
}) => {
    const [trail, setTrail] = useState<TrailPoint[]>([])
    const animationRef = useRef<number | undefined>(undefined)
    const trailIdRef = useRef(0)
    const lastPositionRef = useRef({ x: 0, y: 0 })

    const updateTrail = useCallback(() => {
        setTrail((prevTrail) =>
            prevTrail
                .map((point) => ({
                    ...point,
                    life: Math.max(0, point.life - (16 * speed) / lifetime),
                }))
                .filter((point) => point.life > 0)
        )

        if (enabled) {
            animationRef.current = requestAnimationFrame(updateTrail)
        }
    }, [lifetime, speed, enabled])

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!enabled) return

            const { clientX: x, clientY: y } = e
            const lastPos = lastPositionRef.current

            // Only add point if mouse moved significantly
            const distance = Math.sqrt(
                (x - lastPos.x) ** 2 + (y - lastPos.y) ** 2
            )
            if (distance < 5) return

            lastPositionRef.current = { x, y }

            const newPoint: TrailPoint = {
                id: trailIdRef.current++,
                life: 1,
                timestamp: Date.now(),
                x,
                y,
            }

            setTrail((prevTrail) => {
                const updatedTrail = [newPoint, ...prevTrail]
                return updatedTrail.slice(0, maxPoints)
            })
        },
        [enabled, maxPoints]
    )

    useEffect(() => {
        if (!enabled) return

        document.addEventListener('mousemove', handleMouseMove, {
            passive: true,
        })
        animationRef.current = requestAnimationFrame(updateTrail)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [enabled, handleMouseMove, updateTrail])

    const getTrailElementStyle = (point: TrailPoint, index: number) => {
        const progress = 1 - index / maxPoints
        const scale = point.life * progress
        const currentSize = size * scale

        const baseStyle = {
            height: currentSize,
            left: point.x - currentSize / 2,
            opacity: point.life * progress,
            top: point.y - currentSize / 2,
            transform: `scale(${scale})`,
            width: currentSize,
        }

        return baseStyle
    }

    const getTrailElementClass = () => {
        const baseClasses =
            'absolute pointer-events-none transition-opacity duration-75'

        switch (effect) {
            case 'dots':
                return `${baseClasses} rounded-full bg-${color}`
            case 'glow':
                return `${baseClasses} rounded-full bg-${color} shadow-lg shadow-${color}/50 blur-[1px]`
            case 'particles':
                return `${baseClasses} rounded-full bg-${color} animate-pulse`
            case 'rainbow':
                return `${baseClasses} rounded-full shadow-sm`
            case 'line':
                return `${baseClasses} rounded-full bg-${color} blur-[0.5px]`
            default:
                return `${baseClasses} rounded-full bg-${color}`
        }
    }

    const getRainbowStyle = (index: number) => {
        if (effect !== 'rainbow') return {}

        const hue = (index * 25) % 360
        return {
            backgroundColor: `hsl(${hue}, 70%, 60%)`,
            boxShadow: `0 0 10px hsl(${hue}, 70%, 60%)`,
        }
    }

    if (!enabled) return null

    return (
        <div className={`pointer-events-none fixed inset-0 z-50 ${className}`}>
            {effect === 'line' && trail.length > 1 && (
                <svg className="pointer-events-none absolute inset-0 h-full w-full">
                    <path
                        className="animate-pulse"
                        d={`M ${trail.map((point) => `${point.x} ${point.y}`).join(' L ')}`}
                        fill="none"
                        stroke={`hsl(var(--${color}))`}
                        strokeOpacity="0.6"
                        strokeWidth="2"
                    />
                </svg>
            )}

            {effect !== 'line' &&
                trail.map((point, index) => (
                    <div
                        className={getTrailElementClass()}
                        key={point.id}
                        style={{
                            ...getTrailElementStyle(point, index),
                            ...getRainbowStyle(index),
                        }}
                    />
                ))}
        </div>
    )
}

export default MouseTrailEffect
