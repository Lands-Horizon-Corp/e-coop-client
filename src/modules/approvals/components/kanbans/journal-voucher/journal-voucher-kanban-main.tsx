import { useState } from 'react'

import { dateAgo } from '@/helpers/date-utils'
import { cn } from '@/helpers/tw-utils'
import KanbanContainer from '@/modules/approvals/components/kanban/kanban-container'
import KanbanItemsContainer from '@/modules/approvals/components/kanban/kanban-items-container'
import KanbanTitle from '@/modules/approvals/components/kanban/kanban-title'
import {
    TJournalVoucherMode,
    useGetAllJournalVoucher,
} from '@/modules/journal-voucher'
import { JournalVoucherSkeletonCard } from '@/modules/journal-voucher/components/journal-voucher-skeleton-card'
import JournalVoucherStatusIndicator, {
    IJournalVoucherStatusDates,
} from '@/modules/journal-voucher/components/journal-voucher-status-indicator'

import { CollapseIcon } from '@/components/icons'
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
    JournalVoucherCard,
    JournalVoucherCardCreatorInfo,
} from './journal-voucher-card'
import { JournalVoucherCardActions } from './journal-voucher-card-actions'

type JournalVoucherKanbanProps = {
    mode: TJournalVoucherMode
    icon: React.ReactNode
    isExpanded?: boolean
}

export const JournalVoucherKanbanMain = ({
    mode,
    icon,
}: JournalVoucherKanbanProps) => {
    const [openVouchers, setOpenVouchers] = useState<string[]>([])

    const {
        data: JournalVouchers,
        isLoading,
        refetch,
        isRefetching,
    } = useGetAllJournalVoucher({
        mode: mode,
    })

    if (!JournalVouchers) return

    const allIds = JournalVouchers.map((jv) => jv.id)

    const handleExpandAll = () => {
        setOpenVouchers(allIds)
    }

    const handleCollapseAll = () => {
        setOpenVouchers([])
    }

    const isExpanded = openVouchers.length > 0
    const hasItem = JournalVouchers.length > 0

    const handleExpandedToggle = () => {
        if (!isExpanded) {
            handleExpandAll()
        } else {
            handleCollapseAll()
        }
    }

    if (isLoading) return <JournalVoucherSkeletonCard className="w-[420px]" />

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
                        title={mode}
                        titleClassName="capitalize"
                        totalItems={JournalVouchers.length}
                    />
                </div>
            </div>
            <Separator />

            <KanbanItemsContainer>
                {JournalVouchers.length > 0 ? (
                    <Accordion
                        className="w-full space-y-2"
                        onValueChange={setOpenVouchers}
                        type="multiple"
                        value={openVouchers}
                    >
                        {JournalVouchers.map((journalVoucher) => {
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
                                >
                                    <div className="flex justify-between items-center">
                                        <JournalVoucherStatusIndicator
                                            className="flex-shrink-0"
                                            journalVoucher={journalVoucher}
                                        />
                                        <p className="text-xs  right-3 top-1 text-end text-muted-foreground/70 truncate">
                                            {dateAgo(journalVoucher.date)}
                                        </p>
                                    </div>

                                    <AccordionItem
                                        className=" border-b-0  "
                                        key={journalVoucher.id}
                                        value={journalVoucher.id}
                                    >
                                        <InfoTooltip
                                            content={journalVoucher.name}
                                        >
                                            <AccordionTrigger className="truncate h-10">
                                                <p className="truncate text-lg font-bold text-foreground/95">
                                                    {journalVoucher.name
                                                        ? journalVoucher.name
                                                        : '-'}
                                                </p>
                                            </AccordionTrigger>
                                        </InfoTooltip>

                                        <AccordionContent className="px-2 py-2 text-muted-foreground">
                                            <JournalVoucherCard
                                                journalVoucher={journalVoucher}
                                                refetch={refetch}
                                            />
                                        </AccordionContent>
                                    </AccordionItem>
                                    <JournalVoucherCardActions
                                        journalVoucher={journalVoucher}
                                        jvDates={jvDates}
                                        refetch={refetch}
                                    />
                                    <JournalVoucherCardCreatorInfo
                                        journalVoucher={journalVoucher}
                                    />
                                </div>
                            )
                        })}
                    </Accordion>
                ) : (
                    <p className="text-center text-xs text-muted-foreground/60 p-4">
                        No {mode} requests.
                    </p>
                )}
            </KanbanItemsContainer>
        </KanbanContainer>
    )
}
