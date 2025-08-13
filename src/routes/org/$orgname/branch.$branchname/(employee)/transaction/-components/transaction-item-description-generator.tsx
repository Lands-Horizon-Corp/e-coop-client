import { cn } from '@/lib'

import { TGeneralLedgerSource } from '@/types'

const transactionPhraseMap: Record<TGeneralLedgerSource, string> = {
    withdraw: 'withdrew funds from',
    deposit: 'deposited funds into',
    journal: 'recorded a journal entry for',
    payment: 'made a payment to',
    adjustment: 'made an adjustment to',
    'journal voucher': 'posted a journal voucher for',
    'check voucher': 'created a check voucher for',
}

interface TransactionMessageGeneratorProps {
    userName: string
    sourceType: TGeneralLedgerSource
    detail: string
    className?: string
}

const TransactionMessageGenerator = ({
    userName,
    sourceType,
    detail,
    className,
}: TransactionMessageGeneratorProps) => {
    const phrase = transactionPhraseMap[sourceType]

    if (!phrase) {
        return (
            <p className={className}>Invalid transaction type: {sourceType}</p>
        )
    }
    return (
        <p className={cn('text-xs', className)}>
            <span className="font-bold">{userName}</span> {phrase} &ldquo;
            <span className="font-semibold">{detail}</span>&rdquo;.
        </p>
    )
}
export default TransactionMessageGenerator
