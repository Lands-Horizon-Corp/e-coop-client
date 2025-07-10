import { useState } from 'react'

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

export const Account = ({ id, title }: { id: string; title: string }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id })

    const style = {
        transition,
        transform: transform ? CSS.Transform.toString(transform) : undefined,
    }

    return (
        <div
            className="flex items-center  p-2 border-b bg-background rounded-sm"
            ref={setNodeRef}
            style={style}
            {...attributes}
        >
            <div {...listeners} className="cursor-grab mr-2">
                <DragHandleIcon size={16} />
            </div>
            {title}
        </div>
    )
}
export const AccountCard = ({ accounts }: { accounts: IAccount[] }) => {
    return (
        <div className="flex-col space-y-2">
            <SortableContext
                items={accounts}
                strategy={verticalListSortingStrategy}
            >
                {accounts.map((account) => (
                    <Account
                        key={account.id}
                        id={account.id}
                        title={account.name}
                    />
                ))}
            </SortableContext>
        </div>
    )
}
export default function AccountsCardList({
    accounts,
}: {
    accounts: IAccount[]
}) {
    const [account, setAccount] = useState(accounts)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const getTaskPos = (id: string | number) =>
        account.findIndex((task) => task.id === id)

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id === over.id) return

        setAccount((account) => {
            const originalPos = getTaskPos(active.id)
            const newPos = over ? getTaskPos(over.id) : -1

            return arrayMove(account, originalPos, newPos)
        })
    }

    return (
        <div className="p-4">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
            >
                <AccountCard accounts={account} />
            </DndContext>
        </div>
    )
}
