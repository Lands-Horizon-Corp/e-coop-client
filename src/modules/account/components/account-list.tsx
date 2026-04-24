import { useEffect, useMemo, useState } from 'react'
import { useRef } from 'react'

import Fuse from 'fuse.js'

import {
    GENERAL_LEDGER_TYPE,
    TGeneralLedgerType,
} from '@/modules/general-ledger'
import {
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import debounce from 'lodash-es/debounce'
import { AutoSizer, List } from 'react-virtualized'

import { ChevronDownIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { useReorderAccounts } from '../account.service'
import { IAccount } from '../account.types'
import { useAccountContext } from '../context/account-provider'
import { AccountCard, TAccountModalState } from './account-card'
import AccountListHeader from './account-list-header'

export const getLastAccountForEachType = (
    data: IAccount[]
): Partial<Record<TGeneralLedgerType, IAccount>> => {
    const result: Partial<Record<TGeneralLedgerType, IAccount>> = {}
    const remainingTypes = new Set(GENERAL_LEDGER_TYPE)
    for (let i = data.length - 1; i >= 0; i--) {
        const currentAccount = data[i]
        if (remainingTypes.has(currentAccount.general_ledger_type)) {
            result[currentAccount.general_ledger_type] = currentAccount
            remainingTypes.delete(currentAccount.general_ledger_type)
            if (remainingTypes.size === 0) break
        }
    }
    return result
}

export type TModalState = {
    account: IAccount | null
    index: number
}

export const AccountList = () => {
    const { accountsQuery, createModal, setAccounts, accounts } =
        useAccountContext()

    const parentRef = useRef<List>(null)

    const accountIds = useMemo(() => accounts.map((a) => a.id), [accounts])

    const { mutate: reorderAccounts } = useReorderAccounts()

    const [modalState, setModalState] = useState<TModalState>({
        account: null,
        index: 0,
    })

    const [search, setSearch] = useState('')

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const debouncedReorder = useMemo(
        () =>
            debounce((ids: string[]) => {
                reorderAccounts({ ids })
            }, 0),
        [reorderAccounts]
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (!over || active.id === over.id) return

        setAccounts((items) => {
            const oldIndex = items.findIndex((i) => i.id === active.id)
            const newIndex = items.findIndex((i) => i.id === over.id)

            if (oldIndex === -1 || newIndex === -1) return items
            const newItems = arrayMove(items, oldIndex, newIndex)

            debouncedReorder(newItems.map((item) => item.id))

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
            newIndex = currentIndex
        }

        // Clamp index within bounds
        newIndex = Math.max(0, Math.min(newIndex, lastIndex))

        setModalState({
            account,
            index: newIndex,
        })
    }

    const scrollTo = (direction: 'up' | 'down') => {
        const list = parentRef.current
        if (!list) return

        if (direction === 'up') {
            list.scrollToRow(0)
        } else {
            list.scrollToRow(accounts.length - 1)
        }
    }

    useEffect(() => {
        const container = parentRef.current
        if (!container) return
    }, [])

    return (
        <div className="mx-auto w-full max-w-3xl space-y-4 p-6">
            <AccountListHeader
                createModal={createModal}
                filteredLength={filtered.length}
                isFetching={accountsQuery.isFetching}
                modalState={modalState}
                onRefetch={() => accountsQuery.refetch()}
                onRefresh={() => accountsQuery.refetch()}
                setSearch={setSearch}
            />
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
                    modifiers={[restrictToVerticalAxis]}
                    onDragEnd={handleDragEnd}
                    sensors={sensors}
                >
                    <SortableContext
                        items={accountIds}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="h-screen ecoop-scroll">
                            <AutoSizer>
                                {({ height, width }) => (
                                    <List
                                        className="ecoop-scroll"
                                        height={height}
                                        overscanRowCount={10}
                                        ref={parentRef}
                                        rowCount={accounts.length}
                                        rowHeight={75}
                                        rowRenderer={({
                                            key,
                                            index,
                                            style,
                                        }) => {
                                            const item = accounts[index]

                                            return (
                                                <div key={key} style={style}>
                                                    <AccountCard
                                                        account={item}
                                                        key={item.id}
                                                        setModalState={
                                                            handleModalState
                                                        }
                                                    />
                                                </div>
                                            )
                                        }}
                                        width={width}
                                    />
                                )}
                            </AutoSizer>

                            <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
                                <Button
                                    className="rounded-full shadow-lg border border-border h-10 w-10"
                                    onClick={() => scrollTo('up')}
                                    size="icon"
                                    variant={'secondary'}
                                >
                                    <ChevronDownIcon className="h-5 w-5 rotate-180" />
                                </Button>
                                <Button
                                    className="rounded-full shadow-lg border border-border h-10 w-10"
                                    onClick={() => scrollTo('down')}
                                    size="icon"
                                    variant={'secondary'}
                                >
                                    <ChevronDownIcon className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    )
}
