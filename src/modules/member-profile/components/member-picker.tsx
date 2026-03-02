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
    XIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import Modal from '@/components/modals/modal'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'
import { GenericPickerInputSearch } from '@/components/pickers/generic-picker'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button, ButtonProps } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import useFilterState from '@/hooks/use-filter-state'
import { useInternalState } from '@/hooks/use-internal-state'

import {
    IMemberProfile,
    IMemberProfileQuickSearchResponse,
    useGetMemberProfile,
    useGetMemberProfileQuickSearch,
    useGetPaginatedMemberProfiles,
} from '..'

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

        const { mutateAsync: getMember } = useGetMemberProfile()

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
            fullQuery.isLoading

        // ================= HOTKEY =================
        useHotkeys(
            shortcutHotKey,
            (event) => {
                event.preventDefault()
                if (!disabled && allowShortcutHotKey) {
                    setOpen(true)
                }
            },
            { enableOnFormTags: true },
            [disabled, allowShortcutHotKey]
        )

        // ================= SELECT =================
        const handleSelect = async (
            member: IMemberProfileQuickSearchResponse | IMemberProfile
        ) => {
            if (!member) return

            if (isQuick) {
                const fullMember = await getMember(member.id)
                onSelect?.(fullMember)
            } else {
                queryClient.setQueryData(['member', member.id], member)
                onSelect?.(member as IMemberProfile)
            }

            setOpen(false)
        }

        return (
            <>
                {/* ================= MODAL ================= */}
                <Modal
                    className="h-fit max-w-[90vw] sm:max-w-2xl p-0"
                    onOpenChange={setOpen}
                    open={open}
                >
                    <div className="max-h-[70vh] flex flex-col">
                        {/* SEARCH HEADER */}
                        <div className="relative flex items-center border-b px-3">
                            <MagnifyingGlassIcon className="mr-2 size-4 opacity-50" />

                            {isQuick ? (
                                <GenericPickerInputSearch
                                    onChange={setSearch}
                                    placeHolder={searchPlaceholder}
                                />
                            ) : (
                                <GenericPickerInputSearch
                                    onChange={(value) =>
                                        bulkSetFilter(
                                            [
                                                {
                                                    displayText: 'Full Name',
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
                                                value,
                                            }
                                        )
                                    }
                                    placeHolder={searchPlaceholder}
                                />
                            )}
                        </div>

                        {/* LIST */}
                        <Command
                            className="flex-1 bg-transparent"
                            shouldFilter={false}
                        >
                            <CommandList className="ecoop-scroll max-h-[400px] px-1">
                                {/* Loading / Empty */}
                                <CommandEmpty className="text-sm text-foreground/50">
                                    {isFetching ? (
                                        <LoadingSpinner className="inline" />
                                    ) : (
                                        'No members found.'
                                    )}
                                </CommandEmpty>

                                {members.length > 0 && (
                                    <CommandGroup>
                                        {members.map((member) => {
                                            const isSelected =
                                                value?.id === member.id

                                            return (
                                                <CommandItem
                                                    className={cn(
                                                        'cursor-pointer rounded-lg px-3 py-2'
                                                    )}
                                                    key={member.id}
                                                    onSelect={() =>
                                                        handleSelect(member)
                                                    }
                                                    value={member.full_name}
                                                >
                                                    <div className="flex w-full items-center justify-between">
                                                        {/* LEFT SIDE */}
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <PreviewMediaWrapper
                                                                media={
                                                                    member.media
                                                                }
                                                            >
                                                                <ImageDisplay
                                                                    className="h-8 w-8 rounded-full object-cover shrink-0"
                                                                    src={
                                                                        member
                                                                            .media
                                                                            ?.download_url
                                                                    }
                                                                />
                                                            </PreviewMediaWrapper>

                                                            <div className="flex flex-col min-w-0">
                                                                <span className="truncate font-medium">
                                                                    {
                                                                        member.full_name
                                                                    }
                                                                </span>

                                                                {showPBNo &&
                                                                    'passbook' in
                                                                        member && (
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
                                                </CommandItem>
                                            )
                                        })}
                                    </CommandGroup>
                                )}
                            </CommandList>
                        </Command>

                        {/* PAGINATION ONLY FOR FULL MODE */}
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
                    </div>
                </Modal>

                {/* ================= TRIGGER ================= */}
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
