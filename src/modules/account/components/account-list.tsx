import { useEffect, useMemo, useState } from 'react'

import Fuse from 'fuse.js'
import { toast } from 'sonner'

import {
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { ArrowUpDown, Plus, Search, SearchX } from 'lucide-react'

import RefreshButton from '@/components/buttons/refresh-button'
import { LoadingCircleIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'
import { Input } from '@/components/ui/input'

import { useModalState } from '@/hooks/use-modal-state'

import { useReorderAccounts } from '../account.service'
import { IAccount } from '../account.types'
import { useAccountContext } from '../context/account-provider'
import { AccountCard } from './account-card'

export const AccountList = () => {
    const createModal = useModalState()
    const { accountsQuery } = useAccountContext()
    const [accounts, setAccounts] = useState<IAccount[]>([])

    const { mutate: reorderAccounts, isPending: isPendingReorder } =
        useReorderAccounts({
            options: {
                onSuccess: (data) => {
                    console.log(data)
                    toast.success('Accounts Re-order successfully')
                },
            },
        })

    useEffect(() => {
        if (!accountsQuery || !accountsQuery.data) return
        if (accountsQuery.data) {
            setAccounts(accountsQuery.data)
        }
    }, [accountsQuery.data, setAccounts])

    const [search, setSearch] = useState('')

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (over && active.id !== over.id) {
            setAccounts((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id)
                const newIndex = items.findIndex((i) => i.id === over.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    const fuse = useMemo(
        () =>
            new Fuse<IAccount>(accounts, {
                keys: [
                    { name: 'name', weight: 0.4 },
                    { name: 'description', weight: 0.3 },
                    { name: 'type', weight: 0.3 },
                    { name: 'general_ledger_type', weight: 0.3 },
                ],
                includeScore: true,
                threshold: 0.3,
                ignoreLocation: true,
                findAllMatches: true,
                minMatchCharLength: 2,
            }),
        [accounts]
    )

    const filtered = useMemo(() => {
        if (!search?.trim()) {
            return accounts
        }

        return fuse.search(search).map((result) => result.item)
    }, [search, fuse, accounts])

    return (
        <div className="mx-auto w-full max-w-3xl space-y-4 p-6">
            <div className="sticky top-0 z-40 bg-background pb-4 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-foreground">
                        Accounts
                    </h1>
                    <div>
                        <Button
                            className="gap-2 mr-1"
                            onClick={() => {
                                createModal.onOpenChange(true)
                            }}
                        >
                            <Plus className="h-4 w-4" />
                            Create
                        </Button>
                        <RefreshButton
                            isLoading={accountsQuery.isFetching}
                            onClick={() => accountsQuery.refetch()}
                        />
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        className="pl-10 bg-secondary border-border"
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search accounts..."
                        value={search}
                    />
                </div>

                {/* Sort indicator */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ArrowUpDown className="h-3.5 w-3.5" />
                    <span>Drag to reorder</span>
                    <Button
                        disabled={isPendingReorder}
                        onClick={() => {
                            reorderAccounts({
                                ids: filtered.map((account) => account.id),
                            })
                        }}
                        variant="ghost"
                    >
                        {isPendingReorder ? (
                            <LoadingCircleIcon className="animate-spin" />
                        ) : (
                            'Save'
                        )}
                    </Button>
                    <span className="ml-auto">{filtered.length} accounts</span>
                </div>
            </div>
            {/* List */}
            {(accountsQuery.isLoading ||
                accountsQuery.isPending ||
                accountsQuery.isFetching) && (
                <Empty>
                    <LoadingCircleIcon className=" animate-spin" />
                </Empty>
            )}
            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                sensors={sensors}
            >
                <SortableContext
                    items={filtered.map((a) => a.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-2">
                        {filtered.map((account) => (
                            <AccountCard
                                account={account}
                                key={account.id}
                                searchTerm={search}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
            {filtered.length === 0 && (
                <Empty className="rounded-lg border border-dashed border-border text-center text-muted-foreground">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <SearchX className="size-6" />
                        </EmptyMedia>

                        <EmptyTitle>No Accounts Found</EmptyTitle>

                        <EmptyDescription>
                            We couldn’t find any accounts matching your current
                            filters. Try adjusting your search criteria.
                        </EmptyDescription>
                    </EmptyHeader>

                    <EmptyContent className="flex-row justify-center gap-2">
                        <Button
                            onClick={() => accountsQuery.refetch()}
                            variant="outline"
                        >
                            Refresh Accounts
                        </Button>
                    </EmptyContent>
                </Empty>
            )}
        </div>
    )
}
