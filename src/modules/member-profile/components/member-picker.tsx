import { forwardRef, useMemo, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { PAGINATION_INITIAL_INDEX, PICKERS_SELECT_PAGE_SIZE } from '@/constants'
import { cn } from '@/helpers'
import { IPickerBaseProps } from '@/types/component-types/picker'
import { PaginationState } from '@tanstack/react-table'
import { useHotkeys } from 'react-hotkeys-hook'

import {
    BadgeCheckFillIcon,
    ChevronDownIcon,
    MagnifyingGlassIcon,
    ScanLineIcon,
    XIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'
import GenericPicker, {
    GenericPickerInputSearch,
} from '@/components/pickers/generic-picker'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button, ButtonProps } from '@/components/ui/button'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import useFilterState from '@/hooks/use-filter-state'
import { useInternalState } from '@/hooks/use-internal-state'
import { useModalState } from '@/hooks/use-modal-state'

import {
    IMemberProfile,
    IMemberProfileQuickSearchResponse,
    useGetMemberProfile,
    useGetMemberProfileQuickSearch,
    useGetPaginatedMemberProfiles,
} from '..'
import { MemberQrScannerModal } from './member-qr-scanner'

type MemberPickerVariant = 'quick' | 'full'

interface Props extends IPickerBaseProps<IMemberProfile> {
    mode?: MemberPickerVariant
    allowClear?: boolean
    showPBNo?: boolean
    triggerClassName?: string
    mainTriggerClassName?: string
    mainTriggerProps?: ButtonProps
    allowShortcutHotKey?: boolean
    shortcutHotKey?: string
    searchPlaceholder?: string
}

const MemberPicker = forwardRef<HTMLButtonElement, Props>(
    (
        {
            value,
            onSelect,
            disabled,
            modalState,
            placeholder = 'Select member',
            mode = 'quick',
            allowClear = false,
            showPBNo = true,
            triggerVariant = 'secondary',
            triggerClassName,
            mainTriggerClassName,
            mainTriggerProps,
            allowShortcutHotKey = false,
            shortcutHotKey = 'enter',
            searchPlaceholder = 'Search name or PB no.',
        },
        ref
    ) => {
        const isQuick = mode === 'quick'
        const queryClient = useQueryClient()
        const qrScannerModal = useModalState()

        const [open, setOpen] = useInternalState(
            false,
            modalState?.open,
            modalState?.onOpenChange
        )

        const [search, setSearch] = useState('')
        const [pagination, setPagination] = useState<PaginationState>({
            pageIndex: PAGINATION_INITIAL_INDEX,
            pageSize: PICKERS_SELECT_PAGE_SIZE,
        })

        // ================= QUICK SEARCH =================
        const quickQuery = useGetMemberProfileQuickSearch({
            search,
            options: {
                enabled: open && isQuick && !disabled,
            },
        })

        const { mutateAsync: getMember, isPending: isPendingGetMember } =
            useGetMemberProfile()

        // ================= FULL SEARCH =================
        const { finalFilterPayloadBase64, bulkSetFilter } = useFilterState({
            defaultFilterMode: 'OR',
            debounceFinalFilterMs: 300,
            onFilterChange: () =>
                setPagination((prev) => ({
                    ...prev,
                    pageIndex: PAGINATION_INITIAL_INDEX,
                })),
        })

        const fullQuery = useGetPaginatedMemberProfiles({
            query: {
                filter: finalFilterPayloadBase64,
                ...pagination,
            },
            options: {
                enabled: open && !isQuick && !disabled,
            },
        })

        const members = useMemo(() => {
            if (isQuick) return quickQuery.data ?? []
            return fullQuery.data?.data ?? []
        }, [isQuick, quickQuery.data, fullQuery.data])

        const totalSize = fullQuery.data?.totalSize ?? 0
        const totalPage = fullQuery.data?.totalPage ?? 1

        const isFetching =
            quickQuery.isFetching ||
            fullQuery.isFetching ||
            quickQuery.isLoading ||
            fullQuery.isLoading ||
            isPendingGetMember

        useHotkeys(
            shortcutHotKey,
            (event) => {
                event.preventDefault()
                event.stopPropagation()
                if (!value && !disabled && !isFetching && allowShortcutHotKey) {
                    setOpen(!open)
                }
            },
            {
                enableOnFormTags: true,
            },
            [value, disabled, isFetching, allowShortcutHotKey, open]
        )

        const handleSelect = async (
            member: IMemberProfileQuickSearchResponse | IMemberProfile
        ) => {
            if (!member) return
            if (isQuick) {
                const fullMember = await getMember(member.id)
                onSelect?.(fullMember as IMemberProfile)
            } else {
                queryClient.setQueryData(['member', member.id], member)
                onSelect?.(member as IMemberProfile)
            }
        }

        return (
            <>
                <div className="max-h-[70vh] flex flex-col">
                    <GenericPicker
                        customSearchComponent={
                            isQuick && (
                                <>
                                    <div className="relative flex items-center border-b px-3">
                                        <MagnifyingGlassIcon className="mr-2 size-4 opacity-50" />
                                        <GenericPickerInputSearch
                                            onChange={setSearch}
                                            placeHolder={searchPlaceholder}
                                        />
                                        <Button
                                            className="size-fit p-2 text-muted-foreground "
                                            onClick={() =>
                                                qrScannerModal.onOpenChange(
                                                    true
                                                )
                                            }
                                            size="icon"
                                            variant="ghost"
                                        >
                                            <ScanLineIcon />
                                        </Button>
                                    </div>
                                </>
                            )
                        }
                        isLoading={isFetching}
                        items={members}
                        listHeading={`Matched Results (${totalSize})`}
                        onOpenChange={setOpen}
                        onSearchChange={(searchValue) => {
                            bulkSetFilter(
                                [
                                    {
                                        displayText: 'full name',
                                        field: 'full_name',
                                    },
                                    {
                                        displayText: 'PB',
                                        field: 'passbook',
                                    },
                                ],
                                {
                                    displayText: '',
                                    mode: 'contains',
                                    dataType: 'text',
                                    value: searchValue,
                                }
                            )
                        }}
                        onSelect={(member) => {
                            handleSelect(member)
                        }}
                        open={open}
                        renderItem={(member) => {
                            const isSelected = value?.id === member.id
                            return (
                                <div className="flex w-full items-center justify-between">
                                    {/* LEFT SIDE */}
                                    <div className="flex items-center gap-2 min-w-0">
                                        <PreviewMediaWrapper
                                            media={member.media}
                                        >
                                            <ImageDisplay
                                                className="h-8 w-8 rounded-full object-cover shrink-0"
                                                src={member.media?.download_url}
                                            />
                                        </PreviewMediaWrapper>
                                        <div className="flex flex-col min-w-0">
                                            <span className="truncate font-medium">
                                                {member.full_name}
                                            </span>
                                            {showPBNo &&
                                                'passbook' in member && (
                                                    <span className="text-xs text-muted-foreground truncate">
                                                        {(member.passbook as string) ||
                                                            '-'}
                                                    </span>
                                                )}
                                        </div>
                                    </div>

                                    {/* RIGHT SIDE */}
                                    {isSelected && (
                                        <BadgeCheckFillIcon className="size-4 text-primary shrink-0" />
                                    )}
                                </div>
                            )
                        }}
                        searchPlaceHolder="Search account name"
                    >
                        {!isQuick && (
                            <MiniPaginationBar
                                disablePageMove={fullQuery.isFetching}
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
                                    totalPage,
                                    totalSize,
                                }}
                            />
                        )}
                    </GenericPicker>
                    <MemberQrScannerModal
                        {...qrScannerModal}
                        scannerProps={{
                            onSelectMemberProfile: (memberProfile) => {
                                onSelect?.(memberProfile)
                                setOpen(false)
                            },
                        }}
                    />
                </div>

                <div
                    className={cn(
                        'flex items-center space-x-1',
                        mainTriggerClassName
                    )}
                >
                    <Button
                        {...mainTriggerProps}
                        className={cn(
                            'flex-1 items-center justify-between rounded-md border p-0 px-2 h-10',
                            triggerClassName
                        )}
                        disabled={disabled}
                        onClick={() => setOpen(true)}
                        ref={ref}
                        type="button"
                        variant={triggerVariant}
                    >
                        <span className="flex flex-1 min-w-0 items-center justify-between text-sm text-foreground/90">
                            <span className="inline-flex flex-1 min-w-0 items-center gap-x-2">
                                <div className="shrink-0">
                                    {isFetching ? (
                                        <LoadingSpinner className="size-6" />
                                    ) : (
                                        <PreviewMediaWrapper
                                            media={value?.media}
                                        >
                                            <ImageDisplay
                                                className="h-6 w-6 rounded-full object-cover"
                                                src={value?.media?.download_url}
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
                                        <span className="truncate font-medium shrink min-w-0">
                                            {value.full_name}
                                        </span>
                                        {showPBNo && (
                                            <span className="shrink-0 font-mono text-sm text-muted-foreground ml-auto">
                                                {value?.passbook || ''}
                                            </span>
                                        )}
                                    </span>
                                )}
                            </span>

                            {allowShortcutHotKey && (
                                <span className="ml-2 text-sm shrink-0 text-muted-foreground">
                                    ⌘ ↵
                                </span>
                            )}
                        </span>

                        <ChevronDownIcon className="shrink-0 ml-2 h-4 w-4 text-muted-foreground" />
                    </Button>

                    {allowClear && value && (
                        <Button
                            onClick={(e) => {
                                e.stopPropagation()
                                onSelect?.({} as IMemberProfile)
                            }}
                            size="sm"
                            type="button"
                            variant="ghost"
                        >
                            <XIcon className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </>
        )
    }
)

MemberPicker.displayName = 'MemberPicker'
export default MemberPicker
