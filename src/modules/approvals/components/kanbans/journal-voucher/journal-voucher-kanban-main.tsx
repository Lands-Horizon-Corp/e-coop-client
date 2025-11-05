import { useMemo, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import Fuse from 'fuse.js'

import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@radix-ui/react-accordion'

import { cn } from '@/helpers'
import { dateAgo } from '@/helpers/date-utils'
import {
    IJournalVoucher,
    TJournalVoucherMode,
    useGetAllJournalVoucher,
} from '@/modules/journal-voucher'
import { JournalVoucherSkeletonCard } from '@/modules/journal-voucher/components/journal-voucher-skeleton-card'
import JournalVoucherStatusIndicator from '@/modules/journal-voucher/components/journal-voucher-status-indicator'

import {
    CollapseIcon,
    MagnifyingGlassIcon as SearchIcon,
} from '@/components/icons'
import InfoTooltip from '@/components/tooltips/info-tooltip'
import { Accordion } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import KanbanContainer from '../../kanban/kanban-container'
import KanbanItemsContainer from '../../kanban/kanban-items-container'
import KanbanTitle from '../../kanban/kanban-title'
import {
    JournalVoucherCard,
    JournalVoucherCardCreatorInfo,
} from './journal-voucher-card'
import { JournalVoucherCardActions } from './journal-voucher-card-actions'
import { IJournalVoucherStatusDates } from './journal-voucher-kanban'

type JournalVoucherKanbanProps = {
    mode: TJournalVoucherMode
    icon: React.ReactNode
    isExpanded?: boolean
    searchTerm?: string
    enableSearch?: boolean
    isSelected?: boolean
    isSearchHighlighted?: boolean
}

export const JournalVoucherKanbanMain = ({
    mode,
    icon,
    searchTerm = '',
    // enableSearch = true,
    isSelected = false,
    isSearchHighlighted = false,
}: JournalVoucherKanbanProps) => {
    const invalidate = useQueryClient()
    const [openVouchers, setOpenVouchers] = useState<string[]>([])

    const {
        data: rawJournalVouchers,
        isLoading,
        refetch,
        isRefetching,
    } = useGetAllJournalVoucher({
        mode: mode,
    })

    const journalVoucherData = useMemo(
        () => rawJournalVouchers ?? [],
        [rawJournalVouchers]
    )

    const fuse = useMemo(
        () =>
            new Fuse<IJournalVoucher>(journalVoucherData, {
                keys: [
                    { name: 'name', weight: 0.3 },
                    { name: 'description', weight: 0.2 },
                    { name: 'cash_voucher_number', weight: 0.2 },
                    { name: 'reference', weight: 0.1 },
                    { name: 'member_profile.first_name', weight: 0.1 },
                    { name: 'member_profile.last_name', weight: 0.1 },
                    { name: 'created_by.user_name', weight: 0.1 },
                    { name: 'approved_by.full_name', weight: 0.1 },
                    { name: 'approved_by.user_name', weight: 0.1 },
                    { name: 'printed_by.full_name', weight: 0.1 },
                    { name: 'printed_by.user_name', weight: 0.1 },
                    { name: 'released_by.full_name', weight: 0.1 },
                    { name: 'released_by.user_name', weight: 0.1 },
                ],
                includeScore: true,
                threshold: 0.3,
                ignoreLocation: true,
                findAllMatches: true,
                minMatchCharLength: 2,
            }),
        [journalVoucherData]
    )

    const filteredJournalVouchers = useMemo(() => {
        if (!searchTerm?.trim()) {
            return journalVoucherData
        }

        return fuse.search(searchTerm).map((result) => result.item)
    }, [searchTerm, fuse, journalVoucherData])

    if (!rawJournalVouchers) return null

    const allIds = filteredJournalVouchers.map((jv) => jv.id)
    const hasItem = filteredJournalVouchers.length > 0
    const isExpanded = openVouchers.length > 0

    const handleExpandAll = () => {
        setOpenVouchers(allIds)
    }

    const handleCollapseAll = () => {
        setOpenVouchers([])
    }

    const handleExpandedToggle = () => {
        if (!isExpanded) {
            handleExpandAll()
        } else {
            handleCollapseAll()
        }
    }

    if (isLoading) return <JournalVoucherSkeletonCard className="w-[420px]" />

    const handleInvalidate = () => {
        invalidate.invalidateQueries({
            queryKey: ['get-all-journal-voucher'],
        })
    }

    return (
        <KanbanContainer
            className={cn(
                '2xl:w-[24%] lg:w-[350px] w-[300px] h-full shrink-0 relative',
                isSelected && 'ring-2 ring-primary/20 bg-primary/5'
            )}
        >
            <div className="flex flex-col gap-2 p-2">
                <div className="flex items-center gap-2">
                    {icon}
                    <KanbanTitle
                        isLoading={isRefetching}
                        onRefresh={() => refetch()}
                        otherActions={
                            <div className="flex items-center gap-1">
                                {isSearchHighlighted && (
                                    <Badge
                                        className="text-xs py-0 px-1"
                                        variant="outline"
                                    >
                                        <SearchIcon className="size-2 mr-1" />
                                        Search
                                    </Badge>
                                )}
                                {hasItem && (
                                    <Button
                                        className="!size-fit !p-0.5"
                                        onClick={handleExpandedToggle}
                                        size="sm"
                                        variant="ghost"
                                    >
                                        <CollapseIcon />
                                    </Button>
                                )}
                            </div>
                        }
                        title={mode}
                        titleClassName="capitalize"
                        totalItems={filteredJournalVouchers.length}
                    />
                </div>

                {searchTerm && (
                    <div className="text-xs text-muted-foreground px-2">
                        <Badge
                            className={cn('text-xs ')}
                            variant={
                                filteredJournalVouchers.length > 0
                                    ? 'default'
                                    : 'outline'
                            }
                        >
                            {filteredJournalVouchers.length} of{' '}
                            {journalVoucherData.length} results
                        </Badge>
                    </div>
                )}
            </div>

            <Separator />

            <KanbanItemsContainer>
                {filteredJournalVouchers.length > 0 ? (
                    <Accordion
                        className="w-full space-y-2"
                        onValueChange={setOpenVouchers}
                        type="multiple"
                        value={openVouchers}
                    >
                        {filteredJournalVouchers.map((journalVoucher) => {
                            const jvDates: IJournalVoucherStatusDates = {
                                printed_date: journalVoucher.printed_date,
                                approved_date: journalVoucher.approved_date,
                                released_date: journalVoucher.released_date,
                            }
                            return (
                                <div
                                    className={cn(
                                        'group space-y-2 relative bg-card rounded-xl border border-border p-4 transition-shadow hover:shadow-lg hover:shadow-accent/10'
                                    )}
                                    key={journalVoucher.id}
                                >
                                    <div className="flex justify-between items-center">
                                        <JournalVoucherStatusIndicator
                                            className="flex-shrink-0"
                                            journalVoucher={journalVoucher}
                                        />
                                        <p className="text-xs right-3 top-1 text-end text-muted-foreground/70 truncate">
                                            {dateAgo(journalVoucher.created_at)}
                                        </p>
                                    </div>

                                    <AccordionItem
                                        className="border-b-0"
                                        key={journalVoucher.id}
                                        value={journalVoucher.id}
                                    >
                                        <InfoTooltip
                                            content={journalVoucher.name}
                                        >
                                            <AccordionTrigger className="truncate min-w-0 max-w-full h-10">
                                                <p className="truncate text-sm font-bold text-foreground/95">
                                                    {searchTerm
                                                        ? highlightMatch(
                                                              journalVoucher.name ||
                                                                  '-',
                                                              searchTerm
                                                          )
                                                        : journalVoucher.name ||
                                                          '-'}
                                                </p>
                                            </AccordionTrigger>
                                        </InfoTooltip>
                                        <AccordionContent className="px-2 py-2 text-muted-foreground">
                                            <JournalVoucherCard
                                                highlightMatch={highlightMatch}
                                                journalVoucher={journalVoucher}
                                                refetch={() => {
                                                    handleInvalidate()
                                                    refetch()
                                                }}
                                                searchTerm={searchTerm}
                                            />
                                        </AccordionContent>
                                    </AccordionItem>
                                    <JournalVoucherCardActions
                                        journalVoucher={journalVoucher}
                                        jvDates={jvDates}
                                        refetch={() => {
                                            handleInvalidate()
                                            refetch()
                                        }}
                                    />
                                    <JournalVoucherCardCreatorInfo
                                        journalVoucher={journalVoucher}
                                    />
                                </div>
                            )
                        })}
                    </Accordion>
                ) : (
                    <div className="text-center py-8 space-y-2">
                        <p className="text-xs text-muted-foreground/60">
                            {searchTerm
                                ? `No ${mode} vouchers match "${searchTerm}"`
                                : `No ${mode} Journal Vouchers.`}
                        </p>
                    </div>
                )}
            </KanbanItemsContainer>
        </KanbanContainer>
    )
}

export const highlightMatch = (text: string, search: string) => {
    if (!search || !text) return text
    const regex = new RegExp(`(${search})`, 'ig')
    return text.split(regex).map((part, i) =>
        regex.test(part) ? (
            <span
                className="bg-primary/20 text-primary rounded px-0.5 py-0.5 font-medium"
                key={i}
            >
                {part}
            </span>
        ) : (
            part
        )
    )
}
