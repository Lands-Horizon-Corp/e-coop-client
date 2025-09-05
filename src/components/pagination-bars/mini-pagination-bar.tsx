import { cn } from '@/helpers/tw-utils'

import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'

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
        if (pagination.pageIndex > 0) {
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
            <p className="text-sm text-foreground/70">
                {pagination.pageIndex} of {pagination.totalPage}
            </p>
            <div className="flex items-center justify-end gap-x-1">
                <Button
                    size="icon"
                    variant="secondary"
                    className="size-fit p-1"
                    onClick={handlePrevious}
                    disabled={pagination.pageIndex <= 1 || disablePageMove}
                >
                    <ChevronLeftIcon />
                </Button>
                <Button
                    size="icon"
                    variant="secondary"
                    className="size-fit p-1"
                    onClick={handleNext}
                    disabled={
                        pagination.pageIndex >= pagination.totalPage ||
                        disablePageMove
                    }
                >
                    <ChevronRightIcon />
                </Button>
            </div>
        </div>
    )
}

export default MiniPaginationBar
