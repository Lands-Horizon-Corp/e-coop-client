import { useQueryClient } from '@tanstack/react-query'
import { forwardRef, useState } from 'react'

import { PAGINATION_INITIAL_INDEX, PICKERS_SELECT_PAGE_SIZE } from '@/constants'
import { type TFilterObject } from '@/contexts/filter-context'
import { abbreviateUUID } from '@/utils/formatting-utils'
import { PaginationState } from '@tanstack/react-table'

import {
    BadgeCheckFillIcon,
    ChevronDownIcon,
    ScanLineIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'

import { useFilteredPaginatedMemberProfile } from '@/hooks/api-hooks/member/use-member-profile'
import useFilterState from '@/hooks/use-filter-state'
import { useInternalState } from '@/hooks/use-internal-state'
import { useModalState } from '@/hooks/use-modal-state'

import { IMemberProfile, IPickerBaseProps } from '@/types'

import { MemberQrScannerModal } from '../qrcode-scanner/scanners/member-qr-scanner'
import { useShortcut } from '../use-shorcuts'
import PreviewMediaWrapper from '../wrappers/preview-media-wrapper'
import GenericPicker from './generic-picker'

interface Props extends IPickerBaseProps<IMemberProfile> {
    value?: IMemberProfile
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
                    items={data.data}
                    open={state}
                    listHeading={`Matched Results (${data.totalSize})`}
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
                    className="w-full items-center justify-between rounded-md border bg-background p-0 px-2"
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
                        <span className="mr-1 font-mono text-sm text-foreground/30">
                            #{value?.id ? abbreviateUUID(value.id) : '?'}
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
