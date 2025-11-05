import { useMemo, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import Fuse from 'fuse.js'

import { dateAgo } from '@/helpers/date-utils'
import { cn } from '@/helpers/tw-utils'
import KanbanContainer from '@/modules/approvals/components/kanban/kanban-container'
import KanbanItemsContainer from '@/modules/approvals/components/kanban/kanban-items-container'
import KanbanTitle from '@/modules/approvals/components/kanban/kanban-title'
import { JournalVoucherSkeletonCard } from '@/modules/journal-voucher/components/journal-voucher-skeleton-card'
import {
    ILoanTransaction,
    ILoanTransactionStatusDates,
    TLoanMode,
    useGetAllLoanTransaction,
} from '@/modules/loan-transaction'
import LoanStatusIndicator from '@/modules/loan-transaction/components/loan-status-indicator'

import {
    CollapseIcon,
    MagnifyingGlassIcon as SearchIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
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

import { highlightMatch } from '../journal-voucher/journal-voucher-kanban-main'
import {
    LoanTransactionCard,
    LoanTransactionCardCreatorInfo,
} from './loan-kanban-card'
import { LoanTransactionCardActions } from './loan-kanban-card-actions'

type LoanTransactionKanbanProps = {
    mode: TLoanMode
    icon: React.ReactNode
    isExpanded?: boolean
    searchTerm?: string
    enableSearch?: boolean
    isSelected?: boolean
    isSearchHighlighted?: boolean
}

export const LoanKanbanMain = ({
    mode,
    icon,
    searchTerm = '',
    isSelected = false,
    isSearchHighlighted = false,
}: LoanTransactionKanbanProps) => {
    const invalidate = useQueryClient()
    const [openLoans, setOpenLoans] = useState<string[]>([])

    const {
        data: rawLoans,
        isLoading,
        refetch,
        isRefetching,
    } = useGetAllLoanTransaction({
        mode: mode,
    })

    const loanData = useMemo(() => rawLoans ?? [], [rawLoans])

    const fuse = useMemo(
        () =>
            new Fuse<ILoanTransaction>(loanData, {
                keys: [
                    { name: 'loan_type.name', weight: 0.4 },
                    { name: 'member_profile.full_name', weight: 0.3 },
                    { name: 'member_profile.user.user_name', weight: 0.2 },
                    { name: 'loan_number', weight: 0.1 },
                    { name: 'created_by.full_name', weight: 0.1 },
                    { name: 'created_by.user_name', weight: 0.1 },
                    { name: 'approved_by.full_name', weight: 0.1 },
                    { name: 'approved_by.user_name', weight: 0.1 },
                    { name: 'printed_by.full_name', weight: 0.1 },
                    { name: 'printed_by.user_name', weight: 0.1 },
                    { name: 'released_by.full_name', weight: 0.1 },
                    { name: 'released_by.user_name', weight: 0.1 },
                    { name: 'voucher', weight: 0.1 },
                    { name: 'check_number', weight: 0.1 },
                ],
                includeScore: true,
                threshold: 0.3,
                ignoreLocation: true,
                findAllMatches: true,
                minMatchCharLength: 2,
            }),
        [loanData]
    )

    const filteredLoans = useMemo(() => {
        if (!searchTerm?.trim()) {
            return loanData
        }

        return fuse.search(searchTerm).map((result) => result.item)
    }, [searchTerm, fuse, loanData])

    if (!rawLoans) return null

    const allIds = filteredLoans.map((loan) => loan.id)
    const hasItem = filteredLoans.length > 0
    const isExpanded = openLoans.length > 0

    const handleExpandAll = () => {
        setOpenLoans(allIds)
    }

    const handleCollapseAll = () => {
        setOpenLoans([])
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
            queryKey: ['loan-transaction', 'all'],
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
                        title={`${mode} Loans`}
                        titleClassName="capitalize"
                        totalItems={filteredLoans.length}
                    />
                </div>

                {searchTerm && (
                    <div className="text-xs text-muted-foreground px-2">
                        <Badge
                            className={cn('text-xs ')}
                            variant={
                                filteredLoans.length > 0 ? 'default' : 'outline'
                            }
                        >
                            {filteredLoans.length} of {loanData.length} results
                        </Badge>
                    </div>
                )}
            </div>
            <Separator />
            <KanbanItemsContainer>
                {filteredLoans.length > 0 ? (
                    <Accordion
                        className="w-full space-y-2"
                        onValueChange={setOpenLoans}
                        type="multiple"
                        value={openLoans}
                    >
                        {filteredLoans.map((loan) => {
                            const loanDates: ILoanTransactionStatusDates = {
                                printed_date: loan.printed_date,
                                approved_date: loan.approved_date,
                                released_date: loan.released_date,
                            }

                            const loanTitle =
                                loan.member_profile?.full_name ?? 'No name'
                            const loanSubtitle = loan.member_profile?.user
                                ?.user_name
                                ? `@${loan.member_profile.user.user_name}`
                                : (loan.account?.name ?? '-')
                            const imageSrc =
                                loan.member_profile?.media?.download_url

                            return (
                                <div
                                    className={cn(
                                        'group space-y-2 relative bg-card rounded-xl border border-border p-4 transition-shadow hover:shadow-lg hover:shadow-accent/10'
                                    )}
                                    key={loan.id}
                                >
                                    <div className="flex justify-between items-center">
                                        <LoanStatusIndicator
                                            className="flex-shrink-0"
                                            loanTransactionDates={loanDates}
                                        />
                                        <p className="text-xs right-3 top-1 text-end text-muted-foreground/70 truncate">
                                            {dateAgo(loan.created_at)}
                                        </p>
                                    </div>

                                    <AccordionItem
                                        className=" border-b-0 "
                                        value={loan.id}
                                    >
                                        <InfoTooltip content={loanTitle}>
                                            <AccordionTrigger className="truncate h-10">
                                                <div className="flex flex-col text-left">
                                                    <div className="inline-flex items-center gap-2">
                                                        <ImageDisplay
                                                            className="size-8 rounded-full"
                                                            src={imageSrc}
                                                        />
                                                        <p className="truncate text-sm max-w-[300px] text-muted-foreground">
                                                            {/* Highlight either the full name or the loan type name */}
                                                            {searchTerm
                                                                ? highlightMatch(
                                                                      loanTitle,
                                                                      searchTerm
                                                                  )
                                                                : loanTitle}
                                                            <span className="ml-1">
                                                                {loanSubtitle}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                        </InfoTooltip>

                                        <AccordionContent className="px-2 py-2 text-muted-foreground">
                                            <LoanTransactionCard
                                                highlightMatch={highlightMatch}
                                                loan={loan}
                                                refetch={() => {
                                                    handleInvalidate()
                                                    refetch()
                                                }}
                                                searchTerm={searchTerm}
                                            />
                                        </AccordionContent>
                                    </AccordionItem>
                                    <LoanTransactionCardActions
                                        loanDates={loanDates}
                                        loanTransaction={loan}
                                        refetch={() => {
                                            handleInvalidate()
                                            refetch()
                                        }}
                                    />
                                    <LoanTransactionCardCreatorInfo
                                        loan={loan}
                                    />
                                </div>
                            )
                        })}
                    </Accordion>
                ) : (
                    <div className="text-center py-8 space-y-2">
                        <p className="text-xs text-muted-foreground/60">
                            {searchTerm
                                ? `No ${mode} loans match "${searchTerm}"`
                                : `No ${mode} loans.`}
                        </p>
                    </div>
                )}
            </KanbanItemsContainer>
        </KanbanContainer>
    )
}
