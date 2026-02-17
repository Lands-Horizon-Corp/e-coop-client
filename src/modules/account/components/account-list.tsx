import { useMemo, useState } from 'react'

import Fuse from 'fuse.js'

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
import { ArrowUpDown, Plus, Search } from 'lucide-react'

import RefreshButton from '@/components/buttons/refresh-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

import { useReorderAccounts } from '../account.service'
import { IAccount } from '../account.types'
import { useAccountContext } from '../context/account-provider'
import { AccountCard, TAccountModalState } from './account-card'
import AccountCreateUpdateFormModal from './forms/account-create-update-form'

export const AccountList = () => {
    const {
        accountsQuery,
        createModal,
        setAccounts,
        accounts,
        settings_payment_type_default_value,
    } = useAccountContext()

    const { mutate: reorderAccounts } = useReorderAccounts()

    const [modalState, setModalState] = useState<{
        account: IAccount | null
        index: number
    }>({
        account: null,
        index: 0,
    })

    const [search, setSearch] = useState('')

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (!over || active.id === over.id) return

        setAccounts((items) => {
            const oldIndex = items.findIndex((i) => i.id === active.id)
            const newIndex = items.findIndex((i) => i.id === over.id)

            if (oldIndex === -1 || newIndex === -1) return items
            const newItems = arrayMove(items, oldIndex, newIndex)
            reorderAccounts({
                ids: newItems.map((item) => item.id),
            })
            return newItems
        })
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

    const isSearching = !!search.trim()

    const handleModalState = (modalState: TAccountModalState) => {
        const { account, type } = modalState
        const currentIndex = account.index
        const lastIndex = accounts.length - 1

        let newIndex = currentIndex

        if (type === 'positive') {
            newIndex = currentIndex + 1
        } else if (type === 'negative') {
            newIndex = currentIndex - 1
        }

        // Clamp index within bounds
        newIndex = Math.max(0, Math.min(newIndex, lastIndex))

        setModalState({
            account,
            index: newIndex,
        })
    }

    return (
        <div className="mx-auto w-full max-w-3xl space-y-4 p-6">
            <AccountCreateUpdateFormModal
                className=" min-w-[80vw] max-w-[80vw]"
                formProps={{
                    defaultValues: {
                        index: modalState.index,
                        general_ledger_type:
                            modalState.account?.general_ledger_type,
                        default_payment_type_id:
                            settings_payment_type_default_value?.id,
                        default_payment_type:
                            settings_payment_type_default_value,
                    },
                }}
                {...createModal}
            />
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
                    <span className="ml-auto">{filtered.length} accounts</span>
                </div>
            </div>
            {/* List */}
            {accountsQuery.isLoading ? (
                <div className="p-2 w-full flex flex-col space-y-2">
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <div className="p-2 flex gap-x-2 w-full" key={idx}>
                            <Skeleton className="w-1/16" />
                            <div className="flex flex-col grow space-y-2">
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-5 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : isSearching ? (
                <div className="space-y-2">
                    {filtered.map((account) => (
                        <AccountCard
                            account={account}
                            isSearching={true}
                            key={account.id}
                            searchTerm={search}
                            setModalState={handleModalState}
                        />
                    ))}
                </div>
            ) : (
                <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    sensors={sensors}
                >
                    <SortableContext
                        items={accounts.map((a) => a.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-2">
                            {accounts.map((account) => (
                                <AccountCard
                                    account={account}
                                    key={account.id}
                                    searchTerm=""
                                    setModalState={handleModalState}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    )
}
