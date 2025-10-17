import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { PAGINATION_INITIAL_INDEX, PICKERS_SELECT_PAGE_SIZE } from '@/constants'
import { cn } from '@/helpers'
import {
    IAccount,
    TPaginatedAccountHookMode,
    useFilteredPaginatedAccount,
} from '@/modules/account'
import { AccountTypeBadge } from '@/modules/account'
import { FinancialStatementTypeBadge } from '@/modules/financial-statement-definition/components/financial-statement-type-badge'
import { GeneralLedgerTypeBadge } from '@/modules/general-ledger/components/general-ledger-type-badge'
import { IPickerBaseProps } from '@/types/component-types/picker'
import { PaginationState } from '@tanstack/react-table'

import { ChevronDownIcon, RenderIcon, TIcon, XIcon } from '@/components/icons'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'
import GenericPicker from '@/components/pickers/generic-picker'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'

import useFilterState from '@/hooks/use-filter-state'
import { useInternalState } from '@/hooks/use-internal-state'
import { useShortcut } from '@/hooks/use-shorcuts'

interface Props extends IPickerBaseProps<IAccount> {
    allowShorcutCommand?: boolean
    modalOnly?: boolean
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?(open: boolean): void
    mode?: TPaginatedAccountHookMode
    nameOnly?: boolean
    hideDescription?: boolean
    allowClear?: boolean
}

const AccountPicker = ({
    mode,
    value,
    disabled,
    allowShorcutCommand = false,
    placeholder,
    onSelect,
    modalOnly = false,
    onOpenChange,
    open,
    nameOnly = false,
    hideDescription = false,
    modalState,
    triggerClassName,
    allowClear = false,
}: Props) => {
    const queryClient = useQueryClient()

    const [state, setState] = useInternalState(
        false,
        modalState?.open,
        modalState?.onOpenChange
    )

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: PAGINATION_INITIAL_INDEX,
        pageSize: PICKERS_SELECT_PAGE_SIZE,
    })

    const { finalFilterPayload, bulkSetFilter } = useFilterState({
        defaultFilterMode: 'OR',
        onFilterChange: () =>
            setPagination((prev) => ({
                ...prev,
                pageIndex: PAGINATION_INITIAL_INDEX,
            })),
    })

    const {
        data: AccountData,
        isPending,
        isLoading,
        isFetching,
    } = useFilteredPaginatedAccount({
        mode,
        query: {
            pagination,
            showMessage: false,
            filterPayload: finalFilterPayload,
        },
        options: {
            enabled: !disabled,
        },
    })
    const { data = [], totalPage = 0, totalSize = 0 } = AccountData || {}

    useShortcut(
        'Enter',
        (event) => {
            event?.preventDefault()
            if (
                !value &&
                !disabled &&
                !isPending &&
                !isLoading &&
                !isFetching &&
                allowShorcutCommand
            ) {
                setState((prev) => !prev)
            }
        },
        { disableTextInputs: true }
    )

    return (
        <>
            <GenericPicker
                isLoading={isPending || isLoading || isFetching}
                items={data}
                listHeading={`Matched Results (${totalSize})`}
                onOpenChange={modalOnly ? onOpenChange : setState}
                onSearchChange={(searchValue) => {
                    bulkSetFilter(
                        [
                            { displayText: 'name', field: 'Name' },
                            {
                                displayText: 'alternative-code',
                                field: 'Alternative Code',
                            },
                        ],
                        {
                            displayText: '',
                            mode: 'equal',
                            dataType: 'text',
                            value: searchValue,
                        }
                    )
                }}
                onSelect={(account) => {
                    queryClient.setQueryData(['account', value], account)
                    onSelect?.(account)
                    setState(false)
                }}
                open={modalOnly ? open : state}
                renderItem={(Account) => (
                    <div className="flex w-full items-center justify-between py-1">
                        <div className="flex items-center gap-x-2">
                            {Account.icon && Account.icon.length > 0 && (
                                <span className="bg-muted rounded-full p-0.5">
                                    <RenderIcon icon={Account.icon as TIcon} />
                                </span>
                            )}
                            <span className="text-ellipsis text-left text-foreground/80">
                                {Account.currency?.emoji
                                    ? `${Account.currency?.emoji} `
                                    : '🏳️ '}
                                {Account.name}
                                <br />
                                <span className="text-xs text-muted-foreground/70">
                                    {Account.description}
                                </span>
                            </span>
                        </div>

                        <p className="mr-2 flex gap-x-2 items-center font-mono text-xs italic text-foreground/40">
                            {Account.type && (
                                <AccountTypeBadge
                                    description="(Type)"
                                    type={Account.type}
                                />
                            )}
                            {Account.general_ledger_type && (
                                <GeneralLedgerTypeBadge
                                    description="(GL)"
                                    type={Account.general_ledger_type}
                                />
                            )}
                            {Account.financial_statement_type && (
                                <FinancialStatementTypeBadge
                                    description=" (FS)"
                                    type={Account.financial_statement_type}
                                />
                            )}
                        </p>
                    </div>
                )}
                searchPlaceHolder="Search account name"
            >
                <MiniPaginationBar
                    disablePageMove={isFetching}
                    onNext={({ pageIndex }) =>
                        setPagination((prev) => ({ ...prev, pageIndex }))
                    }
                    onPrev={({ pageIndex }) =>
                        setPagination((prev) => ({ ...prev, pageIndex }))
                    }
                    pagination={{
                        pageIndex: pagination.pageIndex,
                        pageSize: pagination.pageSize,
                        totalPage: totalPage,
                        totalSize: totalSize,
                    }}
                />
            </GenericPicker>
            {!modalOnly && (
                <div
                    className={cn(
                        'flex items-center',
                        allowClear ? 'space-x-2' : ''
                    )}
                >
                    <Button
                        className={cn(
                            'w-full items-center justify-between rounded-md border bg-background p-0 px-1',
                            triggerClassName
                        )}
                        disabled={disabled}
                        onClick={() => setState((prev) => !prev)}
                        role="combobox"
                        tabIndex={0}
                        type="button"
                        variant="secondary"
                    >
                        {/* for future references how it fixed the issue */}
                        {/* flex-1 min-w-0 makes content area responsive */}
                        {/* flex-1 min-w-0 ensures proper space usage for truncation */}
                        {/* flex-shrink-0 protects the icon */}
                        {/* flex-shrink-0 protects the badges */}
                        {/* flex-shrink-0 protects the shortcut command */}
                        <div className="flex flex-1 items-center text-sm text-foreground/90 overflow-hidden">
                            <span className="flex flex-1 min-w-0 items-center gap-x-2">
                                <div>
                                    {isFetching && !value ? (
                                        <LoadingSpinner />
                                    ) : (
                                        ''
                                    )}
                                </div>
                                {value?.icon && value.icon.length > 0 && (
                                    <span className="bg-muted border rounded-full p-0.5 flex-shrink-0">
                                        <RenderIcon
                                            icon={value.icon as TIcon}
                                        />
                                    </span>
                                )}
                                {!value ? (
                                    <span className="text-foreground/70 truncate">
                                        {placeholder || 'Select Account'}
                                    </span>
                                ) : (
                                    <span className="inline-flex flex-1 min-w-0 gap-x-4 items-center">
                                        <span className="font-medium truncate min-w-fit flex-shrink">
                                            {value.name ?? placeholder}
                                        </span>

                                        {!nameOnly && !hideDescription && (
                                            <span className="text-xs text-foreground/70 truncate flex-shrink">
                                                {value.description}
                                            </span>
                                        )}
                                    </span>
                                )}
                                {!nameOnly && (
                                    <span className="ml-2 flex-none flex gap-x-1 items-center font-mono text-sm text-foreground/30 flex-shrink-0">
                                        {value?.type && (
                                            <AccountTypeBadge
                                                description="(Type)"
                                                type={value.type}
                                            />
                                        )}
                                        {value?.general_ledger_type && (
                                            <GeneralLedgerTypeBadge
                                                description="(GL)"
                                                type={value.general_ledger_type}
                                            />
                                        )}
                                        {value?.financial_statement_type && (
                                            <FinancialStatementTypeBadge
                                                description=" (FS)"
                                                type={
                                                    value.financial_statement_type
                                                }
                                            />
                                        )}
                                    </span>
                                )}
                            </span>

                            {/* Shortcut Command */}
                            {allowShorcutCommand && (
                                <span className="ml-2 mr-1 text-sm text-foreground/40 flex-shrink-0">
                                    ⌘ ↵
                                </span>
                            )}
                        </div>

                        {/* Chevron Icon */}
                        <ChevronDownIcon className="flex-shrink-0 ml-1" />
                    </Button>
                    {allowClear && value && (
                        <Button
                            className="cursor-pointer rounded-full !p-0 !px-0"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                onSelect?.(undefined as unknown as IAccount)
                            }}
                            size={'sm'}
                            variant={'ghost'}
                        >
                            <XIcon className="inline" />
                        </Button>
                    )}
                </div>
            )}
        </>
    )
}

export default AccountPicker
