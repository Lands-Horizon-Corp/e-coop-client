import { IMemberAccountingLedger } from '@/modules/member-account-ledger'
import { TransactionMemberAccountLedger } from '@/modules/member-accounting-ledger'
import { MemberAccountGeneralLedgerAction } from '@/modules/member-accounting-ledger'
import MemberAccountingLedgerTable from '@/modules/member-accounting-ledger/components/member-accounting-ledger-table'

import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

interface TransactionAccountMemberLedgerProps {
    memberProfileId?: TEntityId
    onRowClick?: (member: IMemberAccountingLedger) => void
    generalLedger?: ReturnType<typeof useModalState>
}

const TransactionAccountMemberLedger = ({
    memberProfileId,
    onRowClick,
    generalLedger,
}: TransactionAccountMemberLedgerProps) => {
    return (
        <>
            <TransactionMemberAccountLedger {...generalLedger} />
            <MemberAccountingLedgerTable
                actionComponent={(props) => (
                    <>
                        <MemberAccountGeneralLedgerAction
                            memberAccountLedger={props.row.original}
                            onOpen={() => {
                                generalLedger?.onOpenChange(true)
                            }}
                        />
                    </>
                )}
                className="w-full min-h-[40vh] h-full"
                hideToolbar
                memberProfileId={memberProfileId ?? ''}
                mode="member"
                onRowClick={({ original }) => {
                    onRowClick?.(original)
                }}
                persistKey={['general-ledger', 'transaction']}
            />
        </>
    )
}

export default TransactionAccountMemberLedger
