import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { PaginationState } from '@tanstack/react-table'

import GenericPicker from './generic-picker'
import { Button } from '@/components/ui/button'
import ImageDisplay from '@/components/image-display'
import { ChevronDownIcon, PlusIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { BranchCreateFormModal, BranchCreateFormProps } from '../forms'
import { CommandGroup, CommandItem, CommandSeparator } from '../ui/command'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'

import useFilterState from '@/hooks/use-filter-state'
import { abbreviateUUID } from '@/utils/formatting-utils'
import { useFilteredPaginatedBranch } from '@/hooks/api-hooks/use-branch'
import { PAGINATION_INITIAL_INDEX, PICKERS_SELECT_PAGE_SIZE } from '@/constants'

import logger from '@/helpers/loggers/logger'
import { IBranchResource, TEntityId } from '@/server/types'

export interface IBranchPickerCreateProps
    extends Pick<
        BranchCreateFormProps,
        'defaultValues' | 'disabledFields' | 'hiddenFields'
    > {}

export interface IBranchPickerProps {
    value?: TEntityId
    disabled?: boolean
    placeholder?: string
    createProps?: IBranchPickerCreateProps
    onSelect?: (selectedBranch: IBranchResource) => void
}

const BranchPicker = ({
    value,
    disabled,
    placeholder,
    createProps,
    onSelect,
}: IBranchPickerProps) => {
    const queryClient = useQueryClient()
    const [createModal, setCreateModal] = useState(false)
    const [pickerState, setPickerState] = useState(false)
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: PAGINATION_INITIAL_INDEX,
        pageSize: PICKERS_SELECT_PAGE_SIZE,
    })

    const { finalFilterPayload, setFilter } = useFilterState({
        onFilterChange: () =>
            setPagination((prev) => ({
                ...prev,
                pageIndex: PAGINATION_INITIAL_INDEX,
            })),
    })

    const { data, isPending, isLoading, isFetching } =
        useFilteredPaginatedBranch({
            filterPayload: finalFilterPayload,
            pagination,
            enabled: !disabled,
            showMessage: false,
        })

    const selectedBranch = data.data.find((branch) => branch.id === value)

    return (
        <>
            <BranchCreateFormModal
                open={createModal}
                formProps={{
                    ...createProps,
                    onSuccess: (data) => onSelect?.(data),
                }}
                onOpenChange={setCreateModal}
            />
            <GenericPicker
                items={data.data}
                open={pickerState}
                listHeading={`Matched Results (${data.totalSize})`}
                searchPlaceHolder="Search branch name..."
                isLoading={isPending || isLoading || isFetching}
                onSelect={(branch) => {
                    queryClient.setQueryData(['branch', value], branch)
                    onSelect?.(branch)
                    setPickerState(false)
                }}
                onOpenChange={setPickerState}
                onSearchChange={(searchValue) => {
                    setFilter('name', {
                        displayText: '',
                        mode: 'contains',
                        dataType: 'text',
                        value: searchValue,
                    })
                }}
                customCommands={
                    createProps && (
                        <>
                            <CommandGroup>
                                <CommandItem
                                    onSelect={() => {
                                        logger.log('Yes')
                                        setCreateModal(true)
                                    }}
                                    onClick={() => {}}
                                >
                                    <PlusIcon /> Create
                                </CommandItem>
                            </CommandGroup>
                            <CommandSeparator />
                        </>
                    )
                }
                renderItem={(branch) => (
                    <div className="flex w-full items-center justify-between py-1">
                        <div className="flex items-center gap-x-2">
                            <ImageDisplay src={branch.media?.downloadURL} />
                            <span className="text-ellipsis text-foreground/80">
                                {branch.name}
                            </span>
                        </div>
                        <span className="mr-2 font-mono text-xs italic text-foreground/40">
                            #{abbreviateUUID(branch.id)}
                        </span>
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
                onClick={() => setPickerState((val) => !val)}
                className="w-full items-center justify-between rounded-md border bg-background p-0 px-2"
            >
                <span className="justify-betweentext-sm inline-flex w-full items-center text-foreground/90">
                    <span className="inline-flex w-full items-center gap-x-2">
                        <div>
                            {isFetching ? (
                                <LoadingSpinner />
                            ) : (
                                <ImageDisplay
                                    src={selectedBranch?.media?.downloadURL}
                                />
                            )}
                        </div>
                        {!selectedBranch ? (
                            <span className="text-foreground/70">
                                {value || placeholder || 'Select branch'}
                            </span>
                        ) : (
                            <span>{selectedBranch.name}</span>
                        )}
                    </span>
                    <span className="mr-1 font-mono text-sm text-foreground/30">
                        #
                        {selectedBranch?.id
                            ? abbreviateUUID(selectedBranch.id)
                            : '?'}
                    </span>
                </span>
                <ChevronDownIcon />
            </Button>
        </>
    )
}

export default BranchPicker
