import * as React from 'react'

import { cn } from '@/helpers/tw-utils'

import {
    Tooltip,
    TooltipContent,
    TooltipPortal,
    TooltipTrigger,
} from '@/components/ui/tooltip'

import { InfoIcon } from '../icons'

interface InfoTooltipProps {
    content: React.ReactNode
    children?: React.ReactNode
    className?: string
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
    delayDuration?: number
    sideOffset?: number
    alignOffset?: number
}

const InfoTooltip = ({
    content,
    children,
    className,
    side = 'top',
    align = 'center',
    delayDuration = 300,
    sideOffset = 4,
    alignOffset = 0,
}: InfoTooltipProps) => {
    return (
        <Tooltip delayDuration={delayDuration}>
            <TooltipTrigger asChild>
                {children || (
                    <span
                        className={cn(
                            'inline-flex size-3 cursor-help items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground hover:bg-muted-foreground/20',
                            className
                        )}
                    >
                        <InfoIcon className="inline size-full" />
                    </span>
                )}
            </TooltipTrigger>
            <TooltipPortal>
                <TooltipContent
                    align={align}
                    alignOffset={alignOffset}
                    className="text-xs px-1.5 rounded-lg border text-foreground bg-background"
                    side={side}
                    sideOffset={sideOffset}
                    style={{ zIndex: 99999 }}
                >
                    <div>{content}</div>
                </TooltipContent>
            </TooltipPortal>
        </Tooltip>
    )
}

export default InfoTooltip
