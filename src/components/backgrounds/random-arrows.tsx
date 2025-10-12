import { useMemo } from 'react'

import TripleArrow from '@/components/ui/triple-arrow'

type ArrowSize =
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl'

interface RandomArrowsProps {
    count?: number
    className?: string
    sizeVariants?: ArrowSize[]
    opacityVariants?: string[]
    minPosition?: number
    maxPosition?: number
    maxDelay?: number
    enableGlow?: boolean
    enableFloat?: boolean
    enableRocketBoost?: boolean
}

export function RandomArrows({
    count = 12,
    className = '',
    sizeVariants = ['xs', 'sm', 'md', 'lg', 'xl'],
    opacityVariants = ['opacity-90'],
    minPosition = 5,
    maxPosition = 95,
    maxDelay = 3,
    enableGlow = true,
    enableFloat = true,
    enableRocketBoost = true,
}: RandomArrowsProps) {
    // Generate arrows data once and memoize to prevent re-rendering
    const arrows = useMemo(() => {
        return Array.from({ length: count }, (_, i) => {
            const topPercent =
                Math.floor(Math.random() * (maxPosition - minPosition)) +
                minPosition
            const leftPercent =
                Math.floor(Math.random() * (maxPosition - minPosition)) +
                minPosition

            const randomSize =
                sizeVariants[Math.floor(Math.random() * sizeVariants.length)]
            const randomOpacity =
                opacityVariants[
                    Math.floor(Math.random() * opacityVariants.length)
                ]
            const randomDelay = Math.random() * maxDelay

            // Additional effects
            const hasGlow = enableGlow && Math.random() > 0.6 // 40% chance
            const hasFloat = enableFloat && Math.random() > 0.5 // 50% chance
            const floatDirection = Math.random() > 0.5 ? 'up' : 'down'
            const floatDuration = 2 + Math.random() * 3 // 2-5 seconds
            const floatDistance = 5 + Math.random() * 15 // 5-20px movement

            // Rocket boost effect - occasional fast upward movement
            const hasRocketBoost = enableRocketBoost && Math.random() > 0.85 // 15% chance
            const rocketBoostDelay = Math.random() * 10 // Random delay for rocket boost
            const rocketBoostDuration = 0.8 + Math.random() * 0.4 // 0.8-1.2s

            return {
                id: i,
                topPercent,
                leftPercent,
                size: randomSize,
                opacity: randomOpacity,
                rotation: 0,
                delay: randomDelay,
                hasGlow,
                hasFloat,
                floatDirection,
                floatDuration,
                floatDistance,
                hasRocketBoost,
                rocketBoostDelay,
                rocketBoostDuration,
            }
        })
    }, [
        count,
        sizeVariants,
        opacityVariants,
        minPosition,
        maxPosition,
        maxDelay,
        enableGlow,
        enableFloat,
        enableRocketBoost,
    ])

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
            <style>{`
                @keyframes rocketBoost {
                    0% {
                        transform: translateY(0) scale(1);
                        filter: brightness(1);
                    }
                    20% {
                        transform: translateY(-50px) scale(1.2);
                        filter: brightness(1.5);
                    }
                    100% {
                        transform: translateY(-150px) scale(0.6);
                        filter: brightness(0.5);
                        opacity: 0;
                    }
                }

                @keyframes arrowFloat {
                    0%,
                    100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-15px);
                    }
                }

                @keyframes arrowFloatDown {
                    0%,
                    100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(15px);
                    }
                }
            `}</style>

            {arrows.map((arrow) => (
                <div
                    className={`absolute z-0 transition-all duration-500 hover:scale-110 hover:brightness-125 pointer-events-auto cursor-pointer ${arrow.opacity} ${
                        arrow.hasGlow
                            ? 'dark:drop-shadow-lg dark:drop-shadow-primary/30 dark:brightness-125'
                            : ''
                    } ${className}`}
                    key={arrow.id}
                    style={{
                        top: `${arrow.topPercent}%`,
                        left: `${arrow.leftPercent}%`,
                        transformOrigin: 'center',
                        animation: (() => {
                            const animations = []

                            if (arrow.hasRocketBoost) {
                                animations.push(
                                    `rocketBoost ${arrow.rocketBoostDuration}s ease-out ${arrow.rocketBoostDelay}s forwards`
                                )
                            }

                            if (arrow.hasFloat && !arrow.hasRocketBoost) {
                                const floatAnimation =
                                    arrow.floatDirection === 'up'
                                        ? 'arrowFloat'
                                        : 'arrowFloatDown'
                                animations.push(
                                    `${floatAnimation} ${arrow.floatDuration}s ease-in-out ${arrow.delay}s infinite`
                                )
                            }

                            return animations.join(', ') || undefined
                        })(),
                    }}
                >
                    <div className="absolute top-0 h-full w-full">
                        <TripleArrow
                            className="hover:animate-pulse"
                            size={arrow.size}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default RandomArrows
