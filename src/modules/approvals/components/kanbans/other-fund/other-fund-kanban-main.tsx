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
    OtherFundCard,
    OtherFundCardCreatorInfo,
} from '@/modules/approvals/components/kanbans/other-fund/other-fund-card'
import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import { JournalVoucherSkeletonCard } from '@/modules/journal-voucher/components/journal-voucher-skeleton-card'
import {
    IOtherFund,
    TOtherFundMode,
    useGetAllOtherFund, // Updated hook
} from '@/modules/other-fund'
import OtherFundStatusIndicator from '@/modules/other-fund/components/other-fund-status-indicatior'

import { highlightMatch } from '@/components/hightlight-match'
import {
    CollapseIcon,
    MagnifyingGlassIcon as SearchIcon,
} from '@/components/icons'
import InfoTooltip from '@/components/tooltips/info-tooltip'
import { Accordion } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { useSubscribe } from '@/hooks/use-pubsub'

import KanbanContainer from '../../kanban/kanban-container'
import KanbanItemsContainer from '../../kanban/kanban-items-container'
import KanbanTitle from '../../kanban/kanban-title'
import { OtherFundCardActions } from './other-fund-card-actions'
import { IOtherFundStatusDates } from './other-fund-kanban'

type OtherFundKanbanProps = {
    mode: TOtherFundMode
    icon: React.ReactNode
    isExpanded?: boolean
    searchTerm?: string
    enableSearch?: boolean
    isSelected?: boolean
    isSearchHighlighted?: boolean
}

export const OtherFundKanbanMain = ({
    mode,
    icon,
    searchTerm = '',
    isSelected = false,
    isSearchHighlighted = false,
}: OtherFundKanbanProps) => {
    const invalidate = useQueryClient()

    const [openFunds, setOpenFunds] = useState<string[]>([])
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()

    // Real-time subscription updated for other_fund channel
    useSubscribe('other_fund', `dashboard.branch.${branch_id}`, () => {
        refetch()
    })

    const {
        data: rawOtherFunds,
        isLoading,
        refetch,
        isRefetching,
    } = useGetAllOtherFund({
        mode: mode,
    })

    const otherFundData = useMemo(() => rawOtherFunds ?? [], [rawOtherFunds])

    const fuse = useMemo(
        () =>
            new Fuse<IOtherFund>(otherFundData, {
                keys: [
                    { name: 'name', weight: 0.3 },
                    { name: 'description', weight: 0.2 },
                    { name: 'reference', weight: 0.1 },
                    { name: 'member_profile.first_name', weight: 0.1 },
                    { name: 'member_profile.last_name', weight: 0.1 },
                    { name: 'created_by.full_name', weight: 0.1 },
                    { name: 'approved_by.full_name', weight: 0.1 },
                    { name: 'printed_by.full_name', weight: 0.1 },
                    { name: 'released_by.full_name', weight: 0.1 },
                ],
                includeScore: true,
                threshold: 0.3,
                ignoreLocation: true,
                findAllMatches: true,
                minMatchCharLength: 2,
            }),
        [otherFundData]
    )

    const filteredOtherFunds = useMemo(() => {
        if (!searchTerm?.trim()) {
            return otherFundData
        }

        return fuse.search(searchTerm).map((result) => result.item)
    }, [searchTerm, fuse, otherFundData])

    if (!rawOtherFunds) return null

    const allIds = filteredOtherFunds.map((fund) => fund.id)
    const hasItem = filteredOtherFunds.length > 0
    const isExpanded = openFunds.length > 0

    const handleExpandAll = () => setOpenFunds(allIds)
    const handleCollapseAll = () => setOpenFunds([])

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
            queryKey: ['get-all-other-fund'],
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
                                        className="size-fit! p-0.5!"
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
                        totalItems={filteredOtherFunds.length}
                    />
                </div>

                {searchTerm && (
                    <div className="text-xs text-muted-foreground px-2">
                        <Badge
                            className={cn('text-xs ')}
                            variant={
                                filteredOtherFunds.length > 0
                                    ? 'default'
                                    : 'outline'
                            }
                        >
                            {filteredOtherFunds.length} of{' '}
                            {otherFundData.length} results
                        </Badge>
                    </div>
                )}
            </div>

            <KanbanItemsContainer>
                {filteredOtherFunds.length > 0 ? (
                    <Accordion
                        className="w-full space-y-2"
                        onValueChange={setOpenFunds}
                        type="multiple"
                        value={openFunds}
                    >
                        {filteredOtherFunds.map((otherFund) => {
                            const fundDates: IOtherFundStatusDates = {
                                printed_date: otherFund.printed_date,
                                approved_date: otherFund.approved_date,
                                released_date: otherFund.released_date,
                            }
                            return (
                                <div
                                    className="group space-y-2 relative bg-card rounded-xl border border-border p-4 transition-shadow hover:shadow-lg hover:shadow-accent/10"
                                    key={otherFund.id}
                                >
                                    <div className="flex justify-between items-center">
                                        <OtherFundStatusIndicator
                                            className="shrink-0"
                                            otherFund={otherFund}
                                        />
                                        <p className="text-xs text-end text-muted-foreground/70 truncate">
                                            {dateAgo(otherFund.created_at)}
                                        </p>
                                    </div>

                                    <AccordionItem
                                        className="border-b-0"
                                        key={otherFund.id}
                                        value={otherFund.id}
                                    >
                                        <InfoTooltip content={otherFund.name}>
                                            <AccordionTrigger className="truncate min-w-0 max-w-full h-10">
                                                <p className="truncate text-sm font-bold text-foreground/95">
                                                    {searchTerm
                                                        ? highlightMatch(
                                                              otherFund.name ||
                                                                  '-',
                                                              searchTerm
                                                          )
                                                        : otherFund.name || '-'}
                                                </p>
                                            </AccordionTrigger>
                                        </InfoTooltip>
                                        <AccordionContent className="px-2 py-2 text-muted-foreground">
                                            <OtherFundCard
                                                highlightMatch={highlightMatch}
                                                otherFund={otherFund}
                                                refetch={() => {
                                                    handleInvalidate()
                                                    refetch()
                                                }}
                                                searchTerm={searchTerm}
                                            />
                                        </AccordionContent>
                                    </AccordionItem>

                                    <OtherFundCardActions
                                        fundDates={fundDates}
                                        otherFund={otherFund}
                                        refetch={() => {
                                            handleInvalidate()
                                            refetch()
                                        }}
                                    />
                                    <OtherFundCardCreatorInfo
                                        otherFund={otherFund}
                                    />
                                </div>
                            )
                        })}
                    </Accordion>
                ) : (
                    <div className="text-center py-8 space-y-2">
                        <p className="text-xs text-muted-foreground/60">
                            {searchTerm
                                ? `No ${mode} records match "${searchTerm}"`
                                : `No ${mode} Fund Records.`}
                        </p>
                    </div>
                )}
            </KanbanItemsContainer>
        </KanbanContainer>
    )
}
