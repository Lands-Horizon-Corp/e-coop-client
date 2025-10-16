import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { cn } from '@/helpers'
import { dateAgo } from '@/helpers/date-utils'
import KanbanContainer from '@/modules/approvals/components/kanban/kanban-container'
import KanbanItemsContainer from '@/modules/approvals/components/kanban/kanban-items-container'
import KanbanTitle from '@/modules/approvals/components/kanban/kanban-title'
import {
    TCashCheckVoucherStatus,
    useGetAllCashCheckVoucher,
} from '@/modules/cash-check-voucher'
import CashCheckVoucherStatusIndicator from '@/modules/cash-check-voucher/components/cash-check-status-indicator'

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

import { JournalVoucherSkeletonCard } from '../../../../journal-voucher/components/journal-voucher-skeleton-card'
import {
    CashCheckVoucherCard,
    CashCheckVoucherCardCreatorInfo,
} from './cash-check-voucher-card'
import {
    CashCheckVoucherCardActions,
    ICCVStatusDates,
} from './cash-check-voucher-card-actions'

type CashCheckVoucherKanbanProps = {
    mode: TCashCheckVoucherStatus
    icon: React.ReactNode
}
export const CashCheckVoucherKanbanMain = ({
    mode,
    icon,
}: CashCheckVoucherKanbanProps) => {
    const [openVouchers, setOpenVouchers] = useState<string[]>([])
    const invalidate = useQueryClient()
    const {
        data: cashCheckVouchers,
        isLoading,
        refetch,
        isRefetching,
    } = useGetAllCashCheckVoucher({ mode })

    if (!cashCheckVouchers) return

    const allIds = () => cashCheckVouchers.map((jv) => jv.id)

    const handleExpandAll = () => {
        setOpenVouchers(allIds)
    }

    const handleCollapseAll = () => {
        setOpenVouchers([])
    }

    const isExpanded = openVouchers.length > 0
    const hasItem = cashCheckVouchers.length > 0

    const handleExpandedToggle = () => {
        if (isExpanded) {
            handleCollapseAll()
        } else {
            handleExpandAll()
        }
    }

    if (isLoading) return <JournalVoucherSkeletonCard />

    const handleInvalidate = () => {
        invalidate.invalidateQueries({
            queryKey: ['cash-check-voucher'],
        })
    }

    return (
        <div>
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
                            totalItems={cashCheckVouchers.length}
                        />
                    </div>
                </div>
                <Separator />

                <KanbanItemsContainer>
                    {cashCheckVouchers.length > 0 ? (
                        <Accordion
                            className="w-full space-y-2"
                            onValueChange={setOpenVouchers}
                            type="multiple"
                            value={openVouchers}
                        >
                            {cashCheckVouchers.map((cashCheckVoucher) => {
                                const ccvDates: ICCVStatusDates = {
                                    printed_date: cashCheckVoucher.printed_date,
                                    approved_date:
                                        cashCheckVoucher.approved_date,
                                    released_date:
                                        cashCheckVoucher.released_date,
                                }
                                return (
                                    <div
                                        className={cn(
                                            'group space-y-2 relative bg-card rounded-xl border border-border p-4 transition-shadow hover:shadow-lg hover:shadow-accent/10'
                                        )}
                                    >
                                        <div className="flex justify-between items-center">
                                            <CashCheckVoucherStatusIndicator
                                                className="flex-shrink-0"
                                                voucherDates={ccvDates}
                                            />
                                            {cashCheckVoucher.updated_at && (
                                                <p className="text-xs  right-3 top-1 text-end text-muted-foreground/70 truncate">
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
                                                        {cashCheckVoucher.name
                                                            ? cashCheckVoucher.name
                                                            : '-'}
                                                    </p>
                                                </AccordionTrigger>
                                            </InfoTooltip>

                                            <AccordionContent className="px-2 py-2 text-muted-foreground">
                                                <CashCheckVoucherCard
                                                    cashCheckVoucher={
                                                        cashCheckVoucher
                                                    }
                                                    refetch={() => {
                                                        handleInvalidate()
                                                        refetch()
                                                    }}
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
                        <p className="text-center text-xs text-muted-foreground/60 p-4">
                            No {mode} Cash Check Vouchers.
                        </p>
                    )}
                </KanbanItemsContainer>
            </KanbanContainer>
        </div>
    )
}
