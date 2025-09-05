import React, { memo } from 'react'
import { useMemo } from 'react'

import { cn } from '@/helpers/tw-utils'

import ImageDisplay from '../image-display'

export const useRandomGradient = (colorPalette: string[]) => {
    return useMemo(() => getRandomGradient(colorPalette), [colorPalette])
}

export const colorPalette = [
    '#0A2647', // Oxford Blue (deep base)
    '#205295', // Denim Blue (primary blue)
    '#2C74B3', // Steel Blue (accent blue)
    // '#00A86B', // Jade Green (primary green)
    // '#3CCF4E', // Malachite (bright accent green)
]

interface GradientBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string
    children: React.ReactNode
    gradientColor?: string
    opacity?: number
    mediaUrl?: string
    gradientOnly?: boolean
    imageBackgroundOpacity?: number
    colorPalettes?: string[]
    imageBackgroundClassName?: string
}

export const getRandomGradient = (colors: string[]): string => {
    if (colors.length < 2) {
        return `linear-gradient(to right, ${colors[0]}, ${colors[0]})`
    }

    const color1Index = Math.floor(Math.random() * colors.length)
    let color2Index = Math.floor(Math.random() * colors.length)

    while (color2Index === color1Index) {
        color2Index = Math.floor(Math.random() * colors.length)
    }
    const color2 = colors[color2Index]

    const directions = [
        'to right',
        'to left',
        'to bottom',
        'to top',
        'to bottom right',
        'to bottom left',
        'to top right',
        'to top left',
    ]
    const randomDirection =
        directions[Math.floor(Math.random() * directions.length)]

    return `linear-gradient(${randomDirection}, ${'#FFFFFF00'}, ${color2})`
}

export const GradientBackground = memo(
    ({
        children,
        gradientColor,
        opacity = 0.2,
        mediaUrl,
        gradientOnly = false,
        imageBackgroundOpacity = 0.5,
        className,
        colorPalettes = colorPalette,
        imageBackgroundClassName,
        ...props
    }: GradientBackgroundProps) => {
        const randomGradient = useRandomGradient(colorPalettes)
        const showBackgroundImage = !gradientOnly && mediaUrl
        return (
            <div
                {...props}
                className={cn(
                    'relative overflow-hidden rounded-2xl',
                    className
                )}
            >
                {children}
                <div
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{
                        backgroundImage: gradientColor ?? randomGradient,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        opacity: opacity,
                        backgroundBlendMode: 'lighten',
                    }}
                />
                {showBackgroundImage && (
                    <ImageDisplay
                        className={cn(
                            'pointer-events-none absolute top-1/2 -right-[20%] transform -translate-x-1/2 -translate-y-1/2 backdrop-blur-3xl !opacity-30 size-60 -rotate-45 rounded-3xl',
                            imageBackgroundClassName
                        )}
                        src={mediaUrl}
                        style={{ opacity: imageBackgroundOpacity }}
                    />
                )}
            </div>
        )
    }
)
