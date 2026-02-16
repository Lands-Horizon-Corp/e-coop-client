import { useState } from 'react'

import { cn } from '@/helpers'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FileText, GripVertical } from 'lucide-react'

import { highlightMatch } from '@/components/hightlight-match'
import { PlusIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'

import { useModalState } from '@/hooks/use-modal-state'

import { IAccount } from '../account.types'
import { useAccountContext } from '../context/account-provider'
import { AccountActions } from './account-actions'
import AccountCreateUpdateFormModal from './forms/account-create-update-form'

interface AccountCardProps {
    account: IAccount
    onEdit?: (account: IAccount) => void
    searchTerm: string
}

export const AccountCard = ({
    account,
    // onEdit,
    searchTerm,
}: AccountCardProps) => {
    const { settings_payment_type_default_value, accountsQuery } =
        useAccountContext()
    const [index, setIndex] = useState<number>()
    const [selectedAccount, setSelectedAccount] = useState<IAccount | null>(
        null
    )
    const createModal = useModalState(false)

    const isSearching = searchTerm !== ''

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: account.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }
    return (
        <Tooltip delayDuration={200}>
            <AccountCreateUpdateFormModal
                className=" min-w-[80vw] max-w-[80vw]"
                formProps={{
                    defaultValues: {
                        index: index,
                        general_ledger_type:
                            selectedAccount?.general_ledger_type,
                        default_payment_type_id:
                            settings_payment_type_default_value?.id,
                        default_payment_type:
                            settings_payment_type_default_value,
                    },
                    onSuccess: () => {
                        createModal.onOpenChange(false)
                        accountsQuery.refetch()
                    },
                }}
                {...createModal}
            />
            <TooltipTrigger asChild>
                <div
                    className={`group flex  items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50 ${
                        isDragging
                            ? 'opacity-50 shadow-lg shadow-primary/10'
                            : ''
                    }`}
                    ref={setNodeRef}
                    style={style}
                >
                    {/* Drag handle */}
                    <Button
                        {...attributes}
                        {...listeners}
                        className="cursor-grab rounded p-1 hover:bg-transparent! text-muted-foreground hover:text-foreground active:cursor-grabbing"
                        disabled={isSearching}
                        size={'xs'}
                        variant={'ghost'}
                    >
                        <GripVertical />
                    </Button>

                    {/* Icon */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-secondary">
                        <FileText className="h-4 w-4 text-primary" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">
                            {searchTerm
                                ? highlightMatch(account.name, searchTerm)
                                : account.name}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                            {searchTerm
                                ? highlightMatch(
                                      account.description ?? '',
                                      searchTerm
                                  )
                                : account.description}
                        </p>
                    </div>

                    {/* Badges */}
                    <div className="hidden sm:flex items-center gap-2">
                        <span className="rounded-full bg-badge-red/15 px-3 py-1 text-xs font-medium text-badge-red border border-badge-red/30">
                            {searchTerm
                                ? highlightMatch(account.type, searchTerm)
                                : account.type}
                        </span>
                        <span className="rounded-full bg-badge-blue/15 px-3 py-1 text-xs font-medium text-badge-blue border border-badge-blue/30">
                            {searchTerm
                                ? highlightMatch(
                                      account.general_ledger_type,
                                      searchTerm
                                  )
                                : account.general_ledger_type}
                        </span>
                    </div>

                    {/* Edit */}
                    <AccountActions accountData={account} />
                </div>
            </TooltipTrigger>
            <TooltipContent
                align="center"
                className="flex flex-col p-0 bg-transparent "
                side="top"
                sideOffset={0}
            >
                <Button
                    className="z-9999 absolute -right-16 bottom-0 hover:scale-105"
                    onClick={() => {
                        createModal.onOpenChange(true)
                        setSelectedAccount(account)
                        console.log(account.index)
                        if (account.index === 1) {
                            setIndex(1)
                        }
                        setIndex(account.index === 0 ? 0 : account.index - 1)
                    }}
                    size={'xs'}
                >
                    <PlusIcon />
                    create account
                </Button>
                <Button
                    className={cn(
                        'z-9999 -right-16  absolute hover:scale-105',
                        !account.description ? 'top-17' : 'top-19'
                    )}
                    onClick={() => {
                        createModal.onOpenChange(true)
                        setSelectedAccount(account)
                        setIndex(account.index - 1)
                    }}
                    size={'xs'}
                >
                    <PlusIcon /> create account
                </Button>
            </TooltipContent>
        </Tooltip>
    )
}
