import { ReactNode } from 'react'

import {
    Tooltip,
    TooltipContent,
    TooltipPortal,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'

export interface IActionTooltipProps {
    tooltipContent: string | ReactNode
    children?: ReactNode
    delayDuration?: number
    side?: 'top' | 'right' | 'bottom' | 'left' | undefined
    align?: 'center' | 'end' | 'start' | undefined
}

const ActionTooltip = ({
    tooltipContent,
    children,
    side,
    align,
    delayDuration,
}: IActionTooltipProps) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={delayDuration}>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipPortal>
                    <TooltipContent align={align} side={side}>
                        <p>{tooltipContent}</p>
                    </TooltipContent>
                </TooltipPortal>
            </Tooltip>
        </TooltipProvider>
    )
}

export default ActionTooltip
