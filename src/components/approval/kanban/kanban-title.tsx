import LoadingSpinner from '@/components/spinners/loading-spinner'
import { cn } from '@/lib'
import { IClassProps } from '@/types'

interface Props extends IClassProps {
    title: string
    totalItems?: number
    currentItems?: number
    isLoading?: boolean
}

const KanbanTitle = ({
    title,
    className,
    isLoading,
    totalItems,
    currentItems,
}: Props) => {
    return (
        <div
            className={cn(
                'flex w-full justify-between px-1 text-foreground/80',
                className
            )}
        >
            <p>{title}</p>
            <div
                className={cn(
                    'flex items-center gap-x-2',
                    isLoading && 'hidden',
                    totalItems === undefined &&
                        currentItems == undefined &&
                        'hidden'
                )}
            >
                {currentItems !== undefined && (
                    <p className="text-sm">{currentItems}</p>
                )}
                {totalItems !== undefined && currentItems !== undefined && (
                    <p className="text-sm text-muted-foreground">/</p>
                )}
                {totalItems !== undefined && (
                    <p className="font-semibold">{totalItems}</p>
                )}
            </div>
            {isLoading && <LoadingSpinner />}
        </div>
    )
}

export default KanbanTitle
