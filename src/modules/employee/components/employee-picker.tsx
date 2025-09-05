import { forwardRef, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { PAGINATION_INITIAL_INDEX, PICKERS_SELECT_PAGE_SIZE } from '@/constants'
import { IUserBase } from '@/modules/user'
import { IUserOrganization } from '@/modules/user-organization'
import { PaginationState } from '@tanstack/react-table'

import { BadgeCheckFillIcon, ChevronDownIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'
import GenericPicker from '@/components/pickers/generic-picker'
import { Button } from '@/components/ui/button'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import useFilterState from '@/hooks/use-filter-state'
import { useShortcut } from '@/hooks/use-shorcuts'

import { useFilteredPaginatedEmployees } from '../employee.service'

interface Props {
    value?: IUserBase
    disabled?: boolean
    placeholder?: string
    onSelect?: (selectedEmployee: IUserOrganization) => void
    allowShorcutCommand?: boolean
}

const EmployeePicker = forwardRef<HTMLButtonElement, Props>(
    (
        { value, disabled, allowShorcutCommand = false, placeholder, onSelect },
        ref
    ) => {
        const queryClient = useQueryClient()
        const [state, setState] = useState(false)

        const [pagination, setPagination] = useState<PaginationState>({
            pageIndex: PAGINATION_INITIAL_INDEX,
            pageSize: PICKERS_SELECT_PAGE_SIZE,
        })

        const { finalFilterPayloadBase64, bulkSetFilter } = useFilterState({
            defaultFilterMode: 'OR',
            onFilterChange: () =>
                setPagination((prev) => ({
                    ...prev,
                    pageIndex: PAGINATION_INITIAL_INDEX,
                })),
        })

        const {
            data = {
                data: [],
                pageIndex: 0,
                pageSize: 10,
                totalPage: 0,
                totalSize: 0,
            },
            isPending,
            isLoading,
            isFetching,
        } = useFilteredPaginatedEmployees({
            options: {
                enabled: !disabled,
            },
            query: {
                ...pagination,
                filter: finalFilterPayloadBase64,
            },
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
                                {
                                    displayText: 'username',
                                    field: 'user.username',
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
                    renderItem={(employee) => (
                        <div className="flex w-full items-center justify-between py-1">
                            <div className="flex items-center gap-x-2">
                                <PreviewMediaWrapper
                                    media={employee.user?.media}
                                >
                                    <ImageDisplay
                                        src={employee.user?.media?.download_url}
                                    />
                                </PreviewMediaWrapper>

                                <span className="text-ellipsis text-foreground/80">
                                    {employee.user?.full_name}{' '}
                                    {employee.application_status ===
                                        'accepted' && (
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
                    ref={ref}
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
                                <PreviewMediaWrapper media={value?.media}>
                                    <ImageDisplay
                                        src={value?.media?.download_url}
                                    />
                                </PreviewMediaWrapper>
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
)

EmployeePicker.displayName = 'EmployeePicker'

export default EmployeePicker
