import { useState } from 'react'

import { useGeneralLedgerStore } from '@/store/general-ledger-accounts-groupings-store'
import { IAccount } from '@/types/coop-types/accounts/account'
import {
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    closestCorners,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    arrayMove,
    sortableKeyboardCoordinates,
    useSortable,
} from '@dnd-kit/sortable'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { DragHandleIcon } from '@/components/icons'

import { TEntityId, UpdateIndexRequest } from '@/types'

import GLAccountActions from './gl-account-actions'

type AccountItemProps = {
    id: string
    title: string
    handleDeleteAccount: (accountId: TEntityId) => void
    account: IAccount
}

export const GeneralLedgerAccountItem = ({
    id,
    title,
    handleDeleteAccount,
    account,
}: AccountItemProps) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id })

    const style = {
        transition,
        transform: transform ? CSS.Transform.toString(transform) : undefined,
    }

    return (
        <div
            className="flex items-center  p-2 border-b bg-sidebar rounded-sm"
            ref={setNodeRef}
            style={style}
            {...attributes}
        >
            <div {...listeners} className="cursor-grab mr-2">
                <DragHandleIcon size={16} />
            </div>
            <div className="w-full flex items-center justify-between">
                {title}
                <GLAccountActions
                    node={account}
                    handleDeleteAccount={handleDeleteAccount}
                />
            </div>
        </div>
    )
}
type GlAccountListProps = {
    accounts: IAccount[]
    removeAccount: (accountId: string) => void
}
export default function GLAccountsCardList({
    accounts,
    removeAccount,
}: GlAccountListProps) {
    const [account, setAccount] = useState(accounts)
    const { setChangedAccounts } = useGeneralLedgerStore()

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleRemoveAcount = (accountId: TEntityId) => {
        setAccount((prev) => prev.filter((acc) => acc.id !== accountId))
        if (typeof removeAccount === 'function') {
            removeAccount(accountId)
        }
    }

    const getTaskPos = (id: string | number) =>
        account.findIndex((task) => task.id === id)

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id === over.id) return

        setAccount((account) => {
            const originalPos = getTaskPos(active.id)
            const newPos = over ? getTaskPos(over.id) : -1

            const updatedAccounts = arrayMove(account, originalPos, newPos)

            const finalAccounts = updatedAccounts.map((item, i) => ({
                ...item,
                index: i,
            }))

            const changed: UpdateIndexRequest[] = finalAccounts
                .filter(
                    (item, i) =>
                        item.id !== account[i]?.id ||
                        item.index !== account[i]?.index
                )
                .map((item) => ({
                    id: item.id,
                    index: item.index,
                }))

            setChangedAccounts?.(changed)

            return finalAccounts
        })
    }

    return (
        <div className="pl-4 pt-2">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={account}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="flex flex-col gap-2">
                        {account.map((accountItem) => (
                            <GeneralLedgerAccountItem
                                handleDeleteAccount={handleRemoveAcount}
                                account={accountItem}
                                key={accountItem.id}
                                id={accountItem.id}
                                title={accountItem.name}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    )
}
