import { cn } from '@/helpers'

import { RefreshIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'

import { IClassProps } from '@/types'

interface Props extends IClassProps {
    title: string
    totalItems?: number
    currentItems?: number
    isLoading?: boolean
    onRefresh?: () => void
    titleClassName?: string
    otherActions?: React.ReactNode
}

const KanbanTitle = ({
    title,
    className,
    isLoading,
    totalItems,
    currentItems,
    onRefresh,
    titleClassName,
    otherActions,
}: Props) => {
    return (
        <div
            className={cn(
                'flex w-full justify-between px-1 text-foreground/80',
                className
            )}
        >
            <p className={cn('', titleClassName)}>{title}</p>
            <div className="flex justify-end gap-x-2 items-center">
                {isLoading ? (
                    <LoadingSpinner className="text-muted-foreground" />
                ) : (
                    <>
                        {otherActions}
                        <Button
                            className="size-fit text-muted-foreground p-1"
                            disabled={isLoading}
                            onClick={() => onRefresh?.()}
                            size="icon"
                            variant="ghost"
                        >
                            <RefreshIcon className="size-3" />
                        </Button>
                    </>
                )}
                <div
                    className={cn(
                        'flex items-center gap-x-2',
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
            </div>
        </div>
    )
}

export default KanbanTitle
