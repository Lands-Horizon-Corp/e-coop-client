import RowActionsGroup from '@/components/data-table/data-table-row-actions'

import { IDisbursementTransactionTableActionComponentProp } from './columns'

interface IDisbursementTransactionTableActionProps
    extends IDisbursementTransactionTableActionComponentProp {}

const DisbursementTransactionTableAction = ({
    row: _row,
}: IDisbursementTransactionTableActionProps) => {
    return (
        <>
            <div onClick={(e) => e.stopPropagation()}></div>
            <RowActionsGroup otherActions={<></>} />
        </>
    )
}

export default DisbursementTransactionTableAction
