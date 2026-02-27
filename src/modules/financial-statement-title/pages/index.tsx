import { useEffect, useMemo, useState } from 'react'

import { toast } from 'sonner'

import useConfirmModalStore from '@/store/confirm-modal-store'
import {
    DndContext,
    DragEndEvent,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
    SortableContext,
    arrayMove,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { FileText } from 'lucide-react'
import { /*  */ Plus } from 'lucide-react'
import { AutoSizer, List } from 'react-virtualized'

import RefreshButton from '@/components/buttons/refresh-button'
import { Button } from '@/components/ui/button'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'

import { useModalState } from '@/hooks/use-modal-state'

import {
    IFinancialStatementTitle,
    useDeleteFinancialStatementTitleById,
    useFinancialStatementTitleOrder,
    useGetAllFinancialStatementTitle,
} from '..'
import SortableRowFinancialStatementTitle, {
    TSelectFinancialItem,
} from '../components/financial-statement-account'
import { FinancialStatementTitleCreateUpdateFormModal } from '../components/financial-statement-title-create-update'

// export const generateMockFinancialStatementTitles = (
//     count: number
// ): IFinancialStatementTitle[] => {
//     return Array.from({ length: count }).map((_, index) => ({
//         id: `fst-${index + 1}`,
//         title: `Section ${index + 1}`,
//         total_title: `Total Section ${index + 1}`,
//         exclude_consolidate_total: false,
//         index,
//         color: `hsl(${(index * 35) % 360}, 70%, 50%)`,
//         created_at: new Date(),
//         updated_at: new Date(),
//     }))
// }

const FinancialStatementTitleList = () => {
    const [selectedFinancialTitle, setFinancialTitle] =
        useState<IFinancialStatementTitle | null>(null)
    const { onOpen } = useConfirmModalStore()

    const {
        data,
        isLoading: isLoadingData,
        isRefetching: isRefetching,
        refetch,
    } = useGetAllFinancialStatementTitle()
    const { mutate: deleteFinancialStatementTitle } =
        useDeleteFinancialStatementTitleById({
            options: {
                onSuccess: () => {
                    toast.success(`Sucessfully deleted Financial`)
                },
                onError: () => {
                    toast.error('Error: Delete Financial Statement Title')
                },
            },
        })

    const { mutate: reorderTitles } = useFinancialStatementTitleOrder()

    const onOpenState = useModalState(false)

    const [titles, setTitles] = useState<IFinancialStatementTitle[]>([])

    useEffect(() => {
        if (!data) return
        if (titles.length === 0) {
            setTitles(data)
        }
    }, [data])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        })
    )

    const ids = useMemo(() => titles.map((t) => t.id), [titles])

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        setTitles((prev) => {
            const oldIndex = prev.findIndex((i) => i.id === active.id)
            const newIndex = prev.findIndex((i) => i.id === over.id)

            const newItems = arrayMove(prev, oldIndex, newIndex)

            reorderTitles(newItems.map((i) => i.id))

            return newItems
        })
    }

    const handleFinancialStatementTitleAction = (
        selectedItem: TSelectFinancialItem
    ) => {
        if (selectedItem.action === 'delete') {
            onOpen({
                title: 'Delete Selected',
                description: `You are about to delete ${selectedItem.item.title}, are you sure you want to proceed?`,
                onConfirm: () => {
                    deleteFinancialStatementTitle(selectedItem.item.id)
                },
                confirmString: 'Proceed',
            })
        }
        if (selectedItem.action === 'edit') {
            setFinancialTitle(selectedItem.item)
            onOpenState.onOpenChange(true)
        }
    }

    const isLoading = isLoadingData || isRefetching

    return (
        <div className=" flex-1 w-full h-screen max-w-2xl mx-auto space-y-4 p-5 bg-card rounded-2xl">
            <FinancialStatementTitleCreateUpdateFormModal
                {...onOpenState}
                formProps={{
                    defaultValues: selectedFinancialTitle ?? undefined,
                    financialStatementTitleId:
                        selectedFinancialTitle?.id ?? undefined,
                }}
            />
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                    Financial Statement Titles
                </h2>
                <div className=" inline-flex gap-x-1 items-center">
                    <Button
                        onClick={() => {
                            onOpenState.onOpenChange(true)
                        }}
                        size="sm"
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Create
                    </Button>
                    <RefreshButton onClick={refetch} />
                </div>
            </div>

            {isLoading ? (
                <FinancialStatementTitleSkeleton />
            ) : titles.length === 0 ? (
                <FinancialStatementTitleEmptyState
                    onCreate={() => onOpenState.onOpenChange(true)}
                />
            ) : (
                <DndContext
                    collisionDetection={closestCenter}
                    modifiers={[restrictToVerticalAxis]}
                    onDragEnd={handleDragEnd}
                    sensors={sensors}
                >
                    <SortableContext
                        items={ids}
                        strategy={verticalListSortingStrategy}
                    >
                        <AutoSizer>
                            {({ height, width }) => (
                                <List
                                    className="v1 ecoop-scroll h-screen"
                                    height={height}
                                    overscanRowCount={10}
                                    rowCount={titles.length}
                                    rowHeight={60} // adjust to your real height
                                    rowRenderer={({ key, index, style }) => {
                                        const item = titles[index]

                                        return (
                                            <div key={key} style={style}>
                                                <SortableRowFinancialStatementTitle
                                                    item={item}
                                                    onSelect={
                                                        handleFinancialStatementTitleAction
                                                    }
                                                />
                                            </div>
                                        )
                                    }}
                                    width={width}
                                />
                            )}
                        </AutoSizer>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    )
}

const FinancialStatementTitleSkeleton = () => {
    return (
        <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <div className="w-full flex-col space-y-2" key={i}>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            ))}
        </div>
    )
}

const FinancialStatementTitleEmptyState = ({
    onCreate,
}: {
    onCreate: () => void
}) => {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyContent>
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                </EmptyContent>

                <EmptyTitle>No Financial Statement Titles</EmptyTitle>

                <EmptyDescription>
                    Create your first section to start organizing your financial
                    statement.
                </EmptyDescription>
            </EmptyHeader>

            <Button onClick={onCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Create Title
            </Button>
        </Empty>
    )
}

export default FinancialStatementTitleList
