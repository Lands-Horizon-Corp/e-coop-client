import { cn } from '@/helpers'

import { MagnifyingGlassIcon } from '../icons'
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from './empty'

type EmptyStateProps = {
    icon?: React.ReactNode
    title?: string
    description?: string
    className?: string
}
const EmptyState = ({
    icon = <MagnifyingGlassIcon />,
    title = 'No Data Available',
    description = 'There are no records to display at this time.',
    className,
}: EmptyStateProps) => {
    return (
        <Empty className={cn('', className)}>
            <EmptyHeader>
                <EmptyMedia variant="icon">{icon}</EmptyMedia>
                <EmptyTitle>{title}</EmptyTitle>
                <EmptyDescription>{description}</EmptyDescription>
            </EmptyHeader>
        </Empty>
    )
}
export default EmptyState
