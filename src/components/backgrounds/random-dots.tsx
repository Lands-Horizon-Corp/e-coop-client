import { useMemo } from 'react'

interface RandomDotsProps {
    count?: number
    className?: string
    sizeVariants?: string[]
    opacityVariants?: string[]
    animationVariants?: string[]
    durationVariants?: string[]
    minPosition?: number
    maxPosition?: number
    maxDelay?: number
    enableGlow?: boolean
    enableFloat?: boolean
}

export function RandomDots({
    count = 50,
    className = '',
    sizeVariants = ['w-0.5 h-0.5', 'w-1 h-1', 'w-1.5 h-1.5', 'w-2 h-2'],
    opacityVariants = [
        'bg-primary/20',
        'bg-primary/30',
        'bg-primary/40',
        'bg-primary/50',
        'bg-primary/60',
    ],
    animationVariants = [
        'animate-pulse',
        'animate-bounce',
        'animate-spin',
        'hover:animate-bounce',
        '',
    ],
    durationVariants = [
        'duration-1000',
        'duration-2000',
        'duration-3000',
        'duration-[4s]',
        'duration-[5s]',
        '',
    ],
    minPosition = 5,
    maxPosition = 95,
    maxDelay = 2,
    enableGlow = true,
    enableFloat = true,
}: RandomDotsProps) {
    // Generate dots data once and memoize to prevent re-rendering
    const dots = useMemo(() => {
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
            const randomAnimation =
                animationVariants[
                    Math.floor(Math.random() * animationVariants.length)
                ]
            const randomDuration =
                durationVariants[
                    Math.floor(Math.random() * durationVariants.length)
                ]
            const randomDelay = Math.random() * maxDelay

            // Additional effects
            const hasGlow = enableGlow && Math.random() > 0.7 // 30% chance
            const hasFloat = enableFloat && Math.random() > 0.6 // 40% chance
            const floatDirection = Math.random() > 0.5 ? 'up' : 'down'
            const glowIntensity = Math.random() * 0.5 + 0.3 // 0.3 to 0.8

            return {
                id: i,
                topPercent,
                leftPercent,
                size: randomSize,
                opacity: randomOpacity,
                animation: randomAnimation,
                duration: randomDuration,
                delay: randomDelay,
                hasGlow,
                hasFloat,
                floatDirection,
                glowIntensity,
            }
        })
    }, [
        count,
        sizeVariants,
        opacityVariants,
        animationVariants,
        durationVariants,
        minPosition,
        maxPosition,
        maxDelay,
        enableGlow,
        enableFloat,
    ])

    return (
        <>
            {dots.map((dot) => (
                <div
                    key={dot.id}
                    className={`absolute ${dot.size} ${dot.opacity} rounded-full ${dot.animation} ${dot.duration} z-10 transition-all duration-300 hover:scale-125 hover:brightness-125 cursor-pointer ${
                        dot.hasGlow
                            ? 'dark:shadow-lg dark:shadow-primary/30 dark:brightness-125'
                            : ''
                    } ${className}`}
                    style={{
                        top: `${dot.topPercent}%`,
                        left: `${dot.leftPercent}%`,
                        animationDelay: `${dot.delay}s`,
                        boxShadow: undefined,
                        filter: undefined,
                        transform: dot.hasFloat
                            ? `translateY(${dot.floatDirection === 'up' ? '-2px' : '2px'})`
                            : undefined,
                        animation: dot.hasFloat
                            ? `${dot.floatDirection === 'up' ? 'bounce' : 'pulse'} ${3 + Math.random() * 2}s ease-in-out infinite`
                            : undefined,
                    }}
                />
            ))}
        </>
    )
}

export default RandomDots
