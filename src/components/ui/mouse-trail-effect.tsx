'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

interface TrailPoint {
    id: number
    life: number
    timestamp: number
    x: number
    y: number
    invertedColor?: string
}

export interface MouseTrailEffectProps {
    /** Custom CSS classes */
    className?: string
    /** Trail color (for non-rainbow effects) */
    color?: string
    /** Trail effect type */
    effect?: 'dots' | 'line' | 'particles' | 'glow' | 'rainbow' | 'inverted'
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
    /** Enable color inversion based on background */
    invertColors?: boolean
}

// Utility functions for color inversion
const getElementAtPosition = (x: number, y: number): Element | null => {
    const elements = document.elementsFromPoint(x, y)
    return (
        elements.find(
            (el) => el !== document.documentElement && el !== document.body
        ) || document.body
    )
}

const getComputedBackgroundColor = (element: Element): string => {
    const computedStyle = window.getComputedStyle(element)
    let bgColor = computedStyle.backgroundColor

    // If transparent, traverse up the DOM
    let currentElement = element.parentElement
    while (
        (bgColor === 'transparent' || bgColor === 'rgba(0, 0, 0, 0)') &&
        currentElement
    ) {
        bgColor = window.getComputedStyle(currentElement).backgroundColor
        currentElement = currentElement.parentElement
    }

    // Fallback to white if still transparent
    return bgColor === 'transparent' || bgColor === 'rgba(0, 0, 0, 0)'
        ? 'rgb(255, 255, 255)'
        : bgColor
}

const rgbToHsl = (
    r: number,
    g: number,
    b: number
): [number, number, number] => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0,
        s = 0
    const l = (max + min) / 2

    if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0)
                break
            case g:
                h = (b - r) / d + 2
                break
            case b:
                h = (r - g) / d + 4
                break
        }
        h /= 6
    }

    return [h * 360, s * 100, l * 100]
}

const parseRgbColor = (color: string): [number, number, number] | null => {
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
    const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/)

    if (rgbMatch) {
        return [
            parseInt(rgbMatch[1]),
            parseInt(rgbMatch[2]),
            parseInt(rgbMatch[3]),
        ]
    }
    if (rgbaMatch) {
        return [
            parseInt(rgbaMatch[1]),
            parseInt(rgbaMatch[2]),
            parseInt(rgbaMatch[3]),
        ]
    }
    return null
}

const getInvertedColor = (backgroundColor: string): string => {
    const rgb = parseRgbColor(backgroundColor)
    if (!rgb) return '#ffffff' // fallback to white

    const [r, g, b] = rgb
    const [h, s, l] = rgbToHsl(r, g, b)

    // For inverted effect, we want high contrast
    // If background is light, use dark color; if dark, use light color
    const invertedL = l > 50 ? 20 : 80 // More dramatic contrast
    const invertedH = (h + 180) % 360 // Complementary hue for more vibrant effect

    return `hsl(${invertedH}, ${Math.min(s + 20, 100)}%, ${invertedL}%)`
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
    invertColors = false,
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

            // Get inverted color if needed
            let invertedColor: string | undefined
            if (invertColors || effect === 'inverted') {
                const elementAtPosition = getElementAtPosition(x, y)
                if (elementAtPosition) {
                    const bgColor =
                        getComputedBackgroundColor(elementAtPosition)
                    invertedColor = getInvertedColor(bgColor)
                }
            }

            const newPoint: TrailPoint = {
                id: trailIdRef.current++,
                life: 1,
                timestamp: Date.now(),
                x,
                y,
                invertedColor,
            }

            setTrail((prevTrail) => {
                const updatedTrail = [newPoint, ...prevTrail]
                return updatedTrail.slice(0, maxPoints)
            })
        },
        [enabled, maxPoints, invertColors, effect]
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

    const getTrailElementClass = (point: TrailPoint) => {
        const baseClasses =
            'absolute pointer-events-none transition-opacity duration-75'

        // Use inverted colors when available
        const shouldUseInvertedColor =
            (invertColors || effect === 'inverted') && point.invertedColor
        const colorClass = shouldUseInvertedColor ? '' : `bg-${color}`

        switch (effect) {
            case 'dots':
            case 'inverted':
                return `${baseClasses} rounded-full ${colorClass}`
            case 'glow':
                return shouldUseInvertedColor
                    ? `${baseClasses} rounded-full blur-[1px]`
                    : `${baseClasses} rounded-full bg-${color} shadow-lg shadow-${color}/50 blur-[1px]`
            case 'particles':
                return `${baseClasses} rounded-full ${colorClass} animate-pulse`
            case 'rainbow':
                return `${baseClasses} rounded-full shadow-sm`
            case 'line':
                return `${baseClasses} rounded-full ${colorClass} blur-[0.5px]`
            default:
                return `${baseClasses} rounded-full ${colorClass}`
        }
    }

    const getDynamicStyle = (point: TrailPoint, index: number) => {
        const shouldUseInvertedColor =
            (invertColors || effect === 'inverted') && point.invertedColor

        if (effect === 'rainbow' && !shouldUseInvertedColor) {
            const hue = (index * 25) % 360
            return {
                backgroundColor: `hsl(${hue}, 70%, 60%)`,
                boxShadow: `0 0 10px hsl(${hue}, 70%, 60%)`,
            }
        }

        if (shouldUseInvertedColor) {
            const baseStyle = {
                backgroundColor: point.invertedColor,
            }

            // Add glow effect for certain trail types
            if (effect === 'glow' || effect === 'inverted') {
                return {
                    ...baseStyle,
                    boxShadow: `0 0 15px ${point.invertedColor}, 0 0 25px ${point.invertedColor}`,
                    filter: 'brightness(1.2)',
                }
            }

            return baseStyle
        }

        return {}
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
                        stroke={
                            invertColors && trail[0]?.invertedColor
                                ? trail[0].invertedColor
                                : `hsl(var(--${color}))`
                        }
                        strokeOpacity="0.6"
                        strokeWidth="2"
                    />
                </svg>
            )}

            {effect !== 'line' &&
                trail.map((point, index) => (
                    <div
                        className={getTrailElementClass(point)}
                        key={point.id}
                        style={{
                            ...getTrailElementStyle(point, index),
                            ...getDynamicStyle(point, index),
                        }}
                    />
                ))}
        </div>
    )
}

export default MouseTrailEffect
