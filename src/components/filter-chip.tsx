import { IconType } from 'react-icons/lib'

import ActionTooltip from '@/components/action-tooltip'
import { XIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'

interface Props {
    label: string
    Icon?: IconType
    onClick: () => void
    tooltipDescription: string
}

const FilterChip = ({
    label,
    tooltipDescription,
    Icon = XIcon,
    onClick,
}: Props) => {
    return (
        <ActionTooltip tooltipContent={tooltipDescription}>
            <Badge
                onClick={onClick}
                variant="secondary"
                className="group relative cursor-pointer pr-6 shrink-0 w-fit text-xs font-normal"
            >
                {label}
                <span className="absolute right-2 top-1/2 block -translate-y-1/2 rounded-full group-hover:bg-background">
                    <Icon />
                </span>
            </Badge>
        </ActionTooltip>
    )
}

export default FilterChip
