import { cn } from '@/helpers/tw-utils'
import { currencyFormat } from '@/modules/currency'
import { JournalVoucherTagChip } from '@/modules/journal-voucher-tag/components/journal-voucher-tag-management'

import { IdCardIcon, TicketIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import InfoTooltip from '@/components/tooltips/info-tooltip'
import { Separator } from '@/components/ui/separator'

import { IJournalVoucherCardProps } from './journal-voucher-kanban'

export const JournalKanbanInfoItem = ({
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
                <span className="text-muted-foreground/70 text-xs shrink-0">
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
export const JournalVoucherCardCreatorInfo = ({
    journalVoucher,
}: Pick<IJournalVoucherCardProps, 'journalVoucher'>) => {
    const isPrinted = !!journalVoucher.printed_by
    const isApproved = !!journalVoucher.approved_by && isPrinted
    const isReleased = !!journalVoucher.released_by && isApproved && isPrinted

    const label = isReleased
        ? `Released by `
        : isApproved
          ? `Approved by`
          : isPrinted
            ? `Printed by `
            : journalVoucher.created_by
              ? `Created by`
              : 'No Creator Info'

    const name = isReleased
        ? ` ${journalVoucher.released_by?.full_name}`
        : isApproved
          ? ` ${journalVoucher.approved_by?.full_name}`
          : isPrinted
            ? ` ${journalVoucher.printed_by?.full_name}`
            : journalVoucher.created_by
              ? ` ${journalVoucher.created_by?.full_name}`
              : ''

    const mediaUrl = isReleased
        ? journalVoucher.released_by?.media?.download_url
        : isApproved
          ? journalVoucher.approved_by?.media?.download_url
          : isPrinted
            ? journalVoucher.printed_by?.media?.download_url
            : journalVoucher.created_by
              ? journalVoucher.created_by?.media?.download_url
              : ''
    return (
        <div className="flex items-center justify-end gap-x-2">
            <div className=" inline-flex items-center gap-2">
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
                <ImageDisplay className="size-8 rounded-full" src={mediaUrl} />
            </div>
        </div>
    )
}

export const JournalVoucherCard = ({
    journalVoucher,
    className,
    refetch,
}: IJournalVoucherCardProps) => {
    const hasJournalEntries =
        journalVoucher.journal_voucher_tags &&
        journalVoucher?.journal_voucher_tags?.length > 0

    return (
        <div
            className={cn(
                'group space-y-2 relative transition-shadow ',
                className
            )}
        >
            {journalVoucher.cash_voucher_number && (
                <JournalKanbanInfoItem
                    content={journalVoucher.cash_voucher_number}
                    icon={<TicketIcon className="inline mr-2 size-5" />}
                    infoTitle="Voucher Number"
                    title="Voucher"
                />
            )}
            <div className="flex gap-x-2 grow">
                <JournalKanbanInfoItem
                    content={currencyFormat(journalVoucher.total_debit, {
                        currency: journalVoucher.currency,
                        showSymbol: !!journalVoucher.currency,
                    })}
                    icon={<IdCardIcon className="inline mr-2 size-5" />}
                    infoTitle="Total Debit"
                    title="Debit"
                />
                <JournalKanbanInfoItem
                    content={currencyFormat(journalVoucher.total_credit, {
                        currency: journalVoucher.currency,
                        showSymbol: !!journalVoucher.currency,
                    })}
                    icon={<IdCardIcon className="inline mr-2 size-5" />}
                    infoTitle="Total Credit"
                    title="Credit"
                />
            </div>
            {hasJournalEntries && (
                <div className="w-full flex py-2 ecoop-scroll flex-wrap gap-1 max-h-16 overflow-x-auto ">
                    {journalVoucher?.journal_voucher_tags?.map((tag) => (
                        <JournalVoucherTagChip
                            key={tag.id}
                            onRemove={() => {
                                refetch()
                            }}
                            tag={tag}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
