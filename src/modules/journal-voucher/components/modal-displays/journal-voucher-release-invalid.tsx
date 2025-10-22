import { DollarIcon, WarningFillIcon } from '@/components/icons'
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'

export const JournalVoucherReleaseNoTransactionBatchDisplay = () => {
    return (
        <Empty className="!p-0">
            <EmptyHeader className="p-0">
                <EmptyMedia className="text-warning" variant="icon">
                    <WarningFillIcon />
                </EmptyMedia>
                <EmptyTitle>No Active Transaction Batch</EmptyTitle>
                <EmptyDescription className="text-pretty">
                    You cannot release this journal voucher because you
                    don&apos;t have an active transaction batch. Create a
                    transaction batch with the same currency to proceed.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    )
}

export const JournalVoucherReleaseCurrencyMismatchDisplay = () => {
    return (
        <Empty className="!p-0">
            <EmptyHeader className="p-0">
                <EmptyMedia className="text-warning" variant="icon">
                    <DollarIcon />
                </EmptyMedia>
                <EmptyTitle>Currency Mismatch</EmptyTitle>
                <EmptyDescription className="text-pretty">
                    You cannot release this journal voucher because the journal
                    voucher currency does not match your active transaction
                    batch currency. Create a transaction batch with the same
                    currency to proceed.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    )
}
