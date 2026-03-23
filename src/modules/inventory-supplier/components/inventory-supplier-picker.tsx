import { forwardRef, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { PAGINATION_INITIAL_INDEX, PICKERS_SELECT_PAGE_SIZE } from '@/constants'
import { type TFilterObject } from '@/contexts/filter-context'
import { cn } from '@/helpers'
import { IPickerBaseProps } from '@/types/component-types/picker'
import { PaginationState } from '@tanstack/react-table'

import {
    ChevronDownIcon,
    PhoneIcon,
    PinLocationIcon,
    RefreshIcon,
    UserIcon,
} from '@/components/icons'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'
import GenericPicker from '@/components/pickers/generic-picker'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'

import useFilterState from '@/hooks/use-filter-state'
import { useInternalState } from '@/hooks/use-internal-state'
import { useShortcut } from '@/hooks/use-shorcuts'

import { IInventorySupplier, useGetPaginatedInventorySupplier } from '..'

interface Props extends IPickerBaseProps<IInventorySupplier> {
    defaultFilter?: TFilterObject
    allowShorcutCommand?: boolean
}

const InventorySupplierPicker = forwardRef<HTMLButtonElement, Props>(
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
        } = useGetPaginatedInventorySupplier({
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

        const displaySupplier = (supplier: IInventorySupplier) => {
            return supplier.name || 'Unknown Supplier'
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
                                {
                                    displayText: 'description',
                                    field: 'description',
                                },
                                {
                                    displayText: 'address',
                                    field: 'address',
                                },
                                {
                                    displayText: 'contact number',
                                    field: 'contact_number',
                                },
                            ],
                            {
                                displayText: '',
                                mode: 'contains',
                                dataType: 'text',
                                value: searchValue,
                            }
                        )
                    }}
                    onSelect={(supplier) => {
                        queryClient.setQueryData(
                            ['inventory-supplier', supplier.id],
                            supplier
                        )
                        onSelect?.(supplier)
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
                    renderItem={(supplier) => (
                        <div className="flex w-full items-center justify-between py-2">
                            <div className="flex items-center gap-x-2">
                                {/* AVATAR / LOGO */}
                                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 overflow-hidden">
                                    {supplier.media?.download_url ? (
                                        <img
                                            alt={supplier.name}
                                            className="size-full object-cover"
                                            src={supplier.media.download_url}
                                        />
                                    ) : (
                                        <UserIcon className="size-4 text-primary" />
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-sm text-foreground/90 capitalize">
                                        {supplier.name}
                                    </span>

                                    <span className="text-xs text-muted-foreground">
                                        {supplier.description ||
                                            'No description'}
                                    </span>

                                    <div className="flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                                        {supplier.contact_number && (
                                            <span className="flex items-center gap-x-1">
                                                <PhoneIcon className="size-3" />
                                                {supplier.contact_number}
                                            </span>
                                        )}

                                        {supplier.address && (
                                            <span className="flex items-center gap-x-1">
                                                <PinLocationIcon className="size-3" />
                                                {supplier.address}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    searchPlaceHolder="Search supplier name, contact, or address..."
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
                    <span className="inline-flex w-full items-center justify-between text-sm text-foreground/90">
                        <span className="inline-flex truncate w-[90%] items-center gap-x-2">
                            {isFetching && (
                                <div className="flex size-6 items-center justify-center rounded-full bg-primary/10">
                                    <LoadingSpinner className="size-3" />
                                </div>
                            )}

                            {!value ? (
                                <span className="text-foreground/70 min-w-full v1 truncate">
                                    {placeholder || 'Select supplier'}
                                </span>
                            ) : (
                                <span className="capitalize">
                                    {displaySupplier(value)}
                                </span>
                            )}
                        </span>
                        {allowShorcutCommand && (
                            <span className="mr-2 text-sm">⌘ ↵</span>
                        )}
                        <ChevronDownIcon />
                    </span>
                </Button>
            </>
        )
    }
)

InventorySupplierPicker.displayName = 'InventorySupplierPicker'

export default InventorySupplierPicker
