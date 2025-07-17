import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { PAGINATION_INITIAL_INDEX, PICKERS_SELECT_PAGE_SIZE } from '@/constants'
import { abbreviateUUID } from '@/utils/formatting-utils'
import { PaginationState } from '@tanstack/react-table'

import { ChevronDownIcon } from '@/components/icons'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'
import { Button } from '@/components/ui/button'

import { useFilteredPaginatedMemberTypes } from '@/hooks/api-hooks/member/use-member-type'
import useFilterState from '@/hooks/use-filter-state'

import { IMemberType, TEntityId } from '@/types'

import LoadingSpinner from '../spinners/loading-spinner'
import { useShortcut } from '../use-shorcuts'
import GenericPicker from './generic-picker'

interface Props {
    value?: TEntityId
    disabled?: boolean
    placeholder?: string
    onSelect?: (selectedMemberType: IMemberType) => void
    allowShorcutCommand?: boolean
}

const AccountClassificationPicker = ({
    value,
    disabled,
    allowShorcutCommand = false,
    placeholder,
    onSelect,
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

    const { data, isPending, isLoading, isFetching } =
        useFilteredPaginatedMemberTypes({
            filterPayload: finalFilterPayload,
            pagination,
            enabled: !disabled,
            showMessage: false,
        })

    const selectedMemberType = data.data.find(
        (memberType) => memberType.id === value
    )

    useShortcut(
        'Enter',
        (event) => {
            event?.preventDefault()
            if (
                !selectedMemberType &&
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
                items={data.data}
                open={state}
                listHeading={`Matched Results (${data.totalSize})`}
                searchPlaceHolder="Search name"
                isLoading={isPending || isLoading || isFetching}
                onSelect={(memberType) => {
                    queryClient.setQueryData(['member-type', value], memberType)
                    onSelect?.(memberType)
                    setState(false)
                }}
                onOpenChange={setState}
                onSearchChange={(searchValue) => {
                    bulkSetFilter([{ displayText: 'name', field: 'Name' }], {
                        displayText: '',
                        mode: 'equal',
                        dataType: 'text',
                        value: searchValue,
                    })
                }}
                renderItem={(account) => (
                    <div className="flex w-full items-center justify-between py-1">
                        <div className="flex items-center gap-x-2">
                            <span className="text-ellipsis text-foreground/80">
                                {account.name}{' '}
                            </span>
                        </div>

                        <p className="mr-2 font-mono text-xs italic text-foreground/40">
                            <span>#{abbreviateUUID(account.id)}</span>
                        </p>
                    </div>
                )}
            >
                <MiniPaginationBar
                    pagination={{
                        pageIndex: pagination.pageIndex,
                        pageSize: pagination.pageSize,
                        totalPage: data.totalPage,
                        totalSize: data.totalSize,
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
            <Button
                type="button"
                variant="secondary"
                disabled={disabled}
                onClick={() => setState((prev) => !prev)}
                className="w-full items-center justify-between rounded-md border bg-background p-0 px-2"
            >
                <span className="justify-betweentext-sm inline-flex w-full items-center text-foreground/90">
                    <span className="inline-flex w-full items-center gap-x-2">
                        {isFetching && <LoadingSpinner />}
                        {!selectedMemberType ? (
                            <span className="text-foreground/70">
                                {value || placeholder || 'Select Member Type'}
                            </span>
                        ) : (
                            <span>{selectedMemberType.name}</span>
                        )}
                    </span>
                    {allowShorcutCommand && (
                        <span className="mr-2 text-sm">⌘ ↵ </span>
                    )}
                </span>
                <ChevronDownIcon />
            </Button>
        </>
    )
}

export default AccountClassificationPicker
