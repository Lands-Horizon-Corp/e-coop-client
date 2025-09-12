import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { PAGINATION_INITIAL_INDEX, PICKERS_SELECT_PAGE_SIZE } from '@/constants'
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

import { ChevronDownIcon, RenderIcon, TIcon } from '@/components/icons'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'
import GenericPicker from '@/components/pickers/generic-picker'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'

import useFilterState from '@/hooks/use-filter-state'
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
}: Props) => {
    const queryClient = useQueryClient()
    const [state, setState] = useState(false)

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
                items={data}
                open={modalOnly ? open : state}
                listHeading={`Matched Results (${totalSize})`}
                searchPlaceHolder="Search account name"
                isLoading={isPending || isLoading || isFetching}
                onSelect={(account) => {
                    queryClient.setQueryData(['account', value], account)
                    onSelect?.(account)
                    setState(false)
                }}
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
                renderItem={(Account) => (
                    <div className="flex w-full items-center justify-between py-1">
                        <div className="flex items-center gap-x-2">
                            {Account.icon && Account.icon.length > 0 && (
                                <span className="bg-muted rounded-full p-0.5">
                                    <RenderIcon icon={Account.icon as TIcon} />
                                </span>
                            )}
                            <span className="text-ellipsis text-left text-foreground/80">
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
                                    type={Account.type}
                                    description="(Type)"
                                />
                            )}
                            {Account.general_ledger_type && (
                                <GeneralLedgerTypeBadge
                                    type={Account.general_ledger_type}
                                    description="(GL)"
                                />
                            )}
                            {Account.financial_statement_type && (
                                <FinancialStatementTypeBadge
                                    type={Account.financial_statement_type}
                                    description=" (FS)"
                                />
                            )}
                        </p>
                    </div>
                )}
            >
                <MiniPaginationBar
                    pagination={{
                        pageIndex: pagination.pageIndex,
                        pageSize: pagination.pageSize,
                        totalPage: totalPage,
                        totalSize: totalSize,
                    }}
                    disablePageMove={isFetching}
                    onNext={({ pageIndex }) =>
                        setPagination((prev) => ({ ...prev, pageIndex }))
                    }
                    onPrev={({ pageIndex }) =>
                        setPagination((prev) => ({ ...prev, pageIndex }))
                    }
                />
            </GenericPicker>
            {!modalOnly && (
                <Button
                    type="button"
                    role="combobox"
                    tabIndex={0}
                    variant="secondary"
                    disabled={disabled}
                    onClick={() => setState((prev) => !prev)}
                    className="w-full items-center justify-between rounded-md border bg-background p-0 px-2"
                >
                    <span className="justify-between text-sm inline-flex w-full items-center text-foreground/90">
                        <span className="inline-flex w-full items-center gap-x-2">
                            <div>
                                {isFetching && !value ? <LoadingSpinner /> : ''}
                            </div>
                            {value?.icon && value.icon.length > 0 && (
                                <span className="bg-muted rounded-full p-0.5">
                                    <RenderIcon icon={value.icon as TIcon} />
                                </span>
                            )}
                            {!value ? (
                                <span className="text-foreground/70">
                                    {placeholder || 'Select Account'}
                                </span>
                            ) : (
                                <span className="inline-flex gap-x-4 items-center">
                                    <span>{value.name}</span>
                                    {!nameOnly && !hideDescription && (
                                        <span className="text-xs truncate max-w-72 w-fit text-muted-foreground/70">
                                            {value.description}
                                        </span>
                                    )}
                                </span>
                            )}
                        </span>
                        {allowShorcutCommand && (
                            <span className="mr-2 text-sm">⌘ ↵ </span>
                        )}
                        {!nameOnly && (
                            <span className="mr-1 flex gap-x-1 items-center font-mono text-sm text-foreground/30">
                                {value?.type && (
                                    <AccountTypeBadge
                                        type={value.type}
                                        description="(Type)"
                                    />
                                )}
                                {value?.general_ledger_type && (
                                    <GeneralLedgerTypeBadge
                                        type={value.general_ledger_type}
                                        description="(GL)"
                                    />
                                )}
                                {value?.financial_statement_type && (
                                    <FinancialStatementTypeBadge
                                        type={value.financial_statement_type}
                                        description=" (FS)"
                                    />
                                )}
                            </span>
                        )}
                    </span>
                    <ChevronDownIcon />
                </Button>
            )}
        </>
    )
}

export default AccountPicker
