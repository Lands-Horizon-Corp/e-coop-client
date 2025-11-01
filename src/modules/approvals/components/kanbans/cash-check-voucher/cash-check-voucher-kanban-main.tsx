import { useMemo, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import Fuse from 'fuse.js'

import { cn } from '@/helpers'
import { dateAgo } from '@/helpers/date-utils'
import KanbanContainer from '@/modules/approvals/components/kanban/kanban-container'
import KanbanItemsContainer from '@/modules/approvals/components/kanban/kanban-items-container'
import KanbanTitle from '@/modules/approvals/components/kanban/kanban-title'
import {
    ICashCheckVoucher,
    // Ensure this is imported or defined if it wasn't
    TCashCheckVoucherMode,
    useGetAllCashCheckVoucher,
} from '@/modules/cash-check-voucher'
import CashCheckVoucherStatusIndicator from '@/modules/cash-check-voucher/components/cash-check-status-indicator'

import {
    CollapseIcon,
    MagnifyingGlassIcon as SearchIcon,
} from '@/components/icons'
import InfoTooltip from '@/components/tooltips/info-tooltip'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { JournalVoucherSkeletonCard } from '../../../../journal-voucher/components/journal-voucher-skeleton-card'
import { highlightMatch } from '../journal-voucher/journal-voucher-kanban-main'
import {
    CashCheckVoucherCard,
    CashCheckVoucherCardCreatorInfo,
} from './cash-check-voucher-card'
import {
    CashCheckVoucherCardActions,
    ICCVStatusDates,
} from './cash-check-voucher-card-actions'

type CashCheckVoucherKanbanProps = {
    mode: TCashCheckVoucherMode
    icon: React.ReactNode
    isExpanded?: boolean // Not strictly needed, but kept for consistency
    searchTerm?: string
    enableSearch?: boolean // Not strictly needed, but kept for consistency
    isSelected?: boolean
    isSearchHighlighted?: boolean
}

export const CashCheckVoucherKanbanMain = ({
    mode,
    icon,
    searchTerm = '',
    isSelected = false,
    isSearchHighlighted = false,
}: CashCheckVoucherKanbanProps) => {
    const [openVouchers, setOpenVouchers] = useState<string[]>([])
    const invalidate = useQueryClient()
    const {
        data: rawCashCheckVouchers,
        isLoading,
        refetch,
        isRefetching,
    } = useGetAllCashCheckVoucher({ mode })

    const cashCheckVoucherData = useMemo(
        () => rawCashCheckVouchers ?? [],
        [rawCashCheckVouchers]
    )

    const fuse = useMemo(
        () =>
            new Fuse<ICashCheckVoucher>(cashCheckVoucherData, {
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
        [cashCheckVoucherData]
    )

    const filteredCashCheckVouchers = useMemo(() => {
        if (!searchTerm?.trim()) {
            return cashCheckVoucherData
        }

        return fuse.search(searchTerm).map((result) => result.item)
    }, [searchTerm, fuse, cashCheckVoucherData])

    if (!rawCashCheckVouchers) return null

    const allIds = filteredCashCheckVouchers.map((jv) => jv.id)
    const hasItem = filteredCashCheckVouchers.length > 0
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
            queryKey: ['cash-check-voucher'],
        })
    }

    return (
        <KanbanContainer
            className={cn(
                'w-[420px] h-full shrink-0 relative',
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
                        totalItems={filteredCashCheckVouchers.length}
                    />
                </div>

                {searchTerm && (
                    <div className="text-xs text-muted-foreground px-2">
                        <Badge
                            className={cn('text-xs ')}
                            variant={
                                filteredCashCheckVouchers.length > 0
                                    ? 'default'
                                    : 'outline'
                            }
                        >
                            {filteredCashCheckVouchers.length} of{' '}
                            {cashCheckVoucherData.length} results
                        </Badge>
                    </div>
                )}
            </div>
            <Separator />

            <KanbanItemsContainer>
                {filteredCashCheckVouchers.length > 0 ? (
                    <Accordion
                        className="w-full space-y-2"
                        onValueChange={setOpenVouchers}
                        type="multiple"
                        value={openVouchers}
                    >
                        {filteredCashCheckVouchers.map((cashCheckVoucher) => {
                            const ccvDates: ICCVStatusDates = {
                                printed_date: cashCheckVoucher.printed_date,
                                approved_date: cashCheckVoucher.approved_date,
                                released_date: cashCheckVoucher.released_date,
                            }
                            return (
                                <div
                                    className={cn(
                                        'group space-y-2 relative bg-card rounded-xl border border-border p-4 transition-shadow hover:shadow-lg hover:shadow-accent/10'
                                    )}
                                    key={cashCheckVoucher.id}
                                >
                                    <div className="flex justify-between items-center">
                                        <CashCheckVoucherStatusIndicator
                                            className="flex-shrink-0"
                                            voucherDates={ccvDates}
                                        />
                                        {cashCheckVoucher.updated_at && (
                                            <p className="text-xs right-3 top-1 text-end text-muted-foreground/70 truncate">
                                                {dateAgo(
                                                    cashCheckVoucher.updated_at
                                                )}
                                            </p>
                                        )}
                                    </div>

                                    <AccordionItem
                                        className=" border-b-0"
                                        key={cashCheckVoucher.id}
                                        value={cashCheckVoucher.id}
                                    >
                                        <InfoTooltip
                                            content={cashCheckVoucher.name}
                                        >
                                            <AccordionTrigger className="truncate h-10">
                                                <p className="truncate text-lg font-bold text-foreground/95">
                                                    {searchTerm
                                                        ? highlightMatch(
                                                              cashCheckVoucher.name ||
                                                                  '-',
                                                              searchTerm
                                                          )
                                                        : cashCheckVoucher.name ||
                                                          '-'}
                                                </p>
                                            </AccordionTrigger>
                                        </InfoTooltip>

                                        <AccordionContent className="px-2 py-2 text-muted-foreground">
                                            <CashCheckVoucherCard
                                                cashCheckVoucher={
                                                    cashCheckVoucher
                                                }
                                                highlightMatch={highlightMatch}
                                                refetch={() => {
                                                    handleInvalidate()
                                                    refetch()
                                                }}
                                                searchTerm={searchTerm}
                                            />
                                        </AccordionContent>
                                    </AccordionItem>
                                    <CashCheckVoucherCardActions
                                        cashCheckVoucher={cashCheckVoucher}
                                        ccvDates={ccvDates}
                                        refetch={() => {
                                            handleInvalidate()
                                            refetch()
                                        }}
                                    />
                                    <CashCheckVoucherCardCreatorInfo
                                        cashCheckVoucher={cashCheckVoucher}
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
                                : `No ${mode} Cash Check Vouchers.`}
                        </p>
                    </div>
                )}
            </KanbanItemsContainer>
        </KanbanContainer>
    )
}
