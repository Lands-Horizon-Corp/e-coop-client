import { useQueryClient } from '@tanstack/react-query'
import { forwardRef, useState } from 'react'

import { PAGINATION_INITIAL_INDEX, PICKERS_SELECT_PAGE_SIZE } from '@/constants'
import { TFilterObject } from '@/contexts/filter-context'
import { cn } from '@/lib'
import { PaginationState } from '@tanstack/react-table'

import { BadgeCheckFillIcon, ChevronDownIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'
import { Button } from '@/components/ui/button'

import { useFilteredPaginatedUserOrganization } from '@/hooks/api-hooks/use-user-organization'
import useFilterState from '@/hooks/use-filter-state'
import { useInternalState } from '@/hooks/use-internal-state'

import { IPickerBaseProps, IUserBase, IUserOrganization } from '@/types'

import PreviewMediaWrapper from '../wrappers/preview-media-wrapper'
import GenericPicker from './generic-picker'

interface Props<T = IUserBase> extends IPickerBaseProps<IUserOrganization<T>> {
    userOrgSearchMode?: 'all' | 'none-member-profile'
    value?: IUserOrganization<T>
    defaultFilter?: TFilterObject
}

const UserOrganizationPicker = forwardRef<HTMLButtonElement, Props>(
    (
        {
            value,
            disabled,
            modalState,
            placeholder,
            defaultFilter,
            triggerClassName,
            userOrgSearchMode,
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
            pageIndex: PAGINATION_INITIAL_INDEX,
            pageSize: PICKERS_SELECT_PAGE_SIZE,
        })

        const { finalFilterPayload, bulkSetFilter } = useFilterState({
            defaultFilter,
            defaultFilterMode: 'OR',
            onFilterChange: () =>
                setPagination((prev) => ({
                    ...prev,
                    pageIndex: PAGINATION_INITIAL_INDEX,
                })),
        })

        const { data, isPending, isLoading, isFetching } =
            useFilteredPaginatedUserOrganization({
                mode: userOrgSearchMode,
                pagination,
                enabled: !disabled && state,
                showMessage: false,
                filterPayload: finalFilterPayload,
            })

        return (
            <>
                <GenericPicker
                    items={data.data}
                    open={state}
                    listHeading={`Matched Results (${data.totalSize})`}
                    searchPlaceHolder="Search user organization"
                    isLoading={isPending || isLoading || isFetching}
                    onSelect={(userOrg) => {
                        queryClient.setQueryData(
                            ['user-organization', value?.id],
                            userOrg
                        )
                        onSelect?.(userOrg)
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
                                    field: 'user.user_name',
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
                    renderItem={(userOrg) => (
                        <div className="flex w-full items-center justify-between py-1">
                            <div className="flex items-center gap-x-2">
                                <PreviewMediaWrapper
                                    media={userOrg.user?.media}
                                >
                                    <ImageDisplay
                                        src={userOrg.user?.media?.download_url}
                                    />
                                </PreviewMediaWrapper>
                                <span className="text-ellipsis text-foreground/80">
                                    {userOrg.user?.full_name}{' '}
                                    {userOrg.application_status ===
                                        'accepted' && (
                                        <BadgeCheckFillIcon className="ml-2 inline size-2 text-primary" />
                                    )}
                                </span>
                            </div>
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
                    onClick={() => setState(true)}
                    className={cn(
                        'w-full items-center justify-between rounded-md border bg-background p-0 px-2',
                        triggerClassName
                    )}
                >
                    <span className="justify-betweentext-sm inline-flex w-full items-center text-foreground/90">
                        <span className="inline-flex w-full items-center gap-x-2">
                            <div>
                                <PreviewMediaWrapper media={value?.user?.media}>
                                    <ImageDisplay
                                        src={value?.user?.media?.download_url}
                                    />
                                </PreviewMediaWrapper>
                            </div>
                            {!value ? (
                                <span className="text-foreground/70">
                                    {placeholder || 'Select user organization'}
                                </span>
                            ) : (
                                <span>{value?.user?.full_name}</span>
                            )}
                        </span>
                    </span>
                    <ChevronDownIcon />
                </Button>
            </>
        )
    }
)

UserOrganizationPicker.displayName = 'UserOrganizationPicker'

export default UserOrganizationPicker
