import { forwardRef, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { PAGINATION_INITIAL_INDEX, PICKERS_SELECT_PAGE_SIZE } from '@/constants'
import { type TFilterObject } from '@/contexts/filter-context'
import { cn } from '@/helpers'
import { MemberQrScannerModal } from '@/modules/member-profile/components/member-qr-scanner'
import { IPickerBaseProps } from '@/types/component-types/picker'
import { PaginationState } from '@tanstack/react-table'

import {
    BadgeCheckFillIcon,
    ChevronDownIcon,
    ScanLineIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'
import GenericPicker from '@/components/pickers/generic-picker'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import useFilterState from '@/hooks/use-filter-state'
import { useInternalState } from '@/hooks/use-internal-state'
import { useModalState } from '@/hooks/use-modal-state'
import { useShortcut } from '@/hooks/use-shorcuts'

import { IMemberProfile, useGetPaginatedMemberProfiles } from '..'

interface Props extends IPickerBaseProps<IMemberProfile> {
    defaultFilter?: TFilterObject
    allowShorcutCommand?: boolean
}

const MemberPicker = forwardRef<HTMLButtonElement, Props>(
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
        const qrScannerModal = useModalState()
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
        } = useGetPaginatedMemberProfiles({
            query: {
                filter: finalFilterPayloadBase64,
                ...pagination,
            },
            options: {
                enabled: !disabled,
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

        return (
            <>
                <GenericPicker
                    items={data}
                    open={state}
                    listHeading={`Matched Results (${totalSize})`}
                    searchPlaceHolder="Search name or PB no."
                    isLoading={isPending || isLoading || isFetching}
                    otherSearchInputChild={
                        <Button
                            size="icon"
                            variant="ghost"
                            className="size-fit p-2 text-muted-foreground "
                            onClick={() => qrScannerModal.onOpenChange(true)}
                        >
                            <ScanLineIcon />
                        </Button>
                    }
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
                                <PreviewMediaWrapper media={member.media}>
                                    <ImageDisplay
                                        src={member.media?.download_url}
                                    />
                                </PreviewMediaWrapper>

                                <span className="text-ellipsis text-foreground/80">
                                    {member.full_name}{' '}
                                    {member.status === 'verified' && (
                                        <BadgeCheckFillIcon className="ml-2 inline size-2 text-primary" />
                                    )}
                                </span>
                            </div>

                            <p className="mr-2 font-mono text-xs text-muted-foreground">
                                <span>
                                    {member.passbook || (
                                        <span className="text-xs italic text-muted-foreground/70">
                                            -
                                        </span>
                                    )}
                                </span>
                            </p>
                        </div>
                    )}
                >
                    <MiniPaginationBar
                        pagination={{
                            pageIndex: pagination.pageIndex,
                            pageSize: pagination.pageSize,
                            totalPage: totalPage,
                            totalSize: totalSize,
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
                <MemberQrScannerModal
                    {...qrScannerModal}
                    scannerProps={{
                        onSelectMemberProfile: (memberProfile) => {
                            onSelect?.(memberProfile)
                            setState(false)
                        },
                    }}
                />
                <Button
                    ref={ref}
                    type="button"
                    variant="secondary"
                    disabled={disabled}
                    onClick={() => setState(true)}
                    className={cn(
                        'w-full items-center justify-between rounded-md border p-0 px-2',
                        triggerClassName
                    )}
                >
                    <span className="justify-betweentext-sm inline-flex w-full items-center text-foreground/90">
                        <span className="inline-flex w-full items-center gap-x-2">
                            <div>
                                {isFetching ? (
                                    <LoadingSpinner />
                                ) : (
                                    <PreviewMediaWrapper media={value?.media}>
                                        <ImageDisplay
                                            src={value?.media?.download_url}
                                        />
                                    </PreviewMediaWrapper>
                                )}
                            </div>
                            {!value ? (
                                <span className="text-foreground/70">
                                    {value || placeholder || 'Select member'}
                                </span>
                            ) : (
                                <span>{value.full_name}</span>
                            )}
                        </span>
                        {allowShorcutCommand && (
                            <span className="mr-2 text-sm">⌘ ↵ </span>
                        )}
                        <span className="mr-1 font-mono text-sm text-muted-foreground">
                            {value?.passbook || ''}
                        </span>
                    </span>
                    <ChevronDownIcon />
                </Button>
            </>
        )
    }
)

MemberPicker.displayName = 'Member Picker'

export default MemberPicker
