import { IMemberAccountingLedger } from '@/modules/member-account-ledger'
import { useTransactionStore } from '@/store/transaction/transaction-store'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'

interface IMemberAccountGeneralLedgerActionProps {
    memberAccountLedger: IMemberAccountingLedger
    onOpen?: () => void
}

const MemberAccountGeneralLedgerAction = ({
    memberAccountLedger,
    ...props
}: IMemberAccountGeneralLedgerActionProps) => {
    const { setFocusedLedger } = useTransactionStore()

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <RowActionsGroup
                onView={{
                    text: 'View General Ledger',
                    isAllowed: true,
                    onClick: () => {
                        props?.onOpen?.()
                        setFocusedLedger({
                            memberProfileId:
                                memberAccountLedger?.member_profile_id,
                            accountId: memberAccountLedger?.account_id,
                            account: memberAccountLedger?.account,
                        })
                    },
                }}
            />
        </div>
    )
}

export default MemberAccountGeneralLedgerAction
