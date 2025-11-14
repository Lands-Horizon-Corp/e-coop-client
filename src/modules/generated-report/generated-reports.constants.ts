import { PaperSize } from './generated-report.types'

// 📏 Common Paper & Screen Sizes
export const PAPER_SIZES: Record<string, PaperSize> = {
    RECEIPT_58MM: { name: '58mm Receipt', width: 58, height: 200, unit: 'mm' },
    RECEIPT_80MM: { name: '80mm Receipt', width: 80, height: 200, unit: 'mm' },

    A6: { name: 'A6', width: 105, height: 148, unit: 'mm' },
    A5: { name: 'A5', width: 148, height: 210, unit: 'mm' },
    A4: { name: 'A4', width: 210, height: 297, unit: 'mm' },
    A3: { name: 'A3', width: 297, height: 420, unit: 'mm' },

    LETTER: { name: 'Letter', width: 8.5, height: 11, unit: 'in' },
    LEGAL: { name: 'Legal', width: 8.5, height: 14, unit: 'in' },
    FOLIO: { name: 'Folio', width: 8.5, height: 13, unit: 'in' },

    B5: { name: 'B5', width: 176, height: 250, unit: 'mm' },
}

// 🧭 Helper Function to Get Orientation
export function getPaperSize(
    key: keyof typeof PAPER_SIZES,
    orientation: 'portrait' | 'landscape' = 'portrait'
): PaperSize {
    const size = PAPER_SIZES[key]
    if (!size) throw new Error(`Paper size "${key}" not found`)
    return orientation === 'landscape'
        ? { ...size, width: size.height, height: size.width, orientation }
        : { ...size, orientation }
}

export const DELAY_DOWNLOAD_TIME_DURATION = 10
export const DELAY_DOWNLOAD_TIME_INTERVAL = 1000
