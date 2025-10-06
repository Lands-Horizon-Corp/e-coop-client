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
            const floatDuration = 3 + Math.random() * 2 // Pre-calculate the random duration

            // Convert Tailwind animation classes to CSS animation names
            const getAnimationName = (tailwindClass: string) => {
                const animationMap: Record<string, string> = {
                    'animate-pulse': 'pulse',
                    'animate-bounce': 'bounce',
                    'animate-spin': 'spin',
                    'hover:animate-bounce': 'bounce',
                    '': '',
                }
                return animationMap[tailwindClass] || ''
            }

            // Convert Tailwind duration classes to CSS values
            const getDurationValue = (durationClass: string) => {
                const durationMap: Record<string, string> = {
                    'duration-1000': '1s',
                    'duration-2000': '2s',
                    'duration-3000': '3s',
                    'duration-[4s]': '4s',
                    'duration-[5s]': '5s',
                    '': '2s',
                }
                return durationMap[durationClass] || '2s'
            }

            const cssAnimationName = getAnimationName(randomAnimation)
            const cssDuration = getDurationValue(randomDuration)

            return {
                id: i,
                topPercent,
                leftPercent,
                size: randomSize,
                opacity: randomOpacity,
                animationName: cssAnimationName,
                animationDuration: cssDuration,
                delay: randomDelay,
                hasGlow,
                hasFloat,
                floatDirection,
                glowIntensity,
                floatDuration,
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
                    className={`absolute ${dot.size} ${dot.opacity} rounded-full z-10 transition-all duration-300 hover:scale-125 hover:brightness-125 cursor-pointer ${
                        dot.hasGlow
                            ? 'dark:shadow-lg dark:shadow-primary/30 dark:brightness-125'
                            : ''
                    } ${className}`}
                    style={{
                        top: `${dot.topPercent}%`,
                        left: `${dot.leftPercent}%`,
                        transform: dot.hasFloat
                            ? `translateY(${dot.floatDirection === 'up' ? '-2px' : '2px'})`
                            : undefined,
                        animation: (() => {
                            if (dot.hasFloat) {
                                // Float animation takes priority
                                return `${dot.floatDirection === 'up' ? 'bounce' : 'pulse'} ${dot.floatDuration}s ease-in-out ${dot.delay}s infinite`
                            } else if (dot.animationName) {
                                // Regular animation
                                return `${dot.animationName} ${dot.animationDuration} ease-in-out ${dot.delay}s infinite`
                            }
                            return undefined
                        })(),
                    }}
                />
            ))}
        </>
    )
}

export default RandomDots
