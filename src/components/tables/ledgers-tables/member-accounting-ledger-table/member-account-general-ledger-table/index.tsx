import { IGeneralLedger, TEntityId, TableProps } from '@/types'

import { IGeneralLedgerTableColumnProps } from '../../general-ledger-accounts-table/columns'
import GeneralLedgerTable from '../../general-ledger-table'

export interface MemberAccountGeneralLedgerTableProps
    extends TableProps<IGeneralLedger>,
        IGeneralLedgerTableColumnProps {
    memberProfileId: TEntityId
    accountId: TEntityId
    toolbarProps?: Parameters<typeof GeneralLedgerTable>[0]['toolbarProps']
}

const MemberAccountGeneralLedgerTable = ({
    memberProfileId,
    accountId,
    ...props
}: MemberAccountGeneralLedgerTableProps) => {
    return (
        <GeneralLedgerTable
            mode="member-account"
            accountId={accountId}
            memberProfileId={memberProfileId}
            {...props}
        />
    )
}

export default MemberAccountGeneralLedgerTable
