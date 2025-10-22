import { DollarIcon, WarningFillIcon } from '@/components/icons'
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'

export const CashCheckVoucherReleaseNoTransactionBatchDisplay = () => {
    return (
        <Empty className="!p-0">
            <EmptyHeader className="p-0">
                <EmptyMedia className="text-warning" variant="icon">
                    <WarningFillIcon />
                </EmptyMedia>
                <EmptyTitle>No Active Transaction Batch</EmptyTitle>
                <EmptyDescription className="text-pretty">
                    You cannot release this cash check voucher because you
                    don&apos;t have an active transaction batch. Create a
                    transaction batch with the same currency to proceed.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    )
}

export const CashCheckVoucherReleaseCurrencyMismatchDisplay = () => {
    return (
        <Empty className="!p-0">
            <EmptyHeader className="p-0">
                <EmptyMedia className="text-warning" variant="icon">
                    <DollarIcon />
                </EmptyMedia>
                <EmptyTitle>Currency Mismatch</EmptyTitle>
                <EmptyDescription className="text-pretty">
                    You cannot release this cash check voucher because the cash
                    check voucher currency does not match your active
                    transaction batch currency. Create a transaction batch with
                    the same currency to proceed.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    )
}
