import { Button } from '@/components/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'

import { cn } from '@/lib'
import { IClassProps } from '@/types'

export type TPagination = {
    pageSize: number
    totalSize: number
    pageIndex: number
    totalPage: number
}

interface Props extends IClassProps {
    pagination: TPagination
    disablePageMove: boolean
    onNext: (newPagination: TPagination) => void
    onPrev: (newPageIndex: TPagination) => void
}

const MiniPaginationBar = ({
    className,
    pagination,
    disablePageMove,
    onNext,
    onPrev,
}: Props) => {
    const handleNext = () => {
        if (pagination.pageIndex < pagination.totalPage) {
            onNext({
                ...pagination,
                pageIndex: pagination.pageIndex + 1,
            })
        }
    }

    const handlePrevious = () => {
        if (pagination.pageIndex > 1) {
            onPrev({
                ...pagination,
                pageIndex: pagination.pageIndex - 1,
            })
        }
    }

    return (
        <div
            className={cn(
                'flex items-center justify-between border-t p-2',
                className
            )}
        >
            <p className="text-xs text-foreground/70">
                {pagination.pageIndex} of {pagination.totalPage}
            </p>
            <div className="flex items-center justify-end">
                <Button
                    size="icon"
                    variant="ghost"
                    className="size-fit p-0"
                    disabled={pagination.pageIndex <= 1 || disablePageMove}
                    onClick={handlePrevious}
                >
                    <ChevronLeftIcon />
                </Button>
                <Button
                    size="icon"
                    variant="ghost"
                    className="size-fit p-0"
                    disabled={
                        pagination.pageIndex >= pagination.totalPage ||
                        disablePageMove
                    }
                    onClick={handleNext}
                >
                    <ChevronRightIcon />
                </Button>
            </div>
        </div>
    )
}

export default MiniPaginationBar
