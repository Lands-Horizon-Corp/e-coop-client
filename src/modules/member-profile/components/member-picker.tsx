import { forwardRef, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { PAGINATION_INITIAL_INDEX, PICKERS_SELECT_PAGE_SIZE } from '@/constants'
import { type TFilterObject } from '@/contexts/filter-context'
import { cn } from '@/helpers'
import { MemberQrScannerModal } from '@/modules/member-profile/components/member-qr-scanner'
import { IPickerBaseProps } from '@/types/component-types/picker'
import { PaginationState } from '@tanstack/react-table'
import { HotkeysProvider, useHotkeys } from 'react-hotkeys-hook'

import {
    BadgeCheckFillIcon,
    ChevronDownIcon,
    ScanLineIcon,
    XIcon,
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

import { IMemberProfile, useGetPaginatedMemberProfiles } from '..'

interface Props extends IPickerBaseProps<IMemberProfile> {
    defaultFilter?: TFilterObject
    allowShorcutCommand?: boolean
    showPBNo?: boolean
    allowClear?: boolean
    mainTriggerClassName?: string
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
            triggerVariant = 'secondary',
            showPBNo = true,
            allowClear = false,
            mainTriggerClassName,
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
        } = useGetPaginatedMemberProfiles({
            query: {
                filter: finalFilterPayloadBase64,
                ...pagination,
            },
            options: {
                enabled: !disabled,
            },
        })

        useHotkeys(
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
            [
                value,
                disabled,
                isPending,
                isLoading,
                isFetching,
                allowShorcutCommand,
            ]
        )

        return (
            <>
                <HotkeysProvider initiallyActiveScopes={['member-picker']}>
                    <GenericPicker
                        isLoading={isPending || isLoading || isFetching}
                        items={data}
                        listHeading={`Matched Results (${totalSize})`}
                        onOpenChange={setState}
                        onSearchChange={(searchValue) => {
                            bulkSetFilter(
                                [
                                    {
                                        displayText: 'full name',
                                        field: 'fullName',
                                    },
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
                        onSelect={(member) => {
                            queryClient.setQueryData(['member', value], member)
                            onSelect?.(member)
                            setState(false)
                        }}
                        open={state}
                        otherSearchInputChild={
                            <Button
                                className="size-fit p-2 text-muted-foreground "
                                onClick={() =>
                                    qrScannerModal.onOpenChange(true)
                                }
                                size="icon"
                                variant="ghost"
                            >
                                <ScanLineIcon />
                            </Button>
                        }
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
                        searchPlaceHolder="Search name or PB no."
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
                                totalPage: totalPage,
                                totalSize: totalSize,
                            }}
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
                    <div
                        className={cn(
                            'flex items-center space-x-1',
                            mainTriggerClassName
                        )}
                    >
                        <Button
                            className={cn(
                                'flex-1 items-center justify-between rounded-md border p-0 px-2 h-10',
                                triggerClassName
                            )}
                            disabled={disabled}
                            onClick={() => setState(true)}
                            ref={ref}
                            type="button"
                            variant={triggerVariant}
                        >
                            <span className="flex flex-1 min-w-0 items-center justify-between text-sm text-foreground/90">
                                <span className="inline-flex flex-1 min-w-0 items-center gap-x-2">
                                    <div className="flex-shrink-0">
                                        {isFetching ? (
                                            <LoadingSpinner className="size-6" />
                                        ) : (
                                            <PreviewMediaWrapper
                                                media={value?.media}
                                            >
                                                <ImageDisplay
                                                    className="h-6 w-6 rounded-full object-cover"
                                                    src={
                                                        value?.media
                                                            ?.download_url
                                                    }
                                                />
                                            </PreviewMediaWrapper>
                                        )}
                                    </div>

                                    {!value ? (
                                        <span className="truncate text-foreground/70">
                                            {placeholder || 'Select member'}
                                        </span>
                                    ) : (
                                        <span className="inline-flex flex-1 w-0 max-w-fit items-center gap-x-4">
                                            <span className="truncate font-medium flex-shrink min-w-0">
                                                {value.full_name}
                                            </span>
                                            {showPBNo && (
                                                <span className="flex-shrink-0 font-mono text-sm text-muted-foreground ml-auto">
                                                    {value?.passbook || ''}
                                                </span>
                                            )}
                                        </span>
                                    )}
                                </span>

                                {allowShorcutCommand && (
                                    <span className="ml-2 text-sm flex-shrink-0 text-muted-foreground">
                                        ⌘ ↵
                                    </span>
                                )}
                            </span>

                            <ChevronDownIcon className="flex-shrink-0 ml-2 h-4 w-4 text-muted-foreground" />
                        </Button>

                        {allowClear && value && (
                            <Button
                                className="cursor-pointer rounded-full !p-0 !px-0 flex-shrink-0"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    onSelect?.(
                                        undefined as unknown as IMemberProfile
                                    )
                                }}
                                size={'sm'}
                                variant={'ghost'}
                            >
                                <XIcon className="inline h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </HotkeysProvider>
            </>
        )
    }
)

MemberPicker.displayName = 'Member Picker'

export default MemberPicker
