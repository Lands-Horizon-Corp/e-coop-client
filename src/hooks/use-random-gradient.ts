import { useMemo } from 'react'

export const colorPalette = [
    '#073B3A', // Midnight green
    '#0B6E4F', // Dartmouth green
    '#08A045', // Pigment green
    '#6BBF59', // Mantis
    '#21D375', // Emerald
]

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

export const useRandomGradient = () => {
    return useMemo(() => getRandomGradient(colorPalette), [])
}
