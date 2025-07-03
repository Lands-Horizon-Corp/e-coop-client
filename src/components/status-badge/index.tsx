import { cn } from '@/lib'

import { Badge } from '../ui/badge'

export type BadgeColorMap<T extends string> = Record<T, string>

type StatusBadgeProps<T extends string> = {
    text: T
    colorMap: BadgeColorMap<T>
    className?: string
}

export const StatusBadge = <T extends string>({
    text,
    colorMap,
    className,
}: StatusBadgeProps<T>) => (
    <Badge
        className={cn(
            'rounded-full px-2 text-[10px] hover:bg-transparent',
            colorMap[text],
            className
        )}
    >
        {text.toUpperCase()}
    </Badge>
)

export default StatusBadge
