import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { PaginationState } from '@tanstack/react-table'

import GenericPicker from './generic-picker'
import { Button } from '@/components/ui/button'
import ImageDisplay from '@/components/image-display'
import { BadgeCheckFillIcon, ChevronDownIcon } from '@/components/icons'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'

import { useShortcut } from '../use-shorcuts'
import useFilterState from '@/hooks/use-filter-state'
import { useFilteredPaginatedEmployees } from '@/hooks/api-hooks/use-employee'
import { PAGINATION_INITIAL_INDEX, PICKERS_SELECT_PAGE_SIZE } from '@/constants'

import { IUserBase, IUserOrganization } from '@/types'

interface Props {
    value?: IUserBase
    disabled?: boolean
    placeholder?: string
    onSelect?: (selectedEmployee: IUserOrganization) => void
    allowShorcutCommand?: boolean
}

const EmployeePicker = ({
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
        useFilteredPaginatedEmployees({
            filterPayload: finalFilterPayload,
            pagination,
            enabled: !disabled,
            showMessage: false,
        })

    useShortcut(
        'Enter',
        (event) => {
            event?.preventDefault()
            if (
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
                searchPlaceHolder="Search employee username or email"
                isLoading={isPending || isLoading || isFetching}
                onSelect={(employee) => {
                    queryClient.setQueryData(['employee', value], employee)
                    onSelect?.(employee)
                    setState(false)
                }}
                onOpenChange={setState}
                onSearchChange={(searchValue) => {
                    bulkSetFilter(
                        [
                            {
                                displayText: 'full name',
                                field: 'user.full_name',
                            },
                            { displayText: 'email', field: 'user.email' },
                            { displayText: 'username', field: 'user.username' },
                        ],
                        {
                            displayText: '',
                            mode: 'equal',
                            dataType: 'text',
                            value: searchValue,
                        }
                    )
                }}
                renderItem={(employee) => (
                    <div className="flex w-full items-center justify-between py-1">
                        <div className="flex items-center gap-x-2">
                            <ImageDisplay
                                src={employee.user?.media?.download_url}
                            />
                            <span className="text-ellipsis text-foreground/80">
                                {employee.user?.full_name}{' '}
                                {employee.application_status === 'accepted' && (
                                    <BadgeCheckFillIcon className="ml-2 inline size-2 text-primary" />
                                )}
                            </span>
                        </div>
                        {/* <p className="mr-2 font-mono text-xs italic text-foreground/40">
                            <span>#{abbreviateUUID(employee.id)}</span>
                        </p> */}
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
                role="button"
                type="button"
                variant="secondary"
                disabled={disabled}
                onClick={() => setState((prev) => !prev)}
                className="w-full items-center justify-between rounded-md border bg-background p-0 px-2"
            >
                <span className="justify-betweentext-sm inline-flex w-full items-center text-foreground/90">
                    <span className="inline-flex w-full items-center gap-x-2">
                        <div>
                            <ImageDisplay src={value?.media?.download_url} />
                        </div>
                        {!value ? (
                            <span className="text-foreground/70">
                                {value || placeholder || 'Select employee'}
                            </span>
                        ) : (
                            <span>{value?.full_name}</span>
                        )}
                    </span>
                    {allowShorcutCommand && (
                        <span className="mr-2 text-sm">⌘ ↵ </span>
                    )}
                    {/* <span className="mr-1 font-mono text-sm text-foreground/30">
                        #{value?.id ? abbreviateUUID(value.id) : '?'}
                    </span> */}
                </span>
                <ChevronDownIcon />
            </Button>
        </>
    )
}

export default EmployeePicker
