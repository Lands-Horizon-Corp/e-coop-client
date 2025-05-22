import {
    colorPalette,
    getRandomGradient,
} from '@/components/gradient-background/gradient-background'
import { useMemo } from 'react'

export const useRandomGradient = () => {
    return useMemo(() => getRandomGradient(colorPalette), [])
}
