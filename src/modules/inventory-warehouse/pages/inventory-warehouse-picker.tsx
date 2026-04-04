import { forwardRef, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { PAGINATION_INITIAL_INDEX, PICKERS_SELECT_PAGE_SIZE } from '@/constants'
import { type TFilterObject } from '@/contexts/filter-context'
import { cn } from '@/helpers'
import { IPickerBaseProps } from '@/types/component-types/picker'
import { PaginationState } from '@tanstack/react-table'

import { ChevronDownIcon, HouseIcon, RefreshIcon } from '@/components/icons'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'
import GenericPicker from '@/components/pickers/generic-picker'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'

import useFilterState from '@/hooks/use-filter-state'
import { useInternalState } from '@/hooks/use-internal-state'
import { useShortcut } from '@/hooks/use-shorcuts'

import { IInventoryWarehouse, useGetPaginatedInventoryWarehouse } from '..'

interface Props extends IPickerBaseProps<IInventoryWarehouse> {
    defaultFilter?: TFilterObject
    allowShorcutCommand?: boolean
}

const InventoryWarehousePicker = forwardRef<HTMLButtonElement, Props>(
    (
        {
            value,
            disabled,
            modalState,
            placeholder,
            allowShorcutCommand = false,
            triggerClassName,
            onSelect,
        },
        ref
    ) => {
        const queryClient = useQueryClient()

        const [state, setState] = useInternalState(
            false,
            modalState?.open,
            modalState?.onOpenChange
        )

        const [pagination, setPagination] = useState<PaginationState>({
            pageIndex: 0,
            pageSize: PICKERS_SELECT_PAGE_SIZE,
        })

        const { finalFilterPayloadBase64, bulkSetFilter } = useFilterState({
            defaultFilterMode: 'OR',
            debounceFinalFilterMs: 0,
            onFilterChange: () =>
                setPagination((prev) => ({
                    ...prev,
                    pageIndex: PAGINATION_INITIAL_INDEX,
                })),
        })

        const {
            data: { data = [], totalPage = 1, totalSize = 0 } = {},
            isPending,
            isLoading,
            isFetching,
            refetch,
        } = useGetPaginatedInventoryWarehouse({
            query: {
                filter: finalFilterPayloadBase64,
                ...pagination,
            },
            options: {
                enabled: !disabled && state,
                retry: 0,
            },
        })

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
                    setState(true)
                }
            },
            { disableTextInputs: true }
        )

        const displayWarehouse = (warehouse: IInventoryWarehouse) => {
            return `${warehouse.name} (${warehouse.type})`
        }

        return (
            <>
                <GenericPicker
                    isLoading={isPending || isLoading || isFetching}
                    items={data}
                    listHeading={`Matched Results (${totalSize})`}
                    onOpenChange={setState}
                    onSearchChange={(searchValue) => {
                        bulkSetFilter(
                            [
                                { displayText: 'name', field: 'name' },
                                { displayText: 'code', field: 'code' },
                                { displayText: 'type', field: 'type' },
                                { displayText: 'address', field: 'address' },
                            ],
                            {
                                displayText: '',
                                mode: 'contains',
                                dataType: 'text',
                                value: searchValue,
                            }
                        )
                    }}
                    onSelect={(warehouse) => {
                        queryClient.setQueryData(
                            ['inventory-warehouse', value],
                            warehouse
                        )
                        onSelect?.(warehouse)
                        setState(false)
                    }}
                    open={state}
                    otherSearchInputChild={
                        <Button
                            className="size-fit p-2 text-muted-foreground"
                            disabled={isFetching || disabled}
                            onClick={() => refetch()}
                            size="icon"
                            variant="ghost"
                        >
                            {isFetching ? (
                                <LoadingSpinner className="inline" />
                            ) : (
                                <RefreshIcon className="size-4" />
                            )}
                        </Button>
                    }
                    renderItem={(warehouse) => (
                        <div className="flex w-full items-center justify-between py-2">
                            <div className="flex items-center gap-x-2">
                                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                                    <HouseIcon className="size-4 text-primary" />
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-sm text-foreground/90 capitalize">
                                        {warehouse.name}
                                    </span>

                                    <div className="flex gap-x-2 text-xs text-muted-foreground">
                                        <span className="px-1 rounded bg-muted">
                                            {warehouse.type}
                                        </span>
                                        {warehouse.code && (
                                            <span>#{warehouse.code}</span>
                                        )}
                                    </div>

                                    <span className="text-xs text-muted-foreground">
                                        {warehouse.address || 'No address'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                    searchPlaceHolder="Search warehouse name, code, type, or address..."
                >
                    <MiniPaginationBar
                        disablePageMove={isFetching}
                        onNext={({ pageIndex }) =>
                            setPagination((prev) => ({
                                ...prev,
                                pageIndex,
                            }))
                        }
                        onPrev={({ pageIndex }) =>
                            setPagination((prev) => ({
                                ...prev,
                                pageIndex,
                            }))
                        }
                        pagination={{
                            pageIndex: pagination.pageIndex,
                            pageSize: pagination.pageSize,
                            totalPage,
                            totalSize,
                        }}
                    />
                </GenericPicker>

                <Button
                    className={cn(
                        'w-full items-center justify-between rounded-md border p-0 px-2',
                        triggerClassName
                    )}
                    disabled={disabled}
                    onClick={() => setState(true)}
                    ref={ref}
                    type="button"
                    variant="secondary"
                >
                    <span className="inline-flex w-[90%] items-center justify-between text-sm text-foreground/90">
                        <span className="inline-flex w-full items-center gap-x-2">
                            {isFetching && (
                                <div className="flex size-6 items-center justify-center rounded-full bg-primary/10">
                                    <LoadingSpinner className="size-3" />
                                </div>
                            )}
                            {!value ? (
                                <span className="text-foreground/70">
                                    {placeholder || 'Select warehouse'}
                                </span>
                            ) : (
                                <span className="capitalize truncate ">
                                    {displayWarehouse(value)}
                                </span>
                            )}
                        </span>
                        {allowShorcutCommand && (
                            <span className="mr-2 text-sm">⌘ ↵</span>
                        )}
                    </span>
                    <ChevronDownIcon className="" />
                </Button>
            </>
        )
    }
)

InventoryWarehousePicker.displayName = 'InventoryWarehousePicker'

export default InventoryWarehousePicker
