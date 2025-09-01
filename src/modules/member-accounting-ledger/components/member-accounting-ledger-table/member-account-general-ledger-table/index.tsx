import { IGeneralLedger } from '@/modules/general-ledger'
import GeneralLedgerTable from '@/modules/general-ledger/components/tables/general-ledger-table'
import { IGeneralLedgerTableColumnProps } from '@/modules/general-ledger/components/tables/general-ledger-table/columns'

import { TableProps } from '@/components/data-table/table.type'

import { TEntityId } from '@/types'

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
