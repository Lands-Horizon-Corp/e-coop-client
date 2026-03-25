import React from 'react'

import { cn } from '@/helpers'
import { dateAgo, toReadableDate } from '@/helpers/date-utils'
import { currencyFormat } from '@/modules/currency'
import TransactionUserInfoGrid from '@/modules/transaction/components/transaction-user-info-grid'

import { EyeIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import InfoTooltip from '@/components/tooltips/info-tooltip'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { useModalState } from '@/hooks/use-modal-state'

import OtherFundCreateUpdateFormModal from '../../../../other-fund/components/forms/create-update-other-fund-modal'
import OtherFundStatusIndicator from '../../../../other-fund/components/other-fund-status-indicatior'
import { OtherFundTagChip } from '../../../../other-fund/components/other-fund-tag-manager'
import { IOtherFund } from '../../../../other-fund/other-fund.types'
import { IOtherFundCardProps } from './other-fund-kanban'

export const OtherFundCard = ({
    otherFund,
    className,
}: IOtherFundCardProps) => {
    const otherFundModalState = useModalState(false)

    return (
        <div
            className={cn(
                'group space-y-2 relative rounded-xl border-border py-2 transition-shadow hover:shadow-lg hover:shadow-accent/10',
                className
            )}
        >
            <OtherFundCreateUpdateFormModal
                {...otherFundModalState}
                formProps={{
                    defaultValues: otherFund,
                    readOnly: true,
                }}
            />

            <div className="flex justify-between items-start ">
                <p className="truncate text-lg font-bold text-foreground/95">
                    {otherFund.name ||
                        otherFund.cash_voucher_number ||
                        'OF-Unknown'}
                </p>
                <div className="flex items-center gap-1">
                    <InfoTooltip content="View Other Fund Details">
                        <Button
                            onClick={() => {
                                otherFundModalState.onOpenChange(true)
                            }}
                            size="sm"
                            variant="ghost"
                        >
                            <EyeIcon />
                        </Button>
                    </InfoTooltip>
                    <OtherFundStatusIndicator
                        className="shrink-0"
                        otherFund={otherFund}
                    />
                </div>
            </div>

            <TransactionUserInfoGrid
                data={[
                    {
                        label: 'Total Debit',
                        value: currencyFormat(otherFund.total_debit, {
                            currency: otherFund.currency,
                            showSymbol: !!otherFund.currency,
                        }),
                    },
                    {
                        label: 'Total Credit',
                        value: currencyFormat(otherFund.total_credit, {
                            currency: otherFund.currency,
                            showSymbol: !!otherFund.currency,
                        }),
                    },
                    {
                        label: 'Description',
                        value: otherFund.description || '-',
                    },
                    {
                        label: 'Print Number',
                        value: otherFund.print_number
                            ? otherFund.print_number.toString()
                            : '',
                    },
                    {
                        label: 'Reference',
                        value: otherFund.reference || '-',
                    },
                    {
                        label: 'Date',
                        value: otherFund.date
                            ? new Date(otherFund.date).toLocaleDateString(
                                  undefined,
                                  {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                  }
                              )
                            : '-',
                    },
                    {
                        label: 'Created By',
                        value: (
                            <div className="flex items-center gap-2 justify-start">
                                {otherFund.created_by?.media?.download_url && (
                                    <ImageDisplay
                                        className="size-8 rounded-full"
                                        src={
                                            otherFund.created_by.media
                                                .download_url
                                        }
                                    />
                                )}
                                <InfoTooltip
                                    content={`Created by ${otherFund.created_by?.full_name}`}
                                >
                                    <div className="text-right max-w-[200px] shrink">
                                        <p className="truncate font-medium text-sm text-foreground/90">
                                            {otherFund.created_by?.full_name}
                                        </p>
                                        <p className="text-xs text-start text-muted-foreground/70 truncate">
                                            @
                                            {otherFund.created_by?.user_name ??
                                                '-'}
                                        </p>
                                    </div>
                                </InfoTooltip>
                            </div>
                        ),
                    },
                    {
                        label: 'Posted By',
                        value: otherFund.posted_by?.full_name || '-',
                    },
                ]}
                title="Other Fund Summary"
            />

            <TransactionUserInfoGrid
                data={[
                    {
                        label: 'Print Number',
                        value: otherFund.print_number
                            ? otherFund.print_number.toString()
                            : '',
                    },
                    {
                        label: 'Print Date',
                        value: otherFund.printed_date
                            ? toReadableDate(otherFund.printed_date)
                            : '-',
                    },
                ]}
                title="Print Information"
            />

            {otherFund.other_fund_tags && (
                <TransactionUserInfoGrid
                    data={[
                        {
                            label: '',
                            value: (
                                <div className="w-full flex flex-wrap gap-1 max-h-16 overflow-x-auto ">
                                    {otherFund.other_fund_tags.map((tag) => (
                                        <OtherFundTagChip
                                            key={tag.id}
                                            tag={tag}
                                        />
                                    ))}
                                </div>
                            ),
                        },
                    ]}
                    title="Tags"
                />
            )}

            <p className="text-xs text-end text-muted-foreground/70 truncate">
                {dateAgo(otherFund.date)}
            </p>
        </div>
    )
}

export const OtherFundKanbanInfoItem = ({
    className,
    title,
    infoTitle,
    content,
    icon,
}: {
    className?: string
    title?: string
    infoTitle?: string
    content?: React.ReactNode
    icon?: React.ReactNode
}) => {
    return (
        <InfoTooltip content={infoTitle}>
            <div
                className={cn(
                    'px-1 max-w-full mx-auto min-w-0 grow flex items-center gap-x-4 rounded ring-2 ring-secondary/60 ',
                    className
                )}
            >
                <span className="text-muted-foreground/70 text-xs shrink-0 flex items-center gap-1">
                    {icon}
                    {title}
                </span>
                <Separator className="min-h-8" orientation="vertical" />
                <span className="font-mono text-xs font-medium truncate">
                    {content}
                </span>
            </div>
        </InfoTooltip>
    )
}

export const OtherFundCardCreatorInfo = ({
    otherFund,
}: {
    otherFund: IOtherFund
}) => {
    // Logic to determine the current stage and responsible user
    const isPrinted = !!otherFund.printed_by
    const isApproved = !!otherFund.approved_by && isPrinted
    const isReleased = !!otherFund.released_by && isApproved && isPrinted

    const label = isReleased
        ? `Released by`
        : isApproved
          ? `Approved by`
          : isPrinted
            ? `Printed by`
            : otherFund.created_by // Changed from employee_user to match common OtherFund schema
              ? `Created by`
              : 'No Creator Info'

    const user = isReleased
        ? otherFund.released_by
        : isApproved
          ? otherFund.approved_by
          : isPrinted
            ? otherFund.printed_by
            : otherFund.created_by

    const name = user?.full_name ?? ''
    const mediaUrl = user?.media?.download_url ?? ''

    return (
        <div className="flex items-center justify-end gap-x-2">
            <div className="inline-flex items-center gap-2">
                <InfoTooltip content={`${label} ${name}`}>
                    <div className="text-right max-w-[200px] shrink">
                        <p className="truncate font-medium text-sm text-foreground/90">
                            {name}
                        </p>
                        <p className="text-xs text-end text-muted-foreground/70 truncate">
                            {label}
                        </p>
                    </div>
                </InfoTooltip>
                <ImageDisplay
                    className="size-8 rounded-full border border-border"
                    src={mediaUrl}
                />
            </div>
        </div>
    )
}
