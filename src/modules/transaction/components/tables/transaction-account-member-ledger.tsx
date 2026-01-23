import { TransactionMemberAccountLedger } from '@/modules/member-accounting-ledger'
import { MemberAccountGeneralLedgerAction } from '@/modules/member-accounting-ledger'
import MemberAccountingLedgerTable from '@/modules/member-accounting-ledger/components/member-accounting-ledger-table'
import { IMemberProfile } from '@/modules/member-profile'

import { useTransactionContext } from '../../context/transaction-context'

const TransactionAccountMemberLedger = () => {
    const {
        modals: { ledger },
        handlers: { handleMemberOnClick },
        selectedMember,
    } = useTransactionContext()
    return (
        <>
            <TransactionMemberAccountLedger {...ledger} />
            <MemberAccountingLedgerTable
                actionComponent={(props) => (
                    <>
                        <MemberAccountGeneralLedgerAction
                            memberAccountLedger={props.row.original}
                            onOpen={() => {
                                ledger.onOpenChange(true)
                            }}
                        />
                    </>
                )}
                className="w-full min-h-[40vh] h-full"
                hideToolbar
                memberProfileId={selectedMember?.id}
                mode="member"
                onRowClick={(member) => {
                    handleMemberOnClick(
                        member.original.member_profile as IMemberProfile
                    )
                }}
                persistKey={['general-ledger', 'transaction']}
            />
        </>
    )
}

export default TransactionAccountMemberLedger
