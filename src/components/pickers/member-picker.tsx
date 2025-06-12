import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { PaginationState } from '@tanstack/react-table'

import GenericPicker from './generic-picker'
import { Button } from '@/components/ui/button'
import { BadgeCheckFillIcon, ChevronDownIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'

import useFilterState from '@/hooks/use-filter-state'
import { abbreviateUUID } from '@/utils/formatting-utils'
import { PAGINATION_INITIAL_INDEX, PICKERS_SELECT_PAGE_SIZE } from '@/constants'
import { useFilteredPaginatedMemberProfile } from '@/hooks/api-hooks/member/use-member-profile'

import { useShortcut } from '../use-shorcuts'

import { IMemberProfile, TEntityId } from '@/types'

interface Props {
    value?: TEntityId
    disabled?: boolean
    placeholder?: string
    onSelect?: (selectedMember: IMemberProfile) => void
    allowShorcutCommand?: boolean
}

const MemberPicker = ({
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
        useFilteredPaginatedMemberProfile({
            filterPayload: finalFilterPayload,
            pagination,
            enabled: !disabled,
            showMessage: false,
        })

    const selectedMember = data.data.find((member) => member.id === value)

    useShortcut(
        'Enter',
        (event) => {
            event?.preventDefault()
            if (
                !selectedMember &&
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
                searchPlaceHolder="Search name or PB no."
                isLoading={isPending || isLoading || isFetching}
                onSelect={(member) => {
                    queryClient.setQueryData(['member', value], member)
                    onSelect?.(member)
                    setState(false)
                }}
                onOpenChange={setState}
                onSearchChange={(searchValue) => {
                    bulkSetFilter(
                        [
                            { displayText: 'full name', field: 'fullName' },
                            {
                                displayText: 'PB',
                                field: 'memberProfile.passbookNumber',
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
                renderItem={(member) => (
                    <div className="flex w-full items-center justify-between py-1">
                        <div className="flex items-center gap-x-2">
                            <ImageDisplay src={member.media?.download_url} />
                            <span className="text-ellipsis text-foreground/80">
                                {member.full_name}{' '}
                                {member.status === 'verified' && (
                                    <BadgeCheckFillIcon className="ml-2 inline size-2 text-primary" />
                                )}
                            </span>
                        </div>

                        <p className="mr-2 font-mono text-xs italic text-foreground/40">
                            <span>#{abbreviateUUID(member.id)}</span>
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
                        <div>
                            {isFetching ? (
                                <LoadingSpinner />
                            ) : (
                                <ImageDisplay
                                    src={selectedMember?.media?.download_url}
                                />
                            )}
                        </div>
                        {!selectedMember ? (
                            <span className="text-foreground/70">
                                {value || placeholder || 'Select member'}
                            </span>
                        ) : (
                            <span>{selectedMember.full_name}</span>
                        )}
                    </span>
                    {allowShorcutCommand && (
                        <span className="mr-2 text-sm">⌘ ↵ </span>
                    )}
                    <span className="mr-1 font-mono text-sm text-foreground/30">
                        #
                        {selectedMember?.id
                            ? abbreviateUUID(selectedMember.id)
                            : '?'}
                    </span>
                </span>
                <ChevronDownIcon />
            </Button>
        </>
    )
}

export default MemberPicker
