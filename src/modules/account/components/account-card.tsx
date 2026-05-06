import { memo } from 'react'

import { cn } from '@/helpers'
import { TGeneralLedgerType } from '@/modules/general-ledger'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

import { highlightMatch } from '@/components/hightlight-match'
import { PlusIcon, RenderIcon, TIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'

import { useModalState } from '@/hooks/use-modal-state'

import { IAccount } from '../account.types'
import { useAccountContext } from '../context/account-provider'
import { AccountActions } from './account-actions'

export type TAccountModalState = {
    account: IAccount
    type: 'positive' | 'negative'
}
interface AccountCardProps {
    account: IAccount
    onEdit?: (account: IAccount) => void
    searchTerm?: string
    isSearching?: boolean
    setModalState: (data: TAccountModalState) => void
}
export const glTypeStyleMap: Record<
    TGeneralLedgerType,
    {
        border: string
        iconBg: string
        iconText: string
        hoverGradient: string
    }
> = {
    Assets: {
        border: 'border-l-4 border-emerald-500',
        iconBg: 'bg-emerald-500/10',
        iconText: 'text-emerald-600',
        hoverGradient:
            'hover:!bg-gradient-to-r hover:!from-emerald-500/20 hover:!to-transparent',
    },
    Liabilities: {
        border: 'border-l-4 border-rose-500',
        iconBg: 'bg-rose-500/10',
        iconText: 'text-rose-600',
        hoverGradient:
            'hover:!bg-gradient-to-r hover:!from-rose-500/20 hover:!to-transparent',
    },
    Equity: {
        border: 'border-l-4 border-violet-500',
        iconBg: 'bg-violet-500/10',
        iconText: 'text-violet-600',
        hoverGradient:
            'hover:!bg-gradient-to-r hover:!from-violet-500/20 hover:!to-transparent',
    },
    Revenue: {
        border: 'border-l-4 border-sky-500',
        iconBg: 'bg-sky-500/10',
        iconText: 'text-sky-600',
        hoverGradient:
            'hover:!bg-gradient-to-r hover:!from-sky-500/20 hover:!to-transparent',
    },
    Expenses: {
        border: 'border-l-4 border-amber-500',
        iconBg: 'bg-amber-500/10',
        iconText: 'text-amber-600',
        hoverGradient:
            'hover:!bg-gradient-to-r hover:!from-amber-500/20 hover:!to-transparent',
    },
}

export const AccountCard = memo(
    ({ account, isSearching, searchTerm, setModalState }: AccountCardProps) => {
        const { createModal } = useAccountContext()

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
        const actionsModal = useModalState(false)

        return (
            <Popover {...actionsModal}>
                <div
                    className={cn(
                        isDragging
                            ? 'opacity-50 shadow-lg shadow-primary/10'
                            : ''
                    )}
                    onClick={() => {
                        actionsModal.onOpenChange(true)
                    }}
                >
                    <PopoverTrigger asChild>
                        <div>
                            <Tooltip delayDuration={500}>
                                <TooltipTrigger asChild>
                                    <div
                                        className={cn(
                                            `group relative  border-l-0 rounded-l-none! flex items-center gap-3 rounded-lg  bg-card/80 p-4 transition-all duration-300`,
                                            glTypeStyleMap[
                                                account.general_ledger_type
                                            ].border,
                                            glTypeStyleMap[
                                                account.general_ledger_type
                                            ].hoverGradient,
                                            isDragging &&
                                                'opacity-50 shadow-lg shadow-primary/10'
                                        )}
                                        ref={setNodeRef}
                                        style={style}
                                    >
                                        <Button
                                            {...attributes}
                                            {...listeners}
                                            className="cursor-grab rounded p-1 hover:bg-transparent! text-muted-foreground hover:text-foreground active:cursor-grabbing"
                                            disabled={isSearching}
                                            size="xs"
                                            variant="ghost"
                                        >
                                            <GripVertical />
                                        </Button>
                                        <Button
                                            className="cursor-grab rounded p-1 hover:bg-transparent! text-muted-foreground hover:text-foreground active:cursor-grabbing"
                                            disabled={isSearching}
                                            size="xs"
                                            variant="ghost"
                                        >
                                            <span>{account.index}</span>
                                        </Button>
                                        <div
                                            className={cn(
                                                'flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-all duration-300',
                                                glTypeStyleMap[
                                                    account.general_ledger_type
                                                ].iconBg
                                            )}
                                        >
                                            {account.icon && (
                                                <RenderIcon
                                                    className={cn(
                                                        'transition-colors duration-300',
                                                        glTypeStyleMap[
                                                            account
                                                                .general_ledger_type
                                                        ].iconText
                                                    )}
                                                    icon={account.icon as TIcon}
                                                />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-foreground truncate">
                                                {searchTerm
                                                    ? highlightMatch(
                                                          account.name,
                                                          searchTerm
                                                      )
                                                    : account.name}
                                            </p>

                                            <p
                                                className={cn(
                                                    'text-xs text-muted-foreground truncate  transition-all duration-300',
                                                    'opacity-0 max-h-0 translate-y-1',
                                                    'group-hover:opacity-100 group-hover:max-h-10 group-hover:translate-y-0'
                                                )}
                                            >
                                                {searchTerm
                                                    ? highlightMatch(
                                                          account.description ??
                                                              '',
                                                          searchTerm
                                                      )
                                                    : account.description}
                                            </p>
                                        </div>

                                        <div
                                            className={cn(
                                                'hidden sm:flex items-center gap-2 transition-all duration-300',
                                                'opacity-0 translate-y-2',
                                                'group-hover:opacity-100 group-hover:translate-y-0'
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    'g-badge-red/15 px-3 py-1 text-xs font-medium text-badge-red border border-badge-red/30'
                                                )}
                                            >
                                                {searchTerm
                                                    ? highlightMatch(
                                                          account.type,
                                                          searchTerm
                                                      )
                                                    : account.type}
                                            </span>

                                            <span
                                                className={cn(
                                                    'rounded-full bg-badge-blue/15 px-3 py-1 text-xs font-medium text-badge-blue border border-badge-blue/30',
                                                    glTypeStyleMap[
                                                        account
                                                            .general_ledger_type
                                                    ].iconText
                                                )}
                                            >
                                                {searchTerm
                                                    ? highlightMatch(
                                                          account.general_ledger_type,
                                                          searchTerm
                                                      )
                                                    : account.general_ledger_type}
                                            </span>
                                        </div>
                                    </div>
                                </TooltipTrigger>

                                <TooltipContent
                                    align="center"
                                    className="flex flex-col p-0 bg-transparent"
                                    side="top"
                                    sideOffset={0}
                                >
                                    <Button
                                        className="z-9999 absolute -right-16 bottom-0 hover:scale-105"
                                        onClick={() => {
                                            createModal.onOpenChange(true)
                                            setModalState({
                                                account: account,
                                                type: 'negative',
                                            })
                                        }}
                                        size="xs"
                                    >
                                        <PlusIcon />
                                        create account
                                    </Button>

                                    <Button
                                        className={cn(
                                            'z-9999 absolute -right-16 hover:scale-105',
                                            !account.description
                                                ? 'top-17'
                                                : 'top-19'
                                        )}
                                        onClick={() => {
                                            createModal.onOpenChange(true)
                                            setModalState({
                                                account: account,
                                                type: 'positive',
                                            })
                                        }}
                                        size="xs"
                                    >
                                        <PlusIcon />
                                        create account
                                    </Button>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </PopoverTrigger>
                </div>
                <AccountActions account={account} />
            </Popover>
        )
    }
)
