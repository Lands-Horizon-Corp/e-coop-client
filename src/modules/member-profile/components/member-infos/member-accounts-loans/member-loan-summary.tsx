import { useState } from 'react'

import { ILoanTransaction } from '@/modules/loan-transaction'
import { LoanViewModal } from '@/modules/loan-transaction/components/loan-view'
import MemberLoanTableSummary from '@/modules/loan-transaction/components/member-loan-table-summary'

import { TEntityId } from '@/types'

type Props = {
    memberProfileId: TEntityId
}

const MemberLoanSummary = ({ memberProfileId }: Props) => {
    const [focusedLoan, setFocusedLoan] = useState<{
        loanTransactionId: TEntityId
        defaultLoanTransaction?: ILoanTransaction
    }>()

    return (
        <div>
            <LoanViewModal
                open={!!focusedLoan?.loanTransactionId}
                onOpenChange={(open) => {
                    if (!open) {
                        setFocusedLoan((prev) => ({
                            ...prev,
                            loanTransactionId:
                                undefined as unknown as TEntityId,
                        }))
                    }
                }}
                loanTransactionId={focusedLoan?.loanTransactionId as TEntityId}
                defaultLoanTransaction={focusedLoan?.defaultLoanTransaction}
            />
            <MemberLoanTableSummary
                className="h-[500px]"
                memberProfileId={memberProfileId}
                onRowClick={(row) => {
                    setFocusedLoan({
                        loanTransactionId: row.original.id,
                        defaultLoanTransaction: row.original,
                    })
                }}
            />
        </div>
    )
}

export default MemberLoanSummary
