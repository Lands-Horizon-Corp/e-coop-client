import { cn } from '@/lib'
import React, { memo } from 'react'

import SafeImage from '../safe-image'
import { orgBannerList } from '@/assets/pre-organization-banner-background'

import { useRandomGradient } from '@/hooks/use-random-gradient'

export const colorPalette = [
    '#073B3A', // Midnight green
    '#0B6E4F', // Dartmouth green
    '#08A045', // Pigment green
    '#6BBF59', // Mantis
    '#21D375', // Emerald
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
        opacity = 0.1,
        mediaUrl,
        gradientOnly = false,
        imageBackgroundOpacity = 0.5,
        className,
        colorPalettes = colorPalette,
        ...props
    }: GradientBackgroundProps) => {
        const randomGradient = useRandomGradient(colorPalettes)
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
                {!gradientOnly && (
                    <div className="pointer-events-none absolute -top-12 right-0 rounded-full backdrop-blur-3xl before:absolute before:-left-32 before:top-5 before:size-96 before:overflow-hidden before:bg-gradient-to-l before:from-[#073B3A] before:to-[#2b4b4a00] before:content-['']">
                        <SafeImage
                            className="relative size-64 -rotate-45 rounded-3xl"
                            src={mediaUrl}
                            fallbackSrc={orgBannerList[7]}
                            style={{ opacity: imageBackgroundOpacity }}
                        />
                    </div>
                )}
            </div>
        )
    }
)
