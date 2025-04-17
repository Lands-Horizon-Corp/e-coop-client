import { useState } from 'react'
import { PaginationState } from '@tanstack/react-table'

import GenericPicker from './generic-picker'
import { Button } from '@/components/ui/button'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@/components/icons'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'

import {
    PAGINATION_INITIAL_INDEX,
    PAGINATION_INITIAL_PAGE_SIZE,
} from '@/constants'
import useFilterState from '@/hooks/use-filter-state'
import { IMemberProfilePicker, TEntityId } from '@/server/types'
// import { useMemberProfilesPicker } from '@/hooks/api-hooks/member/use-member-profiles-picker'

const dummyMemberProfiles: IMemberProfilePicker[] = [
    {
        id: '1',
        description: 'Member with standard profile',
        notes: 'Active member with no outstanding issues.',
        oldReferenceId: 'REF12345',
        passbookNumber: 'PB1001',
    },
    {
        id: '2',
        description: 'Long-term member',
        notes: 'Eligible for loyalty rewards. Participates in community events.',
        passbookNumber: 'PB1002',
    },
    {
        id: '3',
        description: 'New member',
        notes: 'Recently joined. Awaiting profile verification.',
    },
    {
        id: '4',
        description: 'Premium member',
        notes: 'Premium account holder with special privileges.',
        oldReferenceId: 'REF67890',
    },
    {
        id: '5',
        description: 'Inactive member',
        notes: 'Membership currently inactive due to non-renewal.',
        passbookNumber: 'PB1005',
    },
]

interface Props {
    value?: TEntityId
    placeholder?: string
    disabled?: boolean
    onSelect?: (selectedMembers: IMemberProfilePicker) => void
}

const MembersPicker = ({ value, disabled, placeholder, onSelect }: Props) => {
    const [pickerState, setPickerState] = useState(false)
    const [selectedMembers, setSelectedMembers] =
        useState<IMemberProfilePicker>()
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: PAGINATION_INITIAL_INDEX,
        pageSize: PAGINATION_INITIAL_PAGE_SIZE,
    })

    const { setFilter } = useFilterState({
        onFilterChange: () =>
            setPagination((prev) => ({
                ...prev,
                pageIndex: PAGINATION_INITIAL_INDEX,
            })),
    })

    // const { data, isLoading, isPending, isFetching } = useMemberProfilesPicker({
    //     filters: JSON.stringify(finalFilterPayload),
    //     pagination,
    // })

    return (
        <>
            <GenericPicker
                items={dummyMemberProfiles}
                open={pickerState}
                // listHeading={`Matched Results (${data.totalSize})`}
                searchPlaceHolder="Search members..."
                // isLoading={isPending || isLoading || isFetching}
                onOpenChange={setPickerState}
                onSelect={(selectedMembers) => {
                    onSelect?.(selectedMembers)
                    setSelectedMembers(selectedMembers)
                }}
                onSearchChange={(searchValue) => {
                    setFilter('name', {
                        displayText: '',
                        mode: 'contains',
                        dataType: 'text',
                        value: searchValue,
                    })
                }}
                renderItem={(members) => (
                    <div className="flex w-full items-center justify-between py-1">
                        <div className="flex items-center gap-x-2">
                            <span className="text-ellipsis text-foreground/80">
                                {members.description}
                            </span>
                        </div>
                    </div>
                )}
            >
                <MiniPaginationBar
                    pagination={{
                        pageIndex: pagination.pageIndex,
                        pageSize: pagination.pageSize,
                        totalPage: 0,
                        totalSize: 0,
                    }}
                    disablePageMove={false}
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
                        {!value ? (
                            <span className="flex items-center gap-x-1 text-foreground/70">
                                <MagnifyingGlassIcon />
                                {placeholder}
                            </span>
                        ) : (
                            <span className="mr-1 font-mono text-sm text-foreground/30">
                                {selectedMembers?.passbookNumber}
                            </span>
                        )}
                    </span>
                </span>
                <ChevronDownIcon />
            </Button>
        </>
    )
}

export default MembersPicker
