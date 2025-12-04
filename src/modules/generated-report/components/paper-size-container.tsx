import { cn } from '@/helpers/tw-utils'

import { IClassProps } from '@/types'

import {
    PAPER_SIZES,
    TPaperSizeUnit,
    getPaperSize,
} from '../generated-reports.constants'

interface IPaperSizeContainerProps extends IClassProps {
    size?: keyof typeof PAPER_SIZES
    width?: number
    height?: number
    unit?: TPaperSizeUnit
    orientation?: 'portrait' | 'landscape'
    scale?: number
    showDimensions?: boolean
    children?: React.ReactNode
}

/**
 * Visual preview container that displays content within a scaled paper size boundary.
 *
 * @example
 * <PaperSizeContainer size="A4" orientation="portrait">
 *   <div>Your content here</div>
 * </PaperSizeContainer>
 *
 * @example
 * <PaperSizeContainer width={210} height={297} unit="mm">
 *   <div>Custom size content</div>
 * </PaperSizeContainer>
 */
export const PaperSizeContainer = ({
    size,
    width: customWidth,
    height: customHeight,
    unit: customUnit = 'mm',
    orientation = 'portrait',
    scale = 1,
    showDimensions = true,
    children,
    className,
}: IPaperSizeContainerProps) => {
    // Determine paper dimensions
    let paperWidth: number
    let paperHeight: number
    let paperUnit: TPaperSizeUnit
    let paperName: string

    if (size) {
        const paperSize = getPaperSize(size, orientation)
        paperWidth = paperSize.width
        paperHeight = paperSize.height
        paperUnit = paperSize.unit
        paperName = paperSize.name
    } else if (customWidth && customHeight) {
        paperWidth = customWidth
        paperHeight = customHeight
        paperUnit = customUnit
        paperName = 'Custom'
    } else {
        // Default to A4 portrait
        const defaultSize = getPaperSize('A4', 'portrait')
        paperWidth = defaultSize.width
        paperHeight = defaultSize.height
        paperUnit = defaultSize.unit
        paperName = defaultSize.name
    }

    // Convert dimensions to pixels for display (assuming 96 DPI)
    const convertToPixels = (value: number, unit: TPaperSizeUnit): number => {
        switch (unit) {
            case 'mm':
                return (value * 96) / 25.4
            case 'in':
                return value * 96
            case 'pt':
                return (value * 96) / 72
            default:
                return value
        }
    }

    const widthPx = convertToPixels(paperWidth, paperUnit) * scale
    const heightPx = convertToPixels(paperHeight, paperUnit) * scale

    return (
        <div className={cn('flex flex-col items-center gap-4', className)}>
            {showDimensions && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium">{paperName}</span>
                    <span>•</span>
                    <span>
                        {paperWidth} × {paperHeight} {paperUnit}
                    </span>
                    {orientation === 'landscape' && (
                        <>
                            <span>•</span>
                            <span className="capitalize">{orientation}</span>
                        </>
                    )}
                </div>
            )}
            <div
                className="relative bg-white border border-border shadow-lg overflow-hidden"
                style={{
                    width: `${widthPx}px`,
                    height: `${heightPx}px`,
                }}
            >
                <div className="absolute inset-0 overflow-hidden">
                    {children}
                </div>
                {/* Corner indicator */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/20" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/20" />
            </div>
        </div>
    )
}

export default PaperSizeContainer
