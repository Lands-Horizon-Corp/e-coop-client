import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { ReactNode } from '@tanstack/react-router'

export interface IActionTooltipProps {
    tooltipContent: string
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
                <TooltipContent side={side} align={align}>
                    <p>{tooltipContent}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default ActionTooltip
