import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { PaginationState } from '@tanstack/react-table'

import GenericPicker from './generic-picker'
import { Button } from '@/components/ui/button'
import { ChevronDownIcon, PlusIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { CommandGroup, CommandItem, CommandSeparator } from '../ui/command'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'

import useFilterState from '@/hooks/use-filter-state'
import { abbreviateUUID } from '@/utils/formatting-utils'
import { useFilteredPaginatedMemberCenters } from '@/hooks/api-hooks/member/use-member-center'
import { PAGINATION_INITIAL_INDEX, PICKERS_SELECT_PAGE_SIZE } from '@/constants'

import { IMemberCenterResource, TEntityId } from '@/server/types'
import {
    IMemberCenterCreateUpdateFormProps,
    MemberCenterCreateUpdateFormModal,
} from '../forms/member-forms/member-center-create-update-form'

export interface IMemberCenterPickerCreateProps
    extends Pick<
        IMemberCenterCreateUpdateFormProps,
        'defaultValues' | 'disabledFields' | 'hiddenFields'
    > {}

export interface IMemberCenterPickerProps {
    value?: TEntityId
    disabled?: boolean
    placeholder?: string
    createProps?: IMemberCenterCreateUpdateFormProps
    onSelect?: (selectedMemberCenter: IMemberCenterResource) => void
}

const MemberCenterPicker = ({
    value,
    disabled,
    placeholder,
    createProps,
    onSelect,
}: IMemberCenterPickerProps) => {
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
        useFilteredPaginatedMemberCenters({
            filterPayload: finalFilterPayload,
            pagination,
            enabled: !disabled,
            showMessage: false,
        })

    const selectedMemberCenter = data.data.find((center) => center.id === value)

    return (
        <>
            <MemberCenterCreateUpdateFormModal
                open={createModal}
                formProps={createProps}
                onOpenChange={setCreateModal}
            />
            <GenericPicker
                items={data.data}
                open={pickerState}
                listHeading={`Matched Results (${data.totalSize})`}
                searchPlaceHolder="Search member center name..."
                isLoading={isPending || isLoading || isFetching}
                onSelect={(center) => {
                    queryClient.setQueryData(['memberCenter', value], center)
                    onSelect?.(center)
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
                                    onSelect={() => setCreateModal(true)}
                                    onClick={() => {}}
                                >
                                    <PlusIcon /> Create
                                </CommandItem>
                            </CommandGroup>
                            <CommandSeparator />
                        </>
                    )
                }
                renderItem={(center) => (
                    <div className="flex w-full items-center justify-between py-1">
                        <span className="text-ellipsis text-foreground/80">
                            {center.name}
                        </span>
                        <span className="mr-2 font-mono text-xs italic text-foreground/40">
                            #{abbreviateUUID(center.id)}
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
                        {isFetching ? (
                            <LoadingSpinner />
                        ) : (
                            <span>
                                {selectedMemberCenter?.name ||
                                    placeholder ||
                                    'Select member center'}
                            </span>
                        )}
                    </span>
                    <span className="mr-1 font-mono text-sm text-foreground/30">
                        #
                        {selectedMemberCenter?.id
                            ? abbreviateUUID(selectedMemberCenter.id)
                            : '?'}
                    </span>
                </span>
                <ChevronDownIcon />
            </Button>
        </>
    )
}

export default MemberCenterPicker
