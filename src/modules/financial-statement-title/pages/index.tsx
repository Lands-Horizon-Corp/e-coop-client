import { useEffect, useMemo, useState } from 'react'

import Fuse from 'fuse.js'
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
import { AutoSizer, List } from 'react-virtualized'

import RefreshButton from '@/components/buttons/refresh-button'
import { FilesIcon, PlusIcon } from '@/components/icons'
import SearchInput from '@/components/search/generic-search-input'
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

export const FinancialStatementTitleList = () => {
    const getFinancialStatementTitleData = useGetAllFinancialStatementTitle()

    const [titles, setTitles] = useState<IFinancialStatementTitle[]>(
        getFinancialStatementTitleData.data ?? []
    )

    useEffect(() => {
        if (!getFinancialStatementTitleData.data) return
        setTitles(getFinancialStatementTitleData.data)
    }, [getFinancialStatementTitleData.data])

    const [selectedFinancialTitle, setFinancialTitle] =
        useState<IFinancialStatementTitle | null>(null)

    const { onOpen } = useConfirmModalStore()

    const [search, setSearch] = useState('')

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

    const fuse = useMemo(
        () =>
            new Fuse<IFinancialStatementTitle>(titles, {
                keys: [{ name: 'title', weight: 0.7 }],
                threshold: 0.3,
                ignoreLocation: true,
                minMatchCharLength: 1,
            }),
        [titles]
    )

    const filteredTitles = useMemo(() => {
        if (!search.trim()) return titles

        return fuse.search(search).map((result) => result.item)
    }, [search, fuse, titles])

    const isSearching = !!search.trim()

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        })
    )

    const ids = useMemo(() => titles.map((t) => t.id), [titles])

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (!over || active.id === over.id) return

        const oldIndex = titles.findIndex((i) => i.id === active.id)
        const newIndex = titles.findIndex((i) => i.id === over.id)

        if (oldIndex === -1 || newIndex === -1) return titles

        const newItems = arrayMove(titles, oldIndex, newIndex)

        setTitles(newItems)

        reorderTitles(
            { ids: newItems.map((item) => item.id) },
            {
                onSuccess: (titles) => {
                    setTitles(titles as IFinancialStatementTitle[])
                },
            }
        )
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

    const isLoading = getFinancialStatementTitleData.isLoading

    return (
        <div className=" flex-1 w-full h-screen max-w-2xl mx-auto overflow-auto overflow-y-hidden space-y-4 p-5 bg-card rounded-2xl">
            <FinancialStatementTitleCreateUpdateFormModal
                formProps={{
                    defaultValues: selectedFinancialTitle ?? undefined,
                    financialStatementTitleId:
                        selectedFinancialTitle?.id ?? undefined,
                }}
                onOpenChange={(prev) => {
                    if (!prev) {
                        setFinancialTitle(null)
                    }
                    return onOpenState.onOpenChange(prev)
                }}
                open={onOpenState.open}
            />
            <div className="flex justify-between gap-x-2 items-center">
                <SearchInput
                    debounce={500}
                    inputClassName="pl-10 !bg-card border-border"
                    placeholder="search financial statement title"
                    setSearchTerm={setSearch}
                />
                <div className=" inline-flex gap-x-1 items-center">
                    <Button
                        onClick={() => {
                            onOpenState.onOpenChange(true)
                        }}
                        size="sm"
                    >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Create
                    </Button>
                    <RefreshButton
                        onClick={getFinancialStatementTitleData.refetch}
                    />
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <FinancialStatementTitleSkeleton />
            ) : filteredTitles.length === 0 ? (
                <FinancialStatementTitleEmptyState
                    onCreate={() => onOpenState.onOpenChange(true)}
                />
            ) : isSearching ? (
                <div className="space-y-1">
                    {filteredTitles.map((item) => (
                        <SortableRowFinancialStatementTitle
                            isSearching
                            item={item}
                            key={item.id}
                            onSelect={handleFinancialStatementTitleAction}
                            searchTerm={search}
                        />
                    ))}
                </div>
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
                                    className="ecoop-scroll"
                                    height={height}
                                    overscanRowCount={50}
                                    rowCount={filteredTitles.length}
                                    rowHeight={35}
                                    rowRenderer={({ key, index, style }) => {
                                        const item = filteredTitles[index]
                                        return (
                                            <div key={key} style={style}>
                                                <SortableRowFinancialStatementTitle
                                                    isSearching={isSearching}
                                                    item={item}
                                                    key={item.id}
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
                        <FilesIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                </EmptyContent>

                <EmptyTitle>No Financial Statement Titles</EmptyTitle>

                <EmptyDescription>
                    Create your first section to start organizing your financial
                    statement.
                </EmptyDescription>
            </EmptyHeader>

            <Button onClick={onCreate}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Create Title
            </Button>
        </Empty>
    )
}

export default FinancialStatementTitleList
