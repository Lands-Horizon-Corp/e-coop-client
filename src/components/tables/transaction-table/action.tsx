import RowActionsGroup from '@/components/data-table/data-table-row-actions'

import { ITransactionTableActionComponentProp } from './columns'

interface ITransactionTableActionProps
    extends ITransactionTableActionComponentProp {}

const TransactionTableAction = (_props: ITransactionTableActionProps) => {
    return (
        <RowActionsGroup
            otherActions={
                <>
                    <p className="mx-auto text-center text-muted-foreground/70 text-xs p-4">
                        no action available
                    </p>
                </>
            }
        />
    )
}

export default TransactionTableAction
