import { formatNumber } from '@/helpers'
import { cn } from '@/helpers/tw-utils'
import { ILoanTransaction } from '@/modules/loan-transaction'

import {
    ClockIcon,
    InfoFillCircleIcon,
    MoneyBagIcon,
    TicketIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import InfoTooltip from '@/components/tooltips/info-tooltip'

import { IClassProps } from '@/types'

import { JournalKanbanInfoItem } from '../journal-voucher/journal-voucher-card'

interface ILoanTransactionCardProps extends IClassProps {
    loan: ILoanTransaction
    refetch: () => void
}

export const LoanTransactionCardCreatorInfo = ({
    loan,
}: Pick<ILoanTransactionCardProps, 'loan'>) => {
    const isPrinted = !!loan.printed_by
    const isApproved = !!loan.approved_by && isPrinted
    const isReleased = !!loan.released_by && isApproved && isPrinted

    const label = isReleased
        ? `Released by `
        : isApproved
          ? `Approved by`
          : isPrinted
            ? `Printed by `
            : loan.employee_user
              ? `Created by`
              : 'No Creator Info'

    const name = isReleased
        ? ` ${loan.released_by?.full_name}`
        : isApproved
          ? ` ${loan.approved_by?.full_name}`
          : isPrinted
            ? ` ${loan.printed_by?.full_name}`
            : loan.employee_user
              ? ` ${loan.employee_user?.full_name}`
              : ''

    const mediaUrl = isReleased
        ? loan.released_by?.media?.url
        : isApproved
          ? loan.approved_by?.media?.url
          : isPrinted
            ? loan.printed_by?.media?.url
            : loan.employee_user
              ? loan.employee_user?.media?.url
              : ''
    return (
        <div className="flex items-center justify-end gap-x-2 pt-2 border-t border-dashed">
            <div className=" inline-flex items-center gap-2">
                <InfoTooltip
                    content={`created by ${loan.created_by?.full_name}`}
                >
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

export const LoanTransactionCard = ({
    loan,
    className,
    // refetch,
}: ILoanTransactionCardProps) => {
    return (
        <div
            className={cn(
                'group space-y-2 relative transition-shadow ',
                className
            )}
        >
            <div className="space-y-2">
                {loan.voucher && (
                    <JournalKanbanInfoItem
                        className="w-full"
                        content={loan.voucher}
                        icon={<TicketIcon className="inline mr-2 size-5" />}
                        infoTitle="Loan Voucher Number"
                        title="Voucher"
                    />
                )}
                <JournalKanbanInfoItem
                    className="w-full"
                    content={formatNumber(loan.applied_1, 2) || '-'}
                    icon={<MoneyBagIcon className="inline mr-2 size-5" />}
                    infoTitle="Amount Applied"
                    title="Amount Applied"
                />
                <JournalKanbanInfoItem
                    content={`${loan.terms} months`}
                    icon={<ClockIcon className="inline mr-2 size-5" />}
                    infoTitle="Loan Terms (in Months)"
                    title="Terms"
                />
                <JournalKanbanInfoItem
                    content={loan.check_number}
                    icon={<InfoFillCircleIcon className="inline mr-2 size-5" />}
                    infoTitle="Loan Purpose"
                    title="Purpose"
                />
                <JournalKanbanInfoItem
                    content={loan.mode_of_payment || 'N/A'}
                    icon={<InfoFillCircleIcon className="inline mr-2 size-5" />}
                    infoTitle="Mode of Payment"
                    title="Mode Of Payment"
                />
            </div>
        </div>
    )
}
