import { IMemberAccountingLedger } from '@/modules/member-account-ledger'
import { TransactionMemberAccountLedger } from '@/modules/member-accounting-ledger'
import { MemberAccountGeneralLedgerAction } from '@/modules/member-accounting-ledger'
import MemberAccountingLedgerTable from '@/modules/member-accounting-ledger/components/member-accounting-ledger-table'
import { Row } from '@tanstack/react-table'

import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

type TransactionAccountMemberLedgerProps = {
    memberProfileId: TEntityId
    onRowClick: ((row: Row<IMemberAccountingLedger>) => void) | undefined
}
const TransactionAccountMemberLedger = ({
    memberProfileId,
    onRowClick,
}: TransactionAccountMemberLedgerProps) => {
    const openTransactionMemberAccountLedger = useModalState()

    return (
        <>
            <TransactionMemberAccountLedger
                {...openTransactionMemberAccountLedger}
            />
            <MemberAccountingLedgerTable
                actionComponent={(props) => (
                    <>
                        <MemberAccountGeneralLedgerAction
                            memberAccountLedger={props.row.original}
                            onOpen={() => {
                                openTransactionMemberAccountLedger.onOpenChange(
                                    true
                                )
                            }}
                        />
                    </>
                )}
                className="w-full min-h-[40vh] h-full"
                memberProfileId={memberProfileId}
                mode="member"
                onRowClick={onRowClick}
            />
        </>
    )
}

export default TransactionAccountMemberLedger
