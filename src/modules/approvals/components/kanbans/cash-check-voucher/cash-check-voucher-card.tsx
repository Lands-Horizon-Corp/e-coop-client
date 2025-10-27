import { cn } from '@/helpers/tw-utils'
import { ICashCheckVoucher } from '@/modules/cash-check-voucher'
import { CashCheckVoucherTagChip } from '@/modules/cash-check-voucher-tag/components/cash-check-voucher-tag-manager'
import { currencyFormat } from '@/modules/currency'

import { IdCardIcon, MoneyBagIcon, TicketIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import InfoTooltip from '@/components/tooltips/info-tooltip'

import { IClassProps } from '@/types'

import { JournalKanbanInfoItem } from '../journal-voucher/journal-voucher-card'

interface ICashCheckVoucherCardProps extends IClassProps {
    cashCheckVoucher: ICashCheckVoucher
    refetch: () => void
    searchTerm?: string
    highlightMatch: (text: string, searchTerm: string) => React.ReactNode
}

export const CashCheckVoucherCardCreatorInfo = ({
    cashCheckVoucher,
}: Pick<ICashCheckVoucherCardProps, 'cashCheckVoucher'>) => {
    const isReleased = cashCheckVoucher.status === 'released'
    const isApproved = cashCheckVoucher.status === 'approved'
    const isPrinted = cashCheckVoucher.status === 'printed'

    const label = isReleased
        ? `Released by `
        : isApproved
          ? `Approved by`
          : isPrinted
            ? `Printed by `
            : cashCheckVoucher.created_by
              ? `Created by`
              : 'No Creator Info'

    const name = isReleased
        ? ` ${cashCheckVoucher.released_by?.full_name}`
        : isApproved
          ? ` ${cashCheckVoucher.approved_by?.full_name}`
          : isPrinted
            ? ` ${cashCheckVoucher.printed_by?.full_name}`
            : cashCheckVoucher.created_by
              ? ` ${cashCheckVoucher.created_by?.full_name}`
              : ''

    const mediaUrl = isReleased
        ? cashCheckVoucher.released_by?.media?.url
        : isApproved
          ? cashCheckVoucher.approved_by?.media?.url
          : isPrinted
            ? cashCheckVoucher.printed_by?.media?.url
            : cashCheckVoucher.created_by
              ? cashCheckVoucher.created_by?.media?.url
              : ''

    return (
        <div className="flex items-center justify-end  gap-x-2">
            <div className=" inline-flex items-center gap-2">
                <InfoTooltip content={label}>
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

export const CashCheckVoucherCard = ({
    cashCheckVoucher,
    className,
    refetch,
}: ICashCheckVoucherCardProps) => {
    return (
        <div
            className={cn(
                'group space-y-2 relative transition-shadow ',
                className
            )}
        >
            {cashCheckVoucher.cash_voucher_number && (
                <JournalKanbanInfoItem
                    content={cashCheckVoucher.cash_voucher_number}
                    icon={<TicketIcon className="inline mr-2 size-5" />}
                    infoTitle="Voucher Number"
                    title="Voucher"
                />
            )}
            <div className="flex gap-x-2 grow">
                <JournalKanbanInfoItem
                    content={currencyFormat(cashCheckVoucher.total_debit, {
                        currency: cashCheckVoucher.currency,
                        showSymbol: !!cashCheckVoucher.currency,
                    })}
                    icon={<IdCardIcon className="inline mr-2 size-5" />}
                    infoTitle="Total Debit"
                    title="Debit"
                />
                <JournalKanbanInfoItem
                    content={currencyFormat(cashCheckVoucher.total_credit, {
                        currency: cashCheckVoucher.currency,
                        showSymbol: !!cashCheckVoucher.currency,
                    })}
                    icon={<IdCardIcon className="inline mr-2 size-5" />}
                    infoTitle="Total Credit"
                    title="Credit"
                />
            </div>
            <JournalKanbanInfoItem
                content={cashCheckVoucher.pay_to || '-'}
                icon={<MoneyBagIcon className="inline mr-2 size-5" />}
                infoTitle="Pay To"
                title="Pay To"
            />
            <div className="w-full flex flex-wrap gap-1 max-h-16 ecoop-scroll overflow-x-auto ">
                {cashCheckVoucher?.cash_check_voucher_tags?.map((tag) => (
                    <CashCheckVoucherTagChip
                        key={tag.id}
                        onRemove={() => {
                            refetch()
                        }}
                        tag={tag}
                    />
                ))}
            </div>
        </div>
    )
}
