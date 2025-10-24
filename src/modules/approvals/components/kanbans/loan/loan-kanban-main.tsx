import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { dateAgo } from '@/helpers/date-utils'
import { cn } from '@/helpers/tw-utils'
import KanbanContainer from '@/modules/approvals/components/kanban/kanban-container'
import KanbanItemsContainer from '@/modules/approvals/components/kanban/kanban-items-container'
import KanbanTitle from '@/modules/approvals/components/kanban/kanban-title'
import { JournalVoucherSkeletonCard } from '@/modules/journal-voucher/components/journal-voucher-skeleton-card'
import {
    ILoanTransactionStatusDates,
    TLoanMode,
    useGetAllLoanTransaction,
} from '@/modules/loan-transaction'
import LoanStatusIndicator from '@/modules/loan-transaction/components/loan-status-indicator'

import { CollapseIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import InfoTooltip from '@/components/tooltips/info-tooltip'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import {
    LoanTransactionCard,
    LoanTransactionCardCreatorInfo,
} from './loan-kanban-card'
import { LoanTransactionCardActions } from './loan-kanban-card-actions'

type LoanTransactionKanbanProps = {
    mode: TLoanMode
    icon: React.ReactNode
}

export const LoanKanbanMain = ({ mode, icon }: LoanTransactionKanbanProps) => {
    const invalidate = useQueryClient()
    const [openLoans, setOpenLoans] = useState<string[]>([])

    const { data, isLoading, refetch, isRefetching } = useGetAllLoanTransaction(
        {
            mode: mode,
        }
    )
    if (!data) return

    const allIds = data?.map((loan) => loan.id)

    const handleExpandAll = () => {
        setOpenLoans(allIds)
    }

    const handleCollapseAll = () => {
        setOpenLoans([])
    }

    const isExpanded = openLoans.length > 0
    const hasItem = data.length > 0

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
        <KanbanContainer className="w-[420px] shrink-0 relative ">
            <div className="flex flex-col gap-2 p-2">
                <div className="flex items-center gap-2">
                    {icon}
                    <KanbanTitle
                        isLoading={isRefetching}
                        onRefresh={() => refetch()}
                        otherActions={
                            hasItem && (
                                <Button
                                    className="!size-fit !p-0.5 "
                                    onClick={handleExpandedToggle}
                                    size="sm"
                                    variant="ghost"
                                >
                                    <CollapseIcon />
                                </Button>
                            )
                        }
                        title={`${mode} Loans`}
                        titleClassName="capitalize"
                        totalItems={data.length}
                    />
                </div>
            </div>
            <Separator />
            <KanbanItemsContainer>
                {data.length > 0 ? (
                    <Accordion
                        className="w-full space-y-2"
                        onValueChange={setOpenLoans}
                        type="multiple"
                        value={openLoans}
                    >
                        {data.map((loan) => {
                            const loanDates: ILoanTransactionStatusDates = {
                                printed_date: loan.printed_date,
                                approved_date: loan.approved_date,
                                released_date: loan.released_date,
                            }
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
                                            loanTransactionDates={{
                                                printed_date: loan.printed_date,
                                                approved_date:
                                                    loan.approved_date,
                                                released_date:
                                                    loan.released_date,
                                            }}
                                        />
                                        <p className="text-xs right-3 top-1 text-end text-muted-foreground/70 truncate">
                                            {dateAgo(loan.created_at)}
                                        </p>
                                    </div>

                                    <AccordionItem
                                        className=" border-b-0 "
                                        value={loan.id}
                                    >
                                        <InfoTooltip
                                            content={
                                                loan.member_profile
                                                    ?.full_name ??
                                                'No member name'
                                            }
                                        >
                                            <AccordionTrigger className="truncate h-10">
                                                <div className="flex flex-col text-left">
                                                    <div className="inline-flex items-center gap-2">
                                                        <ImageDisplay
                                                            className="size-8 rounded-full"
                                                            src={
                                                                loan
                                                                    .member_profile
                                                                    ?.media
                                                                    ?.download_url
                                                            }
                                                        />
                                                        <p className="truncate text-sm max-w-[300px] text-muted-foreground">
                                                            {loan.member_profile
                                                                ?.full_name ??
                                                                'N/A'}
                                                            @
                                                            {loan.member_profile
                                                                ?.user
                                                                ?.user_name ??
                                                                '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                        </InfoTooltip>

                                        <AccordionContent className="px-2 py-2 text-muted-foreground">
                                            <LoanTransactionCard
                                                loan={loan}
                                                refetch={() => {
                                                    handleInvalidate()
                                                    refetch()
                                                }}
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
                    <p className="text-center text-xs text-muted-foreground/60 p-4">
                        No {mode} loans.
                    </p>
                )}
            </KanbanItemsContainer>
        </KanbanContainer>
    )
}
