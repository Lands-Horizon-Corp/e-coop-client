import { cn } from '@/lib'

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
}

const KanbanTitle = ({
    title,
    className,
    isLoading,
    totalItems,
    currentItems,
    onRefresh,
}: Props) => {
    return (
        <div
            className={cn(
                'flex w-full justify-between px-1 text-foreground/80',
                className
            )}
        >
            <p>{title}</p>
            <div className="flex justify-end gap-x-2 items-center">
                {isLoading ? (
                    <LoadingSpinner className="text-muted-foreground" />
                ) : (
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onRefresh?.()}
                        disabled={isLoading}
                        className="size-fit text-muted-foreground p-1"
                    >
                        <RefreshIcon className="size-3" />
                    </Button>
                )}
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
            </div>
        </div>
    )
}

export default KanbanTitle
